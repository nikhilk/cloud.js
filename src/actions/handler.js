// actions.js
//

var stream = require('stream');
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
    _httpRequest: request,
    _httpResponse: response,
    url: request.url,
    path: path,
    id: route.params.id,
    params: request.query,
    data: request.body
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

  var statusCode = 200;
  var content = null;
  var contentType = 'text/plain';
  var contentLength = 0;
  var contentStream = false;

  if (error) {
    statusCode = 500;
    content = error.stack;
    if (!content) {
      content = error.toString();
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

