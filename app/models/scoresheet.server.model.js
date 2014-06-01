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
	extraPredictions: {
		qualifiers: [String],
		finalist1: String,
		finalist2: String,
		winner: String
	}
});

mongoose.model('Scoresheet', ScoresheetSchema);