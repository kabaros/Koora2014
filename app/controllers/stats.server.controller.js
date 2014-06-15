'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	when = require('when'),
	MatchScore = mongoose.model('MatchScore'),
	User = mongoose.model('User'),
	Scoresheet = mongoose.model('Scoresheet'),
	UserStandings = mongoose.model('UserStanding'),
    _ = require('lodash');

var matchesSchedule = _.flatten(_.pluck(require('../models/matches-schedule').schedule, 'matches'));
var teamsNames = require('../models/matches-schedule').teamsNames;

var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
};

var getUser = function(username){
	var defered = when.defer();
	User.findOne({username: username}, function(err, user){
		if(err) {
				console.log('error getting userStandings', err);
				defered.reject(err);
		} else {
			defered.resolve(user);
		}
	});
	return defered.promise;
};

var getStandings = function(user){
	var defered = when.defer();
	UserStandings.findOne({user: user._id}, function(err, userStandings){
			if(err) {
				console.log('error getting userStandings', err);
				defered.reject(err);
			} else defered.resolve(userStandings);
		});
	return defered.promise;
};

var getActualMatchScores = function(){
	var defered = when.defer();
	MatchScore.find({}, function(err, matchScores){
		if(err){
			console.log('error getting actual match scores', err);
			defered.reject(err);
		} else defered.resolve(matchScores);
	});
	return defered.promise;
};

var getUserScores = function(user, nextMatchesIds){
	var defered = when.defer();

	Scoresheet.findOne({user: user._id}, function(err, scoreSheet){
		if(err){
			console.error("error in getting scoreSheet %s", user.username, err);
			defered.reject(err);
		}

		var scores = _.where(scoreSheet.scores, function(match){
			return _.contains(nextMatchesIds, match.matchId);
		});
		scores = _.sortBy(scores, function(score){
			return new Date(score.date);
		});

		defered.resolve(scores);
	});

	return defered.promise;
}

exports.getByUser = function(req, res) {
	if(req.userStandings)
		res.jsonp(200, req.userStandings);
	else res.send(404);
};

exports.getUserStats = function(req, res, next, user) {
	var actualScores, nextMatches, nextGamesPredictions;

	getActualMatchScores().then(function(scores){
		actualScores = scores;
		var lastMatch = _.max(_.pluck(scores, 'matchId'));
		nextMatches = _.where(matchesSchedule, function(match){
			var timeDiff = (new Date(match.date) - Date.now())/1000/3600;
			return match.matchId > lastMatch && timeDiff < 24;
		});

		return getUser(user);
	}).then(function(user){
		return getUserScores(user, _.pluck(nextMatches, 'matchId'))
			.then(function(scores){
				scores = scores.slice(0, 3);
				nextGamesPredictions = _.map(scores, function(score){
					var matchInfo = findByMatchId(nextMatches, score.matchId);
					return {
						matchId: score.matchId,
						team1: matchInfo.team1,
						team2: matchInfo.team2,
						date: matchInfo.date,
						team1Score: score.team1Score,
						team2Score: score.team2Score
					}
				});

				nextGamesPredictions = _.sortBy(nextGamesPredictions, function(game){
					return game.matchId;
				});
				return user;
			});
	}).then(getStandings)
	.then(function(userStandings){
		var userMatches = _.sortBy(userStandings.matches, function(standing){
			return standing.date;
		}).reverse().slice(0, 12);

		userMatches = _.map(userMatches, function(match){
			var matchSchedule = findByMatchId(matchesSchedule, match.matchId),
				actualMatch = findByMatchId(actualScores, match.matchId);

			var team1 = matchSchedule.team1;
			var team2 = matchSchedule.team2;
			var actualTeam1Score = actualMatch.team1Score,
				actualTeam2Score = actualMatch.team2Score;

			return {
				team1: team1,
				team2: team2,
				points: match.points,
				team1Score: match.team1Score,
				team2Score: match.team2Score,
				actualTeam1Score: actualTeam1Score,
				actualTeam2Score: actualTeam2Score
			};
		});
		req.userStandings = {
			points: userStandings.points,
			lastMatch: userStandings.lastMatchId,
			userMatches: userMatches,
			nextMatches: nextGamesPredictions
		};
		next();
	});
};