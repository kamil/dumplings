// console.log
var old = console.log;

console.log = function () {
  var args = Array.prototype.slice.call(arguments);
  var date = new Date();
  var hours = date.getHours();
  var minute = lpad(date.getMinutes(), 2, "0");
  var seconds = lpad(date.getSeconds(), 2, "0");
  var milliseconds = lpad(date.getMilliseconds(), 3, "0");
  var date_str = hours + ":" + minute + ":" + seconds + "." + milliseconds + " ";
  args.unshift(date_str);
  old.apply(console, args);
};

// left padding any chars
function lpad(staff, nr_fill, add_char) {
  var string = staff.toString(),
    i = string.length;

  for (; i < nr_fill; ++i) {
    string = add_char + string;
  }

  return string;
}

function get_rand_value_between(from, to) {
  return parseInt((Math.random() * (to - from) + from).toFixed(0), 10);
}

function get_percent_value_of(val, max) {
  return parseInt((val / max * 100).toFixed(0), 10);
}

function get_value_of_percent(total, percent) {
  return parseInt((total * percent / 100).toFixed(0), 10);
}

$(function () {
  pklib.utils.action.outerlink();
})