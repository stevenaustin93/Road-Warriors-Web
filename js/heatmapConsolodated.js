//
// heatmap.js
// Displays a heatmap of selected data from general table
//

var heatmap;
var heatDisplayed = false;

$(document).ready(function() {

	$('#heatMap').on('change', function() {

		if (heatDisplayed) {
			ClearHeatmap();
			heatDisplayed = false;
		}
		heatDisplayed = true;
		QueryForHeatmap();

	});


	// Place the line segments on the click of a button
	$('#clearHeatmap').click(function() {

		ClearHeatmap();

	});
});

/* ---Unnecessary function---
function HeatmapType() {
	// Get the dropdown menu value
	var heatmapVal = $('#heatMap').val();

	var returnValue = "";

	// Based on dropdown value, return general table column title
	switch (heatmapVal) {
		case "accel":
			returnValue = "Accel";
			break;
		case "brake":
			returnValue = "Brake";
			break;
		case "swerve":
			returnValue = "Swerve";
			break;
		case "cars":
			returnValue = "cars";
			break;
		default:
			returnValue = "none";
	}

	return (returnValue);
}
*/

//
// Query the general table on parse for the specified column
function QueryForHeatmap() {
	// Determine which type of heatmap we want
	var heatmapCol = $('#heatMap').val();

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var mainQuery = new Parse.Query(rowColPairs);

	// Set query constraints as appropriate
	var greaterThanVal = 0;

	if (heatmapCol === "accel") {

		// Craft one query for each accel column
		var accel1Query = new Parse.Query(rowColPairs);
		var accel2Query = new Parse.Query(rowColPairs);
		var accel3Query = new Parse.Query(rowColPairs);

		accel1Query.greaterThan("Accel1", greaterThanVal);
		accel2Query.greaterThan("Accel2", greaterThanVal);
		accel3Query.greaterThan("Accel3", greaterThanVal);

		// Merge these queries using parse logical "OR"
		mainQuery = Parse.Query.or(accel1Query, accel2Query, accel3Query);

	} else if (heatmapCol === "brake") {

		// Craft one query for each accel column
		var brake1Query = new Parse.Query(rowColPairs);
		var brake2Query = new Parse.Query(rowColPairs);
		var brake3Query = new Parse.Query(rowColPairs);

		brake1Query.greaterThan("Break1", greaterThanVal);
		brake2Query.greaterThan("Break2", greaterThanVal);
		brake3Query.greaterThan("Break3", greaterThanVal);

		// Merge these queries using parse logical "OR"
		mainQuery = Parse.Query.or(brake1Query, brake2Query, brake3Query);

	} else if (heatmapCol === "swerve") {

		// Swerve only requires querying of one column
		mainQuery.greaterThan("Swerve", greaterThanVal);

	} else if (heatmapCol === "cars") {

		// The cars heatmap requires specialized querying
		QueryForCarHeatmap();
		return;

	} else {

		// Otherwise cancel the query
		return;

	}

	// Set query constraints
	if (heatmapCol === "Accel3")
	query.greaterThan(heatmapCol, greaterThanVal);
	query.limit(500);

	// Perform query
	query.find({

		success: function(results) {

			alert("Number of heatmap entries: " + results.length);

			// Create array of lat/longs for the heatmap plot
			var googleLatLngArray = new Array();

			for (var i = 0; i < results.length; i++) {
				var object = results[i];

				// Convert row/col to lat/lng
				var GLat = object.get('row') * 0.00005 + 41.994;
				var GLng = object.get('col') * 0.00005 - 84.88087;

				// Add point to coords array
				googleLatLngArray.push(new google.maps.LatLng(GLat, GLng));
			}

			// Send coords array to plotting function
			PlotHeatmap(googleLatLngArray);

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

}

//
// Query the general table on parse for the specified column
function QueryForCarHeatmap() {
	// Determine which type of heatmap we want
	var heatmapCol = $('#heatMap').val();

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var query = new Parse.Query(rowColPairs);

	// Set query constraints as appropriate
	var greaterThanVal = 0;

	if (heatmapCol === "accel") {
		return;
	} else if (heatmapCol === "brake") {

	} else if (heatmapCol === "swerve") {

	} else if (heatmapCol === "cars") {

	} else {
		return;
	}

	// Set query constraints
	if (heatmapCol === "Accel3")
	query.greaterThan(heatmapCol, greaterThanVal);
	query.limit(500);

	// Perform query
	query.find({

		success: function(results) {

			alert("Number of heatmap entries: " + results.length);

			// Create array of lat/longs for the heatmap plot
			var googleLatLngArray = new Array();

			for (var i = 0; i < results.length; i++) {
				var object = results[i];

				// Convert row/col to lat/lng
				var GLat = object.get('row') * 0.00005 + 41.994;
				var GLng = object.get('col') * 0.00005 - 84.88087;

				// Add point to coords array
				googleLatLngArray.push(new google.maps.LatLng(GLat, GLng));
			}

			// Send coords array to plotting function
			PlotHeatmap(googleLatLngArray);

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

}

//
// Function that takes array of google.maps.LatLng() values and plots a heatmap
function PlotHeatmap(gLatLngArray) {

	var MVCpointArray = new google.maps.MVCArray(gLatLngArray);

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: MVCpointArray,
		radius: 20
	});

	heatmap.setMap(map);

}

//
// Simple function to remove heatmap
function ClearHeatmap() {

	heatmap.setMap(null);

}