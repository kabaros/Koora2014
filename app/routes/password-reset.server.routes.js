'use strict';

var users = require('../../app/controllers/users'),
	passwordReset = require('../../app/controllers/password-reset');

module.exports = function(app) {
	app.route('/password-reset/:email')
		.post(passwordReset.requestResetKey);

	app.param('email', passwordReset.checkEmail);
};