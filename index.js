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
};

