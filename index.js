/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
'use strict';
process.env.DEBUG = 'actions-on-google:*';
const http = require('http');
var options = {
	host: 'realtime.portauthority.org',
    path: '/bustime/api/v3/getpredictions?key=ZvG9KVepvvzYaDkbAUuP3vyjF&stpid=8199&rtpidatafeed=Port%20Authority%20Bus&format=json'
};

const App = require('actions-on-google').ApiAiApp;
const 	Q = require("q");

var speechText = "Hello, Google";
var myLatitude = 0;
var myLongtitude = 0;


exports.getBusInfo = (request, response) => {
	const app = new App({request, response });

	function getMyPlace(app) {
		if(app.isPermissionGranted()) {
			let deviceCoordinates = app.getDeviceLocation().coordinates;
			const deviceLatitude = deviceCoordinates.latitude;
        	const deviceLongitude = deviceCoordinates.longitude;
			console.log('User device location:');
			console.log(deviceCoordinates.latitude);
			console.log(deviceCoordinates.longitude);
			myLatitude = deviceCoordinates.latitude;
			myLongtitude = deviceCoordinates.longitude;
			app.ask(app.buildRichResponse().addSimpleResponse("What is your destination?"));
			return deviceCoordinates;
		}
		else {
			app.ask(app.buildRichResponse().addSimpleResponse("you did not allow me to get your place"));
			return null;
		}
	}
	//Todo: find out how to reply "YES" to permission request
	function getPermission(app) {
		let permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
		app.data.permission = permission;
		app.askForPermission('To find the bus stop nearby', permission);
		console.log(app.isPermissionGranted());
		
	}

	function updateDataOutbound(app) {
		var request = require('request');
		request('https://three-doors-123.appspot.com/outbound', function (error, res, body) {
	  		app.ask(app.buildRichResponse().addSimpleResponse(body));
		});
	}

	function updateDataInbound(app) {
		var request = require('request');
		request('https://three-doors-123.appspot.com/inbound', function (error, res, body) {
	  		app.ask(app.buildRichResponse().addSimpleResponse(body));
		});
	}
	function printLoc(app) {
		if (app.isPermissionGranted())	app.tell(app.getDeviceLocation().coordinates.toString());
		else app.tell("permission not granted");
	}
	function feedbackBus(app) {
		var request = require('request');
		var baseUrl = 'https://maps.googleapis.com/maps/api/directions/json?';
		var originUrl = 'origin=' + myLatitude + ',' + myLongtitude;
		var destination = app.getRawInput();
		console.log(destination);
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
	  		
	  		var sentence = 'The bus ' + busName + " to " + destination + " will arrive at " + stopName + " in " + timeDifference + " minutes";
	  		console.log(sentence);
	  		app.tell(sentence);
		});
	}

	function getDateTime() {

		var date = new Date();
		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;
		var min  = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;
		return hour + ":" + min;

	}
	const actionMap = new Map();
    actionMap.set('get.permission', getPermission);
    actionMap.set('get.my.place', getMyPlace);
    actionMap.set('update.data.outbound', updateDataOutbound);
    actionMap.set('update.data.inbound', updateDataInbound);
    actionMap.set('bus.feedback', feedbackBus);
    actionMap.set('test', printLoc);
	app.handleRequest(actionMap);	    
};

