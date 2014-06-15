'use strict';

var users = require('../../app/controllers/users'),
	pool = require('../../app/controllers/pool');

module.exports = function(app) {
	app.route('/pool')
		.post(users.requiresLogin, pool.create);

	app.route('/pool/:name')
		.get(pool.getSingle);

	app.route('/pool/:poolToJoin/join')
		.post(users.requiresLogin, pool.join);



	app.param('name', pool.poolByID);
	app.param('poolToJoin', pool.poolToJoin);
};