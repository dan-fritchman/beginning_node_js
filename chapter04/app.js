/* 
Chapter 4
Node.js Packages 
*/ 

console.log("Running Chapter 4");
var assert = console.assert;

var bar = require("./bar");
assert(bar.bar1.a === 1);
assert(bar.bar2.a === 2);
var baz = require("baz");
assert(baz.z === 5);
// FIXME: not sure why this doesnt work yet. 
// console.log(bar.baz.z);
// assert(bar.baz.z === 6);

// JSON

var cfg = require("./config");
assert(cfg.k === 5);
var jstr = JSON.stringify(cfg);
var json_round_trip = JSON.parse(jstr);
assert(json_round_trip.foo === cfg.foo);
assert(json_round_trip.k === cfg.k);

// NPM 

var _ = require("underscore");
assert(_.min([1,2,3]) === 1);
var use_main = require("use_main");
assert(use_main.q === 3);
var l = [1, 10, 50, 99, 100, 101, 500, 1000];
var f = _.filter(l, function(i){return i > 100});
assert(_.min(f) === 101);
var x = _.map(l, function(k) { return 2*k});
assert(_.min(x) === 2);

var now = new Date();
var ms = now.getMilliseconds();
var s = now.getSeconds();
var moment = require("moment");
var m = moment(new Date());
var d = m.toDate();
m = moment("12-25-1995", "MM-DD-YYYY");
var a = moment([2000, 0, 2]);
var b = moment([2000, 0, 3]);
var d = b.from(a);
var jstr = now.toJSON();

var colors = require("colors");
console.log("hello".red);

// Add to prototypes of built-in types
Array.prototype.foo = 123;
assert([].foo === 123);
String.prototype.foo = 123;
assert("str".foo === 123);
Number.prototype.foo = 123;
var four56 = 456; 
assert(four56.foo === 123); // Doesnt work for numeric literals

var d = {};
d.__defineGetter__('f', function(){
    return 11 * 10 * 9;
})
assert(d.f === 11*10*9);


console.log("Ending Chapter 4");

