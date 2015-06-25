//
// plotroute.js
// This file takes an array of points and a route time
// It then passes this array to a cloud function to determine the safety of this route
// It plots the route on the Google Map using polylines, and displays the route time and route safety rating
//

// Global variables
	// Used for "clear route" functionality
var startMarker;
var endMarker;
var infowindow;
var plottedRoute;


// On document ready
$(document).ready(function() {
	$('#calcRoute').click(function() {
		if ( ($('#start').val() === "None") || ($('#end').val() === "None")) {
			alert("Please select start and end points for your route");
		} else {
			calcRouteSuccess();
		}
	});

	$('#clearRoute').click(function() {
		startMarker.setMap(null);
		endMarker.setMap(null);
		infowindow.close();
		plottedRoute.setMap(null);
	});
});

//
// When calculate route is clicked successfully
function calcRouteSuccess() {
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
		startMarker = new google.maps.Marker({
			position: startPosition,
			map: map,
			title: 'Start: ' + selectedStart
		});

		var endPosition = new google.maps.LatLng(endLat, endLong);
		endMarker = new google.maps.Marker({
			position: endPosition,
			map: map,
			title: 'End: ' + selectedEnd
		});

		// Query server for shapepoints between these two points
		// assume cloud function accepts an array of points
		cloudComputeShapes(startEndArray);
}

//
// Function to call cloud function that takes start/end points and returns shapepoints along route
function cloudComputeShapes(startEndArray) {
	// Convert input array to start and end strings
	var startString = "" + startEndArray[0][0] + "," + startEndArray[0][1];
	var endString = "" + startEndArray[1][0] + "," + startEndArray[1][1];

	// Run cloud function to get array of GPS points along route
	Parse.Cloud.run("route", {
		startLocation: startString,
		endLocation: endString
	}, {
		success: function(result) {

			// Convert objects in results to 2D array
			var convertedArray = new Array();
			for (var i = 0; i < result.lat.length; i++) {
				convertedArray.push([result.lat[i],result.lng[i]]);
			}

			// Plot the converted 2D array
			convertShapesToArray(convertedArray);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

//
// Function to take JSON object from query and convert it to array of GPS coordinates
function convertShapesToArray(arrayOfPoints) {

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
	showSafetyRating(arrayOfPoints, 5.4);
	// Plot the route
	plotroute(arrayOfPoints);

}

// 
// Function to put the safety rating on the map in an info window attached to a marker
function showSafetyRating(arrayOfPoints, safetyRating) {

	// Determine the middle of the route
	var middle;

	if ((arrayOfPoints.length % 2) === 1) {
		// Odd case
		middle = (arrayOfPoints.length - 1) / 2;
	} else {
		// Even case
		middle = arrayOfPoints.length / 2;
	}

	// Create a marker at the middle
	var middlePosition = new google.maps.LatLng(arrayOfPoints[middle][0], arrayOfPoints[middle][1]);
	var middleMarker = new google.maps.Marker({
		position: middlePosition,
		//map: map,
		title: 'Route Information'
	});

	// Create an info window and display it at the middle marker
	var contentString = 
		'<h4><b>Route: </b><i>' + $('#start').val() + "</i> to <i>" + $('#end').val() +
		'</i><h4><b>Safety Rating: </b><i>' + safetyRating + '/10</i></h4>' +
		'</i><h4><b>Estimated Time: </b><i>' + 15 + ' min</i></h4>';;

	infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: middlePosition
	});

	infowindow.open(map);

}

//
function plotroute(arrayOfPoints) {

	// Array of coordinates
	var routeCoordinates = new Array();

	for (var i = 0; i < arrayOfPoints.length; i++) {
		routeCoordinates.push(new google.maps.LatLng(arrayOfPoints[i][0],arrayOfPoints[i][1]));
	}

	plottedRoute = new google.maps.Polyline({
		path: routeCoordinates,
		strokeColor: 'DarkBlue',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});

	plottedRoute.setMap(map);






	/*	
	// Array of polylines
	polylineArray = new Array();

	// Loop through array of gps coordinates, create a line segment, add to array of polylines
	for (var i = 0; i < arrayOfPoints.length - 1; i++) {

		// Color of line
		var color = 'DarkBlue';

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
	*/

}