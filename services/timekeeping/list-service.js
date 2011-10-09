
list_service =
(function() {
  function Service() {
  }

  Service.prototype = {
    run: function(f) {
      var args = this.controller.args || {};

      var query = {'from':'com.hoopengines.alarm:1'};
      Database.find(query)
        .complete(function(result) {
          f.result = {
            returnValue: result.returnValue,
            results: map_results(result.results)
          };
        });
    }

    // post: function(f, args) {
    //   var alarm = AlarmMapper.for_creating(args);

    //   Database.insert(alarm)
    //     .success(function(result) {
    //       if (!alarm.on) f.result = result;
    //       else {
    //         var date = Recurrence.next(alarm);
    //         Timeout.schedule(result.id, date)
    //           .complete(function() { f.result = result; });
    //       }
    //     })
    //     .failure(function(result) {
    //       f.result = result;
    //     });
    // },

    // put: function(f, args) {
    //   if (!contains_identity(args))
    //     return missing_argument(f, 'id');
    //   var alarm = AlarmMapper.for_merging(args);

    //   Database.update(alarm)
    //     .success(function(result) {
    //       if (alarm.on) {
    //         var date = Recurrence.next(alarm);
    //         Timeout.schedule(args.id, date)
    //           .complete(function() { f.result = result; });
    //       }
    //       else {
    //         Timeout.clear(args.id)
    //           .complete(function() { f.result = result; });
    //       }
    //     })
    //     .failure(function(result) {
    //       f.result = result;
    //     });
    // },

    // delete: function(f, args) {
    //   if (!contains_identity(args))
    //     return missing_argument(f, 'id');

    //   Database.remove(args.id)
    //     .success(function(result) {
    //       Timeout.clear(args.id)
    //         .complete(function() { f.result = result; });
    //     })
    //     .failure(function(result) {
    //       f.result = result;
    //     });
    // }
  };

  function map_results(results) {
    var remap = [];
    for (var i = 0; i < results.length; i++)
      remap.push(AlarmMapper.for_consumers(results[i]));
    return remap;
  }

  // function unknown_verb(f, verb) {
  //   f.result = {
  //     error: true,
  //     message: 'Unknown verb [' + (verb || 'empty') + '].'
  //   };
  // }

  // function missing_argument(f, argument) {
  //   f.result = {
  //     error: true,
  //     message: 'Missing argument [' + argument + '].'
  //   };
  // }

  // function contains_identity(obj) {
  //   return ((obj || {}).id || '').length > 0;
  // }

  return Service;
})();
