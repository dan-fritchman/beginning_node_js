/* 
Chapter 5
Events & Streams
*/ 

var chapter = "Chapter 5";
console.log("Running", chapter);
process.on('exit', function (code) { // New! 
    console.log("Ending", chapter, "with Error Code", code);
});
var assert = console.assert;

// Classical Inheritrance in JS 

var a = {}
var b = {}
function f(val){
    this.val = val;
}
f.call(a, 123); // Setting `this`
f.call(b, 456);
assert(a.val === 123);
assert(b.val === 456);

function Animal(name){
    this.name = name;
    this.dest = null;
}
Animal.prototype.walk = function(dest){
    this.dest = dest;
}
var e = new Animal("Elephant");
e.walk("Africa");
assert(e.dest === "Africa");

function Bird(name){ // Our first "subclass"
    Animal.call(this, name);
    this.flies = true;
}
Bird.prototype.__proto__ = Animal.prototype;
Bird.prototype.fly = function(dest){
    assert(this.flies);
    this.dest = dest;
}
var bird = new Bird("sparrow");
bird.walk("Sydney");
assert(bird.dest === "Sydney");
bird.fly("Adelaide");
assert(bird.dest === "Adelaide");

function Foo(){ }
assert(Foo.prototype.constructor === Foo);
assert(Foo.prototype.constructor.name === "Foo");

// The Proper Node.js Way

var util = require('util');
function Mammal(name){
    Animal.call(this, name)
    this.flies = false;
    this.furry = true;
}
util.inherits(Bird, Animal);
Mammal.prototype.walk = function(dest){
    assert(this.furry);
    this.i_walked = true;
    Animal.prototype.walk.call(this, dest);
}
var whale = new Mammal('whale');
whale.walk("mars");
assert(whale.i_walked);
assert(whale.dest === "mars");

// Checking Inheritance Chain

assert(whale instanceof Mammal)
function A(){}
function B(){}
util.inherits(B,A);
var b = new B();
assert(b instanceof B);
assert(b instanceof A);

// Deeper Understanding of the Internals of util.inherits

var foo = {};
var bar = Object.create(foo);
assert(bar.__proto__ === foo);
assert(B.super_ === A);

// Node.js Events

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
emitter.on('e1', function(arg){
    assert(arg.a === 3);
    arg.b = 6;
})
emitter.on('e1', function(arg){
    assert(arg.a +1 === 4);
    // Note this requires the function above has run! 
    assert(arg.b === 6);
})
emitter.emit('e1', {a:3});

function f1(arg){
    assert(arg.a === 33);
    arg.b = 77;
}
var f2 = function (arg){
    assert(arg.b === 77);
}
emitter.on('e2', f1);
emitter.on('e2', f2);
emitter.emit('e2', {a:33});
var saw_listener_removed = false;
emitter.on("removeListener", function () {
    saw_listener_removed = true;
})
emitter.removeListener('e2', f1);
emitter.removeListener('e2', f2);
emitter.emit('e2', {a:null});

var e3_has_run = false;
emitter.once('e3', function(){
    assert(!e3_has_run);
    e3_has_run = true;
})
emitter.emit('e3');
emitter.emit('e3');
emitter.emit('e3');

assert(emitter.listeners("e1"));
setTimeout(function () {
    assert(saw_listener_removed);
}, 0);


// Number of listeners limit 
var listenersCalled = 0;
function someCallback() {
    emitter.on('foo', function () { listenersCalled++ });
}
emitter.setMaxListeners(20); // Default errors at 10
for (var i = 0; i < 20; i++) {
    someCallback();
}
emitter.emit('foo');
assert(listenersCalled === 20);

// Error event handling 
var err_str = "WTF?!?"
emitter.on("error", function (e) {
    assert(e.message === err_str);
})
emitter.emit("error", new Error(err_str));

// Creating Your Own Event Emitters
function MyEmitter() { EventEmitter.call(this); }
util.inherits(MyEmitter, EventEmitter);
MyEmitter.prototype.connect = function () {
    this.emit("connected");
}
var mye = new MyEmitter();
var mye_ran = false;
mye.on("connected", function() { 
    assert(!mye_ran);
    mye_ran = true; })
mye.connect(); 
assert(mye_ran);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
    console.log('Stack:', err.stack);
    process.exit(1);
});
// fail_now(); // Non-existent function 

// Using SIGNALS
// setTimeout(function () {
//     console.log("Five sec passed, exiting");
// }, 5000);
// console.log("Started, will exit in 5s");
// process.on('SIGINT', function () {
//     console.log("Got SIGINT, ignoring");
// })

// Streams

var stream = require("stream");
assert(new stream.Stream() instanceof EventEmitter);
var fs = require('fs');
var rs = fs.createReadStream('./cool.txt');
// rs.pipe(process.stdout);
var gzip = require('zlib').createGzip();
var inp = fs.createReadStream('./cool.txt');
var out = fs.createWriteStream('./cool.txt.gz');
inp.pipe(gzip).pipe(out);
var cool = fs.createReadStream('./cool.txt');
cool.on('readable', function () {
    var buf = cool.read();
    if (buf != null){
        assert(buf == "Cool!");
    }
})

var Readable = require('stream').Readable;
function Counter() {
    Readable.call(this);
    this._max = 1000;
    this._index = 1;
}
util.inherits(Counter, Readable);
Counter.prototype._read = function () {
    var i = this._index++;
    if (i > this._max)
        this.push(null);
    else {
        var str = ' ' + i;
        this.push(str);
    }
};
var counter = new Counter();
// counter.pipe(process.stdout);

var Writable = require('stream').Writable;
function Logger() {
    Writable.call(this);
}
util.inherits(Logger, Writable);
Logger.prototype._write = function (chunk) {
    console.log(chunk.toString());
};
var logger = new Logger();
var readStream = require('fs').createReadStream('./message.txt');
// readStream.pipe(logger);

