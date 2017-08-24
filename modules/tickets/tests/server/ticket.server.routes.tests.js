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
describe('Ticket CRUD tests', function () {

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

  it('should not be able to save an ticket if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tickets')
          .send(ticket)
          .expect(403)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Call the assertion callback
            done(ticketSaveErr);
          });

      });
  });

  it('should not be able to save an ticket if not logged in', function (done) {
    agent.post('/api/tickets')
      .send(ticket)
      .expect(403)
      .end(function (ticketSaveErr, ticketSaveRes) {
        // Call the assertion callback
        done(ticketSaveErr);
      });
  });

  it('should not be able to update an ticket if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tickets')
          .send(ticket)
          .expect(403)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Call the assertion callback
            done(ticketSaveErr);
          });
      });
  });

  it('should be able to get a list of tickets if not signed in', function (done) {
    // Create new ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the ticket
    ticketObj.save(function () {
      // Request tickets
      request(app).get('/api/tickets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single ticket if not signed in', function (done) {
    // Create new ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the ticket
    ticketObj.save(function () {
      request(app).get('/api/tickets/' + ticketObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ticket.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single ticket with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tickets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ticket is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single ticket which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent ticket
    request(app).get('/api/tickets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No ticket with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an ticket if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tickets')
          .send(ticket)
          .expect(403)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Call the assertion callback
            done(ticketSaveErr);
          });
      });
  });

  it('should not be able to delete an ticket if not signed in', function (done) {
    // Set ticket user
    ticket.user = user;

    // Create new ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the ticket
    ticketObj.save(function () {
      // Try deleting ticket
      request(app).delete('/api/tickets/' + ticketObj._id)
        .expect(403)
        .end(function (ticketDeleteErr, ticketDeleteRes) {
          // Set message assertion
          (ticketDeleteRes.body.message).should.match('User is not authorized');

          // Handle ticket error error
          done(ticketDeleteErr);
        });

    });
  });

  it('should be able to get a single ticket that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new ticket
          agent.post('/api/tickets')
            .send(ticket)
            .expect(200)
            .end(function (ticketSaveErr, ticketSaveRes) {
              // Handle ticket save error
              if (ticketSaveErr) {
                return done(ticketSaveErr);
              }

              // Set assertions on new ticket
              (ticketSaveRes.body.title).should.equal(ticket.title);
              should.exist(ticketSaveRes.body.user);
              should.equal(ticketSaveRes.body.user._id, orphanId);

              // force the ticket to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(ticketInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single ticket if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the ticket
    ticketObj.save(function (err) {
      if (err) {
        return done(err);
      }
      request(app).get('/api/tickets/' + ticketObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ticket.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single ticket, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'ticketowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Ticket
    var _ticketOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _ticketOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Ticket
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new ticket
          agent.post('/api/tickets')
            .send(ticket)
            .expect(200)
            .end(function (ticketSaveErr, ticketSaveRes) {
              // Handle ticket save error
              if (ticketSaveErr) {
                return done(ticketSaveErr);
              }

              // Set assertions on new ticket
              (ticketSaveRes.body.title).should.equal(ticket.title);
              should.exist(ticketSaveRes.body.user);
              should.equal(ticketSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (ticketInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
