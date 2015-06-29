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

function HeatmapType() {
	// Get the dropdown menu value
	var heatmapVal = $('#heatMap').val();

	var returnValue = "";

	// Based on dropdown value, return general table column title
	switch (heatmapVal) {
		case "accel1":
			returnValue = "Accel1";
			break;
		case "accel2":
			returnValue = "Accel2";
			break;
		case "accel3":
			returnValue = "Accel3";
			break;
		case "brake1":
			returnValue = "Break1";
			break;
		case "brake2":
			returnValue = "Break2";
			break;
		case "brake3":
			returnValue = "Break3";
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

//
// Query the general table on parse for the specified column
function QueryForHeatmap() {
	// Determine which type of heatmap we want
	var heatmapCol = HeatmapType();

	// Cancel query if "none" is selected
	if (heatmapCol === "none") {
		return;
	}

	// Set "greater than" value if necessary
	var greaterThanVal = 0;
	if (heatmapCol === "cars") {
		greaterThanVal = 10;
	}

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var query = new Parse.Query(rowColPairs);

	// Set query constraints
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