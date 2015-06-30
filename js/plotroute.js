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

var routed = false;

// On document ready
$(document).ready(function() {
	$('#calcRoute').click(function() {
		if ( ($('#start').val() === "None") || ($('#end').val() === "None")) {
			alert("Please select start and end points for your route");
		} else {
			if (routed) {
				ClearRoute();
				routed = false;
			}
			routed = true;
			calcRouteSuccess();
		}
	});

	$('#clearRoute').click(function() {
		ClearRoute();
	});
});

//
// Clears displayed route
function ClearRoute() {
	startMarker.setMap(null);
	endMarker.setMap(null);
	infowindow.close();
	plottedRoute.setMap(null);
}

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
		} else if (selectedStart === "Law Quadrangle") {
			startLat = 42.274460; 
			startLong = -83.739531;
		}
		else {
			// nothing here?
		}

		if (selectedEnd === "Stadium") {
			endLat = 42.266804;
			endLong = -83.748016;
		} else if (selectedEnd === "Miller Nature Area") {
			endLat = 42.287535;
			endLong = -83.768593;
		} else {
			// nothing here?
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
// Function to call cloud function that takes start/end points and returns shapepoints along a set of routes
function cloudComputeShapes(startEndArray) {
	alert("querying for routes...");
	// Convert input array to start and end strings
	var startString = "" + startEndArray[0][0] + "," + startEndArray[0][1];
	var endString = "" + startEndArray[1][0] + "," + startEndArray[1][1];

	// Run cloud function to get array of GPS points along route
	Parse.Cloud.run("route", {
		startLocation: startString,
		endLocation: endString
	}, {
		success: function(result) {

			// There may be multiple routes returned
			var arrayOfRoutes = new Array();
			alert(result.length " routes found");

			for (var j = 0; j < result.length; j++) {

				// Convert objects in results to 2D array
				var convertedArray = new Array();
				for (var i = 0; i < result[j].lat.length; i++) {
					convertedArray.push([result[j].lat[i],result[j].lng[i]]);
				}

				arrayOfRoutes.push(convertedArray);
			}

			for (var i = 0; i < arrayOfRoutes.length; i++) {
				var color = 'Gray';
				if (i == 0) {
					color = 'DarkBlue';
				}
				convertShapesToArray(arrayOfRoutes[i], color);
			}

		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

//
// Function to take JSON object from query and convert it to array of GPS coordinates
function convertShapesToArray(arrayOfPoints, color) {

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
	var safetyRating = Math.random() * 10;
	safetyRating = safetyRating.toPrecision(2);  
	showSafetyRating(arrayOfPoints, safetyRating);
	// Plot the route
	plotroute(arrayOfPoints, color);

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
	var routeTime = Math.random() * 20;
	routeTime = routeTime.toPrecision(2);
	var contentString = 
		'<h4><b>Route: </b><i>' + $('#start').val() + "</i> to <i>" + $('#end').val() +
		'</i><h4><b>Safety Rating: </b><i>' + safetyRating + '/10</i></h4>' +
		'</i><h4><b>Estimated Time: </b><i>' + routeTime + ' min</i></h4>';;

	infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: middlePosition
	});

	infowindow.open(map);

}

//
function plotroute(arrayOfPoints, color) {

	// Array of coordinates
	var routeCoordinates = new Array();

	alert("# Lines: " + arrayOfPoints.length);

	for (var i = 0; i < arrayOfPoints.length; i++) {
		routeCoordinates.push(new google.maps.LatLng(arrayOfPoints[i][0],arrayOfPoints[i][1]));
	}

	plottedRoute = new google.maps.Polyline({
		path: routeCoordinates,
		strokeColor: color,
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

//
// Function to set color coding of route polylines
function SetRouteColors() {

	// Query server each shape point along route

	// Set a color for each shape point
	
}