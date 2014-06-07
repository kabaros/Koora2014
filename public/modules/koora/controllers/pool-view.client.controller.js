'use strict';

angular.module('koora').controller('PoolViewController', ['$scope', 'Authentication', '$stateParams', '$location', 'Pool', 'MatchSchedule',
	function($scope, Authentication, $stateParams, $location, Pool, matchSchedule) {

		var $poolScope = $scope;
		$scope.authentication = Authentication;
		$scope.teamsNames = matchSchedule.teamsNames;
		
		// var loadPool = function(pool, status){
		// 	console.log("succes", pool, status);

		// 	$poolScope.pool = pool;

		// 	var userPools = Authentication.user.pools;
		// 	console.log(Authentication.user);
		// 	$scope.isMemberOfGroup = (userPools !== null && _.find(userPools, function(userPool){
		// 		return userPool.name === pool.name;
		// 	}));
		// };

		// $scope.initPool = function(){
		// 	if(!Authentication.user){
		// 		$scope.notAuthenticated;
		// 		return;
		// 	}

		// 	var poolName = $stateParams.name;

		// 	Pool.get(poolName)
		// 		.success(loadPool)
		// 		.error(function(data, status){
		// 			if(status === 404){
		// 				$scope.groupNotFound = true;
		// 			}
		// 			console.log("error", data, status);
		// 		});
		// }

		// $scope.joinPool = function(){
		// 	$scope.joinError = "";

		// 	Pool.join($scope.pool.name, $scope.joinPassword)
		// 		.success(function(res, status){
		// 			$poolScope.joinPassword = "";
		// 			$poolScope.joinedSuccess = true;

		// 			$poolScope.authentication.user.pools = 
		// 				$poolScope.authentication.user.pools || [];

		// 			$poolScope.authentication.user.pools.push(res);

		// 			console.log("success join pool", res, status);
		// 		})
		// 		.error(function(res, err){
		// 			$poolScope.joinPassword = "";
		// 			$poolScope.joinError = res.message;
		// 			console.log(res);
		// 		});
		// }
		
	}
]);