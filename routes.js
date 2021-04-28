const routes = require('next-routes')();
routes
  .add('/ideas/new', '/ideas/new')
  .add('/ideas/all', '/ideas/all')
  .add('/ideas/:address', '/ideas/show')
  .add('/ideas/:address/requests', '/ideas/requests/index')
  .add('/ideas/:address/requests/new', '/ideas/requests/new');
module.exports = routes;