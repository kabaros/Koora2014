'use strict';
var users = require('../../../app/controllers/users'),
	kooraAdmin = require('../../../app/controllers/admin/koora-admin'),
	kooraEmailsAdmin = require('../../../app/controllers/admin/koora-admin-emails');

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

	app.route('/koora-admin/email-updates/send').post(
		users.hasAuthorization(['admin']),
		kooraEmailsAdmin.sendEmails
	);

	app.route('/koora-admin/email-updates').get(
		users.hasAuthorization(['admin']),
		kooraEmailsAdmin.getEmailUpdates
	);

	app.route('/koora-admin/email-updates/generate').post(
		users.hasAuthorization(['admin']),
		kooraEmailsAdmin.generateEmails
	);

	app.route('/koora-admin/update-standings').post(
		[function(req, res, next){
			req.connection.setTimeout(120 * 1000);
			next();
		}, users.hasAuthorization(['admin'])],
		kooraAdmin.updateStandings
	);
};