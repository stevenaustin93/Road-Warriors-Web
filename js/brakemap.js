//
// breakmap.js
// This file handles the input of the break
// 
var brakeCircleArray = new Array();

$(document).ready(function() {
	$('#createMapBreak').click(function() {
		mapBrakes();
	});


	// Place the line segments on the click of a button
	$('#clearMapBrake').click(function() {
		for (var i = 0; i < brakeCircleArray.length; i++) {
			brakeCircleArray[i].setMap(null);
		}

		$('#plottedPoints').val('');
	});
});

function mapBreaks() {

	// Get brake data from input box
	var brakeArray = populateRouteArray();

	for (var i = 0; i < brakeArray.length; i++) {
		var brakeCircle = {
			strokeColor: 'Blue',
			strokeOpacity: 0.5,
			strokeWeight: 2,
			fillColor: 'Blue',
			fillOpacity: 0.25,
			center: new google.maps.LatLng(brakeArray[i][1],brakeArray[i][0]),
			radius: brakeArray[i][2] * 10
		};

		brakeCircleArray.push(brakeCircle);
	}

	for (var i = 0; i < brakeCircleArray.length; i++) {
		brake
	}
}