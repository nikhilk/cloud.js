// server.js
//

var http = require('http');
var app = require('./app.js'),
    consts = require('./consts.js');

var _httpServer = null;

function requestHandler(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('OK');
}

/**
 * Initializes the server.
 */
function initializeServer() {
  _httpServer = http.createServer(requestHandler);
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

