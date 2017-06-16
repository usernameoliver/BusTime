/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */

const http = require('http');
const options = {
	host: 'realtime.portauthority.org',
    path: '/bustime/api/v3/getpredictions?key=ZvG9KVepvvzYaDkbAUuP3vyjF&stpid=8199&rtpidatafeed=Port%20Authority%20Bus&format=json'
}
const App = require('actions-on-google').ApiAiApp;
process.env.DEBUG = 'actions-on-google:*';

var speechText = "Hello, Google";
var data = {
	speech: speechText,
};	
function getDateTime() {

	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	return hour + ":" + min;

}

function updateData(request, response) {

	var requestTimeAndRoute = http.request(options, (res) => {
		var rawData = '';

		res.on('data', (chunk) => {
				rawData += chunk;
				});
		res.on('end', () => {
				try {
				const parsedData = JSON.parse(rawData);
				var route = parsedData['bustime-response']['prd'][0]['rt'];
				var prdTime = parsedData['bustime-response']['prd'][0]['prdtm'];
				var timeDifference = 0;
				predictedTime = prdTime.split(" ")[1];
				currentTime = getDateTime();
				currentHour = currentTime.split(":")[0];
				currentMinute = currentTime.split(":")[1];
				predictedHour = predictedTime.split(":")[0];
				predictedMinute = predictedTime.split(":")[1];
				console.log(predictedTime);
				console.log(currentTime);
				timeDifference = (predictedMinute - 0) - (currentMinute - 0);
				if (timeDifference < 0) {
				timeDifference = (timeDifference - 0) + 60;
				}
				speechText = "The bus " + route + " is coming in " + timeDifference + " minutes";
				console.log(speechText);

				data = {
					speech: speechText,
				};	
				response.send(data);

				} catch (e) {
					console.error(e.message);
				}

		});
	});

	requestTimeAndRoute.on('error', (e) => {
		console.log(e.message);
	});
	requestTimeAndRoute.end();



}



exports.getBusInfo = function getBusInfo (request, response){
	updateData(request, response);	
	const app = new App({ request, response });

 // //    //console.log('Request headers: ' + JSON.stringify(request.headers));
 // //    //if (request.body != null) console.log('Request body: ' + JSON.stringify(request.body));
		  



  

	function getPermission(app) {
	  	const permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
  		app.askForPermission('To find the nearest bus stop around you', permission);
	}  

	function getLocation(app) {
		if (app.isPermissionGranted()) {
		    let deviceCoordinates = app.getDeviceLocation().coordinates;
		    return deviceCoordinates;
		}
	}


	// let actionMap = new Map();

 //    actionMap.set('get.permission', getPermission);
 //    actionMap.set('get.location', getLocation);
    

	// app.handleRequest(actionMap);	    
};

