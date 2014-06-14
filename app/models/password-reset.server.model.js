'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * PasswordReset Schema
 */
var PasswordResetSchema = new Schema({
	createdOn: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	email: String,
	isValid: {
		type: Boolean,
		default: true
	}
});

mongoose.model('PasswordReset', PasswordResetSchema);