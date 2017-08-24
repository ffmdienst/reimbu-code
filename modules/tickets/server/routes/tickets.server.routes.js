'use strict';

/**
 * Module dependencies
 */
var ticketsPolicy = require('../policies/tickets.server.policy'),
  tickets = require('../controllers/tickets.server.controller');

module.exports = function (app) {
  // Tickets collection routes
  app.route('/api/tickets').all(ticketsPolicy.isAllowed)
    .get(tickets.list)
    .post(tickets.create);

  // Single ticket routes
  app.route('/api/tickets/:ticketId').all(ticketsPolicy.isAllowed)
    .get(tickets.read)
    .put(tickets.update)
    .delete(tickets.delete);

  // Finish by binding the ticket middleware
  app.param('ticketId', tickets.ticketByID);
};
