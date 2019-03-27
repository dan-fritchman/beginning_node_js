/*
Chapter 10
Simplifying Callbacks
*/

const chapter = "Chapter 10";
console.log("Running", chapter);
process.on('exit', function (code) {
    console.log("Ending", chapter, "with Error Code", code);
});
const assert = console.assert;
assert(1 === 1);


// The Callback Hell

var bar_ran = false;
var foo_ran = false;

function alwaysAsync(arg, cb) {
    if (arg) process.nextTick(cb); // The important part: don't call cb directly.
    else setTimeout(cb, 100);
}

function foo() {
    assert(!foo_ran);
    assert(bar_ran);
    foo_ran = true;
}

function bar() {
    assert(!foo_ran);
    assert(!bar_ran);
    bar_ran = true;
}

alwaysAsync(true, foo);
bar();


// Async lib

function loadItem(id, cb) {
    function f() {
        cb(null, {id: id})
    } // Called with args `error`, `return val`
    setTimeout(f, 500);
}

function itemsDoneLoading(err, loadedItems) {
    assert(loadedItems.length === 2);
}

const async = require('async');
async.parallel([
    function (cb) {
        loadItem(1, cb);
    },
    function (cb) {
        loadItem(2, cb);
    },
], itemsDoneLoading);


// Error Handling

const fs = require('fs');

function loadJSON(filename, cb) {
    function json_cb(err, data) {
        if (err) {
            return cb(err);
        }
        try {
            var parsed = JSON.parse(data);
        } catch (err) {
            return cb(err);
        }
        return cb(null, parsed);
    }

    fs.readFile(filename, json_cb);
}

function when_json_loaded(err, data) {
    if (err) console.log(err.message);  // Not raising
    console.log(data);
}

loadJSON(__dirname + '/good.json', when_json_loaded);
loadJSON(__dirname + '/bad.json', when_json_loaded);


// Intro to Promises

const Q = require('q');
var deferred = Q.defer();
var promise = deferred.promise;
promise.then(function (val) {
    console.log("Done with: ", val);
});
deferred.resolve('final value');

function getPromise() {
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve("Final Value");
    }, 100);
    return deferred.promise;
}

var promise = getPromise();
promise.then(function (val) {
    console.log('Done With: ', val);
});

var willFulfillDeferred = Q.defer();
var willFulfill = willFulfillDeferred.promise;
willFulfillDeferred.resolve('final_value');

willFulfill
    .then(function (val) {
        console.log('success with ', val);
    })
    .catch(function (reason) {
        console.log('failed with ', reason);
    });
var willRejectDeferred = Q.defer();
var willReject = willRejectDeferred.promise;
willRejectDeferred.reject(new Error('rejection reason'));
willReject
    .then(function (val) {
        console.log('success with: ', val);
    })
    .catch(function (reason) {
        console.log('failed with: ', reason);
    });

var any_cb_ran = false;
Q.when(null).then(function (val) { // Unresolved Promise
    any_cb_ran = true;
    assert(val === null);
});
Q.when('kung foo').then(function (val) { // Resolved to value "kung foo"
    any_cb_ran = true;
    assert(val == 'kung foo');
});
assert(any_cb_ran == false); // This runs first!

Q.reject(new Error('some_internal_error')).catch(function (err) {
    assert(err.message == 'some_internal_error');
});

Q.when(null)
    .then(function (val) {
        return 'kung foo';
    })
    .then(function (val) {
        assert(val === 'kung foo');
        return Q.when('panda');
    })
    .then(function (val) {
        assert(val === 'panda');
    })
    .then(function (val) {
        assert(val === undefined);
    });

Q.when(null)
    .then(function (val) {
        throw new Error('panda');
    })
    .then(function (val) {
        assert(false); // never gonna run
    })
    .catch(function (reason) {
        assert(reason.message === 'panda');
    })
    .then(function (val) {
        return Q.reject(new Error('taco'));
    })
    .then(function (val) {
        assert(false); // never gonna run
    })
    .catch(function (reason) {
        assert(reason.message === 'taco');
    });


// Nodeback Conversion

function data(delay, cb) {
    setTimeout(function () {
        cb(null, 'data');
    }, delay);
}

function error(delay, cb) {
    setTimeout(function () {
        cb(new Error('error'));
    }, delay);
}

data(100, function (err, data) {
    console.log(data);
});
error(100, function (err, data) {
    console.log(err.message);
});
var dataAsync = Q.nbind(data);
var errorAsync = Q.nbind(error);
dataAsync(1000)
    .then(function (data) {
        console.log(data);
    });
errorAsync(1000)
    .then(function (data) {
    })
    .catch(function (err) {
        console.log(err.message);
    });

var readFileAsync = Q.nbind(fs.readFile);
var loadJSONAsync = function (filename) {
    return readFileAsync(filename)
        .then(function (res) {
            return JSON.parse(res);
        })
};
loadJSONAsync(__dirname + '/good.json')
    .then(function (val) {
        console.log(val);
    })
    .catch(function (err) {
        console.log("Error: ", err.message);
    }) // Never called
    .then(function () {
        return loadJSONAsync('absent.json')
    })
    .then(function (val) {
        assert(false); // Never called
    })
    .catch(function (err) {
        assert(err.message);
    })
    .then(function () {
        return loadJSONAsync(__dirname + '/bad.json');
    })
    .then(function (val) {
        assert(false); // Never called
    })
    .catch(function (err) {
        assert(err.message);
    });

var foo = {
    bar: 123,
    bas: function (cb) {
        cb(null, this.bar);
    }
};
var basAsync = Q.nbind(foo.bas, foo);
basAsync().then(function (val) {
    assert(val === 123);
});

const sleepAsync = function (ms) {
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve();
    }, ms);
    return deferred.promise;
};
const p = sleepAsync(100);
p.then(function () {
    console.log("Back from sleep!");
});

function loadJSON_nodeify(filename, callback) {
    return readFileAsync(filename)
        .then(JSON.parse)
        .nodeify(callback);
}

loadJSON_nodeify(__dirname + '/good.json')
    .then(function (val) {
        console.log(val);
    });
loadJSON_nodeify(__dirname + '/good.json', function (err, val) {
    console.log(val);
});

Q.when(Q.when('foo')).then(function (val) {
    console.log(val);
});
var def = Q.defer();
def.resolve(Q.when('foo'));
def.promise.then(function (val) {
    console.log(val);
});
Q.when(null).then(function () {
    return Q.when('foo');
}).then(function (val) {
    console.log(val);
});

function iAsync() {
    return Q.when(null)
        .then(function () {
            var foo;
            foo.bar; // Error!
        });
}

var i = iAsync()
    .catch(function (err) {
        var foo;
        foo.bar; // Another error!
    });
// i.done();  // Error in `catch` is raised here

const BlueBird = require('bluebird');
new BlueBird(function (resolve) {
    resolve('foo');
}).then(function (val) {
    console.log(val);
    assert(val === 'foo');
    return Q.when('bar');
}).then(function (val) {
    assert(val === 'bar');
});


// Inspecting the States of Promises

var p1 = Q.defer().promise;
var p2 = Q.when('fulfill');
var p3 = Q.reject(new Error('reject'));
process.nextTick(function () {
    assert(p1.isPending());
    assert(p2.isFulfilled());
    assert(p3.isRejected());
    assert(p1.inspect()['state'] === 'pending');
    assert(p2.inspect()['state'] === 'fulfilled');
    assert(p2.inspect()['value'] === 'fulfill');
    assert(p3.inspect()['state'] === 'rejected');
});

var loadItem = Q.nbind(function (id, cb) {
    setTimeout(function () {
        cb(null, {id: id});
    }, 500);
});
Q.all([loadItem(1), loadItem(2)])
    .then(function (items) {
        assert(items.length === 2);
        assert(items[0]['id'] === 1);
        assert(items[1]['id'] === 2);
    })
    .done();

