var request = require('request');
var baseUrl = 'https://maps.googleapis.com/maps/api/directions/json?';
var originUrl = 'origin=40.454223999999996,-79.9433595';
var destination = "whole food in pittsburgh pa";
var destinationUrl = '&destination=' + destination;
var transitModeUrl = '&mode=transit';
var APIKeyUrl = '&key=AIzaSyA3mlW7CQCY3d2u_MZBsQfAlt6h-0ryjVI';
var httpUrl = baseUrl + originUrl + destinationUrl + transitModeUrl + APIKeyUrl;
request(httpUrl, function (error, res, body) {
		var obj = JSON.parse(body);
		var busName = obj.routes[0].legs[0].steps[1].transit_details.line.short_name;
		var departureTime = obj.routes[0].legs[0].steps[1].transit_details.departure_time.text;
		var stopName = obj.routes[0].legs[0].steps[1].transit_details.departure_stop.name;
		var currentTime = getDateTime();
		var predictedTime = departureTime.substring(0, departureTime.length - 2);
		var currentHour = currentTime.split(":")[0];
		var currentMinute = currentTime.split(":")[1];
		var predictedHour = predictedTime.split(":")[0];
		var predictedMinute = predictedTime.split(":")[1];

		var timeDifference = (predictedMinute - 0) - (currentMinute - 0);
		if (timeDifference < 0) {
			timeDifference = (timeDifference - 0) + 60;
		}
		var speechText = 'The bus ' + busName + " to " + destination + " will arrive at " + stopName + " in " + timeDifference + " minutes";
		console.log(speechText);
		console.log(busName);
		console.log(departureTime);
		console.log(stopName);
});

function getDateTime() {

	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	return hour + ":" + min;

}
