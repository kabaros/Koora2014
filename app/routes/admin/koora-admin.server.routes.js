'use strict';
var users = require('../../../app/controllers/users'),
	kooraAdmin = require('../../../app/controllers/admin/koora-admin');

var connectTimeout = require('connect-timeout');

var longTimeout = connectTimeout({ time: 60000 });


module.exports = function(app) {
	// Root routing
	app.route('/koora-admin').get(
		users.hasAuthorization(['admin']),
		kooraAdmin.index
	);

	app.route('/koora-admin/match-score').post(
		users.hasAuthorization(['admin']),
		kooraAdmin.postMatchScore
	);

	app.route('/koora-admin/update-standings').post(
		[users.hasAuthorization(['admin']), longTimeout],
		kooraAdmin.updateStandings
	);
};