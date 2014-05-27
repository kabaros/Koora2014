'use strict';

angular.module('koora').factory('ScoreSheet', ['$http', function($http){
	return {
		get: function(){
			return $http.get('/ScoreSheet');
		},
		save: function(matchSchedule){
			console.log('SAVED', matchSchedule);
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

			console.log(scoreSheet);

			return $http.put('/ScoreSheet', 
				{
					//_id: matchSchedule._id,
					scores: scoreSheet
				});
		}
	}
}]);