/* 
Chapter 7
Express
*/ 

var chapter = "Chapter 7";
console.log("Running", chapter);
process.on('exit', function (code) { // New! 
    console.log("Ending", chapter, "with Error Code", code);
});
var assert = console.assert;

var express = require("express");
var http = require("http");
var https = require("https");
var fs = require('fs');


var app = express();
app.use(function(req, res, next){
    res.end("HEELLLOOO EXPRESS");
});
var server = http.createServer(app);
// server.listen(3000);

// var serveStatic = require('serve-static'); // AKA express.static
var serveIndex = require('serve-index');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(serveIndex(__dirname + '/public'));
// app.listen(3000);

var bodyParser = require('body-parser');
var app = express()
    .use(bodyParser())
    .use(function(req, res){
        res.end(req.body);
    });
// app.listen(3000);

var cookieParser = require('cookie-parser');
var app = express()
    .use(cookieParser('optional secret string'))
    .use(function(req, res){
        var name = req.signedCookies.name;
        console.log(name);
        if (name){
            res.clearCookie('name');
            res.end('Cleared Cookie ');
        } else {
            res.cookie('name', 'PD', 
                {'signed':true, 'httpOnly':true, 'maxAge': 900000,} );
            res.end('Helllo');
        }
    });
var opts = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}
var s = https.createServer(opts, app);
// s.listen(443);

var cookieSession = require('cookie-session');
var compression = require('compression');
var timeout = require('connect-timeout');
var app = express()
    .use(timeout(5000))
    .use(function (error, req, res, next) {
        if (req.timedout) {
            res.statusCode = 500;
            res.end('Request timed out');
        } else {
            next(error);
        }}) 
    .use(compression({'threshold':11}))
    .use(cookieSession({keys:['secret signing key']}))
    .use('/home', function(req, res){
        // console.log(req.ip);
        // console.log(req.secure);
        if (req.session.views){
            req.session.views++;
        } else {
            req.session.views = 1;
        }
        res.end('Total views: '+ req.session.views);
    })
    .use('/reset', function(req, res){
        delete req.session.views;
        res.end("Cleared View Count");
    })
// var s = https.createServer(opts, app);
// s.listen(443);

var app = express()
    .use('/home', function(req, res, next){
        console.log('First: ', req.url);
        console.log('First: ', req.originalUrl);
        next();
    })
    .use('/', function(req, res, next){
        console.log('Second: ', req.url);
        console.log('Second: ', req.originalUrl);
        next();
    })
// var s = https.createServer(opts, app);
// s.listen(443);


var app = express();
app.all('/', function(req, res, next){
    res.write('all\n');
    next();
})
app.get('/', function(req,res,next){
    res.end('GET');
})
app.put('/', function(req, res, next){
    res.end('PUT');
})
app.post('/', function(req, res, next){
    res.end('POST');
})
app.delete('/', function(req, res, next){
    res.end('DELETE');
})
// var s = https.createServer(opts, app);
// s.listen(443);


var app = express();
app.route('/')
    .all(function (req, res, next){
        res.write('all\n');
        next();
    })
    .get(function (req, res, next){
        res.end('GET');
    })
    .put(function (req, res, next){
        res.end('PUT');
    })
    .post(function (req, res, next){
        res.end('POST');
    })
    .delete(function (req, res, next){
        res.end('DELETE');
    })
// var s = https.createServer(opts, app);
// s.listen(443);


var app = express();
app.get('/', function(req, res) {
    res.send('Nothing passed in!');
})
app.get(/^\/[0-9]+$/, function(req, res) {
    res.send('Number!');
})
app.get('/:non_number', function(req, res) {
    res.send('Not a number! '+ req.params['non_number']);
})
app.param('userId', function(req,res,next,userId){
    res.write('Looking up user: ' + userId + '\n');
    req.user = {'userId': userId};
    next();
});
app.get('/user/:userId', function(req, res){
    res.end('User is: ' + JSON.stringify(req.user));
});
// var s = https.createServer(opts, app);
// s.listen(443);


var items = [];
var router = express.Router();
router.use(bodyParser());
router.route('/')
    .get(function (req, res, next){
        res.send({
            status: 'Items found',
            items: items
        });
    })
    .post(function (req, res, next){
        items.push(req.body);
        res.send({
            status: 'Item Added',
            itemId: items.length - 1
        });
    })
    .put(function (req, res, next){
        items = req.body;
        res.send({status: 'Items Replaced'});
    })
    .delete(function (req, res, next){
        items = [];
        res.send({status: 'Items cleared'});
    });
router.route('/:id')
    .get(function (req, res, next){
        var id = req.params['id'];
        if (id && items[Number(id)]){
            res.send({
                status: "Item found!",
                item: items[Number(id)]
            });
        } else {
            res.send(404, {status: "Not Found"});
        }
    })
    .all(function (req, res, next){
        res.send(501, {status: "Not Implemented"});
    });
var app = express().use('/dodo', router);
var s = https.createServer(opts, app);
s.listen(443);

