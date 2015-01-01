// logger.js
//

var os = require('os'),
    tty = require('tty'),
    util = require('util');
var winston = require('winston');

function SimpleConsoleTransport(options) {
  options = options || {};
  winston.Transport.call(this, options);

  this.name = 'simpleConsole';
  this.level = options.level || 'debug';

  if (tty.isatty(process.stdout.fd)) {
    this.formatLevel = function(level) {
      switch (level) {
        case 'debug': return '\033[37mDEBUG\033[0m';
        case 'info': return '\033[32m INFO\033[0m';
        case 'warn': return '\033[33m WARN\033[0m';
        case 'error': return '\033[31mERROR\033[0m';
        default: return level.toUpperCase();
      }
    }
  }
  else {
    this.formatLevel = function(level) {
      var label = level.toUpperCase();
      if (label.length == 4) {
        label = ' ' + label;
      }
      return label;
    }
  }
}
util.inherits(SimpleConsoleTransport, winston.Transport);

SimpleConsoleTransport.prototype.log = function (level, msg, meta, callback) {
  var ts = meta.timestamp;
  var stack = meta.error;
  delete meta.timestamp;
  delete meta.error;

  var output = this.formatLevel(level) + ' [' + ts + ']: ' +
               msg + ';  { ' +
               Object.keys(meta).map(function(k) { return k + ': ' + meta[k]; }).join(', ') +
               ' }\n';
  if (stack) {
    output += stack + '\n';
  }

  process.stdout.write(output);
};


function mergeFields(currentFields, additionalFields) {
  var mergedFields = {};
  [currentFields, additionalFields].forEach(function(fields) {
    if (fields) {
      for (var n in fields) {
        mergedFields[n] = fields[n];
      }
    }
  });

  return mergedFields;
}

function writeLog(logger, level, fields, userArgs) {
  var cloneFields = true;
  var message = '';

  userArgs = Array.prototype.slice.call(userArgs);
  if (userArgs.length) {
    var lastArg = userArgs[userArgs.length - 1];
    if (lastArg instanceof Object) {
      fields = mergeFields(fields, lastArg);
      cloneFields = false;

      userArgs.pop();
    }
  }
  if (userArgs.length) {
    var lastArg = userArgs[userArgs.length - 1];
    if (lastArg instanceof Error) {
      message = lastArg.message;
      fields = mergeFields(fields, { error: lastArg.stack });
      cloneFields = false;

      userArgs.pop();
    }
  }
  if (userArgs.length) {
    message = userArgs.length > 1 ? util.format.apply(null, userArgs) : userArgs[0];
  }

  if (cloneFields) {
    // If fields was not cloned already, clone it now, so that setting timestamp
    // on it doesn't pollute the shared set of fields used across all logs.
    fields = mergeFields(fields, {});
  }
  if (!fields.timestamp) {
    fields.timestamp = new Date().toISOString();
  }

  // logger.log.apply(logger, [ level, message, fields ]);
  logger.log(level, message, fields);
}


function Logger(logger, fields) {
  this._logger = logger;
  this._sharedFields = fields;
}
Logger.prototype.child = function(type, fields) {
  fields = mergeFields(this._sharedFields, fields);
  fields.type = type;
  return new Logger(this._logger, fields);
}

// Signature of various logging methods:
// [message, [interpolation args...]], [error], [metadata fields]
Logger.prototype.debug = function() {
  writeLog(this._logger, 'debug', this._sharedFields, arguments);
}
Logger.prototype.info = function() {
  writeLog(this._logger, 'info', this._sharedFields, arguments);
}
Logger.prototype.warn = function() {
  writeLog(this._logger, 'warn', this._sharedFields, arguments);
}
Logger.prototype.error = function() {
  writeLog(this._logger, 'error', this._sharedFields, arguments);
}


exports.createLogger = function(type, fields) {
  var standardFields = { timestamp: '', type: type, host: os.hostname(), pid: process.pid };
  fields = mergeFields(fields, standardFields);

  // TODO: Enable customization of logger

  var transports = [];
  transports.push(new SimpleConsoleTransport());
  transports.push(new winston.transports.File({
    level: 'info',
    filename: '/tmp/cloud.js.log',
    timestamp: false
  }));

  var logger = new winston.Logger({ transports: transports });
  logger.emitErrs = false;

  return new Logger(logger, fields);
}
