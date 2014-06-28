'use strict';

var mongoose = require('mongoose'),
	helpers = require('../helpers'),
	when = require('when'),
	_ = require('lodash'),
	Scoresheet = mongoose.model('Scoresheet'),
	EmailUpdate = mongoose.model('EmailUpdate'),
	User = mongoose.model('User'),
	UserStanding = mongoose.model('UserStanding'),
	MatchScore = mongoose.model('MatchScore');

exports.index = function(req, res) {
	res.render('admin/koora-admin', {
		user: req.user || null
	});
};

exports.postMatchScore = function(req, res){
	var matchScore = new MatchScore(req.body);
	matchScore.save(function(err, matchScore){
		if(err){
			return res.send(400, {
				message: helpers.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(matchScore);
		}
	});
};

exports.getMatchScores = function(req, res){
	var matchScore = new MatchScore(req.body);
	MatchScore.find({}, function(err, matchScores){
		if(err){
			return res.send(400, {
				message: helpers.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(matchScores);
		}
	});
};

var getUsers = function(){
	var deferred = when.defer();

	User.find({}, function(err, users){
		if(err){
			console.log('error when getting users', err);
			return deferred.reject();
		} else return deferred.resolve(users);
	});
	return deferred.promise;
};

var getUserStandings = function(userId){	
	var deferred = when.defer();

	UserStanding.findOne({user: userId}, function(err, standing){
		if(err){
			console.log('error when getting standings', err);
			return deferred.reject();
		}

		else return deferred.resolve(standing);
	});
	return deferred.promise;
};

var getScores = function(){
	var deferred = when.defer();
	MatchScore.find({}, function(err, scores){
		if(err){
			console.log('error retrieving socres', err);
			return deferred.reject();
		}
		else return deferred.resolve(scores);
	});
	return deferred.promise;
};

var getUserScoresheet = function(user){
	var deferred = when.defer();
	Scoresheet.findOne({user: user}, function(err, scoresheet){
		if(err){
			console.log('error retrieving user scoresheet', err);
			return deferred.reject();
		}
		else return deferred.resolve(scoresheet);
	});
	return deferred.promise;
};

var updateSecondRound = function (userStandings, userScore, matchScore){
	var userDraw = userScore.team1Score === userScore.team2Score;
	var userTeam1Win = userScore.team1Score > userScore.team2Score;
	var userTeam2Win = userScore.team2Score > userScore.team1Score;

	var matchScoreDraw = matchScore.team1Score === matchScore.team2Score;
	var matchScoreTeam1Win = matchScore.team1Score > matchScore.team2Score;
	var matchScoreTeam2Win = matchScore.team2Score > matchScore.team1Score;

	var pointsForMatch;

	if(userScore.team1Score === matchScore.team1Score && 
		userScore.team2Score === matchScore.team2Score){
		pointsForMatch = 10;
	}
	else if ((userDraw && matchScoreDraw) || (userTeam1Win && matchScoreTeam1Win) || (userTeam2Win && matchScoreTeam2Win)) {
		pointsForMatch = 5;
	} else {
		var goalDiff = Math.abs(matchScore.team1Score - matchScore.team2Score);
		pointsForMatch = (-2 - goalDiff);
	}

	return pointsForMatch;
};
var updateFirstRound = function(userStandings, userScore, matchScore){
	var userDraw = userScore.team1Score === userScore.team2Score;
	var userTeam1Win = userScore.team1Score > userScore.team2Score;
	var userTeam2Win = userScore.team2Score > userScore.team1Score;

	var matchScoreDraw = matchScore.team1Score === matchScore.team2Score;
	var matchScoreTeam1Win = matchScore.team1Score > matchScore.team2Score;
	var matchScoreTeam2Win = matchScore.team2Score > matchScore.team1Score;

	var pointsForMatch;

	if(userScore.team1Score === matchScore.team1Score && 
		userScore.team2Score === matchScore.team2Score){
		pointsForMatch = 5;
	}
	else if ((userDraw && matchScoreDraw) || (userTeam1Win && matchScoreTeam1Win) || (userTeam2Win && matchScoreTeam2Win)) {
		pointsForMatch = 3;
	} else {
		pointsForMatch = -1;
	}

	return pointsForMatch;
};

var updateStandings = function(userStandings, userScoreSheets, matchScores){
	var deferred = when.defer();
	var findByMatchId = function(matches, matchId){
		return _.find(matches, function(match){
			return match.matchId === matchId;
		});
	};
	//Get matches that didn't participate in previous userStandings
	var matchesResults = _.where(matchScores, function(match){
		return match.matchId > userStandings.lastMatchId; 
	}), matchIds = _.pluck(matchesResults, 'matchId');

	//user scores we care about
	var userScores = _.where((userScoreSheets || {}).scores, function(score){
		return _.contains(matchIds, score.matchId);
	});

	var firstScoreSheetWithPredictions = _.find(_.sortBy(userScoreSheets.scores, function(score){
		return score.matchId;
	}), function(score){
		return !_.isUndefined(score.team1Score) && !_.isUndefined(score.team2Score);
	}),
		firstMatchForUser = (firstScoreSheetWithPredictions|| {}).matchId || _.max(matchIds);

	if(matchIds.length === 0 || (userStandings.lastMatchId >= _.max(matchIds))){
		console.log('nothing to update for user: %s', userStandings.user);
		deferred.resolve({});
	} else {
		for(var i=0; i<matchesResults.length; i++){
			var matchScore = matchesResults[i];
			var userScore = findByMatchId(userScores, matchScore.matchId);

			if(!userScore || _.isUndefined(userScore.team1Score) || _.isUndefined(userScore.team2Score)) {
				var pointsUpdate = {
					matchId:  matchScore.matchId,
					team1Score: (userScore || {}).team1Score,
					team2Score: (userScore || {}).team2Score,
					points: matchScore.matchId > firstMatchForUser ? -1 : 0
				};
				if(matchScore.matchId > firstMatchForUser){
					pointsUpdate.points = matchScore.matchId > 48 ? -2 : -1;
				} else pointsUpdate.points = 0;

				userStandings.matches.push(pointsUpdate);
				userStandings.points += pointsUpdate.points;
			} else {
				var pointsForMatch;
				if(matchScore.matchId > 48){
					pointsForMatch = updateSecondRound(userStandings, userScore, matchScore);
				}
				else {
					pointsForMatch = updateFirstRound(userStandings, userScore, matchScore);
				}

				userStandings.matches.push({
					matchId: userScore.matchId,
					team1Score: userScore.team1Score,
					team2Score: userScore.team2Score,
					points: pointsForMatch
				});
				userStandings.points += pointsForMatch;
			}
		}

		userStandings.lastMatchId = matchIds.length === 0 ? 0 : _.max(matchIds);
		userStandings.save(function(err, doc){
			if(err){
				console.log('error sving standing', err);
				deferred.reject();
			}
			else {
				deferred.resolve(doc);
			}
		});
	}
	return deferred.promise;

};


var updateUserWithStandingId = function(userId, points){
	var deferred = when.defer();

	User.findOneAndUpdate({_id: userId}, {points: points}, function(err, doc){
		if(err) {
			console.log('updating user with standingId', err);
			deferred.reject();
		} else deferred.resolve(doc);
	});
	
	return deferred.promise;
};

var matchesSchedule = _.flatten(_.pluck(require('../../models/matches-schedule').schedule, 'matches'));
var teamsNames = require('../../models/matches-schedule').teamsNames;

var i = 0;

var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
};




exports.updateStandings = function(req, res){
	var matchScores;
	return getScores()
		.then(function(scores){
			matchScores = scores;
			return ;
		})
		.then(getUsers)
		.then(function(users){
			return when.map(users, function(user){
				var oldStandings;
				return getUserStandings(user._id)
					.then(function(standings){
						oldStandings = standings;
						return getUserScoresheet(user._id);
					})
					.then(function(userScoresheet){
						return updateStandings(oldStandings || new UserStanding({user: user._id}), userScoresheet, matchScores);
					}).then(function(doc){
						if(_.isUndefined(doc.points)) return;
						return updateUserWithStandingId(user._id, doc.points);
					});
			}).then(function(){
				console.log('finished updating standings');
				res.jsonp({success: true});
			});
		});
};