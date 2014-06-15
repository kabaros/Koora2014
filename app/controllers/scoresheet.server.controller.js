'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ScoreSheet = mongoose.model('Scoresheet'),
    _ = require('lodash');

var getMatchSchedule = function(){
	return 
}

var matchesSchedule = _.flatten(_.pluck(require("../models/matches-schedule").schedule, "matches"));
/**
 * Create a Scoresheet
 */
exports.create = function(req, res) {
	//var scoreSheet = new ScoreSheet(req.body);
	//req.body.user = req.user._id;

	var scoreSheet = _.extend({}, req.body, {user: req.user._id})


	var missingPredictions = _.where(scoreSheet.scores, function(match){
		return _.isUndefined(match.team1Score) || _.isUndefined(match.team2Score);
	}).length;

	console.log("missing predictions: %s", missingPredictions);

	var func = function(err, returnedScoresheet) {
		if (err) {
			console.log('error on saving scoreSheet', err);
			return res.send(400, {
				message: err
			});
		} else {
			User.update({_id: req.user._id}, {
				predictions: req.body.extraPredictions,
				missingPredictions: missingPredictions
			}, function(){
				res.jsonp(returnedScoresheet);
			});
		}
	};
	

	var matchesToIgnore = _.pluck(_.where(scoreSheet.scores, function(score){
		var matchTime = _.find(matchesSchedule, function(match){
			return match.matchId === score.matchId;
		}).date;

		var timeDiff = (new Date(matchTime) - Date.now())/1000/3600;

		return timeDiff < 2;
	}), "matchId");

	console.log("matchesToIgnore", matchesToIgnore);

	ScoreSheet.findOne({user: req.user._id}, function(err, savedScoreSheet){

		var originalScores = _.filter(savedScoreSheet.scores, function(score){
			return _.contains(matchesToIgnore, score.matchId);
		});
		
		
		console.log(originalScores.length);

		var newScores = _.filter(scoreSheet.scores, function(score){
			return !_.contains(matchesToIgnore, score.matchId);
		});

		var scoresToSave = _.union(originalScores, newScores);

		//getting rid of _ids
		scoresToSave = _.map(scoresToSave, function(score){
			return {
				matchId: score.matchId,
				team1Score: score.team1Score,
				team2Score: score.team2Score
			}
		});

		scoreSheet.scores = scoresToSave;

		console.log("****", scoresToSave);
		console.log("***");
		
		ScoreSheet.findOneAndUpdate({user: req.user._id},
			scoreSheet, {upsert: true}, func);
		
	});
};

/**
 * Show the current Scoresheet
 */
exports.getSingle = function(req, res, next) {
	ScoreSheet.findOne({user: req.user._id}).populate('user', 'displayName').exec(function(err, scoreSheet) {
		if (err) return next(err);
		res.jsonp(scoreSheet);
	});
};