//
// plotrouteNew.js
// Display a route, alternative route options, and information about each route
// (Note this file is a refactor test)

//
// On document ready, listen for 'show route' button click
$(document).ready(function(){

	// Swerve button event handler
	var routeClicked = false;
	$('#showRoute').click(function() {
		plotRoute(routeClicked);
		this.blur(); // force remove focus
		routeClicked = !routeClicked;
	});

});

//
// plots a route based on the selection boxes
function plotRoute(routeClicked) {

	// Get start and end gps coordinates
	var startEndObj = getDestinations();
	if (startEnd)


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