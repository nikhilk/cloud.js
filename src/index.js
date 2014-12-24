// index.js
//

var module = require('module'),
    path = require('path');
var app = require('./app.js'),
    server = require('./server.js');

/**
 * Runs the application.
 */
function run() {
  var appPath = path.dirname(require.main.filename);
  var appRequire = require.main.require.bind(require.main);

  app.initialize(appPath, appRequire);
  server.initialize();
  server.run();
}

exports.run = run;
