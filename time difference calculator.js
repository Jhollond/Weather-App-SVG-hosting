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
