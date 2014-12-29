// index.js
//

var module = require('module'),
    path = require('path');
var app = require('./app.js');

/**
 * Runs the application.
 */
function run() {
  var appPath = path.dirname(require.main.filename);
  var appRequire = require.main.require.bind(require.main);

  if (app.initialize(appPath, appRequire)) {
    var server = require('./server.js');

    server.initialize();
    server.run();
  }
}

exports.run = run;
