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

exports.loadObject = function(path) {
  var globals = {
    require: app.require,
    app: app.api(),
    console: console
  };

  var script = readScript(path);
  if (script) {
    vm.runInNewContext(script, globals, path);
  }
  return globals;
};

exports.loadFunction = function(path, name, args) {
  var allArgs = [ 'require', 'console' ].concat(args).join(',');
  var script = 'function ' + name + '(' + allArgs + ') { ' + readScript(path) + ' }';

  var globals = {};
  vm.runInNewContext(script, globals, path);

  return globals[name];
};

