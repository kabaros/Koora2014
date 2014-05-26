'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Scoresheet Schema
 */
var ScoresheetSchema = new Schema({
	user: {
		type: String
	},
	scores: [{
		matchId: Number,
		team1Score: Number,
		team2Score: Number
	}],
});

mongoose.model('Scoresheet', ScoresheetSchema);