Timekeeping = (function() {
  var TIMEKEEPING_URL = 'palm://com.hoopengines.whendle.timekeeping.service';
  var Now = {
  };

  function Timekeeping() {
  }

  _.extend(Timekeeping, {
    list: function() {
      return new Service(TIMEKEEPING_URL).invoke('list', {});      
    },

    get: function(identity) {
      var p = new Promise();
      Timekeeping.list()
        .success(function(response) {
          var alarm = _.detect(response.results, function(result) {
            return result.id == identity;
          });
          alarm ? p.resolve(alarm) : p.reject();
        })
        .failure(function(response) {
          p.reject(response);
        });

      return p;
    },

    new: function(alarm) {
      return new Service(TIMEKEEPING_URL)
        .invoke('new', _.extend(alarm, { verb: 'post' }));
    },

    edit: function(alarm) {
      return new Service(TIMEKEEPING_URL)
        .invoke('edit', _.extend(alarm, { verb: 'put' }));
    },

    delete: function(alarm) {
      return new Service(TIMEKEEPING_URL)
        .invoke('delete', { verb: 'delete', id: alarm.id });
    },

    tick: function() {
      if (Now.date) return;

      Timekeeping.now()
        .failure(function(response) {
          Now.offset = 0;
          Now.date = new Date()
            .second(0).millisecond(0);
        })
        .success(function(response) {
          response = response.time;
          Now.timezone = response.timezone;
          Now.offset = response.offset;
          Now.declination = response.declination;
          Now.date = new Date()
            .year(response.year)
            .month(response.month)
            .day(response.day)
            .hour(response.hour)
            .minute(response.minute)
            .second(0).millisecond(0);
        })
        .complete(function() {
          trigger_tick();
          Now.timer = new Timer(on_micro_tick);
        });
    },

    now: function() {
      return new Service(TIMEKEEPING_URL).invoke('now', {});      
    },

    snooze: function(alarm, dismiss) {
      var minutes = dismiss ? 0 : alarm.snooze || 0;
      return new Service(TIMEKEEPING_URL)
        .invoke('snooze', {'id': alarm.id, 'snooze': minutes});
    },

    check: function() {
      return new Service(TIMEKEEPING_URL)
        .invoke('check', {})
        .failure(function(response) {
        });
    }
  });

  function on_micro_tick(time) {
    time = time.subtract((Now.offset).minutes)
      .second(0).millisecond(0);

    if (Now.date.compare(time) != 0) {
      Now.date = time;
      trigger_tick();
    }
  }

  function trigger_tick() {
    _.trigger('clock:tick', {
      now: Now.date,
      offset: Now.offset,
      declination: Now.declination
    });
  }

  return Timekeeping;
})();