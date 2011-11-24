(function() {
  var slippy = {
    name: 'SlippyMap',
    kind: enyo.Control,
    className: 'slippy-map',
    published: { tracking: false },
    events: { onTap: '', onDoubleTap: '' },
    create: function() {
      this.inherited(arguments);
    },
    rendered: function() {
      this.inherited(arguments);
      this.map = new SlippyMap.Map(this.hasNode(), new Tyler());
      this.trackingChanged();
      _.observe('map:tap',
        _.bind(on_tap, this));
      _.observe('map:doubleTap',
        _.bind(on_double_tap, this));      
    },
    pan: function(latitude, longitude) {
      if (this.map) this.map.pan(latitude, longitude);
      return this;
    },
    zoom: function(value) {
      if (this.map) this.map.zoom(value);
      return this;
    },
    size: function(width, height) {
      if (this.map) this.map.size(width, height);
      else {
        this.applyStyle('width', width + 'px');
        this.applyStyle('height', height + 'px');
      }
      return this;
    },
    time: function(date, declination) {
      if (this.map) this.map.time(date, declination);      
      return this;
    },

    trackingChanged: function() {
      this.map.track(this.tracking);
    }
  };

  function on_tap(e) {
    this.doTap(e);
  }
  function on_double_tap(e) {
    this.doDoubleTap(e);
  }

  enyo.kind(slippy);
})();