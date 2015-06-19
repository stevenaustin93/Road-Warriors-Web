//
// heatmap.js
// Displays a heatmap of input coordinates
//

//
// breakmap.js
// This file handles the input of the break
// 

var heatmap;

$(document).ready(function() {
	$('#createHeatmap').click(function() {
		alert("called me");
		funcHeatmap();
	});


	// Place the line segments on the click of a button
	$('#clearHeatmap').click(function() {

		heatmap.setMap(null);

		$('#plottedPoints').val('');
	});
});

function funcHeatmap() {

	var heatmapData = new Array();

	// Get brake data from input box
	var heatPointsArray = populateRouteArray();

	for (var i = 0; i < heatPointsArray.length; i++) {
		var coordinate = new google.maps.LatLng(heatPointsArray[i][1],heatPointsArray[i][0]);

		heatmapData.push(coordinate);
	}

	var MVCpointArray = new google.maps.MVCArray(heatmapData);

	heatmap = new google.maps.visualization.HeatmapLayer({
	    data: MVCpointArray,
	    radius: 20
	});

	heatmap.setMap(map);
	
}