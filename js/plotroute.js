//
// plotrouteNew.js
// Display a route, alternative route options, and information about each route
// (Note this file is a refactor test)

var rinfowindow;
var plottedRoutes;

//
// On document ready, listen for 'show route' button click
$(document).ready(function(){

	var routed = false;

	// Swerve button event handler
	var routeClicked = false;
	$('#calcRoute').click(function() {
		
		if (($('#start').val() === "None") || ($('#end').val() === "None")) {
			$('#myModal').modal('show');
		} else {

			// Disable the button until finished querying to prevent overload of server
			$('#calcRoute').prop('disabled', true);
			$('#calcRoute').text("Loading...");

			if (routed) {
				clearRoutes();
				routed = false;
			}
			plotRoute(routeClicked);
			routed = true;
		}

		this.blur();

	});

	$('#clearRoute').click(function() {
		clearRoutes();
		routed = false;
		this.blur();
	});

});

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

	// Get start and end gps coordinates
	var startEndObj = getDestinations();
	if (!startEndObj.exists) return;

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
	var message = '<div><h4><b><i>' + $('#start').val() + "</i></b> to <b><i>" + $('#end').val() + '</b></i></div>';
	for (var i = 0; i < routes.length; i++) {
		var currString = '<div style=\"float: left; position:relative\">';
		if (i == 0) {
			currString += '<p>(blue route)</p>';
		} else {
			currString += '<p>(grey route)</p>';
		}
		currString += '<b>Safety Rating: </b><i>' + routes[i].safety + '/10</i>' +
		'</i><br><b>Estimated Time: </b><i>' + routes[i].time.toPrecision(3) + ' min</i>' +
		'</i><br><b>Approx. Distance: </b><i>' + routes[i].distance + ' miles</i></h5>' + '</div>';

		message += currString;
	}
	message += '</div>';

	rinfowindow = new google.maps.InfoWindow({
		content: message,
		position: northPos,
		map: map
	});
	
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
// Returns two GPS coordinates based on selection boxes
function getDestinations() {

	// Get start selection
	var start = $('#start').val();
	var end = $('#end').val();

	// Hardcoded reverse-geocode
	var lat0 = 0;
	var lng0 = 0;
	switch (start) {
		case "PF Changs":
			lat0 = 42.242753;
			lng0 = -83.745882;
			break;
		case "Law Quadrangle":
			lat0 = 42.274460;
			lng0 = -83.739531;
			break;
		case "City Hall":
			lat0 = 42.283308;
			lng0 = -83.744921;
			break;
		default:
			// do nothing
	}

	var lat1 = 0;
	var lng1 = 0;
	switch (end) {
		case "Stadium":
			lat1 = 42.266804;
			lng1 = -83.748016;
			break;
		case "Miller Nature Area":
			lat1 = 42.287535;
			lng1 = -83.768593;
			break;
		case "Ann Arbor Municipal Airport":
			lat1 = 42.224220;
			lng1 = -83.745186;
			break;
		default:
			// do nothing
	}

	// Check to see if we have an invalid input
	var exists = !(lat0 == 0 || lng0 == 0 || lat1 == 0 || lng1 == 0);

	var destObject = {
		exists: exists,
		lat0: lat0,
		lng0: lng0,
		lat1: lat1,
		lng1: lng1
	};

	return ( destObject );
}