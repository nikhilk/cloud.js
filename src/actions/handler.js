// actions.js
//

var stream = require('stream');
var app = require('../app.js'),
    consts = require('../consts.js'),
    loader = require('../core/loader.js');
var metadata = require('./metadata.js');

var _actionSets = null;

function resolveAction(route) {
  var action = null;

  var actionSet = _actionSets[route.params.actionSet];
  if (actionSet) {
    action = actionSet.actions[route.params.action || route.method];
  }

  if (action && (action.httpMethod == route.method)) {
    if (!actionSet.thisObject || (typeof(actionSet.thisObject) != 'object')) {
      actionSet.thisObject = loader.loadObject(actionSet.thisObject);
    }

    if (typeof(action.script) != 'function') {
      action.script = loader.loadFunction(action.script, 'action', [ 'request' ],
                                          actionSet.thisObject);
    }
  }

  return action;
}

function createRequestApi(route, request, response) {
  return {
    _httpRequest: request,
    _httpResponse: response,
    id: request.id,
    url: request.url,
    path: route.path,
    qualifier: route.params.qualifier,
    params: request.query,
    data: request.body,
    log: request.log
  };
}

function requestHandler(route, request, response) {
  var statusCode = 200;
  var result;
  var error;
  try {
    var action = resolveAction(route);
    if (action) {
      var requestApi = createRequestApi(route, request, response);

      result = action.script(app.require, console, requestApi);
      if (result === undefined) {
        result = requestApi.result;
      }
    }
    else {
      statusCode = 404;
    }
  }
  catch (e) {
    error = e;
    statusCode = 500;
  }

  var content = '';
  var contentType = 'text/plain';
  var contentLength = 0;
  var contentStream = false;

  if (statusCode != 200) {
    if (error) {
      content = error.stack;
      if (!content) {
        content = error.toString();
      }
    }
  }
  else if ((result === undefined) || (result === null)) {
    statusCode = 204;
  }
  else if (typeof(result) != 'object') {
    // Handles number, string, function
    content = result.toString();
  }
  else if (result instanceof Buffer) {
    content = result;
    contentType = result.mimeType || 'application/octet-stream';
    contentLength = result.length;
  }
  else if (result instanceof stream.Readable) {
    content = result;
    contentType = result.mimeType || 'application/octet-stream';
    contentStream = true;
  }
  else {
    content = JSON.stringify(result);
    contentType = 'application/json';
  }

  if (content && !contentStream && !contentLength) {
    contentLength = Buffer.byteLength(content);
  }

  if (!contentStream) {
    response.writeHead(statusCode, { 'Content-Type': contentType, 'Content-Length': contentLength });
    if (statusCode != 204) {
      response.write(content);
    }
    response.end();
  }
  else {
    response.writeHead(statusCode, { 'Content-Type': contentType });
    content.pipe(response).on('close', function() {
      response.end();
    });
  }
}

requestHandler.route = consts.routes.actions;
requestHandler.initialize = function() {
  _actionSets = metadata.load();
}

module.exports = requestHandler;

