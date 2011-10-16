
now_service =
(function() {
  function Service() {
  }

  Service.prototype = {
    run: function(f) {
      load_system_time()
        .success(function(response) {
          f.result = {
            returnValue: true,
            time: build_result(response)
          };
      });
    }
  };

  function load_system_time() {
    var p = new Promise(),
        params = {};

    PalmCall.call('palm://com.palm.systemservice/time', 'getSystemTime', params)
      .then(function(f) {
        p.resolve(f.result);
      });

    return p;
  };

  function build_result(system_time) {
    var local = system_time.localtime;
    var now = new Date()
      .year(local.year)
      .month(local.month)
      .day(local.day)
      .hour(local.hour)
      .minute(local.minute);
    
    now = now.subtract(
      (system_time.offset).minutes);
    
    return {
      year: now.year(),
      month: now.month(),
      day: now.day(),
      hour: now.hour(),
      minute: now.minute(),
      timezone: system_time.timezone,
      offset: system_time.offset,
      declination: Sunlight.declination(now)
    };
  }

  return Service;
})();
