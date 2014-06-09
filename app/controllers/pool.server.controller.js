'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Pool = mongoose.model('Pool'),
	User = mongoose.model('User'),
    _ = require('lodash');

var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Pool with the same name already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

var genarateRandomString = function(length, chars){
	chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};
/**
 * Create a Pool
 */
exports.create = function(req, res) {
	var pool = new Pool(req.body);

	if(req.user.isPoolAdmin){
		res.send(403, {message: 'You can not be the admin of more than one pool.'});
	} else {
		pool.admin = req.user;
		pool.name = pool.displayName.replace(/[^\w[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]/ig,'-').toLowerCase();

		//.replace(/[^A-Z0-9]/ig,"-").toLowerCase();
		pool.password = genarateRandomString(6);
		pool.members.push(req.user._id);

		pool.save(function(err){
			if (err) {
				console.log('error when saving pool', err, pool);
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				User.update({_id: req.user._id}, {$push: {pools: {
					displayName: pool.displayName,
					name: pool.name,
					password: pool.password,
					isAdmin: true
				}}, isPoolAdmin: true }, function(){
					res.jsonp(pool);
				});
			}
		});
	}	
};

exports.getSingle = function(req, res){
	if(!req.pool)
		return res.send(404, {
				message: 'Item does not exist'
			});

	res.jsonp(req.pool);
};

exports.join = function(req, res){
	console.log('joining group', req.user.pools, req.pool);

	if(!req.pool){
		return res.send(400, {
				message: 'The group and password you provided do not match.'
			});
	}

	var alreadyMember = _.contains(req.user.pools, function(userPool){
		return userPool.name === req.pool.name;
	});

	if(alreadyMember){
		return res.send(400, {
				message: 'You\'re already a member of this group.'
			});
	}
	else {
		Pool.update({name: req.pool.name}, {$push: {
			members: req.user._id
		}}, function(err){
			if (err) {
				console.log('error when joining pool', err, req.body);
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				User.update({_id: req.user._id}, {$push: {pools: {
					displayName: req.pool.displayName,
					name: req.pool.name
				}}}, function(){
					res.jsonp(req.pool);
				});
			}
		});
	}
};
/**
 * Article middleware
 */
exports.poolByID = function(req, res, next, name) {
	Pool.findOne({name: name}, {password: 0, admin: 0, _id: 0, createdOn: 0}).populate('members', 'displayName predictions').exec(function(err, pool) {
		if (err) return next(err);
		req.pool = pool;
		next();
	});
};

exports.poolToJoin = function(req, res, next, name) {
	Pool.findOne({name: name, password: req.body.password}, {password: 0, admin: 0, _id: 0, createdOn: 0}).exec(function(err, pool) {
		if (err) return next(err);
		req.pool = pool;
		next();
	});
};

