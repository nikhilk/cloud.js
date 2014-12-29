// app.js
//

var fs = require('fs'),
    path = require('path'),
    yaml = require('yamljs');
var logger = require('./core/logger.js');

var _rootPath = null;
var _require = null;
var _settings = null;
var _log = null;

/**
 * Returns the application object that should be exposed to user code.
 */
function getApiObject() {
  return {
    settings: _settings,
    log: _log
  };
}

/**
 * Initializes the current application module.
 * @param {String} root  The root directory that the application is located in.
 * @param {Function} require  The module loader associated with the application.
 */
function initializeApplication(root, require) {
  _log = logger.createLog('app');
  _log.debug('Initializing application "%s" ...', root);

  _rootPath = root;
  _require = require;

  var settingsFile = path.join(root, 'config', 'app.yaml');
  if (fs.existsSync(settingsFile)) {
    try {
      _settings = yaml.load(settingsFile);
    }
    catch (e) {
      _log.error('Unable to parse "%s" as a valid YAML settings file.', settingsFile);
      return false;
    }
  }
  else {
    _settings = {};
  }

  exports.settings = _settings;
  exports.log = _log;

  return true;
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
 * @param {String} relativePath  The relative path to resolve.
 * @param {String} relativePaths  Placeholder for indicating more path segments.
 * @returns  The full path.
 */
function resolvePath(relativePath, relativePaths) {
  if (!relativePaths) {
    return path.join(_rootPath, relativePath);
  }
  else {
    var segments = [ _rootPath ].concat(Array.prototype.slice.call(arguments));
    return path.join.apply(null, segments);
  }
}

exports.initialize = initializeApplication;
exports.require = requireModule;
exports.resolve = resolvePath;
exports.api = getApiObject;

