
reliability_service =
(function() {
  var Frequency = '00:02:00';
  var NextCheck = {
    'key':    'com.hoopengines.whendle.reliability',
    'uri':    'palm://com.hoopengines.whendle.timekeeping/check',
    'params': '{}',
    'wakeup': false,
    'in': Frequency
  };

  function Service() {
  }

  Service.prototype = {
    run: function(f) {
      console.log('reliability check');

      var query = {'from':'com.hoopengines.alarm:1'};
      Database.find(query)
        .success(function(result) {

          queue_alarm_resets(result.results)
            .complete(function() {

              Timeout.set(NextCheck)
                .complete(function(result) {
                  console.log('reliability scheduled next check');
                  f.result = true;
                });
            });
        });
    }
  };

  function queue_alarm_resets(alarms) {
    var queue = new Promise.Queue();

    for (var i = 0; i < alarms.length; i++) {
      var alarm = alarms[i];
      if (!alarm.on) continue;

      var date = Recurrence.next(alarm);
      if (date == null) continue;

      queue.up(Timeout.schedule(alarm._id, date)
        .complete(function() {
          console.log('reliability scheduled an alarm');
        })
      );
    }

    return queue;
  }

  return Service;
})();
