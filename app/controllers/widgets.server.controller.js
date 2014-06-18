'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	MatchScore = mongoose.model('MatchScore'),
	_ = require('lodash');

var matchesSchedule = _.flatten(_.pluck(require('../models/matches-schedule').schedule, 'matches'));
var teamsNames = require('../models/matches-schedule').teamsNames;
var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
};

exports.listMatchScores = function(req, res){
	MatchScore.find({}).sort({matchId:-1})
		.limit((req.query && req.query.limit) || 5).exec(function(err, doc){
			if(err) {
				console.log('error listing match scores', err);
				res.send(500, {message: 'Something went wrong.'})
			}

			var result = _.map(doc, function(match){
				var  mixin = _.clone(match);
				var matchInfo = findByMatchId(matchesSchedule, match.matchId);
				mixin.team1Score = match.team1Score;
				mixin.team2Score = match.team2Score;
				mixin.team1 = matchInfo.team1;
				mixin.team2 = matchInfo.team2;
				mixin.date = matchInfo.date;
				return mixin;
			});
			res.jsonp(result);
		})
}