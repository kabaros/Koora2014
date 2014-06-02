'use strict';

angular.module('koora').controller('MyPoolsController', ['$scope', '$location', 'Authentication', 'Pool',
	function($scope, $location, Authentication, pool) {
		$scope.authentication = Authentication;
		if(!Authentication.user){
				$location.path('signin');
				return;
			}

		$scope.myPools = Authentication.user.pools;
		if($scope.myPools && $scope.myPools.length>0){
			$scope.selectedPool = $scope.myPools[0];
		}

		$scope.poolToSave;

		$scope.savePool = function(){
			return pool.save($scope.poolToSave)
				.success(function(res){
					$scope.myPools.push(res);
					$scope.savedPool = res;
				}).error(function(data, status){
					console.log("error", data, status);
					alert(data && data.message || "An error occured");
				});
		};
	}
]);