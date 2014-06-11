'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * PoolRun Schema
 */
var UserStandingSchema = new Schema({
	lastMatchId: {
		type: Number,
		default: 0
	},
	points: {
		type: Number,
		default: 0
	},
	matches: [{
		matchId: Number,
		team1Score: Number,
		team2Score: Number,
		points: Number
	}],
	lastUpdated: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('UserStanding', UserStandingSchema);