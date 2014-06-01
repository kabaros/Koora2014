'use strict';

angular.module('koora').controller('MyPoolsController', ['$scope', 'Authentication',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		
		$scope.myPools = [];
	}
]);