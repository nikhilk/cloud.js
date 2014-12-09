// server.js
//

var http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    fs = require('fs'),
    connect = require('connect'),
    bodyParser = require('body-parser'),
    static = require('serve-static');
var app = require('./app.js'),
    consts = require('./consts.js');

var _httpServer = null;

function requestHandler(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('OK');
}

function queryParser(req, res, next) {
  if (!req.query) {
    req.query = ~req.url.indexOf('?') ? qs.parse(url.parse(req.url).query) : {};
  }

  next();
}

/**
 * Initializes the server.
 */
function initializeServer() {
  // TODO: Enable configuration of the pipeline

  var pipeline = connect();

  var path = app.path('content');
  if (fs.existsSync(path)) {
    var stats = fs.statSync(path);
    if (stats.isDirectory()) {
      pipeline.use(static(path));
    }
  }

  pipeline.use(bodyParser.json())
          .use(queryParser)
          .use(requestHandler);

  _httpServer = http.createServer(pipeline);
}

/**
 * Runs the server.
 */
function runServer() {
  var port = process.env[consts.vars.port] ||
             app.settings.port ||
             consts.defaults.port;
  port = parseInt(port, 10);

  _httpServer.listen(port);
  console.log('Started server at http://localhost:' + port);
}

exports.initialize = initializeServer;
exports.run = runServer;

