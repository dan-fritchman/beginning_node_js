
/* 
Beginning Node.js
Chapter 2 
Understanding Node.js 
*/ 

// Some setup 
// `console.log` gets tedious here
var cl = console.log;
cl("Running Chapter2");
var assert = console.assert;

var foo = 123;
assert(foo === 123);
// console.log(foo);

var foo = 3;
var bar = 5;
assert(foo+1 === 4);
// console.log(foo+1);
assert(foo/bar === 0.6);
// console.log(foo/bar);
assert(foo*bar === 15);
// console.log(foo*bar);
assert(foo-bar === -2);
// console.log(foo-bar);
assert(foo%2 === 1);
// console.log(foo%2);

var foo = true;
assert(foo);
assert(true && true);
assert(!(true && false));
assert(true || false);
assert(!(false || false));
assert(!!true);
assert(!false);

var foo = [];
foo.push(1);
console.log(foo);
foo.unshift(2);
console.log(foo);
console.log(foo[0]);

var foo = {};
// console.log(foo);
foo.bar = 123;
// console.log(foo);

var foo = {
    bar: 456
};
// console.log(foo);

var foo = {
    bar: 123,
    bas: {
        bas1: 'some string',
        bas2: 345
    },
    bat: [1, 2, 3]
};
// console.log(foo);

var foo = {
    bar: 123,
    bas: [{
        qux: 1
    },
    {
        qux: 2
    },
    {
        qux: 3
    }]
};
assert(foo.bar === 123);        // 123
assert(foo.bas[0].qux === 1); // 1
assert(foo.bas[2].qux === 3);

function foot (){
    return 123;
}
assert(foot() === 123);

function bart (){ }
assert(bart() === undefined);

(function immediately_execute () {
    console.log("Immediately executed!");
})();

var foo = 123;
(function () { // create a new scope
    var foo = 456;
}) ();
assert(foo === 123); // 123;
// no function name given i.e. anonymous function
var foo2 = function () { }
foo2(); // foo2

function outer(arg){
    var outer_var = arg;
    function inner(){
        console.log(outer_var);
    }
    return inner();
}
outer("Calling outer func with closure");

function outer2(arg){
    var outer_var = arg;
    return function(){
        console.log(outer_var);
    }
}

var inner2 = outer2("Hello inner2!");
inner2();

// TODO: sort out his point on the async/ callback theme. 
// This code takes about 10s to run, so it's generally left out. 

// console.time('timer');
// setTimeout(function(){
//    console.timeEnd('timer');
// },1000)

// console.time('timeit');
// function fibonacci(n) {
//     if (n < 2)
//         return 1;
//     else
//         return fibonacci(n - 2) + fibonacci(n - 1);
// }
// fibonacci(44);             // modify this number based on your system performance
// console.timeEnd('timeit'); // On my system it takes about 9000ms (i.e. 9 seconds)

// // setup the timer
// console.time('timer');
// setTimeout(function () {
//     console.timeEnd('timer'); // Prints much more than 1000ms
// }, 1000)

// // Start the long running operation
// fibonacci(44);

var foo = { bas: 123 };
var bar = foo;
bar.bas = 456;
assert(foo.bas === 456); // 456

var foob;
assert(foob === undefined); // undefined

var foo = { bar: 123 };
assert(foo.bar === 123); // 123
assert(foo.bas === undefined); // undefined

// Exact Equality

assert(5 == '5');   // true
assert(!(5 === '5'));  // false
assert(!('' == '0'));  // false
assert('' == 0);    // true

// Truthy and Falsy

assert(null == undefined);
assert(!(null === undefined));

assert(!false);
assert(!null);
assert(!undefined);
assert(1);
assert(!'');

// Revealing Module Pattern

function printableMessage(){
    var message = 'hello';
    function setMessage(newMessage){
        if (!newMessage) throw new Error('Empy Message')
        message = newMessage;
    }
    function getMessage(){
        return message;
    }
    function printMessage(){
        cl(message);
    }
    return {
        setMessage: setMessage,
        getMessage: getMessage,
        printMessage: printMessage
    }
}

var awesome1 = printableMessage();
assert(awesome1.getMessage() == 'hello');
// awesome1.printMessage();

var awesome2 = printableMessage();
awesome2.setMessage('hi');
assert(awesome2.getMessage() == 'hi');
// awesome2.printMessage();

// Understanding `this`

var foo = {
    bar: 123,
    bas: function () {
        assert(this.bar === 123);
        // cl("Inside this.bar is: ", this.bar);
    }
}
assert(foo.bar === 123);
foo.bas();

function f () {
    // Without an object, `this` is the `global` object 
    assert(this === global);
}
f();

function f () {
    this.foo = 123;
    // console.log('Is this global?: ', this == global);
}
// without the new operator
f(); // Is this global?: true
// console.log(global.foo); // 123
// with the new operator
var newFoo = new f();  // Is this global?: false
// console.log(newFoo.foo); // 123


// Understanding Prototype

function f() {};
f.prototype.bar = 123;
var bas = new f();
// cl(bas.__proto__);
// cl(f.prototype);
assert(bas.__proto__ === f.prototype);
assert(bas.bar === 123);

var qux = new f();
assert(bas.bar === 123);
assert(qux.bar === 123);
// Change the proto attribute
f.prototype.bar = 456;
assert(bas.bar === 456);
assert(qux.bar === 456);
// Now over-write with a local attr
bas.bar = 789;
assert(bas.bar === 789);
assert(qux.bar === 456);

function someClass(){
    this.someProperty = 'some initial value';
}
someClass.prototype.someMethod = function (){
    this.someProperty = 'modified value';
}
var instance = new someClass();
assert(instance.someProperty === 'some initial value');
instance.someMethod();
assert(instance.someProperty === 'modified value');

// Error Handling

(function (){
    var try_ran = false;
    var catch_ran = false;
    try {
        try_ran = true;
        throw new Error("Error Thrown");
    }
    catch(e) {
        catch_ran = true;
        assert(e.message === "Error Thrown");
    }
    finally {
        assert(try_ran);
        assert(catch_ran);
    }
})();

// Async/ callback use-case 
setTimeout(function () {
    try {
        throw new Error('Error thrown');
    }
    catch (e) {
        assert(e.message === 'Error thrown');
    }
}, 1000);

