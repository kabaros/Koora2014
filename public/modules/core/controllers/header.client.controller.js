'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication', 'Menus',
	function($scope, $location, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.goTo = function(name){
			// console.log($scope.selectedPage);
			if(name === "auth/signout"){
				window.location.href= name;
			} else $location.path(name);
		}

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);