/*
Chapter 3 
Core Node.js 
*/

// Module System 

var t1 = new Date().getTime();
var x = require("./foo");
var dt1 = new Date().getTime() - t1;
console.assert(dt1 > 0, dt1);

var y = x.f();
console.assert(y === 3);

console.assert(x.s === 123);
x.s = 456;
var x2 = require("./foo");
console.assert(x2.s === 456);
console.assert(x.s === 456);

console.assert(module.exports == exports);
exports.a = 5;
module.exports.b = 6;
console.assert(module.exports == exports);

// Modules Best Practices

var x3 = require("./foo");     // Preferred 
var x4 = require("./foo.js");  // Not
console.assert(x3.a === x4.a);

var pkg = require("./pkg/index");
console.assert(pkg.mod1.my_number === 1, pkg.mod1);

// console.log(__dirname);
// console.log(__filename);
// console.log(process.argv);

var k = false;
process.nextTick(function () {
    // console.log("in next tick");
    console.assert(k);
})
console.assert(!k);
k = true;
// console.log("k set");

// Buffers 
// Appears to be deprecated
// var str = "Hello Buffer World!";
// var buffer = new Buffer(str, 'utf-8');
// var roundTrip = buffer.toString('utf-8');
// console.log(roundTrip); // Hello

console.assert(console === global.console);
console.assert(setTimeout === global.setTimeout);
console.assert(process === global.process);

// Core Modules

var path = require("path");
var pn = path.normalize("//Users/dan/..");
console.assert(pn == "/Users", pn)

var fs = require("fs");
fs.unlink("./not_really_there", function (err) {
    console.assert(err, err.message);
    // console.log(err.message);
});

var util = require("util");
util.log("Sample Message!");

