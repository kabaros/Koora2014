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
	req.body.user = req.user._id;

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
		req.body, {upsert: true}, func);
};

/**
 * Show the current Scoresheet
 */
exports.read = function(req, res) {

};

/**
 * Update a Scoresheet
 */
exports.update = function(req, res) {

};

/**
 * Delete an Scoresheet
 */
exports.delete = function(req, res) {

};

/**
 * List of Scoresheets
 */
exports.list = function(req, res) {

};