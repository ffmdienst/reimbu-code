'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ticket = mongoose.model('Ticket'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ticket;

/**
 * Ticket routes tests
 */
describe('Ticket Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new ticket
    user.save()
      .then(function () {
        ticket = {
          title: 'Ticket Title',
          content: 'Ticket Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an ticket if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Get a list of tickets
            agent.get('/api/tickets')
              .end(function (ticketsGetErr, ticketsGetRes) {
                // Handle ticket save error
                if (ticketsGetErr) {
                  return done(ticketsGetErr);
                }

                // Get tickets list
                var tickets = ticketsGetRes.body;

                // Set assertions
                (tickets[0].user._id).should.equal(userId);
                (tickets[0].title).should.match('Ticket Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an ticket if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Update ticket title
            ticket.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing ticket
            agent.put('/api/tickets/' + ticketSaveRes.body._id)
              .send(ticket)
              .expect(200)
              .end(function (ticketUpdateErr, ticketUpdateRes) {
                // Handle ticket update error
                if (ticketUpdateErr) {
                  return done(ticketUpdateErr);
                }

                // Set assertions
                (ticketUpdateRes.body._id).should.equal(ticketSaveRes.body._id);
                (ticketUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an ticket if no title is provided', function (done) {
    // Invalidate title field
    ticket.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(422)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Set message assertion
            (ticketSaveRes.body.message).should.match('Title cannot be blank');

            // Handle ticket save error
            done(ticketSaveErr);
          });
      });
  });

  it('should be able to delete an ticket if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Delete an existing ticket
            agent.delete('/api/tickets/' + ticketSaveRes.body._id)
              .send(ticket)
              .expect(200)
              .end(function (ticketDeleteErr, ticketDeleteRes) {
                // Handle ticket error error
                if (ticketDeleteErr) {
                  return done(ticketDeleteErr);
                }

                // Set assertions
                (ticketDeleteRes.body._id).should.equal(ticketSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single ticket if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new ticket model instance
    ticket.user = user;
    var ticketObj = new Ticket(ticket);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Get the ticket
            agent.get('/api/tickets/' + ticketSaveRes.body._id)
              .expect(200)
              .end(function (ticketInfoErr, ticketInfoRes) {
                // Handle ticket error
                if (ticketInfoErr) {
                  return done(ticketInfoErr);
                }

                // Set assertions
                (ticketInfoRes.body._id).should.equal(ticketSaveRes.body._id);
                (ticketInfoRes.body.title).should.equal(ticket.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (ticketInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Ticket.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
