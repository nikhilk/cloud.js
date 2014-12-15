// metadata.js
//

var fs = require('fs'),
    path = require('path');
var app = require('../app.js');

function Action(name, httpMethod, scriptPath) {
  this.name = name;
  this.httpMethod = httpMethod;
  this.scriptPath = scriptPath;
}

function ActionSet(name) {
  this.name = name;
}

function load() {
  var actionSets = {};

  var actionsPath = app.path('code', 'actions');
  if (fs.existsSync(actionsPath) && fs.statSync(actionsPath).isDirectory()) {
    fs.readdirSync(actionsPath).forEach(function(item) {
      var itemPath = path.join(actionsPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        var actionSet = new ActionSet(item);
        actionSets[item] = actionSet;
      }
    });
  }

  return actionSets;
}

exports.load = load;

