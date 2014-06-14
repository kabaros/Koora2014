'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * EmailUpdate Schema
 */
var EmailUpdateSchema = new Schema({
	matchId: {
		type: Number
	},
	toEmail: {
		type: String
	},
	emailBody: {
		type: String
	},
	isSent: {
		type: Boolean,
		default: false
	},
	opResponse: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('EmailUpdate', EmailUpdateSchema);