
new_service =
(function() {
  function Service() {
  }

  Service.prototype = {
    run: function(f) {
      var args = this.controller.args || {};
      var alarm = AlarmMapper.for_creating(args);

      Database.insert(alarm)
        .success(function(result) {
          if (!alarm.on) f.result = result;
          else {
            var date = Recurrence.next(alarm);
            Timeout.schedule(result.id, date)
              .complete(function() { f.result = result; });
          }
        })
        .failure(function(result) {
          f.result = result;
        });
    }
  };

  return Service;
})();
