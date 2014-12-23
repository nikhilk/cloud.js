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
  var context = {
    require: app.require,
    app: app.api(),
    console: console
  };

  var script = readScript(path);
  if (script) {
    vm.runInNewContext(script, context);
  }
  return context;
};

exports.loadFunction = function(path, args) {
  var allArgs = [ 'require', 'console' ].concat(args).join(',');
  var script = 'function __f(' + allArgs + ') { ' + readScript(path) + ' }';

  var context = {};
  vm.runInNewContext(script, context);

  return context.__f;
};

