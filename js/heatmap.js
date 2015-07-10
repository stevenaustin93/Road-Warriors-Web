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
		$('#heatdiv').append('<img id="load_spinner" src="images/heat_load.gif"/>');
		QueryForHeatmap();

	});


	// Place the line segments on the click of a button
	$('#clearHeatmap').click(function() {

		ClearHeatmap();

	});
});

//
// Query the general table on parse for the specified column
function QueryForHeatmap() {
	// Determine which type of heatmap we want
	var heatmapCol = $('#heatMap').val();

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var query = new Parse.Query(rowColPairs);

	if (heatmapCol === "none") {

		// If "none" is selected, cancel the query
		return;

	} else if (heatmapCol === "cars") {

		// Car density querying requires specialized querying function
		//alert("Selected \"Cars\", redirecting query...");
		QueryForCarHeatmap();
		return;

	} else if (heatmapCol === "accel") {

		var accel1Query = new Parse.Query(rowColPairs);
		var accel2Query = new Parse.Query(rowColPairs);

		accel1Query.greaterThan("accel1", 0);
		accel2Query.greaterThan("accel2", 0);

		query = Parse.Query.or(accel1Query, accel2Query);

	} else if (heatmapCol === "brake") {

		var brake1Query = new Parse.Query(rowColPairs);
		var brake2Query = new Parse.Query(rowColPairs);

		brake1Query.greaterThan("brake1", 0);
		brake2Query.greaterThan("brake2", 0);

		query = Parse.Query.or(brake1Query, brake2Query);

	} else if (heatmapCol === "variance") {

		QueryForVarHeatmap();
		return;

	} else if (heatmapCol === "swerve") {
		query.greaterThan("swerve", 0);

	} else {
		$('#load_spinner').remove();
		return;
	}

	query.limit(500);

	// Perform query
	query.find({

		success: function(results) {

			//alert("Number of heatmap entries: " + results.length);

			// Create array of lat/longs for the heatmap plot
			var googleLatLngArray = new Array();

			for (var i = 0; i < results.length; i++) {
				var object = results[i];

				// Convert row/col to lat/lng
				var GLat = object.get('row') * 0.00005 + 35;
				var GLng = object.get('col') * 0.00005 - 90;

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
// Function to query for only top of speed variances
function QueryForVarHeatmap() {

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var varQuery = new Parse.Query(rowColPairs);

	// Set query constraints
	varQuery.descending("speed_variance");
	varQuery.limit(1000);

	// Perform query
	varQuery.find({

		success: function(results) {

			//alert("Number of car heatmap entries: " + results.length);

			// Create array of lat/longs for the heatmap plot
			var googleLatLngArray = new Array();

			for (var i = 0; i < results.length; i++) {
				var object = results[i];

				// Convert row/col to lat/lng
				var GLat = object.get('row') * 0.00005 + 35;
				var GLng = object.get('col') * 0.00005 - 90;

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
// Function to query for only top car densities
function QueryForCarHeatmap() {

	// Setup query from general table
	var rowColPairs = Parse.Object.extend("generalTable");
	var carQuery = new Parse.Query(rowColPairs);

	// Set query constraints
	carQuery.descending("cars");
	carQuery.limit(1000);

	// Perform query
	carQuery.find({

		success: function(results) {

			//alert("Number of car heatmap entries: " + results.length);

			// Create array of lat/longs for the heatmap plot
			var googleLatLngArray = new Array();

			for (var i = 0; i < results.length; i++) {
				var object = results[i];

				// Convert row/col to lat/lng
				var GLat = object.get('row') * 0.00005 + 35;
				var GLng = object.get('col') * 0.00005 - 90;

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

	$('#load_spinner').remove();

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