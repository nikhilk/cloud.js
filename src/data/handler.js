// handler.js
//

var stream = require('stream');
var app = require('../app.js'),
    consts = require('../consts.js'),
    loader = require('../core/loader.js');
var metadata = require('./metadata.js');

var _models = null;

function resolveModelOperation(route) {
  var operation = null;

  var model = _models[route.params.model];
  if (model) {
    operation = model.operations[route.params.operation || route.method];
  }

  if (operation && (operation.httpMethod == route.method)) {
    if (!model.thisObject || (typeof(model.thisObject) != 'object')) {
      model.thisObject = loader.loadObject(model.thisObject);
    }

    if (typeof(operation.script) != 'function') {
      action.script = loader.loadFunction(operation.script, 'operation', [ 'request' ],
                                          model.thisObject);
    }
  }

  return action;
}

function requestHandler(route, request, response) {
  response.writeHead(500);
  response.end();
}

requestHandler.route = consts.routes.data;
requestHandler.initialize = function() {
  _models = metadata.load();
}

module.exports = requestHandler;

