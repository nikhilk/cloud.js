// loader.js
//

var fs = require('fs'),
    vm = require('vm');
var app = require('../app.js');

function readScript(path) {
  if (!path) {
    return '';
  }
  return fs.readFileSync(path, 'utf8');
}

function runScript(script) {
  var context = {
    require: app.require,
    app: app.api(),
    console: console
  };

  if (script) {
    vm.runInNewContext(script, context);
  }
  return context;
}

exports.loadObject = function(path) {
  return runScript(readScript(path));
};

exports.loadFunction = function(path, args) {
  var allArgs = [ 'require', 'console' ].concat(args).join(',');
  var script = 'function __f(' + allArgs + ') { ' + readScript(path) + ' }';

  var objects = runScript(script);
  return objects.__f;
};

