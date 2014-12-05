// server.js
//

var http = require('http');
var app = require('./app.js');

var httpServer = null;

/**
 * Initializes the server.
 */
function initializeServer() {
}

/**
 * Runs the server.
 */
function runServer() {
  console.log(app.settings);
}

exports.initialize = initializeServer;
exports.run = runServer;

