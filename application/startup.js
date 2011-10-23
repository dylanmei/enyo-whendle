(function() {  var startup = {    name: 'Startup',    kind: 'Component',    components: [      { name: 'notices', kind: 'Notices' }    ],    create: function() {      this.inherited(arguments);      this.launch(enyo.windowParams);    },    launch: function(parameters) {      if (!enyo.applicationRelaunchHandler)        enyo.applicationRelaunchHandler = _.bind(this.launch, this);      if (parameters.dockMode)        return this.exhibition(parameters);      else {        switch (parameters.reason || "") {          case 'alarm': return this.alert(parameters);          case 'snooze': return this.notify(parameters);          default: return this.application(parameters);        }      }    },    alert: function(parameters) {      this.$.notices.hide();      var path = resolve_path('alert');      return enyo.windows.openPopup(path, 'Alert', parameters, {        clickableWhenLocked: true      }, 180, true);    },    notify: function(parameters) {      this.$.notices.show(parameters.reason, parameters.alarm);    },    application: function(parameters) {      if (!is_app_open()) {        enyo.windows.activate(          resolve_path('app'), 'App', parameters);      }    },    exhibition: function() {      enyo.windows.activate(resolve_path('dock'), 'Dock', {});    }  };  function is_app_open() {    return enyo.windows.fetchWindow('App') != null;  }  function resolve_path(type) {    return enyo.fetchAppRootPath() + '/' + type + '/index.html';  }  enyo.kind(startup);})();