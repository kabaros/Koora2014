'use strict';

var mongoose = require('mongoose'),
	helpers = require('../helpers'),
	when = require('when'),
	_ = require('lodash'),
	Scoresheet = mongoose.model('Scoresheet'),
	User = mongoose.model('User'),
	UserStanding = mongoose.model('UserStanding'),
	MatchScore = mongoose.model('MatchScore');

/**
 * Module dependencies.
 */
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

var getUsers = function(){
	var deferred = when.defer();

	User.find({}, function(err, users){
		if(err){
			console.log("error when getting users", err);
			return deferred.reject();
		} else return deferred.resolve(_.pluck(users, "_id"));
	});
	return deferred.promise;
}
var getUserStandings = function(userId){
	console.log("getting user standing", userId)
	var deferred = when.defer();

	UserStanding.findOne({user: userId}, function(err, standing){
		if(err){
			console.log("error when getting standings", err);
			return deferred.reject();
		}

		else return deferred.resolve(standing);
	})
	return deferred.promise;
};

var getScores = function(){
	var deferred = when.defer();
	MatchScore.find({}, function(err, scores){
		if(err){
			console.log("error retrieving socres", err);
			return deferred.reject();
		}
		else return deferred.resolve(scores);
	});
	return deferred.promise;
};

var getUserScoresheet = function(user){
	console.log("<<<<<getting user scoresheet" + user);
	var deferred = when.defer();
	Scoresheet.findOne({user: user}, function(err, scoresheet){
		if(err){
			console.log("error retrieving user scoresheet", err);
			return deferred.reject();
		}
		else return deferred.resolve(scoresheet);
	});
	return deferred.promise;
};

var updateStandings = function(userStandings, userScoreSheets, matchScores){
	var deferred = when.defer();
	var findByMatchId = function(matches, matchId){
		return _.find(matches, function(match){
			return match.matchId === matchId;
		});
	}
	//Get matches that didn't participate in previous userStandings
	var matchesResults = _.where(matchScores, function(match){
		return match.matchId > userStandings.lastMatchId; 
	}), matchIds = _.pluck(matchesResults, "matchId");

	//user scores we care about
	var userScores = _.where((userScoreSheets || {}).scores, function(score){
		return _.contains(matchIds, score.matchId);
	});

	for(var i=0; i<matchesResults.length; i++){
		console.log("<<<<<<HHH")
		var matchScore = matchesResults[i];
		var userScore = findByMatchId(userScores, matchScore.matchId);
		
		if(!userScore || !userScore.team1Score || !userScore.team2Score) {
			userStandings.matches.push({
				matchId:  matchScore.matchId,
				team1Score: (userScore || {}).team1Score,
				team2Score: (userScore || {}).team2Score,
				points: -1
			});
			userStandings.points = userStandings.points - 1;
		} else {
			var userDraw = userScore.team1Score === userScore.team2Score;
			var userTeam1Win = userScore.team1Score > userScore.team2Score;

			var matchScoreDraw = matchScore.team1Score === matchScore.team2Score;
			var matchScoreTeam1Win = matchScore.team1Score > matchScore.team2Score;

			var pointsForMatch;

			if(userScore.team1Score === matchScore.team1Score
				&& userScore.team2Score === matchScore.team2Score){
				pointsForMatch = 5;
			}
			else if ((userDraw && matchScoreDraw) || (userTeam1Win && matchScoreTeam1Win)) {
				pointsForMatch = 3;
			} else {
				pointsForMatch = -1;
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

	userStandings.lastMatchId = matchIds.length == 0 ? 0 : _.max(matchIds);

	userStandings.save(function(err, doc){
		if(err){
			console.log("error sving standing", err);
			deferred.reject();
		}
		else deferred.resolve(doc);
	});

	return deferred.promise;

}

exports.updateStandings = function(req, res){
	var matchScores, oldStandings;
	return getScores()
		.then(function(scores){
			matchScores = scores;
			return ;
		})
		.then(getUsers)
		.then(function(users){
			console.log("in USERS, " + users.length);
			return when.map(users, function(user){
				return getUserStandings(user)
					.then(function(standings){
						oldStandings = standings;
						return getUserScoresheet(user);
					})
					.then(function(userScoresheet){
						return updateStandings(oldStandings || new UserStanding({user: user}), userScoresheet, matchScores);
					});
			}).then(function(){
				console.log("finished updating standings");
				res.jsonp({success: true});
			});
		});

		


		// .then(function(standings){
		// 	oldStandings = standings;
		// 	return getUserScoresheet(req.user);
		// })
		// .then(function(userScoresheet){
			// var standings;
			// if(!oldStandings) {
			// 	console.log("no old standings");
			// 	standings = new UserStanding({user: req.user});
			// }
			// else {
			// 	console.log("yes old standing")
			// 	standings = new UserStanding(oldStandings);
			// }
			
		// });
};