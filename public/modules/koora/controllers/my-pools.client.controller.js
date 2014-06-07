'use strict';

angular.module('koora').controller('MyPoolsController', ['$scope', '$location', 'Authentication', 'Pool',
	function($scope, $location, Authentication, pool) {
		$scope.authentication = Authentication;
		$scope.baseUrl = $location.absUrl();
		// if(!Authentication.user){
		// 		$location.path('signin');
		// 		return;
		// 	}


		if($scope.authentication.user){
			$scope.myPools = Authentication.user.pools || [];

			if($scope.myPools.length>0){
				$scope.selectedPool = $scope.myPools[0];

				$scope.isPoolAdmin = _.find($scope.myPools, function(pool){
					return pool.isAdmin;
				}) !== undefined;
			}
		}
		//$scope.poolToSave;


		$scope.savePool = function(){
			return pool.save($scope.poolToSave)
				.success(function(res){
					$scope.poolToSave.displayName = "";
					$scope.isPoolAdmin = true;
					res.isAdmin = true;
					$scope.myPools.push(res);
					$scope.savedPool = res;
				}).error(function(data, status){
					console.log("error", data, status);
					alert(data && data.message || "An error occured");
				});
		};
	}
]);