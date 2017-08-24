'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ticket = mongoose.model('Ticket'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ticket
 */
exports.create = function(req, res) {
  // create a ticket, information comes from AJAX request from Angular
  Ticket.create({
    name: req.body.name,
    location: req.body.location,
    date: new Date(req.body.date),
    price: req.body.price,
    reimbursed: req.body.reimbursed,
    imageUrl: req.body.imageUrl,
    thumbUrl: req.body.thumbUrl
  }, function(err, ticket) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // get and return all the tickets after you create another
    Ticket.find(function(err, tickets) {
      if (err)
        res.send(err);
      res.json(tickets);
      return;
    });
  });
};

/**
 * Show the current Ticket
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ticket = req.ticket ? req.ticket.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ticket.isCurrentUserOwner = req.user && ticket.user && ticket.user._id.toString() === req.user._id.toString();

  res.jsonp(ticket);
};

/**
 * Update a Ticket
 */
exports.update = function(req, res) {
  var ticket = req.ticket;

  ticket = _.extend(ticket, req.body);

  ticket.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ticket);
    }
  });
};

/**
 * Delete an Ticket
 */
exports.delete = function(req, res) {
  Ticket.remove({
    _id: req.params.ticket_id
  }, function(err, ticket) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // get and return all the tickets after you create another
    Ticket.find(function(err, tickets) {
      if (err)
        res.send(err);
      res.json(tickets);

      return;
    });
  });
};


/**
 * List of Tickets
 */
exports.list = function(req, res) {
  Ticket.find(function(err, tickets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({"tickets": tickets, "token": req.user._doc.providerData.accessToken});
    }

    return;
  });
};

/**
 * Ticket middleware
 */
exports.ticketByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ticket is invalid'
    });
  }

  Ticket.findById(id).populate('user', 'displayName').exec(function (err, ticket) {
    if (err) {
      return next(err);
    } else if (!ticket) {
      return res.status(404).send({
        message: 'No Ticket with that identifier has been found'
      });
    }
    req.ticket = ticket;
    next();
  });
};
