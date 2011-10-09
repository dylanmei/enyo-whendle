Timekeeping = (function() {
  function Timekeeping() {
  }

  _.extend(Timekeeping, {
    list: function() {
      return new Service('palm://com.hoopengines.whendle.timekeeping')
        .invoke('list', {});      
    },

    get: function(identity) {
      var p = new Promise();
      Timekeeping.list()
        .success(function(response) {
          var alarm = response.results
            ? _.detect(response.results, function(result) {
                return result.id == identity;
              })
            : undefined;
          
          p.resolve(alarm);
        })
        .failure(function(response) {
          p.reject(response);
        });

      return p;
    },

    new: function(alarm) {
      return new Service('palm://com.hoopengines.whendle.timekeeping')
        .invoke('new', _.extend(alarm, { verb: 'post' }));
    },

    edit: function(alarm) {
      return new Service('palm://com.hoopengines.whendle.timekeeping')
        .invoke('edit', _.extend(alarm, { verb: 'put' }));
    },

    delete: function(alarm) {
      return new Service('palm://com.hoopengines.whendle.timekeeping')
        .invoke('delete', { verb: 'delete', id: alarm.id });
    },

    snooze: function(alarm, dismiss) {
      var minutes = dismiss ? 0 : alarm.snooze || 0;
      return new Service('palm://com.hoopengines.whendle.timekeeping')
        .invoke('snooze', {'id': alarm.id, 'snooze': minutes});
    }
  });

  return Timekeeping;
})();