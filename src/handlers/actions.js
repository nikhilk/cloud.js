// actions.js
//

var app = require('../app.js'),
    consts = require('../consts.js');

function initialize() {
}

function requestHandler(route, request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(JSON.stringify(route));
  response.write('---');
  response.write(JSON.stringify(request.query));
  response.end();
}

exports.initialize = initialize;
exports.requestHandler = requestHandler;
exports.route = consts.routes.actions;

