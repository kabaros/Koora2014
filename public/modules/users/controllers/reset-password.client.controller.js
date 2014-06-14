'use strict';

angular.module('users').controller('ResetPasswordController', ['$scope', '$http', '$location', '$stateParams', 'Authentication', 'ResetPassword',
	function($scope, $http, $location, $stateParams, Authentication, ResetPassword) {
		$scope.authentication = Authentication;
		console.log($stateParams)
		
		if($stateParams.resetKey){
			$scope.resetPasswordDetails = {
				resetKey: $stateParams.resetKey 
			};
		}
		
		$scope.ajaxInProgress = false;
		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.requestResetKey = function(){
			$scope.ajaxInProgress = true;
			ResetPassword.requestResetKey($scope.resetPasswordDetails.email)
				.success(function(data, status){
					if(data && data.success)
						$scope.keyRequestSuccess = true;
					$scope.resetPasswordDetails.email = '';
					$scope.error = false;
					$scope.ajaxInProgress = false;
				})
				.error(function(data, status){
					$scope.error = data && data.message;
					$scope.resetPasswordDetails.email = '';
					$scope.keyRequestSuccess = false;
					$scope.ajaxInProgress = false;
				});
		};
		
		$scope.resetPassword = function(){
			ResetPassword.resetPassword($scope.resetPasswordDetails)
				.success(function(data, status){
					if(data && data.message){
						window.location = "/";
						//$scope.changePasswordSuccess = true;
					}
					$scope.error = false;
					$scope.ajaxInProgress = false;
				})
				.error(function(data, status){
					$scope.error = data && data.message;
					$scope.keyRequestSuccess = false;
					$scope.ajaxInProgress = false;
				});
		}
	}
]);