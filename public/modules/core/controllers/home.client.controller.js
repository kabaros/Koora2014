'use strict';


angular.module('core').controller('HomeController', ['$scope', '$interval', 'Authentication',
	function($scope, $interval, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		//http://stackoverflow.com/questions/9335140/how-to-countdown-to-a-date
		var worldCupStartDate = new Date('2014-06-12T21:00+0100');

		    var _second = 1000;
		    var _minute = _second * 60;
		    var _hour = _minute * 60;
		    var _day = _hour * 24;
		    var timer;

		    function showRemaining() {
		        var now = new Date();
		        var distance = worldCupStartDate - now;
		        if (distance < 0) {

		            $interval.cancel(timer);
		            $scope.remaingTime = {days: 0, hours: 0, minutes: 0, seconds: 0};

		            return;
		        }
		        var days = Math.floor(distance / _day);
		        var hours = Math.floor((distance % _day) / _hour);
		        var minutes = Math.floor((distance % _hour) / _minute);
		        var seconds = Math.floor((distance % _minute) / _second);
		        $scope.remainingTime = {
		        	days: days,
		        	hours: hours,
		        	minutes: minutes,
		        	seconds: seconds
		        }
		    }
		    
		    timer = $interval(showRemaining, 1000);
	}
]);