//
// colorroute.js
// This script handles route display and color coding
//

$(document).ready(function() {
	// The DOM is ready

	// Polyline segment array
	var polySegArray = new Array();

	// On the click of a button, input the route and display it
	$('#createRoute').click(function() {
		// Load .csv data into array
		var routeArray = populateRouteArray();

		// Loop through array and create a set of line segments
		for (var i = 0; i < routeArray.length - 1; i++) {

			// Color of line
			var color;

			// Set start/end coords
			var startEndCoords = [n
				new google.maps.LatLng(routeArray[i][1],routeArray[i][2])
				new google.maps.LatLng(routeArray[i+1][1],routeArray[i+1][2])
			];

			// Set polyline color
			switch (routeArray[i][3]) {
				case "1":
					color = 'DarkRed';
					break;
				case "2":
					color = 'Red';
					break;
				case "3":
					color = 'Orange';
					break;
				case "4":
					color = 'Yellow';
					break;
				case "5":
					color = 'YellowGreen';
					break;
				case "6":
					color = 'Green';
					break;
				default:
					color = 'Blue';
			}

			// Create polyline segment
			var lineSegment = new google.maps.Polyline({
				path: startEndCoords,
				geodesic: true,
				strokeColor: color,
				strokeOpacity: 1.0,
				strokeWeight: 3
			});

			// Add to polyline segment array
			polySegArray.push(lineSegment);
		}

		// Place the polylines
		for (var i = 0; i < polySegArray.length; i++) {
			polySegArray[i].setMap(map);
		}
	)};


	// Place the line segments on the click of a button
	$('#clearRoute').click(function() {
		for (var i = 0; i < polySegArray.length; i++) {
			polySegArray[i].setMap(null);
		}
	});

});

function populateRouteArray() {

	// Variable Declarations
	var anomaliesArr;	// 2D array of lat,long,type for each anomaly detected
	var input;			// .csv input

	// Get data input from the anomalies csv
	//input = readFile(ANOMALIES_FILE);
	input = ""1",-83.742919921875,42.2633399963379,5\n
"2",-83.7429428100586,42.2633514404297,5\n
"3",-83.7429733276367,42.2633514404297,5\n
"4",-83.7429885864258,42.2633590698242,5\n
"5",-83.7430114746094,42.2633590698242,5\n
"6",-83.7430267333984,42.263370513916,5\n
"7",-83.7430572509766,42.2633781433105,5\n
"8",-83.7430801391602,42.2633781433105,5\n
"9",-83.7431030273438,42.2633895874023,5\n
"10",-83.7431335449219,42.2633895874023,5\n
"11",-83.7431488037109,42.2634010314941,5\n
"12",-83.7431716918945,42.2634010314941,5\n
"13",-83.7431869506836,42.2634086608887,5\n
"14",-83.7432174682617,42.2634201049805,5\n
"15",-83.7432403564453,42.2634201049805,5\n
"16",-83.7432632446289,42.2634315490723,5\n
"17",-83.743293762207,42.2634391784668,5\n
"18",-83.7433090209961,42.2634391784668,5\n
"19",-83.7433319091797,42.2634506225586,5\n
"20",-83.7433471679688,42.2634506225586,5\n
"21",-83.7433776855469,42.2634582519531,5\n
"22",-83.7434005737305,42.2634696960449,5\n
"23",-83.7434234619141,42.2634696960449,5\n
"24",-83.7434463500977,42.2634811401367,5\n
"25",-83.7434692382812,42.2634811401367,5\n
"26",-83.7434921264648,42.2634887695312,5\n
"27",-83.743537902832,42.263500213623,5\n
"28",-83.7435607910156,42.2635116577148,5\n
"29",-83.7435836791992,42.2635192871094,5\n
"30",-83.7435836791992,42.2635192871094,5\n
"31",-83.7435989379883,42.2635192871094,5\n
"32",-83.7436218261719,42.2635307312012,5\n
"33",-83.7436370849609,42.2635307312012,5\n
"34",-83.7436676025391,42.2635383605957,5\n
"35",-83.7436904907227,42.2635498046875,5\n
"36",-83.7437133789062,42.2635498046875,5\n
"37",-83.7437362670898,42.2635612487793,5\n
"38",-83.7437591552734,42.2635688781738,5\n
"39",-83.743782043457,42.2635688781738,5\n
"40",-83.7437973022461,42.2635803222656,5\n
"41",-83.7438278198242,42.2635803222656,5\n
"42",-83.7438507080078,42.2635917663574,5\n
"43",-83.7438735961914,42.263599395752,5\n
"44",-83.743896484375,42.263599395752,5\n
"45",-83.7439193725586,42.2636108398438,5\n
"46",-83.7439422607422,42.2636108398438,5\n
"47",-83.7439727783203,42.2636184692383,5\n
"48",-83.7439880371094,42.2636299133301,5\n
"49",-83.744010925293,42.2636299133301,5\n
"50",-83.7440338134766,42.2636413574219,5";

	// Convert that csv to an array
	anomaliesArr = $.csv.toArrays(input);

	// Return the array of information
	return(anomaliesArr);
}