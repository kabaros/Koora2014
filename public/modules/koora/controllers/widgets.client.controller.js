'use strict';

angular.module('koora').controller('WidgetsController', ['$scope', 'Authentication', 'Widgets',
	function($scope, Authentication, Widgets) {

		

		$scope.authentication = Authentication;

		$scope.loadScores = function(){
			Widgets.getMatchScores()
				.success(function(doc, err){
					console.log(doc)
					$scope.matchesScores = doc;
				})
				.error(function(doc, err){
					$scope.errorMesasage = err;
					console.log('error');
				})
		};
	}]);