//
// colorroute.js
// This script handles route display and color coding
//

// Polyline segment array
var polySegArray = new Array();

$(document).ready(function() {
	// The DOM is ready

	// On the click of a button, input the route and display it
	$('#createRoute').click(function() {
		mapColorRoute();
	});


	// Place the line segments on the click of a button
	$('#clearRoute').click(function() {
		for (var i = 0; i < polySegArray.length; i++) {
			polySegArray[i].setMap(null);
		}

		$('#plottedPoints').val('');
	});

});

function populateRouteArray() {

	// Variable Declarations
	var anomaliesArr;	// 2D array of lat,long,type for each anomaly detected
	var input;			// .csv input

	// Get data input from the anomalies csv
	//input = readFile(ANOMALIES_FILE);
	
	input = $('#plottedPoints').val();

	// Convert that csv to an array
	anomaliesArr = $.csv.toArrays(input);
	

	// Return the array of information
	return(anomaliesArr);
}

function mapColorRoute() {
// Load .csv data into array
	var routeArray = populateRouteArray();

	// Loop through array and create a set of line segments
	for (var i = 0; i < routeArray.length - 1; i++) {

		// Color of line
		var color;

		// Set start/end coords
		var startEndCoords = [
			new google.maps.LatLng(routeArray[i][1], routeArray[i][0]),
			new google.maps.LatLng(routeArray[i+1][1], routeArray[i+1][0])
		];

		// Set polyline color
		switch (routeArray[i][2]) {
			case "1":
				color = '#8B0000';	// dark red
				break;
			case "2":
				color = '#FF0000';	// red
				break;
			case "3":
				color = '#FFA500';	// orange
				break;
			case "4":
				color = '#FFFF00';	// yellow
				break;
			case "5":
				color = '#9ACD32'; // yellow green
				break;
			case "6":
				color = '#008000';	// green
				break;
			default:
				color = '#0000FF';	// blue
		}

		// Create polyline segment
		var lineSegment = new google.maps.Polyline({
		    path: startEndCoords,
		    geodesic: true,
		    strokeColor: color,
		    strokeOpacity: 1.0,
		    strokeWeight: 3
		  });

		lineSegment.setMap(map);

		// Add to polyline segment array
		polySegArray.push(lineSegment);
	}

	// Place the polylines
	for (var i = 0; i < polySegArray.length; i++) {
		polySegArray[i].setMap(map);
	}
}