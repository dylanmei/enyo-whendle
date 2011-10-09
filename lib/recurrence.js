Recurrence = (function() {
  function Recurrence() {
  }

  Recurrence.next = function(alarm) {
    if (!can_recur(alarm))
      return null;

      var days = [
        alarm.sunday    || false,
        alarm.monday    || false,
        alarm.tuesday    || false,
        alarm.wednesday || false,
        alarm.thursday  || false,
        alarm.friday    || false,
        alarm.saturday  || false
      ];

      var now = Date.now()
        .second(1);
      var test = Date.today()
        .hour(alarm.hour)
        .minute(alarm.minute);

      var next = null;
      do {
        if (test.compare(now) > 0) {
          if (days[test.getDay()])
            next = test;
        }
        test = test.add((1).days);
      } while (next == null);

      return next;
  };

  function can_recur(alarm) {
    if (alarm != null) {
      if (alarm.sunday) return true;
      if (alarm.monday) return true;
      if (alarm.tuesday) return true;
      if (alarm.wednesday) return true;
      if (alarm.thursday) return true;
      if (alarm.friday) return true;
      if (alarm.saturday) return true;
    }
    return false;
  }

  return Recurrence;
})();