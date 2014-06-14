'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	PasswordReset = mongoose.model('PasswordReset'),
	User = mongoose.model('User'),
    _ = require('lodash');

var sendEmail = function(user, resetLink, callback){
	var toEmail;
		if (process.env.NODE_ENV !== 'production') { 
			toEmail = 'kabaros+' + user.email.replace(/@.+/, "") + '@gmail.com';
		} else toEmail = user.email.toEmail;
		
		console.log("email to be sent for reset: " + toEmail);

		var sendGridUser = process.env.SENDGRID_USERNAME || "app25678727@heroku.com";
		var sendGridPass = process.env.SENDGRID_PASSWORD || "yopsydme";

		var sendgrid  = require('sendgrid')(sendGridUser, sendGridPass);
		 	sendgrid.send({
		 	  to:       toEmail,
		 	  from:     'me@kabaros.com',
		 	  subject:  'Koora 2014 - Password Reset',
		 	  html:     'Hi ' + user.displayName + ',<br/><br/>'
		 	  	+ 'You have requested to reset your password.<br/><br/>'
		 	  	+ 'Please go to this link and follow the instructions: <br/><br/>'
		 	  	+ '<a href="' + resetLink +'">' + resetLink + ' </a>'
		 	  	+ "<br><br>The link will expire within two hours. <br><br>"
		 	  	+ '<a href="http://www.koora2014.com"><h4>Koora 2014</h4></a>' 
		 	  	+ '<a href="https://twitter.com/Koora_WorldCup"><h4>@Koora_WorldCup</h4></a>' 
		 	  	+ "<small>Reply to this email for any further information or help.</small>"
		 	}, function(err, json) {
		 	  if (err) { console.error(err); }
		 	  callback();
		 });
};

exports.requestResetKey = function(req, res) {
	var user = req.userToReset;
	if(!user) {
		res.jsonp(400, {message: "Email not found."});
	} else {
		var resetKey = "ASDSAD";

		var passwordReset = new PasswordReset({
			user: user._id,
			email: user.email
		});

		passwordReset.save(function(err, doc){
			if(err){
				console.log("Error while creating PasswordReset for user %s. %s", user && user.email, err);
				res.jsonp(400, {success: false, error: 'Error while attempting to reset password'});
			} else {
				var resetLink = req.protocol + "://" + req.host + "/#!/reset-password?resetKey=" + passwordReset._id; 
				sendEmail(user, resetLink, function(){
					res.jsonp({success: true});
				});
			}
		})
		
	}
};

exports.checkEmail = function(req, res, next, email){
	User.findOne({email: email}, function(err, doc){
		if (err) return next(err);
		req.userToReset = doc;
		next();
	})
};