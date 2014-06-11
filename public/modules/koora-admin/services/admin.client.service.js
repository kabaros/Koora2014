'use strict';

angular.module('koora-admin').factory('Admin', [ '$http',
	function($http) {
		
		return {
			saveScore: function(matchScore) {
				return $http.post('/koora-admin/match-score/', matchScore);
			},

			updateStandings: function() {
				return $http.post('/koora-admin/update-standings/');
			}
		};
	}
]);