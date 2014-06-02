'use strict';

//Setting up route
angular.module('koora').config(['$stateProvider',
	function($stateProvider) {
		// Koora state routing
		$stateProvider.
		state('my-predictions', {
			url: '/my-predictions',
			templateUrl: 'modules/koora/views/my-predictions.client.view.html'
		}).
		state('my-pools', {
			url: '/my-pools',
			templateUrl: 'modules/koora/views/my-pools.client.view.html'
		}).
		state('view-pool', {
			url: '/my-pools/:name',
			templateUrl: 'modules/koora/views/pools/view-pool.client.view.html'
		});
	}
])

angular.module('kooraConfiguration', []);