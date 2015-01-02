// consts.js
//

exports.vars = {
  port: 'CLOUDJS_PORT'
};

exports.defaults = {
  port: 8080
};

exports.values = {
  supportedHTTPMethods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
  supportedDataOperations: {
    'READ': 'GET',
    'INSERT': 'PUT',
    'UPDATE': 'POST',
    'DELETE': 'DELETE'
  }
};

exports.routes = {
  actions: '/actions/:actionSet/:action?/:qualifier?',
  data: '/data/:model/:id?/:operation?'
}

