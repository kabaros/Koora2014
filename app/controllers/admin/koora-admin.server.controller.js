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
		} else return deferred.resolve(users);
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

	if(matchIds.length === 0 || (userStandings.lastMatchId >= _.max(matchIds))){
		console.log("nothing to update for user: %s, matchIds: %s", userStandings._id, matchIds);
		deferred.resolve({});
	} else {
		for(var i=0; i<matchesResults.length; i++){
			console.log("inside match" + i);
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
			else {
				console.log("doc", doc);
				deferred.resolve(doc);
			}
		});
	}
	return deferred.promise;

}


var updateUserWithStandingId = function(userId, points){
	var deferred = when.defer();

	User.findOneAndUpdate({_id: userId}, {points: points}, function(err, doc){
		if(err) {
			console.log("updating user with standingId", err);
			deferred.reject();
		} else deferred.resolve(doc);
	});
	
	return deferred.promise;
};

var matchesSchedule = _.flatten(_.pluck(require("../../models/matches-schedule").schedule, "matches"));

var i = 0;

var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
}

var sendEmail = function(emailOptions){
	var deferred = when.defer();
	var user = emailOptions.user,
		standings = emailOptions.standings,
		scoresheet = emailOptions.userScoresheet;


	var email;

	if (process.env.NODE_ENV !== 'production') { 
		email = 'kabaros+' + user.email.replace(/@.+/, "") + '@gmail.com';
	} else email = 'kabaros@gmail.com'

	var matchesInCurrentUpdate = _.pluck(standings.matches, "matchId");

	

	var matchesScores = _.map(matchesInCurrentUpdate, function(matchId){
		return findByMatchId(emailOptions.matchScores, matchId);
	});

	var nextMatch = findByMatchId(matchesSchedule,  _.max(matchesInCurrentUpdate) + 1);
	var nextMatchPrediction = findByMatchId(scoresheet.scores, _.max(matchesInCurrentUpdate) + 1);

	console.log("===email====", email);
	console.log("matchesInCurrentUpdate",  matchesInCurrentUpdate)
	console.log("nextMatch", nextMatch);
	console.log("nextMatchPrediction", nextMatchPrediction);
	console.log("matchScores", matchesScores);

	deferred.resolve({});

	if(i==0){
		/* var sendgrid  = require('sendgrid')("app25678727@heroku.com", "yopsydme");
		 	sendgrid.send({
		 	  to:       email,
		 	  from:     'me@kabaros.com',
		 	  subject:  'Welcome to Koora 2014',
		 	  html:     'Hello <strong>' + user.displayName + '</strong>,'
		 	  	+ '<br/><br/>'
		 	  	+ ' <h2 style="text-align: center">Don\'t forget to add your scores before the start of today\'s game: '
		 	  	+ ' <strong>BRAZIL</strong> vs. <strong>CROATIA</strong></h2><br/><br/><br/>'

		 	  	+ 'You are now allowed to update your scores up to two hours before each game (as opposed to adding all the scores before the start of the tournament).<br/><br/>'
		 	  	+ 'You can also update your finalists until the end of the first round of the tournament.<br/><br/>'
			  	
		 	  	+ 'Enjoy the World Cup.'
		 	  	+ '<h3>Current Points: 0</h3> '
		 	}, function(err, json) {
		 	  if (err) { return console.error(err); }
		 	  console.log(json);
		 });*/
		 i++;
	}

	return deferred.promise;
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
				var oldStandings, emailOptions = {user: user};
				return getUserStandings(user._id)
					.then(function(standings){
						oldStandings = standings;
						return getUserScoresheet(user._id);
					})
					.then(function(userScoresheet){
						emailOptions.userScoresheet = userScoresheet;
						if(user.displayName!== "Mozafar")
						 return "K";
						else{
							console.log(" mozafar", user._id, oldStandings);
							return updateStandings(oldStandings || new UserStanding({user: user._id}), userScoresheet, matchScores);
						}
					}).then(function(doc){
						emailOptions.standings = doc;
						emailOptions.matchScores = matchScores;

						if(!doc.points) return;

						return updateUserWithStandingId(user._id, doc.points).then(function(){
							sendEmail(emailOptions);
						});
						
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