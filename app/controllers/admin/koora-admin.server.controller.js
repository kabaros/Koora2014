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


exports.emailsPage = function(req, res){
	EmailUpdate.find({}, function(err, emailUpdates){
		res.render('admin/koora-admin-emails', {
			emails: emailUpdates
		});
	});
}

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
			var matchScore = matchesResults[i];
			var userScore = findByMatchId(userScores, matchScore.matchId);
			
			if(!userScore || _.isUndefined(userScore.team1Score) || _.isUndefined(userScore.team2Score)) {
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
var teamsNames = require("../../models/matches-schedule").teamsNames;

var i = 0;

var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
};

module.exports.sendEmails = function(req, res){
	


	EmailUpdate.find({isSent: false}, function(err, emails){
		_.each(emails, function(email){
			var toEmail;
			console.log("email: " + email.toEmail);
			if (process.env.NODE_ENV !== 'production') { 
				toEmail = 'kabaros+' + email.toEmail.replace(/@.+/, "") + '@gmail.com';
			} else toEmail = email.toEmail;
			
			// if(i==0){
				var sendGridUser = process.env.SENDGRID_USERNAME || "app25678727@heroku.com";
				var sendGridPass = process.env.SENDGRID_PASSWORD || "yopsydme";

				var sendgrid  = require('sendgrid')(sendGridUser, sendGridPass);
				 	sendgrid.send({
				 	  to:       toEmail,
				 	  from:     'me@kabaros.com',
				 	  subject:  'Welcome to Koora 2014',
				 	  html:     email.emailBody,
				 	}, function(err, json) {
				 	  if (err) { console.error(err); }
				 	  console.log(json);
				 });
			// 	 i++;
			// }

			new EmailUpdate(email).remove();
		});

		res.jsonp(200, {emailsSent: true});

		
	});
}

var storeEmail = function(emailOptions){
	
	var deferred = when.defer();

	var user = emailOptions.user,
		standings = emailOptions.standings,
		scoresheet = emailOptions.userScoresheet;


	var matchesInCurrentUpdate = _.pluck(standings.matches, "matchId");

	

	var matchesScores = _.map(matchesInCurrentUpdate, function(matchId){
		return findByMatchId(emailOptions.matchScores, matchId);
	});

	var nextMatch = findByMatchId(matchesSchedule,  _.max(matchesInCurrentUpdate) + 1);
	var nextMatchPrediction = findByMatchId(scoresheet.scores, _.max(matchesInCurrentUpdate) + 1);

	//console.log("===email====", email);
	//console.log("matchesInCurrentUpdate",  matchesInCurrentUpdate)
	//console.log("nextMatch", nextMatch);
	//console.log("nextMatchPrediction", nextMatchPrediction);
	//console.log("matchScores", matchesScores);

	

	var predictionsMessage = [], predictionNotProvided;
	_.each(matchesScores, function(realScore){
		var prediction = findByMatchId(standings.matches, realScore.matchId);

		var match = findByMatchId(matchesSchedule, realScore.matchId);
		
		if(_.isUndefined(prediction.team1Score) || _.isUndefined(prediction.team2Score)){

			predictionsMessage.push("You did not enter a prediction for <strong>"
				+ teamsNames[match.team1] + "</strong> vs <strong>" + teamsNames[match.team2]
				+ "</strong> *");
				predictionNotProvided = true;
		} else { 
			predictionsMessage.push("You predicted: <strong>" 
				+ teamsNames[match.team1] + "</strong> " + prediction.team1Score
				+ " - <strong>" + teamsNames[match.team2] + "</strong> " + prediction.team2Score
				+ " (" + realScore.team1Score + " - " + realScore.team2Score + ")");
		}
	});

	var nextGamePredictionMessage;

	if(!nextMatchPrediction || _.isUndefined(nextMatchPrediction.team1Score) || _.isUndefined(nextMatchPrediction.team2Score)){
		nextGamePredictionMessage = "You have not entered a prediction for the next game. <strong>"
			+ teamsNames[nextMatch.team1] + "</strong> vs <strong>" + teamsNames[nextMatch.team2] + "</strong>"
	} else {
		nextGamePredictionMessage = 
		 "<strong>" + teamsNames[nextMatch.team1] + "</strong> "
		 + nextMatchPrediction.team1Score
		 + " - "
		 +"<strong>" + teamsNames[nextMatch.team2] + "</strong> "
		 + nextMatchPrediction.team2Score;
	}

	var htmlMessage = 'Hello <strong>' + user.displayName + '</strong>,'
	 	  	+ '<br/><br/>'
	 	  	+ 'Great to see you taking part of Koora2014 competition. <br/><br/> '
	 	  	+ 'You will be able to enter scores up to 2 hours before the start of each game '
	 	  	+ 'so there is still time for more people to join us and make a late comeback. '
	 	  	+ 'So help spread the word about Koora!'
	 	  	+ '<br/><br/>'
	 	  	+ '<h2>Your predictions</h2>'
	 	  	+ predictionsMessage.join('<br/>')
	 	  	+ '<br/><br/>'
	 	  	+ '<h2>Your prediction for the next game</h2>'
	 	  	+ nextGamePredictionMessage + "<br><br>"
	 	  	+ '<h2>Current Points: '+ user.points +'</h2> '
	 	  	+ '<a href="http://www.koora2014.com/#!/my-standings"><h4>My Standings</h4></a>' 
	 	  	+ '<a href="http://www.koora2014.com"><h4>Koora 2014</h4></a>' 
	 	  	+ '<a href="https://twitter.com/Koora_WorldCup"><h4>@Koora_WorldCup</h4></a>' 
	 	  	+ (predictionNotProvided? '<br/>* you have missed entering predictions for one game and lost 1 point. Make sure to enter all your predictions and you can change them up to 2 hours from the start of the game.': '')
	 	  	+ '<br/>** Apologies if you received an email with wrong scores yesterday. Don\'t worry, we\'ve got your scores 100% correct on the site!';


	 	 var emailUpdate = new EmailUpdate({
	 	 	user: user._id,
	 	 	matchId: _.max(matchesInCurrentUpdate),
	 	 	toEmail: user.email,
	 	 	emailBody: htmlMessage
	 	 });
	 	 emailUpdate.save(function(err, doc){
	 	 	if(err){
	 	 		console.log("error while saving email", err);
	 	 	}
	 	 	deferred.resolve(doc|| {});
	 	 })
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
				var oldStandings, emailOptions = {};
				return getUserStandings(user._id)
					.then(function(standings){
						oldStandings = standings;
						return getUserScoresheet(user._id);
					})
					.then(function(userScoresheet){
						emailOptions.userScoresheet = userScoresheet;
						return updateStandings(oldStandings || new UserStanding({user: user._id}), userScoresheet, matchScores);
					}).then(function(doc){
						emailOptions.standings = doc;
						emailOptions.matchScores = matchScores;

						if(!doc.points) return;

						return updateUserWithStandingId(user._id, doc.points).then(function(doc){
							emailOptions.user = doc;
							return storeEmail(emailOptions)
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