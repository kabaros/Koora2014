'use strict';

angular.module('koora-admin').controller('KooraAdminController', ['$scope', 'Authentication', 'MatchSchedule', 'Admin',
	function($scope, Authentication, MatchSchedule, AdminService) {
		$scope.authentication = Authentication;
		$scope.teamsNames = MatchSchedule.teamsNames;
		$scope.matchSchedule = _.sortBy(_.flatten(_.map(MatchSchedule.schedule, function(group){
			return group.matches;
		})), function(match){
			return match.matchId;
		});

		$scope.saveScore = function(matchScore){
			AdminService.saveScore(matchScore)
				.success(function(res, status){
					console.log(res, status);
					alert('match score saved successfully');
				})
				.error(function(res, status){
					console.log(res, status);
					alert('saving score failed');
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
	}
]);