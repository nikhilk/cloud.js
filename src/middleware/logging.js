// logging.js
//

var os = require('os');
var bunyan = require('bunyan'),
    uuid = require('node-uuid');
var app = require('../app.js');

var log = bunyan.createLogger({
  name: 'requests',
  hostname: os.hostname(),
  pid: process.pid,
  serializers: {
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
  },
  streams: [
    { stream: process.stdout, level: 'info' }
  ]
});

exports.logger = function(req, res, next) {
  var requestId = req.headers['x-request-id'];
  if (!requestId) {
    requestId = uuid.v4();
  }

  req.id = requestId;
  req.log = log.child({ id: requestId });

  var startTime = new Date();
  function generateLog() {
    res.removeListener('close', generateLog);
    res.removeListener('finish', generateLog);

    res.duration = new Date() - startTime;

    log.info({ id: requestId, req: req, res: res, time: startTime });
  }

  res.setHeader('X-Request-Id', requestId);
  res.on('close', generateLog);
  res.on('finish', generateLog);

  next();
}
