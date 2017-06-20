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
  


exports.getBusInfo = (request, response) => {
	const app = new App({request, response });

	function getMyPlace(app) {
		if(app.isPermissionGranted()) {
			let deviceCoordinates = app.getDeviceLocation().coordinates;
			console.log('User device location:', JSON.stringify(deviceCoordinates));
		}
		else {
			app.ask(app.buildRichResponse().addSimpleResponse("you did not allow me to get your name"));
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
	const actionMap = new Map();
    actionMap.set('get.permission', getPermission);
    actionMap.set('get.my.place', getMyPlace);
    actionMap.set('update.data.outbound', updateDataOutbound);
    actionMap.set('update.data.inbound', updateDataInbound);
    actionMap.set('test', printLoc);
	app.handleRequest(actionMap);	    
};

