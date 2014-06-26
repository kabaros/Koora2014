'use strict';

angular.module('koora').controller('MyPredictionsController', ['$scope', '$timeout', '$filter', '$modal',
	'Authentication', 'MatchSchedule', 'ScoreSheet', 
	function ($scope, $timeout, $filter, $modal, Authentication, matchSchedule, scoreSheet) {
		//$scope.global = Global;
		$scope.authentication = Authentication;

	    $scope.teamsNames = matchSchedule.teamsNames;

	    $scope.standings = {};

	    

	    function clearStanding(group){
	    	for(var i=0;i<group.length; i++){
	    		var team = group[i];
	    		team.played = team.won = team.drawn = team.lost = team.gf = team.ga = team.pts = 0;
	    	}
	    }
	    var somethingChanged = false, initializing = true;

	    $scope.$watch('matchSchedule', function(newValue, oldValue){
	    	if(!newValue)
	    		return;
	    	if(newValue != oldValue && !initializing){
	    		console.log('somethingChanged')
	    		somethingChanged = true;
	    	}

	    	// $scope.missingScores = [];
	    	// $scope.qualifiers = {};
	    	// var standings = $scope.standings;
	  
	    	// var standingChanged = false;
	    	// for(var i=0; i<$scope.matchSchedule.length; i++){
	    	// 	var group = $scope.matchSchedule[i];
	    	// 	var currentgroup = standings[group.group];
	    	// 	clearStanding(currentgroup);

	    	// 	group.scoresAdded = 0;

	    	// 	for(var j=0; j<group.matches.length; j++){
	    	// 		var match = group.matches[j],
	    	// 			team1 = match.team1,
	    	// 			team2 = match.team2;

	    	// 			if(!_.isUndefined(match.team1Score) && !_.isUndefined(match.team2Score)){
	    	// 				group.scoresAdded++;
	    	// 				standingChanged = true;
	    	// 				//teamScore = {played: 0, points: team1points}
	    					
			   //  			var team1Standing = _.find(currentgroup, function(item){
				  //   				return item.team === team1;
				  //   			}),
			   //  				team2Standing = _.find(currentgroup, function(item){
					 //    			return item.team === team2;
					 //    		});

			   //  			team1Standing.played = ++team1Standing.played;
			   //  			team2Standing.played = ++team2Standing.played;

			   //  			team1Standing.gf = team1Standing.gf + match.team1Score;
			   //  			team1Standing.ga = team1Standing.ga + match.team2Score;

			   //  			team2Standing.gf = team2Standing.gf + match.team2Score;
			   //  			team2Standing.ga = team2Standing.ga + match.team1Score;

			   //  			if(match.team1Score === match.team2Score){
			   //  				team1Standing.pts++;
			   //  				team2Standing.pts++;
			   //  			}
			   //  			else if(match.team1Score > match.team2Score)
			   //  				team1Standing.pts  += 3;
			   //  			else if (match.team2Score > match.team1Score)
			   //  				team2Standing.pts += 3;
			   //  			// currentgroup[team1] = team1Standing;
			   //  			// currentgroup[team2] = team2Standing;
	    	// 			}
	    	// 	}

	    	// 	if(group.scoresAdded !== 6) {
	    	// 		$scope.missingScores.push("Group " + group.group
	    	// 			+ " is missing " + (6-group.scoresAdded)
	    	// 			+ " scores.");
	    	// 	}

	    	// 	$scope.standings[group.group].sort(function(a, b){
	    	// 		if(a.pts !== b.pts)
	    	// 			return a.pts<b.pts;
	    	// 		else {
	    	// 			var aDiff = a.gf - a.ga,
	    	// 				bDiff = b.gf - b.ga;
	    	// 			if(aDiff !== bDiff)
	    	// 				return aDiff<bDiff;
	    	// 			else {
	    	// 				return a.gf<b.gf;
	    	// 			}
	    	// 		}
	    	// 	});

	    	// 	var firstQualifier = $scope.standings[group.group][0].team,
	    	// 		secondQualifier = $scope.standings[group.group][1].team;

	    	// 	group.qualifiers = [firstQualifier, secondQualifier];

	    	// 	$scope.qualifiers[firstQualifier] = $scope.teamsNames[firstQualifier];
	    	// 	$scope.qualifiers[secondQualifier] = $scope.teamsNames[secondQualifier];
	    	// }
	    }, true);
		
		

		var saveScoresheet = function(){
			return scoreSheet.save($scope.matchSchedule, {
				qualifiers: _.map($scope.qualifiers, function(v, k){return k;}),
				finalist1: $scope.finalist1,
				finalist2: $scope.finalist2,
				winner: $scope.winner
			});
		};

		$scope.$watchCollection('[finalist1, finalist2]',
			function(newValues, oldValues, scope) {
				if(oldValues && newValues && !_.contains(newValues, $scope.winner)){
					$scope.winner = newValues[0] || newValues[1];
				}
			});

		$scope.changeGroup = function(group){
			$scope.selectedGroup = _.find($scope.matchSchedule, function(schedule){
				return schedule.group === group.group;
			});
		};

		//var successSaveModal = $modal.open({title: 'My Title', content: 'My Content', show: false});
		var saveTooltips = angular.element(document.getElementsByClassName("save-success-tooltip"));

		$scope.checkMissingScores = function(){
	    	if( $scope.finalist1 && $scope.finalist2 && $scope.winner){
	    		$scope.savingInProgress = true;
	    		$scope.showMissingScores = false;
	    		$scope.showMissingFinalists = false;
	    		saveScoresheet()
					.success(function(response){
						somethingChanged = false;
						$timeout(function(){
							$scope.savingInProgress = false;
							angular.element(document.getElementsByClassName('save-success-tooltip')).triggerHandler('showTip');
							$timeout(function(){
								angular.element(document.getElementsByClassName('save-success-tooltip')).triggerHandler('hideTip');
							}, 2000);
						}, 500)
					}).error(function(data, status){
						$scope.savingInProgress = false;
						alert("error while saving");
					});
				} else {
					$scope.showMissingScores = true;
				}
			}

	    $scope.allMatchesByDay = {};
	    

	    
        //Close the info again
        // $timeout(function () {
        //     $("#RegisterHelp").trigger('hide');
        // }, 3000);


	    // $scope.selectedDay = 2;

	    $scope.$watch('selectedDay', function(newValue, oldValue){
	    	if(somethingChanged){
	    		$scope.checkMissingScores();
	    	}
	    });

	    matchSchedule.getSchedule().success(function(res){
	    	$scope.matchSchedule = res;
	    	$scope.selectedGroup = $scope.matchSchedule[0];

	    	var matchesByDay = _.groupBy(_.sortBy(_.flatten(_.pluck($scope.matchSchedule, 'matches')), function(match){
	    		return match.date;
	    	}), function(match){
	    		return $filter('date')(match.date, 'shortDate');
	    	});

	    	$scope.daysPagerCount = _.keys(matchesByDay).length;
	    	$scope.dayToDays = {};
	    	var i = 0
	    	_.each(matchesByDay, function(day){
	    		i++;
	    		$scope.allMatchesByDay[i] =day;
	    	});

	    	//current day of tournament
	    	$scope.selectedDay = Math.round((Date.now() - Date.parse("2014-06-12"))/1000/3600/24);

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
		    	
			if(Authentication.user){

				scoreSheet.get().success(function(response){
					if(!response.scores)
						return;

					var savedScores = _.object(_.map(response.scores, function(scoreSheet){
						return [scoreSheet.matchId, {team1Score: scoreSheet.team1Score, team2Score: scoreSheet.team2Score }];
					}));
					_.each($scope.matchSchedule, function(group){
			    		_.each(group.matches, function(match){
			    			match.team1Score = (savedScores[match.matchId]|| {}).team1Score;
			    			match.team2Score = (savedScores[match.matchId]|| {}).team2Score;
			    		});
			    	});

			    	$scope.finalist1 = response.extraPredictions.finalist1;
			    	$scope.finalist2 = response.extraPredictions.finalist2;
			    	$scope.winner = response.extraPredictions.winner;
				}).error(function(data, status){
					alert("Error loading your predictions");
				});	

				initializing = false;
			}
	    });
	}
]);