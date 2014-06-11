'use strict';

//Setting up route
angular.module('koora-admin').config(['$stateProvider',
	function($stateProvider) {
		// Koora admin state routing
		$stateProvider.
		state('koora-admin', {
			url: '/koora-admin',
			templateUrl: 'modules/koora-admin/views/koora-admin.client.view.html'
		});
	}
]);