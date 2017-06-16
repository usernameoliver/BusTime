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


var speechText = "Hello, Google";

  

  

	

exports.getBusInfo = (request, response) => {
	const app = new App({request, response });
	// console.log('Request headers: ' + JSON.stringify(request.headers));
	// console.log('Request body: ' + JSON.stringify(request.body));
	function getPermission(app) {
		let namePermission = app.SupportedPermissions.NAME;
		let preciseLocationPermission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION
  		app.askForPermissions('To address you by name and know your location',[namePermission, preciseLocationPermission]);
	}	
	function getLocation(app) {
		getPermission(app);
		if (app.isPermissionGranted()) {
		    let deviceCoordinates = app.getDeviceLocation().coordinates;
		    return deviceCoordinates;
		}
		else {
			return "unknownLocation";
		}
	}



	function updateData(app) {
		var request = require('request');
		request('https://three-doors-123.appspot.com/', function (error, res, body) {
	  		console.log('body:', body); // Print the HTML for the Google homepage.
	  		var data = {
				speech: body
			};
	  		app.ask(app.buildRichResponse().addSimpleResponse(body));
		});
	}


	const actionMap = new Map();
    actionMap.set('get.permission', getPermission);
    actionMap.set('get.location', getLocation);
    actionMap.set('update.data', updateData);
	app.handleRequest(actionMap);	    
};

