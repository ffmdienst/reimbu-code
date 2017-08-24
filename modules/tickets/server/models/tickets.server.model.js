'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Ticket name',
    trim: true
  },
  location: {
    type: String,
    default: '',
    required: 'Please fill in city name',
    trim: true
  },
  date: {
    type: Date,
    default: '',
    required: 'Please fill in date traveled',
    trim: true
  },
  price: {
    type: Number,
    default: '',
    required: 'Please fill in ticket price',
    trim: true
  },
  reimbursed: {
    type: Number,
    default: '',
    required: 'Please fill in amount reimbursed',
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    required: 'Please fill in URL to file',
    trim: true
  },
  thumbUrl: {
    type: String,
    default: '',
    required: 'Please fill in URL to file',
    trim: true
  }
}, {
  timestamps: true
});

mongoose.model('Ticket', TicketSchema);
