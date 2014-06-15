'use strict';
var users = require('../../../app/controllers/users'),
	kooraAdmin = require('../../../app/controllers/admin/koora-admin');

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

	app.route('/koora-admin/match-score').get(
		users.hasAuthorization(['admin']),
		kooraAdmin.getMatchScores
	);

	app.route('/koora-admin/send-emails').get(
		users.hasAuthorization(['admin']),
		kooraAdmin.sendEmails
	);

	app.route('/koora-admin/update-standings').post(
		[function(req, res, next){
			req.connection.setTimeout(120 * 1000);
			next();
		}, users.hasAuthorization(['admin'])],
		kooraAdmin.updateStandings
	);
};