'use strict';

var users = require('../../app/controllers/users'),
	stats = require('../../app/controllers/stats');

module.exports = function(app) {
	app.route('/stats/user/:user')
		.get(users.requiresLogin, stats.getByUser);

	app.param('user', stats.getUserStats);
};