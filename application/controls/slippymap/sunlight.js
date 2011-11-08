SlippyMap.Sunlight = (function() {
  function Sunlight(map) {
    this.element = document.createElement('div');
    this.element.className = 'slippy-sunlight';
    map.element.appendChild(this.element);
  }

  _.extend(Sunlight.prototype, {
    clear: function() {
      this.element.innerHTML = '';
    },

    draw: function(context) {
      if (!this.can_draw(context)) return;

      this.element.style.webkitTransform = 'translate3d(' +
        Math.round((context.width / 2) - context.x) + 'px,' +
        Math.round((context.height / 2) - context.y) + 'px,0)';
      var cols = overlay_column_range(context);

      for (var col = cols.first; col <= cols.last; col++) {
        this.draw_overlay(context, col);
      }
    },

    can_draw: function(context) {
      return context.declination !== undefined;
    },

    draw_overlay: function(context, column) {
      var key = overlay_element_identity(column, context.declination);
      var left = context.x - ((context.span / 360) * context.hour_angle);
      var position = {
        x: Math.round(left) - (context.span / 2), y: 0
      };

      var element = document.getElementById(key);
      if (!element) {
        element = new_overlay_element(key);
        element.appendChild(
          new_overlay_image(context.declination, context.span));
        if (context.declination < 0)
          element.style.webkitTransform = 'rotate(180deg)';
        this.element.appendChild(element);
      }

      element.style.top = position.y + 'px';
      element.style.left = (position.x + (column * context.span)) + 'px';
    }
  });

  function new_overlay_element(identity) {
    var element = document.createElement('div');
    element.className = 'sunlight';
    element.id = identity;
    return element;      
  }

  function new_overlay_image(declination, span) {
    var which = Math.abs(Math.floor(declination));
    var image = document.createElement('img');
    image.onload = function() {
      this.style.visibility = 'visible';
    };
    image.onerror = function() {
    };
    image.onselectstart = function() { return false; };
    image.onmousemove = function() { return false; };
    image.width = span;
    image.height = span;
    image.style.visibility = 'hidden';
    image.src = '../tiles/sunlight-' + which + '.png';
    return image;
  }  

  function overlay_element_identity(column, declination) {
    return 'sunlight:' + declination + ',' + column;
  }

  function overlay_column_range(context) {
    var offset_x = (context.x - context.width / 2) - (context.span / 2),
        extent_x = (context.x + context.width / 2) + (context.span / 2);

    return {
      first: Math.floor(offset_x / context.span),
      last: Math.ceil(extent_x / context.span) - 1
    }
  }


  return Sunlight;
})();