// index.js
//

var app = require('./app.js');

/**
 * Runs the application.
 * @param {String} path  The root directory that the application is located in.
 * @param {Function} require  The module loader associated with the application.
 */
function run(path, require) {
  app.initialize(path, require);
}

exports.run = run;

