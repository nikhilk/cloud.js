// consts.js
//

exports.vars = {
  port: 'CLOUDJS_PORT'
};

exports.defaults = {
  port: 8080
};

exports.values = {
  supportedHTTPMethods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ]
};

exports.routes = {
  actions: '/api/:actionSet/:action?/:qualifier?'
}

