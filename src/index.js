// index.js
//

var app = require('./app.js'),
    server = require('./server.js');

/**
 * Perform startup initialization.
 */
function initialize(path, require) {
  app.initialize(path, require);
  server.initialize();
}

/**
 * Runs the application.
 * @param {String} path  The root directory that the application is located in.
 * @param {Function} require  The module loader associated with the application.
 */
function run(path, require) {
  initialize(path, require);
  server.run();
}

exports.run = run;

