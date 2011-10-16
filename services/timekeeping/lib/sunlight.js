Sunlight = (function() {

  function obliquity_correction(time) {
    var seconds = 21.448 - time * (46.8150 + time * (0.00059 - time * (0.001813)));
    var mean = 23.0 + (26.0 + (seconds / 60.0))/60.0;
    
    var omega = 125.04 - 1934.136 * time;
    return mean + 0.00256 * Math.cos(degrees_to_radian_angle(omega));
  }
  
  function apparent_longitude(jctime) {
    var l0 = geometric_mean_longitude_of_sun(jctime);
    var c = equation_of_center_for_the_sun(jctime);
    var true_longitude = l0 + c;
    
    var omega = 125.04 - 1934.136 * jctime;
    var lambda = true_longitude - 0.00569 - 0.00478 * Math.sin(degrees_to_radian_angle(omega));
    return lambda;
  }

  function geometric_mean_longitude_of_sun(jctime) {
    var L0 = 280.46646 + jctime * (36000.76983 + 0.0003032 * jctime);
    while(L0 > 360.0) {
      L0 -= 360.0;
    }
    while(L0 < 0.0) {
      L0 += 360.0;
    }
    return L0;    
  }

  function equation_of_center_for_the_sun(jctime) {
    var mean_anomoly = 357.52911 + jctime *
        (35999.05029 - 0.0001537 * jctime);
  
    var mrad = degrees_to_radian_angle(mean_anomoly);
    var sinm = Math.sin(mrad);
    var sin2m = Math.sin(mrad * 2);
    var sin3m = Math.sin(mrad * 3);

    var C = sinm * (1.914602 - jctime * (0.004817 + 0.000014 * jctime)) +
        sin2m * (0.019993 - 0.000101 * jctime) + sin3m * 0.000289;
    return C;   
  }
  
  function date_to_julian_century(date) {
    var jd = date_to_julian_date(date);
    return julian_date_to_julian_century(jd);
  }

  function date_to_julian_date(date) {
    var year = date.year();
    var month = date.month();
    var day = date.day();
    
    if (month <= 2) {
      --year;
      month += 12;
    }
    
    var A = Math.floor(year / 100.0);
    var B = 2 - A + Math.floor(A / 4.0);
    
    var jdn = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    var hours = date.hour() + date.minute() / 60.0 + date.second() / 3600.0;
    return jdn + (hours / 24.0); 
  }
    
  function julian_date_to_julian_century(jdn) {
    return (jdn - 2451545.0) / 36525.0;
  }
    
  function degrees_to_radian_angle(n) {
    return Math.PI * n / 180.0;
  }
  
  function radian_angle_to_degrees(n) {
    return 180.0 * n / Math.PI;
  }

  return {
    declination: function(date) {
      var jctime = date_to_julian_century(date);

      var correction = obliquity_correction(jctime);
      var lambda = apparent_longitude(jctime);
      
      var sint = Math.sin(degrees_to_radian_angle(correction)) *
        Math.sin(degrees_to_radian_angle(lambda));
      var theta = radian_angle_to_degrees(Math.asin(sint));
      return theta; 
    }
  };
  
})();
