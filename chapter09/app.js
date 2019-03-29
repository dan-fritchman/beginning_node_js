/*
Chapter 9
Front-End Basics
*/

const chapter = "Chapter 9";
console.log("Running", chapter);
process.on('exit', function (code) {
    console.log("Ending", chapter, "with Error Code", code);
});
const assert = console.assert;
assert(1 === 1);

const express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db, itemsCollection;
const db_url = 'mongodb://127.0.0.1:27017/demo';
var app = express();
MongoClient.connect(db_url, function (err, client) {
    if (err) throw err;
    var db = client.db();
    itemsCollection = db.collection('items');
    app.listen(3000);
    console.log("Listening on Port 3000");
})

var router = express.Router();
router.use(bodyParser.json());
router.route('/')
    .get(function (req, res, next){
        itemsCollection.find().toArray(function (err, docs){
            res.send({
                status: "Items Found",
                items: docs
            });
        });
    })
    .post(function (req, res, next){
        var item = req.body;
        itemsCollection.insert(item, function (err, docs) {
            res.send({
                status: 'Item Added',
                itemId: item._id
            });
        });
    });
router.route('/:id')
    .delete(function (req, res, next){
        var id = req.params['id'];
        var lookup = {
            _id: new mongodb.ObjectID(id)
        };
        itemsCollection.remove(lookup, function(err, results){
            res.send({status: "Item Deleted"});
        });
    });
app.use(express.static(__dirname + '/public'))
    .use('/todo', router);
