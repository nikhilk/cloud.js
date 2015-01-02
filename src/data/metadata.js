// metadata.js
//

var fs = require('fs'),
    path = require('path');
var app = require('../app.js'),
    consts = require('../consts.js');

function Operation(name, dataOperation, httpMethod, scriptPath) {
  this.name = name;
  this.dataOperation = dataOperation;
  this.httpMethod = httpMethod;
  this.script = scriptPath;
}

function Model(name) {
  this.name = name;
  this.operations = {};
}

function loadModel(modelName, modelPath) {
  var model = new Model(modelName);

  fs.readdirSync(modelPath).forEach(function(scriptName) {
    var scriptPath = path.join(modelPath, scriptName);
    if ((path.extname(scriptName) != '.js') ||
        !fs.statSync(scriptPath).isFile()) {
      return;
    }

    if (scriptName == '_object.js') {
      model.thisObject = scriptPath;
    }
    else {
      scriptName = scriptName.substr(0, scriptName.length - 3);

      var key = null;
      var httpMethod = null;
      var dataOperation = null;

      var prefixIndex = scriptName.indexOf('.');
      if (prefixIndex < 0) {
        var prefix = scriptName.toUpperCase();
        if (consts.values.supportedDataOperations[prefix] !== undefined) {
          key = dataOperation = prefix;
          httpMethod = consts.values.supportedDataOperations[prefix];
        }
        else {
          key = prefix;
          dataOperation = 'ACTION';
          httpMethod = 'POST';
        }
      }
      else {
        var prefix = scriptName.substr(0, prefixIndex).toUpperCase();
        if (consts.values.supportedDataOperations[prefix] !== undefined) {
          key = scriptName.substr(prefixIndex + 1);
          scriptName = dataOperation = prefix;
          httpMethod = consts.values.supportedDataOperations[prefix];
        }
      }

      if (key) {
        model.operations[key] =
          new Operation(scriptName, dataOperation, httpMethod, scriptPath);
      }
    }
  });

  return model;
}

function load() {
  var models = {};

  var dataPath = app.resolve('code', 'data');
  if (fs.existsSync(dataPath) && fs.statSync(dataPath).isDirectory()) {
    fs.readdirSync(dataPath).forEach(function(modelName) {
      var modelPath = path.join(actionsPath, modelName);
      if (!fs.statSync(modelPath).isDirectory()) {
        return;
      }

      models[modelName] = loadActionSet(modelName, modelPath);
    });
  }

  return models;
}

exports.load = load;

