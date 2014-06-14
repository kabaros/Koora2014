'use strict';

angular.module('koora').factory('ResetPassword', ['$http', function($http){
	return {
		requestResetKey: function(email){
			return $http.post('/password-reset/' + email);
		},
		resetPassword: function(resetDetails){
			return $http.post('/users/password', resetDetails);
		}
	}
}]);