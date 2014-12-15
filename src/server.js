// server.js
//

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    routes = require('routes'),
    connect = require('connect'),
    bodyParser = require('body-parser'),
    queryParser = require('./middleware/queryparser.js'),
    static = require('serve-static');
var app = require('./app.js'),
    consts = require('./consts.js');

var _handlers = [
  require('./actions/handler.js')
];

var _httpServer = null,
    _routes = null;

function requestHandler(request, response) {
  var parsedURL = url.parse(request.url);

  var matchingRoute = _routes.match(parsedURL.pathname);
  if (matchingRoute) {
    matchingRoute.fn(matchingRoute, request, response);
  }
  else {
    response.writeHead(404);
    response.end();
  }
}

/**
 * Initializes the server.
 */
function initializeServer() {
  _routes = routes();
  _handlers.forEach(function(handler) {
    handler.initialize();
    _routes.addRoute(handler.route, handler);
  });

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
          .use(queryParser.parser)
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

