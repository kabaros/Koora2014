'use strict';

angular.module('koora-admin').controller('KooraAdminController', ['$scope', '$sce', '$location', 'Authentication', 'MatchSchedule', 'Admin',
	function($scope, $sce, $location, Authentication, MatchSchedule, AdminService) {
		$scope.authentication = Authentication;
		$scope.teamsNames = MatchSchedule.teamsNames;
		
		if(!Authentication.user || !Authentication.user. roles || !_.contains(Authentication.user.roles, 'admin')){
			$location.path('/');
		}

		var findByMatchId = function(matches, matchId){
			return _.find(matches, function(match){
				return match.matchId === matchId;
			});
		};

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

		$scope.renderHtml = function(html_code)
		{
		    return $sce.trustAsHtml(html_code);
		};

		$scope.loadEmails = function(){
			AdminService.getEmails()
				.success(function(res, status){
					$scope.emails = res;
				})
				.error(function(res, status){
					console.log(res, status);
					alert('error loading emails');
				});
		};

		$scope.sendEmails = function(){
			$scope.emailPassword = '';
			$scope.savingInProgress = true;
			AdminService.sendEmails()
				.success(function(res, status){
					$scope.emailSentResponse = res;
					$scope.savingInProgress = false;
				})
				.error(function(res, status){
					console.log(res, status);
					alert('error sending emails');
					$scope.savingInProgress = false;
				});
		};

		$scope.generateEmails = function(){
			AdminService.generateEmails($scope.emailToSend)
				.success(function(res, status){
					$scope.emails = res;
				})
				.error(function(res, status){
					console.log(res, status);
					alert('error generating emails');
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

				$scope.matchSchedule = matches;
			});
	}
]);