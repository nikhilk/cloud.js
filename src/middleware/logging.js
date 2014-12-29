// logging.js
//

var os = require('os');
var uuid = require('node-uuid');
var app = require('../app.js'),
    logger = require('../core/logger.js');

var _serializers = {
  req: function(request) {
    return {
      url: request.url,
      method: request.method
    };
  },
  res: function(response) {
    return {
      status: response.statusCode,
      duration: response.duration
    };
  }
};

var _log = logger.createLog('requests', /* streams */ null, _serializers);

exports.logger = function(req, res, next) {
  var requestId = req.headers['x-request-id'];
  if (!requestId) {
    requestId = uuid.v4();
  }

  req.id = requestId;
  req.log = logger.createChildLog(_log, { id: requestId });

  var startTime = new Date();
  function generateLog() {
    res.removeListener('close', generateLog);
    res.removeListener('finish', generateLog);

    res.duration = new Date() - startTime;

    req.log.info({ req: req, res: res, time: startTime });
  }

  res.setHeader('X-Request-Id', requestId);
  res.on('close', generateLog);
  res.on('finish', generateLog);

  next();
}
