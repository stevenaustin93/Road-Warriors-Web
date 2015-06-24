//
// plotroute.js
// This file takes an array of points and a route time
// It then passes this array to a cloud function to determine the safety of this route
// It plots the route on the Google Map using polylines, and displays the route time and route safety rating
//

//
$('#calcRoute').click(functio() {
	plotroute();
});

//
function plotroute() {

	var arrayOfPoints = [ [42.266804, -83.748016],[42.242753, -83.745882] ];

	// Function call to determine safety rating of route
	// CloudComputeSafetyRating(arrayOfPoints);

	// Array of polylines
	var polylineArray = new Array();

	// Loop through array of gps coordinates, create a line segment, add to array of polylines
	for (var i = 0; i < arrayOfPoints.length - 1; i++) {

		// Color of line
		var color = 'Blue';

		// Set start/end coords
		var startEndCoords = [
			new google.maps.LatLng(arrayOfPoints[i][0], arrayOfPoints[i][1]),
			new google.maps.LatLng(arrayOfPoints[i+1][0], arrayOfPoints[i+1][1])
		];

		// Create polyline segment
		var lineSegment = new google.maps.Polyline({
		    path: startEndCoords,
		    strokeColor: color,
		    strokeOpacity: 1.0,
		    strokeWeight: 3
		});

	}

	// Plot the polylines
	for (var i = 0; i < polylineArray.length; i++) {
		polylineArray[i].setMap(map);
	}

	// Add infowindow
	var infowindow = new google.maps.InfoWindow({
		content: "Info windoooooow"
	});

	infowindow.open(infowindow);

}