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
	displayName: {
		type: String,
		trim: true
	},
	password: String,
	name: {
		type: String,
		trim: true,
		index: { unique: true }
	},
	defaultPool: {
		type: Boolean,
		default: false
	},
	members: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Pool', PoolSchema);