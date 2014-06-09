'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ScoreSheet = mongoose.model('Scoresheet'),
    _ = require('lodash');

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
	
	ScoreSheet.findOneAndUpdate({user: req.user._id},
		scoreSheet, {upsert: true}, func);
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