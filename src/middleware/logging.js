// logging.js
//

var os = require('os');
var uuid = require('node-uuid');
var app = require('../app.js');

exports.logger = function(req, res, next) {
  var startTime = new Date();
  var requestId = req.headers['x-request-id'];
  if (!requestId) {
    requestId = uuid.v4();
  }

  var log = app.log.child('request', { request: requestId });

  req.id = requestId;
  req.log = log;

  function generateLog() {
    res.removeListener('close', generateLog);
    res.removeListener('finish', generateLog);

    log.info({
      url: req.url,
      method: req.method,
      status: res.statusCode,
      timestamp: startTime.toISOString(),
      duration: new Date() - startTime
    });
  }

  res.setHeader('X-Request-Id', requestId);
  res.on('close', generateLog);
  res.on('finish', generateLog);

  next();
}
