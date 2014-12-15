// actions.js
//

var consts = require('../consts.js');
var metadata = require('./metadata.js');

var _actionSets = null;

function requestHandler(route, request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(JSON.stringify(route));
  response.write('---');
  response.write(JSON.stringify(request.query));
  response.end();
}

requestHandler.route = consts.routes.actions;
requestHandler.initialize = function() {
  _actionSets = metadata.load();
}

module.exports = requestHandler;

