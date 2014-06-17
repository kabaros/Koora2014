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
		}).state('my-standings', {
			url: '/my-standings',
			templateUrl: 'modules/koora/views/my-pools.client.view.html'
		}).
		state('view-league', {
			url: '/my-leagues/:name',
			templateUrl: 'modules/koora/views/my-pools.client.view.html'
		}).
		state('view-pool', {
			url: '/my-pools/:name',
			templateUrl: 'modules/koora/views/my-pools.client.view.html'
		});
	}
]);

angular.module('koora').config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'mouseenter': 'mouseleave',
        'click': 'click',
        'focus': 'blur',
        'never': 'mouseleave',
        'showTip': 'hideTip'
    });
}]);

angular.module('kooraConfiguration', []);