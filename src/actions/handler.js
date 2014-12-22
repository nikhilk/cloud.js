// actions.js
//

var app = require('../app.js'),
    consts = require('../consts.js'),
    loader = require('../core/loader.js');
var metadata = require('./metadata.js');

var _actionSets = null;

function requestHandler(route, path, request, response) {
  var action = null;

  var actionSet = _actionSets[route.params.actionSet];
  if (actionSet) {
    action = actionSet.actions[route.params.action || request.method.toUpperCase()];
  }

  if (!action) {
    response.writeHead(404);
    response.end();
    return;
  }

  if (action.httpMethod != request.method.toUpperCase()) {
    response.writeHead(405);
    response.end();
    return;
  }

  try {
    if (!actionSet.thisObject || (typeof(actionSet.thisObject) != 'object')) {
      actionSet.thisObject = loader.loadObject(actionSet.thisObject);
    }

    if (typeof(action.script) != 'function') {
      action.script = loader.loadFunction(action.script, [ 'request' ]);
    }
  }
  catch (e) {
    response.writeHead(500);
    response.end();
    return;
  }

  var requestObject = {
    url: request.url,
    path: path,
    query: request.query,
    data: request.body,
    method: request.method,
    httpRequest: request,
    httpResponse: response
  };

  var result;
  var error;
  try {
    result = action.script.call(actionSet.thisObject,
                                app.require, console, requestObject);
    if (result === undefined) {
      result = requestObject.result;
    }
  }
  catch (e) {
    error = e;
  }

  if (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end(error.toString());
  }
  else if ((result === undefined) || (result === null)) {
    response.writeHead(204);
  }
  else if (typeof(result) != 'object') {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(result.toString());
  }
  else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(result));
  }
}

requestHandler.route = consts.routes.actions;
requestHandler.initialize = function() {
  _actionSets = metadata.load();
}

module.exports = requestHandler;

