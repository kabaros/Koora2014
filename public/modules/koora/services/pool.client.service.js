'use strict';

angular.module('koora').factory('Pool', ['$http', function($http){
	return {
		get: function(name){
			return $http.get('/pool/' + name);
		},
		join: function(name, password){
			console.log("requesting to join", name, password);
			return $http.post('pool/'+name+'/join', {
				password: password
			});
		},
		save: function(pool){
			return $http.post('/Pool', pool);
		}
	}
}]);