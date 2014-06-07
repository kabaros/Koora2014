'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'MatchSchedule',
	function($scope, $http, $location, Authentication, matchSchedule) {
		$scope.authentication = Authentication;
		$scope.teamsNames = matchSchedule.teamsNames;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$scope.credentials.predictions = {
				finalist1: $scope.finalist1,
				finalist2: $scope.finalist2,
				winner: $scope.winner
			};
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.$watchCollection('[finalist1, finalist2]', 
			function(newValues, oldValues, scope) {
				if(_.contains(newValues, $scope.winner)){
					$scope.winner = newValues[0] || newValues[1];
				}
			});


		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);