SlippyMap.Map = (function() {
  var MAX_NORTH = 85.05112877980662;

  function Map(element, tile_service) {
    this.element = element;
    this.service = tile_service;
    this.layers = [
      new SlippyMap.Surface(this, tile_service),
      new SlippyMap.Sunlight(this)
    ];
    this.tracker = new EventHandler(this);
  }

  _.extend(Map.prototype, {
    pan: function(latitude, longitude) {
      this.go(latitude, longitude, this.depth);
    },

    zoom: function(depth) {
      this.go(this.latitude, this.longitude, depth);
    },

    go: function(latitude, longitude, depth) {
      this.depth = depth;
      if (!this.latitude)
        this.latitude = normalize_latitude(latitude, this.depth);
      this.longitude = normalize_longitude(longitude, this.depth);
      this.refresh();
    },

    size: function(size) {
      var pair = _.isNumber(size),
          width = pair ? arguments[0] : size.width,
          height = pair ? arguments[1] : size.height;
      this.element.style.width = (this.width = width) + 'px';
      this.element.style.height = (this.height = height) + 'px';
      this.refresh();
    },

    time: function(now, declination) {
      this.declination = declination;
      this.hour_angle = ((now.hour() * 60 + now.minute()) - 720) / 4;
      this.refresh();
    },

    location: function() {
      return { latitude: this.latitude, longitude: this.longitude };
    },

    position: function() {
      return location_to_position(this.location(), this.span());
    },

    span: function() {
      return Math.pow(2, this.depth) * this.service.tile_size();
    },

    track: function(on) {
      on ? this.tracker.bind() : this.tracker.unbind();
    },

    refresh: function() {
      if (this.ready) this.draw();
      else {
        this.ready = !(
          _.isUndefined(this.latitude)  || _.isUndefined(this.longitude) ||
          _.isUndefined(this.width)     || _.isUndefined(this.height)
        );
        if (this.ready) {
          _.defer(_.bind(this.refresh, this));
        }
      }
    },

    draw: function() {
      var context = new DrawContext(this);
      _.each(this.layers, function(layer) {
        if (layer.draw) layer.draw(context);
      });
    }    
  });

  function location_to_position(location, span) {
    var pair = _.isNumber(location),
        latitude = pair ? arguments[0] : location.latitude,
        longitude = pair ? arguments[1] : location.longitude,
        span = pair ? arguments[2] : span;

    var x = span / 2 + longitude * span / 360;
    var s = Math.sin(Math.PI * latitude / 180);
    if (s == 1) s -= 1e-9;
    if (s == -1) s += 1e-9;
    var l = 0.5 * Math.log((1 + s) / (1 - s));
    var y = span / 2 - l * (span / (2 * Math.PI));
    return { x: x, y: y };
  }

  function position_to_location(position, span) {
    var pair = _.isNumber(position),
      x = pair ? arguments[0] : position.x,
      y = pair ? arguments[1] : position.y,
      z = pair ? arguments[2] : span;

    var latitude = (2 * Math.atan(Math.exp((1 - 2 * y / span) * Math.PI)) - Math.PI / 2) * (180 / Math.PI);
    var longitude = (x - span / 2) / (span / 360);

    return {
      latitude: normalize_latitude(latitude),
      longitude: normalize_longitude(longitude)
    };
  }

  function normalize_latitude(latitude) {
    return (latitude > MAX_NORTH ? MAX_NORTH : (latitude < -MAX_NORTH ? -MAX_NORTH : latitude));
  }

  function normalize_longitude(longitude) {
    return (longitude + 180) % 360 + (longitude < -180 ? 180 : -180);
  }

  var DrawContext = function(map) {
    var pos = map.position();

    this.x = pos.x;
    this.y = pos.y;
    this.span = map.span();
    this.zoom = map.depth;
    this.width = map.width;
    this.height = map.height;
    this.latitude = map.latitude;
    this.longitude = map.longitude;
    this.declination = map.declination;
    this.hour_angle = map.hour_angle;
  };

  _.extend(DrawContext.prototype, {
    location_to_position: function(location) {
      var args = [].splice.call(arguments, 0);
      args.push(this.span);
      return location_to_position.apply(null, args);
    },

    position_to_location: function(position) {
      var args = [].splice.call(arguments, 0);
      args.push(this.span);
      return position_to_location.apply(null, args);
    }    
  });

  var EventHandler = function(map) {
    this.map = map;
    this.element = map.element;
    this.tap_timer = null;
  };

  _.extend(EventHandler.prototype, {
    bind: function() {
      var element = this.element;
      if (!this.pressHandler) {
        this.pressHandler = _.throttle(_.bind(this.press, this), 100);
        element.addEventListener('mousedown', this.pressHandler, false);
      }
      if (!this.releaseHandler) {
        this.releaseHandler = _.throttle(_.bind(this.release, this), 100);
        element.addEventListener('mouseup', this.releaseHandler, false);
        element.addEventListener('mouseout', this.releaseHandler, false);
      }
      if (!this.moveHandler) {
        this.moveHandler = _.bind(this.move, this);
        element.addEventListener('mousemove', this.moveHandler, false);
      }
    },
    unbind: function() {
      var element = this.element;
      if (this.pressHandler) {
        element.removeEventListener('mousedown', this.pressHandler)
        delete this.pressHandler;          
      }
      if (this.releaseHandler) {
        element.removeEventListener('mouseup', this.pressHandler)
        element.removeEventListener('mouseout', this.pressHandler)
        delete this.releaseHandler;
      }
      if (this.moveHandler) {
        element.removeEventListener('mousemove', this.moveHandler)
        delete this.moveHandler;          
      }
    },
    interactive: function() {
      return !_.isUndefined(this.map.ready) && this.map.ready;
    },
    press: function(e) {
      if (!this.interactive()) return;

      var p = this.position_from_event(e);
      this.last_x = p.x;
      this.last_y = p.y;
      this.pressed = _.isUndefined(e.button) || e.button == 0;
      if (this.pressed) this.prevent_default(e);
    },
    release: function(e) {
      if (!this.interactive()) return;

      if (e.type == 'mouseout' && this.is_map_element(e.toElement))
        return;

      if (!this.dragging && this.pressed) {
        if (!this.tap_timer) {
          this.tap_timer = setTimeout(_.bind(function(e) {
            this.tap(e);
          }, this, e), 360);
        }
        else {
          clearTimeout(this.tap_timer);
          this.double_tap(e);
        }
      }
      if (this.pressed) this.prevent_default(e);
      this.pressed = this.dragging = false;
    },
    tap: function(e) {
      delete this.tap_timer;
      _.trigger('map:tap', {
        position: this.position_from_event(e),
        location: this.location_from_event(e)
      });
    },
    double_tap: function(e) {
      delete this.tap_timer;
      _.trigger('map:doubleTap', {
        position: this.position_from_event(e),
        location: this.location_from_event(e)
      });
    },
    move: function(e) {
      if (!this.interactive()) return;
      var p = this.position_from_event(e);

      if (this.pressed)  this.dragging = true;
      if (this.dragging) {

        var distance_x = p.x - this.last_x;
        var distance_y = p.y - this.last_y;

        var position = this.map.position();
        position.x -= distance_x;
        position.y -= distance_y;

        var location = position_to_location(
          position, this.map.span());
        this.map.pan(location.latitude, location.longitude);
        this.prevent_default(e);
      }

      this.last_x = p.x;
      this.last_y = p.y;
    },

    is_map_element: function(element) {
      while (element != null && element.nodeName != "BODY") {
        if (element == this.map.element) return true;
        element = element.offsetParent;
      }
      return false;
    },

    prevent_default: function(e) {
      if (e.preventDefault) e.preventDefault();
    },

    position_from_event: function(e) {
      if (this.element.getBoundingClientRect) {
        var box = this.element.getBoundingClientRect();
        return {
          x: e.clientX - box.left,
          y: e.clientY - box.top
        };
      }

      return {
        x: e.clientX - this.element.offsetLeft,
        y: e.clientY - this.element.offsetTop
      };
    },

    location_from_event: function(e) {
      var pos = this.position_from_event(e);
      var center = this.map.position();
      pos.x += (center.x - this.map.width / 2);
      pos.y += (center.y - this.map.height / 2);
      return position_to_location(pos, this.map.span());
    }
  });

  return Map;
})();