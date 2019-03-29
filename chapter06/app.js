/* 
Chapter 6
Getting Started with HTTP
*/ 

var chapter = "Chapter 6";
console.log("Running", chapter);
process.on('exit', function (code) { // New! 
    console.log("Ending", chapter, "with Error Code", code);
});
var assert = console.assert;


var http = require('http');

var f = function(request, response){
    console.log("Requested!");
    console.log(request.headers);
    console.log(request.method);
    console.log(request.url);
    // Twiddle some header content 
    response.setHeader("Content-Type", "text/html");
    var contentType = response.getHeader('content-type');
    assert(contentType === 'text/html');
    response.removeHeader("Content-Type");
    // Set an error code 
    response.statusCode = 500;
    // Over-write that
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write("HELLO!");
    response.end();
}
// FIXME: how to run tests around this
// var server = http.createServer(f);
// server.listen(3000);

// MIME Types
var mime = require("mime");
// Seems this function the book uses is out of date
// console.log(mime.lookup("file.txt"));
// assert(mime.lookup("file.txt") === 'text/plain');

// Simple File Server 

var fs = require("fs");
var path = require("path");
var mimeLookup = {
    '.js': 'application/javascript',
    '.html': 'text/html'
};
function send404(resp){
    resp.writeHead(404, {'Content-Type':'text/plain'});
    resp.write('Error 404: Resource Not Found');
    resp.end();
}
function respond(req, resp){
    if (req.method == 'GET'){
        var fileurl;
        if (req.url == '/') fileurl = 'index.html';
        else fileurl = req.url;
        var filepath = path.resolve('./public/' + fileurl);
        var fileExt = path.extname(filepath);
        var mimeType = mimeLookup[fileExt];
        if (!mimeType){
            send404(resp);
            return;
        }
        fs.exists(filepath, function(exists){
            if (!exists){
                send404(resp);
                return;
            }
            resp.writeHead(200, {'content-type':'text/html'});
            fs.createReadStream(filepath).pipe(resp);
        })
    }
    else {
        send404(resp);
    }
}
// var file_server = http.createServer(respond)
// file_server.listen(3000);

// Connect 

var util = require("util");
function logit(req, resp, next){
    var msg = util.format('Requested: %s, %s', req.method, req.url);
    util.log(msg);
    next();
}
function echo(req, resp, next){
    req.pipe(resp);
    // next();
}
var connect = require("connect");
// var app = connect() 
//     .use(logit)
//     .use("/echo", echo)
//     .use(function (req, res) { res.end('Wassup!') })
//     .listen(3000);

var echo = {
    handle: function(req, res, next){
        req.pipe(res);
    }
}
// connect().use(echo).listen(3000);

function greeter(message){
    return function (req, resp, next){
        resp.end(message);
    }
}
var hello = greeter('Hello World!');
var hey = greeter("Hey There!");
// connect()
//     .use('/hello', hello)
//     .use('/hey', hey)
//     .listen(3000);


function parseJSON(req, res, next) {
    console.log(req.method);
    console.log(req.body);
    if (req.headers['content-type'] == 'application/json') {
        // Load all the data
        var readData = '';
        req.on('readable', function () {
            readData += req.read();
        });
        console.log(readData);
        // Try to parse
        req.on('end', function () {
            try { req.body = JSON.parse(readData); }
            catch (e) { }
            next();
        })
    }
    else { next(); }
}
var c = connect()
    .use(parseJSON)
    .use(function(req, res){
        if (req.body){
            res.end('Parsed JSON: ', req.body.foo);
        } else {
            res.end('No JSON Detected');
        }
    })
// c.listen(3000);

function auth(req, res, next){
    function send401(){
        res.writeHead(401 , {'WWW-Authenticate': 'Basic'});
        res.end();
    }
    var authHeader = req.headers.authorization;
    if(!authHeader){
        send401();
        return;
    }
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'foo' && pass == 'bar'){
        next();
    } else {
        send401();
    }
}
var c = connect()
    .use(auth)
    .use(function (req, res) { res.end('Authorized!'); });
// c.listen(3000);

var log_error = function(err, req, res, next){
    console.log("LOGGING ERROR");
    console.log(err.message);
    console.log(err.stack);
    res.writeHead(500);
    res.end("Internal Server Error. Sorry.");
}
var c = connect()
    .use(function (req, res, next) { throw new Error('An error has occurred') })
    // .use(function (req, res, next) { next(new Error('An error has occurred')) })
    .use(function (req, res, next) { res.end('I will never get called'); })
    .use(log_error);
// c.listen(3000);

var https = require('https');
var opts = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}
var hello_from_https = function (req, res){
    console.log('???');
    res.end("Hello from HTTPS!");
}
var s = https.createServer(opts, hello_from_https);
// s.listen(3000);

var app = connect();
app.use(hello_from_https);
var s = https.createServer(opts, app);
// s.listen(443);
var redirect = function(req, res){
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}
var h = http.createServer(redirect);
// h.listen(80);


