'use strict';

//Menu service used for managing  menus
angular.module('koora').service('MatchSchedule', [ '$http',
	function($http) {
		this.getSchedule = function() {
			return $http.get('/matches-schedule');
		};
		// Define the menus object
		this.schedule = [
			{
				group: 'A',
				matches: [
					{
						matchId: 1,
						date: '2014-06-12T21:00+0100',
						team1: 'BRA',
						team2: 'CRO'
					},{
						matchId: 2,
						date: '2014-06-13T17:00+0100',
						team1: 'MEX',
						team2: 'CMR'
					}, {
						matchId: 17,
						date: '2014-06-17T20:00+0100',
						team1: 'BRA',
						team2: 'MEX'
					}, {
						matchId: 18,
						date: '2014-06-18T23:00+0100',
						team1: 'CMR',
						team2: 'CRO'
					}, {
						matchId: 33,
						date: '2014-06-23T21:00+0100',
						team1: 'CMR',
						team2: 'BRA'
					}, {
						matchId: 34,
						date: '2014-06-23T21:00+0100',
						team1: 'CRO',
						team2: 'MEX'
					}
				]
			},
			{
				group: 'B',
				matches: [
					{
						matchId: 3,
						date: '2014-06-13T20:00+0100',
						team1: 'ESP',
						team2: 'NED'
					},{
						matchId: 4,
						date: '2014-06-13T23:00+0100',
						team1: 'CHI',
						team2: 'AUS'
					},{
						matchId: 20,
						date: '2014-06-18T17:00+0100',
						team1: 'AUS',
						team2: 'NED'
					},{
						matchId: 19,
						date: '2014-06-18T20:00+0100',
						team1: 'ESP',
						team2: 'CHI'
					},{
						matchId: 35,
						date: '2014-06-23T17:00+0100',
						team1: 'AUS',
						team2: 'ESP'
					},{
						matchId: 36,
						date: '2014-06-23T17:00+0100',
						team1: 'NED',
						team2: 'CHI'
					}
				]
			},
			{
				group: 'C',
				matches: [
					{
						matchId: 5,
						date: '2014-06-14T17:00+0100',
						team1: 'COL',
						team2: 'GRE',
					}, {
						matchId: 6,
						date: '2014-06-15T02:00+0100',
						team1: 'CIV',
						team2: 'JPN',
					}, {
						matchId: 21,
						date: '2014-06-19T17:00+0100',
						team1: 'COL',
						team2: 'CIV',
					}, {
						matchId: 22,
						date: '2014-06-19T23:00+0100',
						team1: 'JPN',
						team2: 'GRE',
					}, {
						matchId: 37,
						date: '2014-06-24T21:00+0100',
						team1: 'JPN',
						team2: 'COL',
					}, {
						matchId: 38,
						date: '2014-06-24T21:00+0100',
						team1: 'GRE',
						team2: 'CIV',
					}
				]
			}, {
				group: 'D',
				matches:[{
						matchId: 7,
						date: '2014-06-14T20:00+0100',
						team1: 'URU',
						team2: 'CRC',
					},{
						matchId: 8,
						date: '2014-06-14T23:00+0100',
						team1: 'ENG',
						team2: 'ITA',
					},{
						matchId: 23,
						date: '2014-06-19T20:00+0100',
						team1: 'URU',
						team2: 'ENG',
					},{
						matchId: 24,
						date: '2014-06-20T17:00+0100',
						team1: 'ITA',
						team2: 'CRC',
					},{
						matchId: 39,
						date: '2014-06-24T17:00+0100',
						team1: 'ITA',
						team2: 'URU',
					},{
						matchId: 40,
						date: '2014-06-24T17:00+0100',
						team1: 'CRC',
						team2: 'ENG',
					}]
			}, {
				group: 'E',
				matches: [{
						matchId: 9,
						date: '2014-06-15T17:00+0100',
						team1: 'SUI',
						team2: 'ECU',
					},{
						matchId: 10,
						date: '2014-06-15T20:00+0100',
						team1: 'FRA',
						team2: 'HON',
					},{
						matchId: 25,
						date: '2014-06-20T20:00+0100',
						team1: 'SUI',
						team2: 'FRA',
					},{
						matchId: 26,
						date: '2014-06-20T23:00+0100',
						team1: 'HON',
						team2: 'ECU',
					},{
						matchId: 41,
						date: '2014-06-25T21:00+0100',
						team1: 'HON',
						team2: 'SUI',
					},{
						matchId: 42,
						date: '2014-06-25T21:00+0100',
						team1: 'ECU',
						team2: 'FRA',
					}
				]
			}, {
				group: 'F',
				matches: [{
						matchId: 11,
						date: '2014-06-15T23:00+0100',
						team1: 'ARG',
						team2: 'BIH',
					},{
						matchId: 12,
						date: '2014-06-16T20:00+0100',
						team1: 'IRN',
						team2: 'NGA',
					},{
						matchId: 27,
						date: '2014-06-21T17:00+0100',
						team1: 'ARG',
						team2: 'IRN',
					},{
						matchId: 28,
						date: '2014-06-21T23:00+0100',
						team1: 'NGA',
						team2: 'BIH',
					},{
						matchId: 43,
						date: '2014-06-25T17:00+0100',
						team1: 'NGA',
						team2: 'ARG',
					},{
						matchId: 44,
						date: '2014-06-25T17:00+0100',
						team1: 'BIH',
						team2: 'IRN',
					}
				]
			}, {
				group: 'G',
				matches: [{
						matchId: 13,
						date: '2014-06-16T17:00+0100',
						team1: 'GER',
						team2: 'POR',
					},{
						matchId: 14,
						date: '2014-06-16T23:00+0100',
						team1: 'GHA',
						team2: 'USA',
					},{
						matchId: 29,
						date: '2014-06-21T20:00+0100',
						team1: 'GER',
						team2: 'GHA',
					},{
						matchId: 30,
						date: '2014-06-22T23:00+0100',
						team1: 'USA',
						team2: 'POR',
					},{
						matchId: 45,
						date: '2014-06-26T17:00+0100',
						team1: 'USA',
						team2: 'GER',
					},{
						matchId: 46,
						date: '2014-06-26T17:00+0100',
						team1: 'POR',
						team2: 'GHA',
					}
				]
			}, {
				group: 'H',
				matches: [{
						matchId: 15,
						date: '2014-06-17T17:00+0100',
						team1: 'BEL',
						team2: 'ALG',
					},{
						matchId: 16,
						date: '2014-06-17T23:00+0100',
						team1: 'RUS',
						team2: 'KOR',
					},{
						matchId: 31,
						date: '2014-06-22T17:00+0100',
						team1: 'BEL',
						team2: 'RUS',
					},{
						matchId: 32,
						date: '2014-06-22T20:00+0100',
						team1: 'KOR',
						team2: 'ALG',
					},{
						matchId: 47,
						date: '2014-06-26T21:00+0100',
						team1: 'KOR',
						team2: 'BEL',
					},{
						matchId: 48,
						date: '2014-06-26T21:00+0100',
						team1: 'ALG',
						team2: 'RUS',
					}
				]
			}, {
				group: 'Round16',
				matches: [
					{
						matchId: 49,
						date: '2014-06-28T17:00+0100',
						team1: 'BRA',
						team2: 'CHI'
					},{
						matchId: 50,
						date: '2014-06-28T21:00+0100',
						team1: 'COL',
						team2: 'URU'
					},{
						matchId: 51,
						date: '2014-06-29T17:00+0100',
						team1: 'NED',
						team2: 'MEX'
					},{
						matchId: 52,
						date: '2014-06-29T21:00+0100',
						team1: 'CRC',
						team2: 'GRE'
					},{
						matchId: 53,
						date: '2014-06-30T17:00+0100',
						team1: 'FRA',
						team2: 'NGA'
					},{
						matchId: 54,
						date: '2014-06-30T21:00+0100',
						team1: 'GER',
						team2: 'ALG'
					},{
						matchId: 55,
						date: '2014-07-01T17:00+0100',
						team1: 'ARG',
						team2: 'SUI'
					},{
						matchId: 56,
						date: '2014-07-01T21:00+0100',
						team1: 'BEL',
						team2: 'USA'
					}
				]
			}
		];

	    this.teamsNames = {
	    	'BRA' : 'Brazil',
	    	'CRO' : 'Croatia',
	    	'MEX' : 'Mexico',
	    	'CMR' : 'Cameroon',

	    	'ESP': 'Spain',
	    	'NED': 'Netherlands',
	    	'CHI': 'Chile',
	    	'AUS': 'Australia',

	    	'COL': 'Colombia',
	    	'GRE': 'Greece',
	    	'CIV': 'Cote d\'ivoire',
	    	'JPN': 'Japan',

	    	'URU': 'Uruguay',
	    	'CRC': 'Costa Rica',
	    	'ENG': 'England',
	    	'ITA': 'Italy',

	    	'SUI': 'Switzerland',
	    	'ECU': 'Ecuador',
	    	'FRA': 'France',
	    	'HON': 'Honduras',

	    	'ARG': 'Argentina',
	    	'BIH': 'Bosnia',
	    	'IRN': 'Iran',
	    	'NGA': 'Nigeria',

	    	'GER': 'Germany',
	    	'POR': 'Portugal',
	    	'GHA': 'Ghana',
	    	'USA': 'USA',

	    	'BEL': 'Belgium',
	    	'ALG': 'Algeria',
	    	'RUS': 'Russia',
	    	'KOR': 'Korea'
	    }
	}
]);