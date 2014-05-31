'use strict';

angular.module('koora').controller('IndexController', ['$scope', 'MatchSchedule', 'ScoreSheet', function ($scope, matchSchedule, scoreSheet) {
		//$scope.global = Global;


	    $scope.matchSchedule = matchSchedule.schedule;
	    $scope.teamsNames = matchSchedule.teamsNames;

	    $scope.standings = {};
	    _.each($scope.matchSchedule, function(group){
	    	$scope.standings[group.group] = [];
	    	_.each(group.matches, function(match){
	    		_.each([match.team1, match.team2], function(team){
	    			if($scope.standings.length === 0 || !_.find($scope.standings[group.group], function(item){
		    			return item.team === team;
		    		})) {
		    			$scope.standings[group.group].push({team: team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0});
		    		}
	    		});
	    	});
	    });

	    function clearStanding(group){
	    	for(var i=0;i<group.length; i++){
	    		var team = group[i];
	    		team.played = team.won = team.drawn = team.lost = team.gf = team.ga = team.pts = 0;
	    	}
	    }

	    $scope.$watch('matchSchedule', function(newValue, oldValue){
	    	//console.log(oldValue, newValue);
	    	var standings = $scope.standings;
	  
	    	var standingChanged = false;
	    	for(var i=0; i<$scope.matchSchedule.length; i++){
	    		var group = $scope.matchSchedule[i];
	    		var currentgroup = standings[group.group];
	    		clearStanding(currentgroup);

	    		for(var j=0; j<group.matches.length; j++){
	    			var match = group.matches[j],
	    				team1 = match.team1,
	    				team2 = match.team2;

	    				if(!_.isUndefined(match.team1Score) && !_.isUndefined(match.team2Score)){
	    					standingChanged = true;
	    					//teamScore = {played: 0, points: team1points}
	    					
			    			var team1Standing = _.find(currentgroup, function(item){
				    				return item.team === team1;
				    			}),
			    				team2Standing = _.find(currentgroup, function(item){
					    			return item.team === team2;
					    		});

			    			team1Standing.played = ++team1Standing.played;
			    			team2Standing.played = ++team2Standing.played;

			    			team1Standing.gf = team1Standing.gf + match.team1Score;
			    			team1Standing.ga = team1Standing.ga + match.team2Score;

			    			team2Standing.gf = team2Standing.gf + match.team2Score;
			    			team2Standing.ga = team2Standing.ga + match.team1Score;

			    			if(match.team1Score === match.team2Score){
			    				team1Standing.pts++;
			    				team2Standing.pts++;
			    			}
			    			else if(match.team1Score > match.team2Score)
			    				team1Standing.pts  += 3;
			    			else if (match.team2Score > match.team1Score)
			    				team2Standing.pts += 3;

			    			// currentgroup[team1] = team1Standing;
			    			// currentgroup[team2] = team2Standing;
	    				}
	    		}

	    		$scope.standings[group.group].sort(function(a, b){
	    			if(a.pts !== b.pts)
	    				return a.pts<b.pts;
	    			else {
	    				var aDiff = a.gf - a.ga,
	    					bDiff = b.gf - b.ga;
	    				if(aDiff !== bDiff)
	    					return aDiff<bDiff;
	    				else {
	    					return a.gf<b.gf;
	    				}
	    			}
	    		});
	    	}
	    	if(standingChanged) console.log('latestStanding', $scope.standings);
	    }, true);
		
		$scope.selectedGroup = $scope.matchSchedule[0];

		$scope.saveScoresheet = function(){
			scoreSheet.save($scope.matchSchedule)
				.success(function(response){
					console.log("saved for real", response);
				}).error(function(data, status){
					console.log(data, status);
				});
		};

		$scope.changeGroup = function(group){
			$scope.selectedGroup = _.find($scope.matchSchedule, function(schedule){
				return schedule.group === group.group;
			});
		};

		scoreSheet.get().success(function(response){
			var savedScores = _.object(_.map(response.scores, function(scoreSheet){
				return [scoreSheet.matchId, {team1Score: scoreSheet.team1Score, team2Score: scoreSheet.team2Score }];
			}));
			console.log('savedscores,', savedScores)
			_.each($scope.matchSchedule, function(group){
	    		_.each(group.matches, function(match){
	    			console.log('savedscore', savedScores[match.matchId]);
	    			match.team1Score = (savedScores[match.matchId]|| {}).team1Score;
	    			match.team2Score = (savedScores[match.matchId]|| {}).team2Score;
	    		});
	    	});
			console.log('returned', response);
		}).error(function(data, status){
			//console.log('error', data, status)
		});
	}
]);