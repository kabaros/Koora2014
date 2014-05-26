'use strict';

angular.module('koora').factory('ScoreSheet', ['$http', function($http){
	return {
		save: function(matchSchedule){
			console.log('SAVED', matchSchedule);
			var scoreSheet = _.map(matchSchedule, function(group){
				 return _.map(group.matches, function(match){
					return {
							matchId: match.matchid, 
							team1Score: match.team1Score,
							team2Score: match.team2Score
						}
				});
			});
			scoreSheet = _.flatten(scoreSheet);
			
			console.log(scoreSheet);

			$http.post('/ScoreSheet', 
				{
					scores: scoreSheet
				});
		}
	}
}]);