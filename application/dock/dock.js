(function() {  var dock = {    name: "Dock",    kind: "VFlexBox",    components: [      { kind: 'SlippyMap', name: 'map' },      { name: 'clock', className: 'clock' },      { name: 'overlay', className: 'overlay' }    ],    create: function() {      this.inherited(arguments);      _.observe('clock:tick', _.bind(on_clock_tick, this));      _.defer(Timekeeping.tick);    },    rendered: function() {      this.inherited(arguments);      var node = this.hasNode(),          latitude = 37.6,          longitude = 0;      this.$.map        .zoom(2)        .pan(latitude, longitude)        .size(node.offsetWidth, node.offsetHeight);      _.delay(function(self) {        self.addClass('darken');      }, (5).seconds, this);    }  };  function on_clock_tick(e) {    if (e.declination !== undefined)      this.$.map.time(e.now, e.declination);    var local = e.now      .add((e.offset).minutes);    this.$.clock.setContent(local.hh12);  }  enyo.kind(dock);})();