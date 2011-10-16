(function() {  var app = {    name: "App",    kind: "VFlexBox",    components: [      { kind: 'ApplicationEvents', onWindowParamsChange: 'on_window_params' },      { kind: 'SlippyMap', name: 'map' },      { kind: 'App.Scroller', name: 'scroller', components: [        { kind: 'App.Alarms', name: 'alarms' }      ]}    ],    create: function() {      this.inherited(arguments);      _.observe('alarms:list', _.bind(on_load_alarms, this));      _.observe('alarms:save', _.bind(on_save_alarm, this));      _.observe('alarms:delete', _.bind(on_delete_alarm, this));      _.observe('clock:tick', _.bind(on_clock_tick, this));      _.defer(Timekeeping.tick);      _.delay(Timekeeping.check, (5).seconds);      enyo.keyboard.setResizesWindow(false);    },    rendered: function() {      this.inherited(arguments);      var node = this.hasNode(),          latitude = 37.6,          longitude = 0;      this.$.map        .zoom(2)        .pan(latitude, longitude)        .size(node.offsetWidth, node.offsetHeight);    },        on_window_params: function() {      _.log('app params_changing', enyo.windowParams);    },    resizeHandler: function() {      var node = this.hasNode();      this.$.map.size(node.offsetWidth, node.offsetHeight);    }     };  function on_clock_tick(e) {    this.$.map.time(e.now, e.declination);  }  function on_load_alarms(e) {    _.log('app on_load_alarms');    Timekeeping.list()      .success(function(response) {        if (e.success) e.success(response.results);      })      .complete(function() {        if (e.complete) e.complete();      });  }  function on_save_alarm(e) {    var self = this;    var alarm = e.alarm;        if (alarm.id) {      Timekeeping.edit(alarm)        .complete(function() {          if (e.complete) e.complete();        });    }    else {      Timekeeping.new(alarm)        .success(function(response) {          _.log('on_save_alarm:success', response);        })        .failure(function(response) {          _.log('on_save_alarm:failure', response);        })        .complete(function() {          _.log('on_save_alarm:complete');          if (e.complete) e.complete();        });    }  }  function on_delete_alarm(e) {    Timekeeping.delete({id: e.id})      .complete(function() {          _.log('on_delete_alarm:complete');          if (e.complete) e.complete();      });  }  enyo.kind(app);})();