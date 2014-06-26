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


var matchesSchedule = _.flatten(_.pluck(require('../../models/matches-schedule').schedule, 'matches'));
var teamsNames = require('../../models/matches-schedule').teamsNames;

var findByMatchId = function(matches, matchId){
	return _.find(matches, function(match){
		return match.matchId === matchId;
	});
};


var storeEmail = function(emailOptions){
	
	var deferred = when.defer();

	var user = emailOptions.user,
		standings = emailOptions.standings,
		scoresheet = emailOptions.userScoresheet;


	var matchesInCurrentUpdate = _.pluck(standings.matches, 'matchId');

	

	var matchesScores = _.map(matchesInCurrentUpdate, function(matchId){
		return findByMatchId(emailOptions.matchScores, matchId);
	});

	

	var predictionsMessage = [], predictionNotProvided;
	_.each(matchesScores, function(realScore){
		var prediction = findByMatchId(standings.matches, realScore.matchId);

		var match = findByMatchId(matchesSchedule, realScore.matchId);
		
		if(_.isUndefined(prediction.team1Score) || _.isUndefined(prediction.team2Score)){

			predictionsMessage.push('You did not enter a prediction for <strong>'+
			 teamsNames[match.team1] + '</strong> vs <strong>' + teamsNames[match.team2] +
			  '</strong>.  -1 points');
				predictionNotProvided = true;
		} else { 
			predictionsMessage.push('<strong>' + 
				teamsNames[match.team1] + '</strong> ' + prediction.team1Score +
				' - <strong>' + teamsNames[match.team2] + '</strong> ' + prediction.team2Score +
				' (' + realScore.team1Score + ' - ' + realScore.team2Score + ')' +
				'. Points: ' + prediction.points);
		}
	});

	predictionsMessage = predictionsMessage.reverse().slice(0, 5);

	var nextMatchPredictionsMessages = [];

	_.times(5, function(n){
		var nextMatchPrediction = findByMatchId(scoresheet.scores, (_.max(matchesInCurrentUpdate) + n + 1));
		var nextMatch = findByMatchId(matchesSchedule,  _.max(matchesInCurrentUpdate) + n + 1);

		if(nextMatchPrediction){

			if(_.isUndefined(nextMatchPrediction.team1Score) || _.isUndefined(nextMatchPrediction.team2Score)){
				nextMatchPredictionsMessages.push('You have not entered a prediction for <strong>' +
					teamsNames[nextMatch.team1] + '</strong> vs <strong>' + teamsNames[nextMatch.team2] + '</strong>');
			} else {
				nextMatchPredictionsMessages.push(
				 '<strong>' + teamsNames[nextMatch.team1] + '</strong> ' +
				 nextMatchPrediction.team1Score + 
				 ' - ' +'<strong>' + teamsNames[nextMatch.team2] + '</strong> ' +
				 nextMatchPrediction.team2Score);
			}	
		}
	});
	

	var htmlMessage = 'Hello ' + user.displayName + ',' +
		 '<br/><br/>' +
		 emailOptions.bodyCustomMessage +
		  '<br/><br/>' +
		  '<h2>Your last predictions</h2>' +
		  predictionsMessage.join('<br/>') + 
		  '<br/><br/>' +
		  '<h2>Your predictions for the next games</h2>' +
		  nextMatchPredictionsMessages.join('<br>') + 
		  '<br><br><b>You can change your predictions up to two hours from the start of the game.</b><br><br>' +
		  '<h2>Current Points: '+ user.points +'</h2> ' +
		  '<a href="http://www.koora2014.com/#!/my-standings"><h4>My Standings</h4></a>'  +
		  '<a href="http://www.koora2014.com"><h4>Koora 2014</h4></a>'  +
		  '<a href="https://twitter.com/Koora_WorldCup"><h4>@Koora_WorldCup</h4></a>' ;


	 	 var emailUpdate = new EmailUpdate({
	 	 	user: user._id,
	 	 	matchId: _.max(matchesInCurrentUpdate),
	 	 	toEmail: user.email,
	 	 	subject: emailOptions.subject,
	 	 	emailBody: htmlMessage
	 	 });
	 	 emailUpdate.save(function(err, doc){
	 	 	if(err){
	 	 		console.log('error while saving email', err);
	 	 	}
	 	 	deferred.resolve(doc|| {});
	 	 });
	return deferred.promise;
};

module.exports.getEmailUpdates = function(req, res){
	EmailUpdate.find({}, function(err, emails){
		res.jsonp(emails);
	});
};

var getAll = function(modelName, query){
	var deferred = when.defer();
	modelName.find({} || query).populate('user').exec(function(err, res){
		if(err){
			console.log('error getting %s', modelName && modelName.toString(), err);
			deferred.reject(err);
		}
		deferred.resolve(res);
	});
	return deferred.promise;
};

var getOne = function(modelName, query){
	var deferred = when.defer();
	modelName.findOne(query).populate('user').exec(function(err, res){
		if(err){
			console.log('error getting %s', modelName && modelName.toString(), err);
			deferred.reject(err);
		}
		deferred.resolve(res);
	});
	return deferred.promise;
};

var purgeEmailUpdates = function(){
	var deferred = when.defer();
	EmailUpdate.remove({}, function(err, doc){
		if(err){
			console.log('error purging emails', doc);
			deferred.reject(err);
		} else deferred.resolve();
	});
	return deferred.promise;
};

module.exports.generateEmails = function(req, res){
	console.log('generating emails');
	return purgeEmailUpdates().then(function(){
		return getAll(UserStanding);
	}).then(function(allUsersStandings){
		return getAll(MatchScore).then(function(matchScores){
			return when.map(allUsersStandings, function(userStandings){
				if(!userStandings.user)
					return;
				return getOne(Scoresheet, {user: userStandings.user._id}).then(function(userScoresheet){
					var emailOptions = {
						standings: userStandings,
						user: userStandings.user,
						matchScores: matchScores,
						userScoresheet: userScoresheet
					};

					emailOptions = _.extend(emailOptions, req.body);
					
					return storeEmail(emailOptions);
				});
				
			}).then(function(allEmails){
				res.jsonp(_.compact(allEmails));
			});
		});
	});
};

var sendGridUser = process.env.SENDGRID_USERNAME || 'app25678727@heroku.com';
var sendGridPass = process.env.SENDGRID_PASSWORD || 'yopsydme';

var sendgrid  = require('sendgrid')(sendGridUser, sendGridPass);


module.exports.sendEmails = function(req, res){
	console.log('sending emails');
	var emailsSent = 0, emailsWithErrors = 0, emailsSentAndDbUpdated = 0;
	EmailUpdate.find({isSent: false}, function(err, emails){
		return when.map(_.map(emails, function(email){
			var deferred = when.defer();
			var toEmail;
			
			if (process.env.NODE_ENV !== 'production') { 
				toEmail = 'kabaros+' + email.toEmail.replace(/@.+/, '') + '@gmail.com';
			} else toEmail = email.toEmail;
			
			console.log('sending email to ' + toEmail);
				
		 	sendgrid.send({
			 	  to:       toEmail,
			 	  from:     'me@kabaros.com',
			 	  subject:  email.subject,
			 	  html:     email.emailBody,
			 	}, function(err, json) {
			 	  if (err) {
			 	   	console.error(err);
			 	   	emailsWithErrors++;
			 	   }
			 	   console.log(json);
			 	   emailsSent++;
			 	   EmailUpdate.findByIdAndUpdate(email._id, {
			 	   	isSent: true,
			 	   	opResponse: json
			 	   }, function(){
			 	   	emailsSentAndDbUpdated++;
			 	   	deferred.resolve(email);
			 	   });
			 });
			return deferred.promise;
			
		})).then(function(emails){
			res.jsonp(200, {
				emailsSent: emailsSent,
				emailsWithErrors: emailsWithErrors,
				emailsSentAndDbUpdated: emailsSentAndDbUpdated
			});		
		});
	});
};

