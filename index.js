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

	function getMyPlace(app) {
		app.askForPermission('To find your location', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
		if(app.isPermissionGranted()) {
			let deviceCoordinates = app.getDeviceLocation().coordinates;
			app.tell(deviceCoordinates);
		}
		else {
			app.tell("how are you");
		}
	}
	//Todo: debug why isPermissionGranted is false after asking for permission. 
	function getPermission(app) {
		app.askForPermission('To find the nearby bus stop around you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
		app.tell(app.isPermissionGranted().toString());
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
	const actionMap = new Map();
    actionMap.set('get.permission', getPermission);
    actionMap.set('get.my.place', getMyPlace);
    actionMap.set('update.data.outbound', updateDataOutbound);
    actionMap.set('update.data.inbound', updateDataInbound);
	app.handleRequest(actionMap);	    
};

