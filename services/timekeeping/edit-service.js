
edit_service =
(function() {
  function Service() {
  }

  Service.prototype = {
    run: function(f) {
      var args = this.controller.args || {};

      if (!contains_identity(args))
        return missing_argument(f, 'id');
      var alarm = AlarmMapper.for_merging(args);

      Database.update(alarm)
        .success(function(result) {
          if (alarm.on) {
            var date = Recurrence.next(alarm);
            Timeout.schedule(args.id, date)
              .complete(function() { f.result = result; });
          }
          else {
            Timeout.clear(args.id)
              .complete(function() { f.result = result; });
          }
        })
        .failure(function(result) {
          f.result = result;
        });
    }
  };

  function missing_argument(f, argument) {
    f.result = {
      error: true,
      message: 'Missing argument [' + argument + '].'
    };
  }

  function contains_identity(obj) {
    return ((obj || {}).id || '').length > 0;
  }

  return Service;
})();
