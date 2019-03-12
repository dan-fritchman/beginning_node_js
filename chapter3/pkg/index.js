
var mod1 = require("./mod1");
var mod2 = require("./mod2");
var mod3 = require("./mod3");

console.assert(mod1.my_number === 1, mod1.my_number);
console.assert(mod2.my_number === 2);
console.assert(mod3.my_number === 3);

exports.mod1 = mod1;
exports.mod2 = mod2;
exports.mod3 = mod3;
