'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	ScoreSheet = mongoose.model('Scoresheet'),
    _ = require('lodash');

/**
 * Create a Scoresheet
 */
exports.create = function(req, res) {
	//var scoreSheet = new ScoreSheet(req.body);
	//req.body.user = req.user._id;

	var scoreSheet = _.extend({}, req.body, {user: req.user._id})

	var func = function(err, returnedScoresheet) {
		if (err) {
			console.log('error on saving scoreSheet', err);
			return res.send(400, {
				message: err
			});
		} else {
			res.jsonp(returnedScoresheet);
		}
	};
	
	ScoreSheet.findOneAndUpdate({user: req.user._id},
		scoreSheet, {upsert: true}, func);
};

/**
 * Show the current Scoresheet
 */
exports.getSingle = function(req, res) {
	ScoreSheet.findOne({user: req.user._id}).populate('user', 'displayName').exec(function(err, scoreSheet) {
		if (err) return next(err);
		res.jsonp(scoreSheet);
	});
};