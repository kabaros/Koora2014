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
	var scoreSheet = new ScoreSheet(req.body);
	scoreSheet.user = req.user._id;

	scoreSheet.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(scoreSheet);
		}
	});
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