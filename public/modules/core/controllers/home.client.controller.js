'use strict';


angular.module('core').controller('HomeController', ['$scope', '$interval', 'Authentication',
	function($scope, $interval, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;	
	}
]);