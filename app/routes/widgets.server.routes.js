'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	widgets = require('../../app/controllers/widgets');

module.exports = function(app) {
	// Article Routes
	app.route('/widgets/match-scores')
		.get(widgets.listMatchScores);
};