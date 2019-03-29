console.log(new Date());

var assert = require('assert');
var List = require('./list');
var list = new List();
assert.equal(list.count(), 0);

list.add({
    id: 'someId',
    value: 'some value'
});
assert.equal(list.count(), 1);
list.clear();
assert.equal(list.count(), 0);

list.add({
    id: 'someId',
    value: 'some value'
});
list.remove('someId');
assert.equal(list.count(), 0);

list.add({
    id: 'someId',
    value: 'some value'
});
assert.equal(list.get('someId').value, 'some value');
list.clear();

assert.throws(function () {
    list.add({
        value: 'some value' // no id
    })
}, function (err) {
    return (err instanceof Error) &&
        (err.message === 'item must have id')
});


// Mocha

describe('our test suite', function () {
    var testExecuting = 0;
    beforeEach(function () {
        testExecuting++;
    });

    it('test 1', function () {
        assert.equal(1, 1);
    });
    it('test 2', function () {
        assert.equal(3, 3);
    });
});

describe('suite 2', function () {
    it('suite 2, test 1', function () {
        assert.equal(5,5);
    })
});

describe('suite 3', function () {
    it('should pass', function(done){
        setTimeout(() => { done(); }, 100)
    });
    // it('should pass', function(done){
    //     setTimeout(() => { done(new Error('fail')); }, 100)
    // });
});


const Q = require('q');

describe('promise_test_suite', function () {
    it('should_pass', function () {
        return Q.when('pass');
    });
    // it('should_fail', function () {
    //     return Q.reject(new Error('fail'));
    // });
});


// Chai

var chai = require('chai');
var assert = chai.assert;
assert.isNull(null);

chai.use(require('chai-datetime'));
var t1 = new Date();
chai.assert.equalTime(t1, t1);
chai.assert.beforeTime(t1, new Date());

var expect = chai.expect;
var beverages = { tea: ['chai', 'matcha', 'oolong']};
assert.lengthOf(beverages.tea, 3);
expect(beverages).to.have.property('tea').with.length(3);


console.log(new Date());

