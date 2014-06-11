'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * MatchScore Schema
 */
var MatchScoreSchema = new Schema({
	matchId: {
		type: Number,
		index: { unique: true }
	},
	team1Score: Number,
	team2Score: Number
});

mongoose.model('MatchScore', MatchScoreSchema);