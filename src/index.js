// index.js
//

var module = require('module'),
    path = require('path');
var app = require('./app.js');

function initializeApplication() {
  var appPath = path.dirname(require.main.filename);
  var appRequire = require.main.require.bind(require.main);

  return app.initialize(appPath, appRequire));
}

function runWebServer() {
  if (initializeApplication()) {
    var server = require('./server.js');

    server.initialize();
    server.run();
  }
}

function run() {
  // TODO: Support for other modes ... eg. worker and task
  runWebServer();
}

exports.run = run;
