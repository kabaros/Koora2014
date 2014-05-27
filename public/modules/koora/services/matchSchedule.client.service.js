'use strict';

//Menu service used for managing  menus
angular.module('koora').service('MatchSchedule', [
	function() {
		// Define the menus object
		this.schedule = [
	    	{
	    		group: 'A',
	    		matches: [
	    			{
	    				matchId: 1,
	    				date: '2014-06-12T16:00+0100',
	    				team1: 'BRA',
	    				team2: 'CRO'
	    			},{
	    				matchId: 2,
	    				date: '2014-06-13T13:00+0100',
	    				team1: 'MEX',
	    				team2: 'CMR'
	    			}, {
	    				matchId: 22,
	    				team1: 'BRA',
	    				team2: 'MEX'
	    			}
	    		]
	    	},
	    	{
	    		group: 'B',
	    		matches: [
	    			{
	    				matchId: 3,
	    				date: '2014-06-13T16:00+0100',
	    				team1: 'ESP',
	    				team2: 'NED'
	    			},{
	    				matchId: 4,
	    				date: '2014-06-13T18:00+0100',
	    				team1: 'CHI',
	    				team2: 'AUS'
	    			}
	    		]
	    	},
	    	{
	    		group: 'C',
	    		matches: [
	    			{
	    				matchId: 5,
	    				date: '2014-06-14T13:00+0100',
	    				team1: 'COL',
	    				team2: 'GRE',
	    			}, {
	    				matchId: 6,
	    				date: '2014-06-14T22:00+0100',
	    				team1: 'CIV',
	    				team2: 'JAP',
	    			}
	    		]
	    	}, {
	    		group: 'D',
	    		matches:[{
	    				matchId: 7,
	    				date: '2014-06-14T13:00+0100',
	    				team1: 'COL',
	    				team2: 'GRE',
	    			}]
	    	}
	    ];
	}
]);