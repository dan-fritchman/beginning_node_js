/* 
Chapter 8
Persisting Data
*/ 

var chapter = "Chapter 8";
console.log("Running", chapter);
process.on('exit', function (code) { 
    console.log("Ending", chapter, "with Error Code", code);
});
var assert = console.assert;


var MongoClient = require('mongodb').MongoClient;
var db_url = 'mongodb://127.0.0.1:27017/demo';
var demoPerson = {name: 'John', lastName: 'Smith'};
var findKey = {name: 'John'};
var f = function (err, client){
    if (err) throw err;
    console.log("Successfully Connected!");
    var db = client.db();
    // console.log(db);
    var collection = db.collection('people');
    var insert_cb = function (err, res){
        assert(res.result.n >= 1);
        // console.log("Inserted ", res.result.n);
        // console.log("ID: ", demoPerson._id);
        var find_cb = function (err, results){
            assert(results.length >= 1);
            // console.log("Found Results: ", results);
            collection.deleteMany(findKey, function (err, res){
                assert(res.result.n >= 1);
                client.close();
            });
        };
        collection.find(findKey).toArray(find_cb);
    };
    collection.insertOne(demoPerson, insert_cb);
};
MongoClient.connect(db_url, { useNewUrlParser: true }, f)


function f (err, client){
    if (err) throw err;
    var db = client.db();
    var collection = db.collection('people');
    collection.insertOne(demoPerson,  function(err, docs){
        if (err) throw err;
        demoPerson.lastName = 'Martin';
        collection.updateOne(demoPerson, function(err){
            if (err) throw err;
            console.log("Updated");
            collection.find(findKey).toArray(function (err, results){
                if (err) throw err;
                console.log(results);
                collection.drop(function () { db.close(); });
            });
        });
    });
}
// FIXME: fails in newer mongo clients!  Not sure how to represent this save -> updateOne change.
// MongoClient.connect(db_url, { useNewUrlParser: true }, f);


var website = {
    url: 'http://www.hw21.io',
    visits: 0
}
var siteSearch = {
    url: 'http://www.hw21.io',
}
function incrementation_tests (err, client){
    if (err) throw err;
    var collection = client.db().collection('websites');
    collection.insertOne(website, function (err, docs){
        var done = 0;
        function onDone(err){
            done++;
            if (done < 4) return;
            collection.find(siteSearch).toArray(function (err, res){
                var visits = res[0].visits;
                console.log('Visits: ', visits);
                assert(visits === 4, visits);
                collection.drop(function () { client.close() });
            });
        }
        var incrementVisits = { '$inc': {'visits':1}};
        collection.updateOne(siteSearch, incrementVisits, onDone);
        collection.updateOne(siteSearch, incrementVisits, onDone);
        collection.updateOne(siteSearch, incrementVisits, onDone);
        collection.updateOne(siteSearch, incrementVisits, onDone);
    })
}
MongoClient.connect(db_url, { useNewUrlParser: true }, incrementation_tests);


var mongoose = require('mongoose');
var tankSchema = new mongoose.Schema({
    name: 'string', 
    size: 'string'
});
tankSchema.methods.print = function () {
    console.log("I am", this.name, "the", this.size);
}
var Tank = mongoose.model('Tank', tankSchema);
mongoose.connect(db_url);
var db = mongoose.connection;
db.on('error', function (err) { throw err; });
db.once('open', function cb() {
    console.log('connected');
    var tony = new Tank({
        name: "Tony",
        size: "small"
    })
    tony.save(function (err) {
        if (err) throw err;
        console.log("Saved!");
        Tank.findOne({name: 'Tony'})
        .exec(function (err, tank){
            if (err) throw err;
            tank.print();
            db.collection('tanks').drop(function () {db.close();})
        });
    })    
});

var express = require('express');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
mongoose.connect(db_url);
var db = mongoose.connection;
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
var app = express()
    .use(expressSession({
        secret: 'my super secret key',
        store: sessionStore
    }))
    .use('/home', function (req, res){
        if (req.session.views){
            req.session.views++;
        } else {
            req.session.views = 1;
        }
        res.end("Total views: " + req.session.views);
    })
    .use('/reset', function (req, res){
        delete req.session.views;
        res.end('Cleared Views');
    })
    .listen(3000);

