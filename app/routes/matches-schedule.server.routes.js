'use strict';

var _ = require("lodash"),
	matchesSchedule = require('../../app/models/matches-schedule').schedule;

module.exports = function(app) {
	app.route('/matches-schedule').get(function(req, res, next){
		var schedule = _.map(matchesSchedule, function(group){
			return {
				group : group.group,
				matches: _.map(group.matches, function(match){
					var timeDiff = 
						(new Date(match.date) - Date.now())/1000/3600;

					if(timeDiff < 2){
						return _.extend(match, {disabled : true});
					} else return match;
				})
			} 
		});

		res.jsonp(schedule);
	});
};