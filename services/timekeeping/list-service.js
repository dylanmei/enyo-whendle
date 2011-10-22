
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
  };

  function map_results(results) {
    var remap = [];
    for (var i = 0; i < results.length; i++)
      remap.push(Mapper.alarm_for_selecting(results[i]));
    return remap;
  }

  return Service;
})();
