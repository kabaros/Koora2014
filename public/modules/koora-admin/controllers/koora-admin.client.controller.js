'use strict';

angular.module('koora-admin').controller('KooraAdminController', ['$scope', 'Authentication', 'MatchSchedule', 'Admin',
	function($scope, Authentication, MatchSchedule, AdminService) {
		$scope.authentication = Authentication;
		$scope.teamsNames = MatchSchedule.teamsNames;
		
		var findByMatchId = function(matches, matchId){
			return _.find(matches, function(match){
				return match.matchId === matchId;
			});
		}

		$scope.saveScore = function(matchScore){
			$scope.savingInProgress = true;
			AdminService.saveScore(matchScore)
				.success(function(res, status){
					console.log(res, status);
					matchScore.disabled = true;
					alert('match score saved successfully');
					$scope.savingInProgress = false;
				})
				.error(function(res, status){
					console.log(res, status);
					alert('saving score failed');
					$scope.savingInProgress = false;
				});
		};

		$scope.updateStandings = function(){
			AdminService.updateStandings()
				.success(function(res, status){
					console.log(res, status);
					alert('standings updated successfully');
				})
				.error(function(res, status){
					console.log(res, status);
					alert('standings update failed');
				});
		};

		AdminService.getMatchScores()
			.success(function(scores){
				var matches = _.sortBy(_.flatten(_.map(MatchSchedule.schedule, function(group){
					return group.matches;
				})), function(match){
					return match.matchId;
				});

				_.each(scores, function(score){
					var match = findByMatchId(matches, score.matchId);
					match.disabled = true;
					match.team1Score = score.team1Score;
					match.team2Score = score.team2Score;
				});

				console.log(matches);

				$scope.matchSchedule = matches;
			});
	}
]);