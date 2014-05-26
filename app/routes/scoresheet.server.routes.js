'use strict';

var users = require('../../app/controllers/users'),
	scoresheet = require('../../app/controllers/scoresheet');

module.exports = function(app) {
	app.route('/scoresheet')
		.get(scoresheet.list)
		.put(scoresheet.create);
};