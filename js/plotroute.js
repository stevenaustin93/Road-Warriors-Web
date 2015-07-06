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
var infoWindows = new Array();
var plottedRoutes = new Array();

var routed = false;

// On document ready
$(document).ready(function() {
	$('#calcRoute').click(function() {
		if ( ($('#start').val() === "None") || ($('#end').val() === "None")) {
			alert("Please select start and end points for your route");
		} else {
			if (routed) {
				ClearRoutes();
				routed = false;
			}
			routed = true;
			calcRouteSuccess();
		}
	});

	$('#clearRoute').click(function() {
		ClearRoutes();
	});
});

//
// Clears all displayed routes
function ClearRoutes() {
	//startMarker.setMap(null);
	//endMarker.setMap(null);

	for (var i = 0; i < infoWindows.length; i++) {
		infoWindows[i].setMap(null);
	}
	infoWindows.length = 0;
	for (var i = 0; i < plottedRoutes.length; i++) {
		plottedRoutes[i].setMap(null);
	}
	plottedRoutes.length = 0;
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

		/*
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
		*/

		// Query server for shapepoints between these two points
		// assume cloud function accepts an array of points
		cloudComputeShapes(startEndArray);
}

//
// Function to call cloud function that takes start/end points and returns shapepoints along a set of routes
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
			alert("Found " + result.length + " route(s), blue representing the fastest.");

			// There may be multiple routes returned
			var arrayOfRtObjects = new Array();

			// parse results into array of objects
			for (var i = 0; i < result.length; i++) {

				var routeObject = {
					rtPoints: [],
					time: [],
					distance: []
				};

				// Convert lat/lng objects to 2D array
				for (var j = 0; j < result[i].lat.length; j++) {
					routeObject.rtPoints.push([result[i].lat[j], result[i].lng[j]]);
				}

				routeObject.time = result[i].time;
				routeObject.distance = result[i].distance;

				arrayOfRtObjects.push(routeObject);
			}

			ManageRoutes(arrayOfRtObjects);

		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

//
// Function to take JSON object from query and convert it to array of GPS coordinates
function ManageRoutes(routeObjList) {

	// Display route info for each route
	for (var i = 0; i < routeObjList.length; i++) {
		var safetyRating = Math.random() * 10;
		safetyRating = safetyRating.toPrecision(2); 

		DisplayRouteInfo(routeObjList[i].rtPoints, safetyRating, routeObjList[i].time, routeObjList[i].distance);
	}

	for (var i = 0; i < infoWindows.length; i++) {
		infoWindows[i].setMap(map);
	}


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

	// Plot the routes
	PlotRoutes(routeObjList);

	// 
	for (var i = 0; i < routeObjList.length; i++) {
		var allBoxList = AllBoxes(routeObjList[i].rtPoints);
		var queryList = ConvertToQueries(allBoxList);
	}

}

//
// Returns the center of a polyline
function GetLineCenter(arrayOfPoints) {

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

	return ( middlePosition );

}

// 
// Function to put the safety rating on the map in an info window attached to a marker
function DisplayRouteInfo(arrayOfPoints, safetyRating, routeTime, routeDistance) {

	var middlePosition = GetLineCenter(arrayOfPoints);
	/*
	var middleMarker = new google.maps.Marker({
		position: middlePosition,
		//map: map,
		title: 'Route Information'
	});
	*/

	// Create an info window and display it at the middle marker
	routeTime = routeTime.toPrecision(3);
	routeDistance = routeDistance.toPrecision(3);
	var contentString = 
		'<h5><b>Route: </b><i>' + $('#start').val() + "</i> to <i>" + $('#end').val() +
		'</i><br><b>Safety Rating: </b><i>' + safetyRating + '/10</i> (fake)' +
		'</i><br><b>Estimated Time: </b><i>' + routeTime + ' min</i>' +
		'</i><br><b>Approx. Distance: </b><i>' + routeDistance + ' miles</i></h5>';

	infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: middlePosition
	});

	infoWindows.push(infowindow);

}

//
function PlotRoutes(arrayOfRoutes) {
	
	for (var j = 0; j < arrayOfRoutes.length; j++) {

		var color = 'Gray';
		if (j == 0) {
			color = 'Blue';
		}

		// Array of coordinates
		var routeCoordinates = new Array();

		for (var i = 0; i < arrayOfRoutes[j].rtPoints.length; i++) {
			routeCoordinates.push(new google.maps.LatLng(arrayOfRoutes[j].rtPoints[i][0],arrayOfRoutes[j].rtPoints[i][1]));

		}

		plottedRoutes.push(new google.maps.Polyline({
			path: routeCoordinates,
			strokeColor: color,
			strokeOpacity: 0.7,
			strokeWeight: 5
		}));
	}

	for (var i = 0; i < plottedRoutes.length; i++) {
		plottedRoutes[i].setMap(map);
		AddInfowindow(plottedRoutes[i], i);
	}
	

}

//
// Function to add an infowindow to a polyline
function AddInfowindow(polyline, number) {
	google.maps.event.addListener(polyline, 'click', function(event) {
			infoWindows[number].open(map);
		});
}

//
// Function to set color coding of route polylines
function SetRouteColors() {

	// Query server each shape point along route

	// Set a color for each shape point
	
}