/*
Chapter 12
Testing
*/

const chapter = "Chapter 12";
console.log("Running", chapter);
process.on('exit', function (code) {
    console.log("Ending", chapter, "with Error Code", code);
});


// Apparently we been screwing this up!
const assert = require('assert');
assert.equal(1, 1);

try{
    assert.equal(0,1);
} catch (e) {
    console.log(e);
}
