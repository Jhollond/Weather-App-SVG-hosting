
var weather_Ob;
var astronomy;
var system = "imperial";
var initial_state = true;

var day_stage = {
  "sunrise" : false,
  "sunset"  : false,
  "isDay"   : false,
  "mornMid" : false,
  "evening" : false,
  "night"   : false,
}

function smallest_time_diff(time1arr, time2arr) {
  var time1hr , time1min = time1arr[0] , time1arr[1];
  var time2hr , time2min = time2arr[0] , time2arr[1];

  if (time1hr + (time1min * 0.01) > time2hr + (time2min * 0.01)) {
    var time1 = [time1hr,time1min], time2 = [time2hr,time2min];
  } else {
    var time1 = [time2hr,time2min], time2 = [time1hr,time1min];
  }
  var hours1 = (time1[0], 10),
      hours2 = (time2[0], 10),
      mins1  = (time1[1], 10),
      mins2  = (time2[1], 10);
  var hours  = hours2 - hours1, mins = 0;

  if (hours < 0) hours = 24 + hours;
  if (mins2 >= mins1) {
    mins = mins2 - mins1;
  }
  else {
    mins = (mins2 + 60) - mins1;
    hours--;
  }
  mins = mins / 60; // take percentage in 60
  hours += mins;
  hours = hours.toFixed(2);
  return hours;
}

function switch_system() {

  var metric_is_btn     = "<span id='measure-system' class='pointer' >metric</span> | <b>imperial</b>";
  var imperial_is_btn   = "<b>metric</b> | <span id='measure-system' class='pointer' >imperial</span>";

  initial_state = false;

  if (system == "imperial") {
      system  = "metric";
    update_result_panel("switch-buttons", imperial_is_btn );
  }

  else
  if (system == "metric"  ) {
      system  = "imperial";
    update_result_panel("switch-buttons",   metric_is_btn );
  }
  else {
    console.log("FATAL ERROR, SELF DESTRUCT SEQUENCE INITIATED")
  }
}

function get_input_address() {
  var address =  $("#input-address").val();
      address =  address.replace(/\s/g, '+');
  if (address == undefined) {
      address =  0.0000;
  };
  return address;
}

function form_geocode_URL() {
  var        user_address = get_input_address();
  var geocode_URL_address = 'https://crossorigin.me/https://maps.googleapis.com/maps/api/geocode/json?address=';
      geocode_URL_address += user_address
      geocode_URL_address += '&key=AIzaSyC9wUOpXdjimYykMXHtI_vQ-KXxZTp1Vck';
  return geocode_URL_address;
}

function weathercompany_conditions(lat,lng) {
  var format_URL = 'https://api.wunderground.com/api/f8a0793b923caba3/astronomy/conditions/geolookup/q/';
      format_URL += lat + ',';
      format_URL += lng + '.json';
  $.ajax({
    url: format_URL,
    success: function (data) {
      //In metric
      weather_Ob = data.current_observation;
      astronomy  = data.moon_phase;
      assign_weather_variables();
    },
    error: function (err) {
      alert(err);
    }
  })
}


function calc_locale_astro_stages(reset_bool) {
  var locale_time    = [astronomy.current_time.hour, astronomy.current_time.minute];
  var sunrise        =      [astronomy.sunrise.hour, astronomy.sunrise.minute];
  var sunset         =       [astronomy.sunset.hour, astronomy.sunset.minute];
  var time_diff_rise = smallest_time_diff(locale_time,sunrise);
  var time_diff_set  = smallest_time_diff(locale_time,sunset );

  if (reset == undefined) {
    if (time_diff_rise <= 0.25) {
      day_stage.sunrise = true;
    }
    if (time_diff_set  <= 0.25) {
      day_stage.sunset  = true;
    }
    if (((locale_time[0] > sunrise[0]) && (locale_time[1] > sunrise[1])) &&
        ((locale_time[0] <  sunset[0]) && (locale_time[1] < sunset[1]))) {
      day_stage.isDay = true;
      if (day_stage.isDay && time_diff_set > 3) {
        day_stage.mornMid = true;
      }
      else {
        day_stage.evening = true;
      }
    }
    else {
      day_stage.night = true;
    }
  }
  else {
    for (var i in day_stage) {
      day_stage[i] = false;
    }
  }
}

function edit_weather_icon(icon_bottom,icon_top,third_layer) {
  if (icon_bottom != undefined) {
    var rawgit_repo    = "https://cdn.rawgit.com/Jhollond/" +
                         "Weather-App-SVG-hosting/master/";
    var svg_url = rawgit_repo + icon_bottom
    $("#WeIc_bottom").css({
      "background-image" : "url(" + svg_url + ")";
    })
  }
  if (icon_top != undefined) {
    svg_url = rawgit_repo + icon_top
    $("#WeIc_top").css({
      "background-image" : "url(" + svg_url + ")";
    })
  }
  if (third_layer != undefined) {
    svg_url = rawgit_repo + third_layer
    $("#WeIc_third").css({
      "background-image" : "url(" + svg_url + ")";
    })
  }
}


function weather_icon_logic(w_phrase,icon) {
  calc_locale_astro_stages();

  if (w_phrase == "Cloudy") {
    edit_weather_icon("clouds.svg");
  }

  else if (w_phrase == "Partly Cloudy") {
    if (day_stage.isDay) {
      edit_weather_icon("sunny.svg","clouds.svg");
    }
    else {
      edit_weather_icon("moon-full.svg");
      draw_moonphase();
      edit_weather_icon(,"clouds.svg");
    }
  }
  else if (w_phrase == "light rain showers") {
    if (day_stage.isDay) {
      edit_weather_icon("rainy.svg","clouds.svg");
    }
    else {
      edit_weather_icon("moon-full.svg");
      draw_moonphase();
      edit_weather_icon(,"clouds.svg","raining.svg");
    }
  }
  //uses the icon property now
  else if (icon == "clear") {
    if (day_stage.sunrise) {
      edit_weather_icon("sunrise.svg");
    }
    else if (day_stage.sunset) {
      edit_weather_icon("sunset-1.svg");
    }
    else if (day_stage.day) {
      edit_weather_icon("sunny.svg");
    }
    else {
      edit_weather_icon("moon-full.svg");
      draw_moonphase();
    }
  }
  else if (icon == "mostly cloudy") {
    if (day_stage.mornMid) {
      edit_weather_icon("clouds-1.svg");
    }
    else if (day_stage.evening) {
      edit_weather_icon("clouds-and-sun.svg");
    }
    else {
      edit_weather_icon("cloudy-night.svg");
    }
  }
  else if (icon == "thunderstorms") {
    if (day_stage.isDay) {
      edit_weather_icon("storm.svg");
    }
    else {
      edit_weather_icon("storm-1.svg");
    }
  }
  else if (icon == "rain") {
    if (day_stage.isDay) {
      edit_weather_icon("rainy.svg");
    }
    else {
      edit_weather_icon("moon-full.svg","raining.svg")
      draw_moonphase();
    }
  }
}


function assign_weather_variables() {

  var temp_rn_i  =              weather_Ob.temp_f;
  var temp_rn_m  =              weather_Ob.temp_c;

  var fls_like_i =         weather_Ob.feelslike_f;
  var fls_like_m =         weather_Ob.feelslike_c;

  var wind_dir   =        weather_Ob.wind_degrees;

  var wdir_car   =            weather_Ob.wind_dir;

  var wind_spd_i =            weather_Ob.wind_mph;
  var wind_spd_m =            weather_Ob.wind_kph;

  var rain_hr_i  =       weather_Ob.precip_1hr_in;
  var rain_hr_m  =   weather_Ob.precip_1hr_metric;

  var r_total_i  =     weather_Ob.precip_today_in;
  var r_total_m  = weather_Ob.precip_today_metric;

  var w_phrase   =             weather_Ob.weather;
  var w_icon     =                weather_Ob.icon;

  var loc_name = weather_Ob.display_location.full;

  if (initial_state) {
    switch_system();
  }

  if (system == "metric") {
    update_result_panel("temperature","<b>" + temp_rn_m + "°</b>");

    update_result_panel("humidity","<b>feels like</b><br>" + fls_like_m + "°");

    update_result_panel("w_vel","<b> wind velocity </b> <br>" + wind_spd_m +
                        " km/h" + " " + "<span Title='" + wind_dir + "°'>" +
                        wdir_car + "</span>");

    update_result_panel("rain","<b>precipitation</b> <br> this hour: " +
                        rain_hr_m + "ml <br> today: " + r_total_m + "ml");

    update_result_panel("phrase",w_phrase)
  }

  if (system == "imperial") {
    update_result_panel("temperature","<b>" + temp_rn_i + "°</b>");

    update_result_panel("humidity","<b>feels like</b><br>" + fls_like_i + "°");

    update_result_panel("w_vel","<b> wind velocity </b> <br>" + wind_spd_i +
                        " mi/h" + " " + "<span Title='" + wind_dir + "°'>" +
                        wdir_car + "</span>");

    update_result_panel("rain","<b>precipitation</b> <br> this hour: " +
                        rain_hr_i + "in <br> today:" + r_total_i + "in");

    update_result_panel("phrase",w_phrase)
  }

  $("#input-address").attr('placeholder',loc_name);

}

function update_result_panel(id_tag,content) {
  document.getElementById(id_tag).innerHTML = content;
}

function weather_geocode_useraddress() {
  $.ajax({
    url: form_geocode_URL(),
    type: 'GET',
    success: function (data) {
      console.log(data);
      var location_data = data.results[0].geometry.location;
               latitude = location_data["lat"];
              longitude = location_data["lng"];
      console.log(latitude + "," + longitude)
      weathercompany_conditions(latitude, longitude);
    }
  })
}

function weather_browser_geolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      var browser_lat = position.coords.latitude;
      var browser_lng = position.coords.longitude;
      console.log(browser_lat + " : " + browser_lng);
      weathercompany_conditions(browser_lat,browser_lng);
    });
  }
}

$(document)
  .ready(function () {
    $("#test-button")
      .on("click", function () {
        weathercompany_conditions(25.0329694,121.5654177)
    });
    $("#input-address").bind("enterKey",function() {
      weather_geocode_useraddress();
    });
    $("#input-address").keyup(function(e) {
      if(e.keyCode == 13)
        {
          $(this).trigger("enterKey");
        }
    }); //Pressing Enter mimicks #btn-submit on.("click",)

    $("#btn-geolocate")
      .on("click", function () {
        weather_browser_geolocation();
    });
    $("#btn-submit")
      .on("click", function () {
        weather_geocode_useraddress();
    });
    $("#switch-buttons")
      .on("click", "#measure-system", function() {
        switch_system();
        assign_weather_variables();
    });
});
