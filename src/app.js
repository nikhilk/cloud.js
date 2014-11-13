// app.js
//

var path = require('path');

var _path = null;
var _require = null;

/**
 * Initializes the current application module.
 * @param {String} path  The root directory that the application is located in.
 * @param {Function} require  The module loader associated with the application.
 */
function initializeApplication(path, require) {
  console.log('Application "%s" initialized...', path);

  _path = path;
  _require = require;
}

/**
 * Loads the specified module from the application.
 * @param {String} name  The name of the module to load.
 * @returns  The loaded module.
 */
function requireModule(name) {
  return _require(name);
}

/**
 * Resolves the specified path against the application root path.
 * @param {String} path  The relative path to resolve.
 * @returns  The full path.
 */
function resolvePath(path) {
  return path.join(_path, path);
}

exports.initialize = initializeApplication;
exports.module = requireModule;
exports.path = resolvePath;

