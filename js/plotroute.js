//
// plotroute.js
// This file takes an array of points and a route time
// It then passes this array to a cloud function to determine the safety of this route
// It plots the route on the Google Map using polylines, and displays the route time and route safety rating
//

$(document).ready(function() {
	$('#calcRoute').click(function() {
		
		var destArray = new Array();
		destArray.push([42.266804, -83.748016]);
		destArray.push([42.242753, -83.745882]);
		destArray.push([45.242753, -84.745882]);
		plotroute(destArray);
		

		
	});
});

//
function plotroute(arrayOfPoints) {

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

	// Add infowindow
	/*
	var infowindow = new google.maps.InfoWindow({
		content: "Info windoooooow"
	});

	infowindow.open(infowindow);
	*/

}