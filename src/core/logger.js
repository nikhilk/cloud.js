// logger.js
//

var os = require('os');
var bunyan = require('bunyan');

function Logger(log) {
  this._log = log;
}
Logger.prototype.info = function() {
  return this._log.info.apply(this._log, arguments);
}
Logger.prototype.warn = function() {
  return this._log.warn.apply(this._log, arguments);
}
Logger.prototype.error = function() {
  return this._log.error.apply(this._log, arguments);
}
Logger.prototype.debug = function(msg) {
  return this._log.debug.apply(this._log, arguments);
}


function errorSerializer(err) {
  return {
    message: err.message,
    stack: err.stack
  };
}

exports.createLog = function(name, streams, serializers) {
  if (!streams) {
    streams = [
      { stream: process.stdout, level: 'debug' }
    ];
  }

  serializers = serializers || {};
  serializers.err = errorSerializer;

  var logOptions = {
    name: name,
    hostname: os.hostname(),
    pid: process.pid,
    serializers: serializers,
    streams: streams
  };

  var log = bunyan.createLogger(logOptions);
  return new Logger(log);
}

exports.createChildLog = function(log, data) {
  return log._log.child(data, /* simple */ true);
}

