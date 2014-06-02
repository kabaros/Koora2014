'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pool Schema
 */
var PoolSchema = new Schema({
	createdOn: {
		type: Date,
		default: Date.now
	},
	admin: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	displayName: String,
	password: String,
	name: {
		type: String,
		index: { unique: true }
	},
	members: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Pool', PoolSchema);