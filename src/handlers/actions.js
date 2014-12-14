// actions.js
//

var fs = require('fs'),
    path = require('path');
var app = require('../app.js'),
    consts = require('../consts.js');

var _actionSets = {};

function ActionSet(name, path, object) {
  this.name = name;
  this.path = path;
  this.object = object;

  this.endpoints = {};
}

function ActionEndpoint(name, method) {
}

function buildActionsModel(actionsPath) {
  fs.readdirSync(actionsPath).forEach(function(item) {
    var itemPath = path.join(actionsPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      var actionSet = new ActionSet(item, itemPath);
      _actionSets[item] = actionSet;
    }
  });
}

function initialize() {
  var actionsPath = app.path('code', 'actions');
  if (fs.existsSync(actionsPath) && fs.statSync(actionsPath).isDirectory()) {
    buildActionsModel(actionsPath);
  }
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

