//
// plotroute.js
// This file takes an array of points and a route time
// It then passes this array to a cloud function to determine the safety of this route
// It plots the route on the Google Map using polylines, and displays the route time and route safety rating
//

$(document).ready(function() {
	$('#calcRoute').click(function() {

		// Get Start and End from selection box
		var selectedStart = $('#start').val();
		var selectedEnd = $('#end').val();

		// Convert these to coordinates
		var startLat;
		var endLat;
		var startLong;
		var endLong;

		if (selectedStart === "PF Changs") {
			startLat = 42.242753;
			startLong = -83.745882;
		} else {
			startLat = 42.242753;
			startLong = -83.745882;
		}

		if (selectedEnd === "Stadium") {
			endLat = 42.266804;
			endLong = -83.748016;
		} else {
			endLat = 42.266804;
			endLong = -83.748016;
		}

		var startEndArray = new Array();
		startEndArray.push([startLat, startLong]);
		startEndArray.push([endLat, endLong]);

		// Place markers at start and end
		var startPosition = new google.maps.LatLng(startLat, startLong);
		var startMarker = new google.maps.Marker({
			position: startPosition,
			map: map,
			title: 'Start: ' + selectedStart
		});

		var endPosition = new google.maps.LatLng(endLat, endLong);
		var endMarker = new google.maps.Marker({
			position: endPosition,
			map: map,
			title: 'End: ' + selectedEnd
		});

		// Query server for shapepoints between these two points
		// assume cloud function accepts an array of points
		cloudComputeShapes(startEndArray);

	});
});

//
// Function to call cloud function that takes start/end points and returns shapepoints along route
function cloudComputeShapes(startEndArray) {
	/*
	Parse.Cloud.run('getShapePoints', {
		startEndCoords: 'startEndArray'
	}, {
		success: function(results) {
			convertShapesToArray(results);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
	*/

	startEndArray.push([42.256804, -83.758016]);
	startEndArray.push([42.226804, -83.758016]);

	convertShapesToArray(startEndArray);
}

//
// Function to take JSON object from query and convert it to array of GPS coordinates
function convertShapesToArray(arrayOfShapePoints) {

	// Conver the shape points to array of lat/longs
		// unnecessary??
	//

	// Call server function to determine safety rating
	/*
	Parse.Cloud.run('getSafetyRating', {
		points: arrayOfShapePoints
	}, {
		success: function(result) {
			showSafetyRating(arrayOfShapePoints, result);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
	*/

	// Create an info window and marker  
	showSafetyRating(arrayOfShapePoints, 5);
	// Plot the route
	plotroute(arrayOfShapePoints);

}

// 
// Function to put the safety rating on the map in an info window attached to a marker
function showSafetyRating(arrayOfShapePoints, safetyRating) {

	// Determine the middle of the route
	var middle;

	if ( (arrayOfShapePoints.length % 2) === 1 ) {
		// Odd case
		middle = (arrayOfShapePoints.length - 1) / 2;
	} else {
		// Even case
		middle = arrayOfShapePoints.length / 2;
	}

	// Create a marker at the middle
	var middlePosition = new google.maps.LatLng(arrayOfShapePoints[middle][0], arrayOfShapePoints[middle][1]);
	var middleMarker = new google.maps.Marker({
		position: middlePosition,
		//map: map,
		title: 'Route Information'
	});

	// Create an info window and display it at the middle marker
	var contentString = '<h3>Safety Rating:</h3>' + '<p><h4>' + safetyRating + '</h4></p>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: middlePosition
	});

	infowindow.open(map);

}

//
function plotroute(arrayOfPoints) {

	// Array of polylines
	var polylineArray = new Array();

	// Loop through array of gps coordinates, create a line segment, add to array of polylines
	for (var i = 0; i < arrayOfPoints.length - 1; i++) {

		// Color of line
		var color = 'Blue';

		// Set start/end coords
		var startEndCoords = [
			new google.maps.LatLng(arrayOfPoints[i][0], arrayOfPoints[i][1]),
			new google.maps.LatLng(arrayOfPoints[i + 1][0], arrayOfPoints[i + 1][1])
		];

		// Create polyline segment
		var lineSegment = new google.maps.Polyline({
			path: startEndCoords,
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 3
		});

		polylineArray.push(lineSegment);
	}


	// Plot the polylines
	for (var i = 0; i < polylineArray.length; i++) {
		polylineArray[i].setMap(map);
	}

}