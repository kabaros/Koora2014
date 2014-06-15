'use strict';

angular.module('koora').factory('Pool', ['$http', function($http){
	return {
		get: function(name){
			return $http.get('/pool/' + name);
		},
		join: function(name, password){
			return $http.post('pool/'+name+'/join', {
				password: password
			});
		},
		getUserStats: function(user){
			return $http.get('/stats/user/'+user);
		},
		save: function(pool){
			return $http.post('/Pool', pool);
		}
	}
}]);