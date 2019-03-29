/*
Chapter 11
Debugging
*/

const chapter = "Chapter 11";
console.log("Running", chapter);
process.on('exit', function (code) {
    console.log("Ending", chapter, "with Error Code", code);
});
const assert = console.assert;
assert(1 === 1);


// Console

console.time('first');
setTimeout(() => {
    console.timeEnd('first');
}, 200);
console.time('second');
setTimeout(() => {
    console.timeEnd('second');
}, 100);

function foo() {
    console.trace('trace at foo');
}

function bar() {
    foo();
}

foo();
bar();

function foo() {
    var stack = new Error('trace at foo').stack;
    console.log(stack);
}

bar();

console.log('Std Out');
console.error('Std Err');

for (let index = 0; index < 10; index++) {
    let msg = 'Loop # ' + index;
    debugger; // Works similar to a breakpoint
    console.log(msg);
}

// http = require('http');
// const server = http.createServer(function (req, res){
//     res.write('hello client');
//     res.end();
// });
// server.listen(3000);

