'use strict';

angular.module('koora').factory('ScoreSheet', ['$http', function($http){
	return {
		get: function(){
			return $http.get('/ScoreSheet');
		},
		save: function(matchSchedule, extraPredictions){
			var scoreSheet = _.map(matchSchedule, function(group){
				 return _.map(group.matches, function(match){
					return {
							matchId: match.matchId, 
							team1Score: match.team1Score,
							team2Score: match.team2Score
						}
				});
			});
			scoreSheet = _.flatten(scoreSheet);

			return $http.put('/ScoreSheet', 
				{
					scores: scoreSheet,
					extraPredictions: extraPredictions
				});
		}
	}
}]);