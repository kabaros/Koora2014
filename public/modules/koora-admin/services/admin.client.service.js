'use strict';

angular.module('koora-admin').factory('Admin', [ '$http',
	function($http) {
		
		return {
			saveScore: function(matchScore) {
				return $http.post('/koora-admin/match-score/', matchScore);
			},

			updateStandings: function() {
				return $http.post('/koora-admin/update-standings/');
			},

			getMatchScores: function(){
				return $http.get('/koora-admin/match-score/');
			},

			getEmails: function(){
				return $http.get('/koora-admin/email-updates/');
			},

			sendEmails: function(){
				return $http.post('/koora-admin/email-updates/send');
			},

			generateEmails: function(emailOptions){
				return $http.post('/koora-admin/email-updates/generate', emailOptions);
			}
		};
	}
]);