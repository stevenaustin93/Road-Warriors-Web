//
// breakmap.js
// This file handles the input of the break
// 
var brakeCircleArray = new Array();

$(document).ready(function() {
	$('#createBrake').click(function() {
		mapBrakes();
	});


	// Place the line segments on the click of a button
	$('#clearBrake').click(function() {
		for (var i = 0; i < brakeCircleArray.length; i++) {
			brakeCircleArray[i].setMap(null);
		}

		$('#plottedPoints').val('');
	});
});

function mapBrakes() {

	// Get brake data from input box
	var brakeArray = populateRouteArray();

	for (var i = 0; i < brakeArray.length; i++) {
		var brakeCircle = new google.maps.Circle({
			strokeColor: '#0000FF',	// blue
			strokeOpacity: 0.25,
			strokeWeight: 0,
			fillColor:  '#0000FF',	// blue
			fillOpacity: 0.25,
			center: new google.maps.LatLng(brakeArray[i][1],brakeArray[i][0]),
			radius: brakeArray[i][2] * 10
		});

		brakeCircleArray.push(brakeCircle);
	}

	for (var i = 0; i < brakeCircleArray.length; i++) {
		brakeCircleArray[i].setMap(map);
	}
	
}