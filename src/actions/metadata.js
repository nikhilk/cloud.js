// metadata.js
//

var fs = require('fs'),
    path = require('path');
var app = require('../app.js'),
    consts = require('../consts.js');

function Action(name, httpMethod, scriptPath) {
  this.name = name;
  this.httpMethod = httpMethod;
  this.scriptPath = scriptPath;
}

function ActionSet(name) {
  this.name = name;
  this.actions = {};
}

function load() {
  var actionSets = {};

  var actionsPath = app.path('code', 'actions');
  if (fs.existsSync(actionsPath) && fs.statSync(actionsPath).isDirectory()) {
    fs.readdirSync(actionsPath).forEach(function(setName) {
      var setPath = path.join(actionsPath, setName);
      if (!fs.statSync(setPath).isDirectory()) {
        return;
      }

      var actionSet = new ActionSet(setName);
      actionSets[setName] = actionSet;

      fs.readdirSync(setPath).forEach(function(scriptName) {
        var scriptPath = path.join(setPath, scriptName);
        if ((path.extname(scriptName) != '.js') ||
            !fs.statSync(scriptPath).isFile()) {
          return;
        }

        if (scriptName == '_shared.js') {
          actionSet.thisObject = scriptPath;
        }
        else {
          scriptName = scriptName.substr(0, scriptName.length - 3);

          var key = null;
          var httpMethod = null;

          var prefixIndex = scriptName.indexOf('.');
          if (prefixIndex < 0) {
            var prefix = scriptName.toUpperCase();
            if (consts.values.supportedHTTPMethods.indexOf(prefix) >= 0) {
              key = httpMethod = prefix;
              scriptName = null;
            }
          }
          else {
            var prefix = scriptName.substr(0, prefixIndex).toUpperCase();
            if (consts.values.supportedHTTPMethods.indexOf(prefix) >= 0) {
              httpMethod = prefix;
              key = scriptName = scriptName.substr(prefixIndex + 1);
            }
          }

          if (!key) {
            httpMethod = 'POST';
            key = scriptName;
          }

          actionSet.actions[key] =
            new Action(scriptName, httpMethod, scriptPath);
        }
      });
    });
  }

  return actionSets;
}

exports.load = load;

