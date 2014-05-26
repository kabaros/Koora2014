'use strict';

//Setting up route
angular.module('koora').config(['$stateProvider',
	function($stateProvider) {
		// Koora state routing
		$stateProvider.
		state('koora', {
			url: '/koora',
			templateUrl: 'modules/koora/views/index.client.view.html'
		});
	}
])

angular.module('kooraConfiguration', [])
	.constant('HOST', 'sada');