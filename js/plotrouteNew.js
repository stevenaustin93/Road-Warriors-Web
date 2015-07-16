//
// plotrouteNew.js
// Display a route, alternative route options, and information about each route
// (Note this file is a refactor test)

var rinfowindow;
var plottedRoutes;

var startMark;
var endMark;

var startMarkInfo;

//
// On document ready, listen for 'show route' button click
$(document).ready(function(){

	var routed = false;

	$('#calcRoute').prop('disabled', true);

	var routeClicked = false;
	$('#routeSelect').click(function() {
		placeRouteMarks(routeClicked);
		if (routeClicked) this.blur();
		routeClicked = !routeClicked;

	});

	$('#calcRoute').click(function() {
		if (!validBounds()) {
			$('#myModal').modal('show');
		} else {
			if (routed) clearRoutes();
			plotRoute(routed);
			this.blur();
			routed = true;
			startMarkInfo.setMap(null);
		}
	});

});

//
// Checks to see if the markers are close enough to Ann Arbor to calculate
function validBounds() {
	var bounds = getMarksPos();
	var maxLat = 42.435361;
	var minLng = -84.023722;
	var minLat = 42.138680;
	var maxLng = -83.560553;

	var valid = true;

	/*
	console.log( bounds.lat0 > maxLat );
	console.log( bounds.lat1 > maxLat );
	console.log( bounds.lat1 > maxLat );
	console.log( bounds.lat1 < minLat );

	console.log( bounds.lng0 > maxLng );
	console.log( bounds.lng1 > maxLng );
	console.log( bounds.lng0 < minLng );
	console.log( bounds.lng1 < minLng );
	*/

	if (bounds.lat0 > maxLat) valid = false;
	if (bounds.lat1 > maxLat) valid = false;
	if (bounds.lat0 < minLat) valid = false;
	if (bounds.lat1 < minLat) valid = false;

	if (bounds.lng0 > maxLng) valid = false;
	if (bounds.lng1 > maxLng) valid = false;
	if (bounds.lng0 < minLng) valid = false;
	if (bounds.lng1 < minLng) valid = false;

	return ( valid );

}


//
// places start and end markers on the map
function placeRouteMarks(clicked) {

	if (!clicked) {

		$('#calcRoute').prop('disabled', false);

		startMarkInfo = new google.maps.InfoWindow({
			content: "Start: Drag me around to select a start and end point for your route!"
		});

		startMark = new google.maps.Marker({
			position: new google.maps.LatLng(42.287535, -83.768593),
			icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
			title: "Start Marker",
			draggable: true,
			map: map
		});

		startMarkInfo.open(map, startMark);

		endMark = new google.maps.Marker({
			position: new google.maps.LatLng(42.242753, -83.745882),
			icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
			title: "End Marker",
			draggable: true,
			map: map
		});

	} else {
		$('#calcRoute').prop('disabled', true);
		startMark.setMap(null);
		endMark.setMap(null);
		clearRoutes();
		routed = false;
	}
}

//
// Clears polyline routes and rinfowindows
function clearRoutes() {
	rinfowindow.setMap(null);

	for (var i = 0; i < plottedRoutes.length; i++) {
		plottedRoutes[i].setMap(null);
	}

	plottedRoutes.length = 0;
}


//
// plots a route based on the selection boxes
function plotRoute(routeClicked) {

	$('#calcRoute').prop('disabled', true);
	$('#calcRoute').text("Calculating..."); 
	

	// Get start and end gps coordinates
	var startEndObj = getMarksPos();
	//if (!startEndObj.exists) return;

	// Get route shapepoints from server
	var startString = "" + startEndObj.lat0 + "," + startEndObj.lng0;
	var endString = "" + startEndObj.lat1 + "," + startEndObj.lng1;

	// Route results
	var routeResults = new Array();

	// Run cloud function to get array of GPS points along route
	Parse.Cloud.run("route", {
		startLocation: startString,
		endLocation: endString
	}, {
		success: function(result) {


			// parse results into array of objects
			for (var i = 0; i < result.length; i++) {

				var routeObject = {
					rtPoints: [],
					time: [],
					distance: [],
					safety: []
				};



				// Convert lat/lng objects to 2D array
				for (var j = 0; j < result[i].lat.length; j++) {
					routeObject.rtPoints.push([result[i].lat[j], result[i].lng[j]]);
				}

				routeObject.time = result[i].time;
				routeObject.distance = result[i].distance;
				routeObject.safety = -1;

				routeResults.push(routeObject);
			}

		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			$('#calcRoute').prop('disabled', false);
			$('#calcRoute').text("Calculate Route");
			$('#calcRoute').css('font-weight', 'bold');
		}
	}).then( function() {
		// After we have found all the routes, rate the safety of each route

		var count = 0;
		var maxResults = routeResults.length;

		for (var i = 0; i < routeResults.length; i++) {

			Parse.Cloud.run("rateSafety", {
				shapeArray: routeResults[i].rtPoints
			}, {
				success: function(result) {

					console.log("# routes = " + routeResults.length + ", curr=" + count);

					routeResults[count].safety = result;
					console.log("routeResults[" + count + "].safety = " + routeResults[count].safety);

				},
				error: function(error) {
					alert("Error: " + error.code + " " + error.message);
						$('#calcRoute').prop('disabled', false);
						$('#calcRoute').text("Calculate Route");
						$('#calcRoute').css('font-weight','bold');  
				}
			}).then(function() {
				count++;
				console.log("Current count=" + count);
				if (count >= maxResults) {
					// When finished rating the safety of the routes, display them
					createInfo(routeResults, startEndObj);
					plotRoutes(routeResults);
					return;
				}
			});
		}
	});
}

//
// Given a list of routes, makes an rinfowindow displaying side-by-side information
function createInfo(routes, startEndObj) {

	// Determine nothernmost point
	var northLat;
	var northLng;
	if (startEndObj.lat0 > startEndObj.lat1) {
		northLat = startEndObj.lat0;
		northLng = startEndObj.lng0;
	} else {
		northLat = startEndObj.lat1;
		northLng = startEndObj.lng1;
	}

	var northPos = new google.maps.LatLng(northLat, northLng);
	

	// Create an rrinfowindow and display it at the northernmost route
	var message = '<div><h4><b>Route Information</b></div>';
	for (var i = 0; i < routes.length; i++) {
		var currString = '<div style=\"float: left; padding-left: 5px; position:relative\">';
		if (i == 0) {
			currString += '<div>(blue route)';
		} else {
			currString += '<div>(grey route)';
		}
		currString += '<div><b>Safety Rating: </b>' + parseFloat(routes[i].safety).toPrecision(2) + '/10' +
		'<br><b>Estimated Time: </b>' + routes[i].time.toPrecision(2) + ' min' +
		'<br><b>Approx. Distance: </b>' + routes[i].distance.toPrecision(2) + ' miles</h5>' + '</div></div></div>';

		message += currString;
	}
	message += '</div>';

	rinfowindow = new google.maps.InfoWindow({
		content: message
	});

	rinfowindow.open(map, startMark);
	
}

//
// Given a list of routes, plot them with shapepoints
function plotRoutes(routes) {

	plottedRoutes = new Array();

	for (var j = 0; j < routes.length; j++) {

		var color = 'Gray';
		if (j == 0) {
			color = 'Blue';
		}

		// Array of coordinates
		var routeCoordinates = new Array();

		for (var i = 0; i < routes[j].rtPoints.length; i++) {
			routeCoordinates.push(new google.maps.LatLng(routes[j].rtPoints[i][0], routes[j].rtPoints[i][1]));

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

		google.maps.event.addListener(plottedRoutes[i], 'click', function(event) {
			rinfowindow.open(map);
		});
	}

	$('#calcRoute').prop('disabled', false);
	$('#calcRoute').text("Calculate Route");
	$('#calcRoute').css('font-weight','bold');   
	
}

//
// returns the position of the two markers as an object
function getMarksPos() {

	var destObject = {
		lat0: startMark.getPosition().lat(),
		lng0: startMark.getPosition().lng(),
		lat1: endMark.getPosition().lat(),
		lng1: endMark.getPosition().lng()
	}; 

	return ( destObject );
}
