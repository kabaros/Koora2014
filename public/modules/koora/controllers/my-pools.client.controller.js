'use strict';

angular.module('koora').controller('MyPoolsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pool',
	function($scope, $stateParams, $location, Authentication, Pool) {

		var $originalScope = $scope;

		$scope.authentication = Authentication;
		$scope.baseUrl = $location.protocol() + "://" +$location.host() + "/#!/my-leagues";
		$scope.returnUrl = $location.url();
		$scope.groupByName = false;
		$scope.groupFound = true;
		$scope.isMemberOfGroup = true;

		if($stateParams.name){
			$scope.groupByName = true;
		}

		$scope.showMemberDetails = function(member){
			
			if(!member.stats){
				Pool.getUserStats(member.username)
				.success(function(doc, status){
					member.stats = doc;
				})
				.error(function(doc, status){
					console.log(doc);
					alert("Error loading member stats");
				});
			}
			member.showMemberDetails=!member.showMemberDetails;
			member.showDetails = true;
		}

		var loadPool = function(pool, status){

			$scope.poolToJoin = pool;
			$scope.groupFound = true;
			$scope.groupNotFoundName = "";

			var userPools = Authentication.user.pools;

			if(userPools!=null) {
				var matchedPool = _.find(userPools, function(userPool){
					return userPool.name === pool.name;
				});

				$originalScope.isMemberOfGroup = !_.isUndefined(matchedPool);
				
				if(matchedPool){
					$originalScope.selectedPool = _.extend(matchedPool, pool);
				}
			} else $originalScope.isMemberOfGroup = false;
		};

		var initPool = function(poolToLoad){
			if(!Authentication.user){
				$scope.notAuthenticated;
				return;
			}

			var poolName = poolToLoad || $stateParams.name;

			Pool.get(poolName)
				.success(loadPool)
				.error(function(data, status){
					if(status === 404){
						$scope.groupFound = false;
						$scope.groupNotFoundName = poolName;
					}
				});
		};



		if($scope.authentication.user){
			$scope.myPools = Authentication.user.pools || [];

			if($stateParams.name){
				initPool();
				$scope.groupByName = true;
			} else {
				$scope.groupNotFoundName = "";

				if($scope.myPools.length>0){
					$scope.selectedPool = _.last($scope.myPools);

					$scope.isPoolAdmin = _.find($scope.myPools, function(pool){
						return pool.isAdmin;
					}) !== undefined;

					initPool($scope.selectedPool.name);
				}

			}
		}
		//$scope.poolToSave;

		$scope.goTo = function(name) {
			$location.path("my-leagues/" +name);
		}

		$scope.savePool = function(){
			return Pool.save($scope.poolToSave)
				.success(function(res){
					$scope.poolToSave.displayName = "";
					$scope.isPoolAdmin = true;
					res.isAdmin = true;
					$scope.myPools.push(res);
					$scope.savedPool = res;
				}).error(function(data, status){
					alert(data && data.message || "An error occured");
				});
		};



		$scope.joinPool = function(){
			$scope.joinError = "";

			Pool.join($scope.poolToJoin.name, $scope.joinPassword)
				.success(function(res, status){
					$originalScope.joinPassword = "";
					$originalScope.joinedSuccess = true;

					$originalScope.authentication.user.pools = 
						$originalScope.authentication.user.pools || [];

					$originalScope.authentication.user.pools.push(res);
				})
				.error(function(res, err){
					$originalScope.joinPassword = "";
					$originalScope.joinError = res.message;
				});
		}
	}
]);