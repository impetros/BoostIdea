const routes = require('next-routes')();
routes
  .add('/ideas/new', '/ideas/new')
  .add('/ideas/:address', '/ideas/show');
module.exports = routes;