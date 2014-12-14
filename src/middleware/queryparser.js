// queryparser.js
//

var qs = require('querystring'),
    url = require('url');

exports.parser = function(req, res, next) {
  if (!req.query) {
    req.query = ~req.url.indexOf('?') ? qs.parse(url.parse(req.url).query) : {};
  }

  next();
}

