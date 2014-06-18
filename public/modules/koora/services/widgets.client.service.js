'use strict';

angular.module('koora').factory('Widgets', ['$http', function($http){
	return {
		getMatchScores: function(){
			return $http.get('/widgets/match-scores?limit=9');
		}
	}
}]);