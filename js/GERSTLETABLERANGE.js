//
// GeneralTableRange.js
// Queries the general table on the database and finds the "range"
//

var maxRow;
var minRow;
var maxCol;
var minCol;

$(document).ready(function() {

	// Query the general table for the max row and col
	alert("plotting rectangle");
	FindMaxRow();

});

function FindMaxRow() {
	console.log("finding max row");
	var generalTable = Parse.Object.extend("generalTable");
	var query = new Parse.Query(generalTable);

	// Set query constraints
	query.descending("row");
	query.limit(1);

	// Perform query
	query.find({

		success: function(results) {

			maxRow = results[0].get('row');
			console.log("found max row: " + maxRow);

			FindMaxCol();

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});
}

function FindMaxCol() {
	console.log("Finding max col...");
	var generalTable = Parse.Object.extend("generalTable");
	var query = new Parse.Query(generalTable);

	// Set query constraints
	query.descending("col");
	query.limit(1);

	// Perform query
	query.find({

		success: function(results) {

			maxCol = results[0].get('col');

			console.log("Found max col: " + maxCol);

			FindMinRow();
			
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});
}

function FindMinRow() {
	console.log("Finding min row...");
	var generalTable = Parse.Object.extend("generalTable");
	var query = new Parse.Query(generalTable);

	// Set query constraints
	query.ascending("row");
	query.limit(1);

	// Perform query
	query.find({

		success: function(results) {

			minRow = results[0].get('row');

			console.log("Found min row: " + minRow);

			FindMinCol();
			
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});
}

function FindMinCol() {
	console.log("Finding min col...");
	var generalTable = Parse.Object.extend("generalTable");
	var query = new Parse.Query(generalTable);

	// Set query constraints
	query.ascending("col");
	query.limit(1);

	// Perform query
	query.find({

		success: function(results) {

			minCol = results[0].get('col');

			console.log("Found min col: " + minCol);

			PlotRectangle();
			
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});
}

function PlotRectangle() {

	var maxLat = maxRow * 0.00005 + 35;
	var maxLng = maxCol * 0.00005 - 90;
	var minLat = minRow * 0.00005 + 35
	var minLng = minCol * 0.00005 - 90;

	console.log("Plotting rectangle...");
	console.log("Bounds: (" + maxLat + "," + maxLng + ") --> (" +
		minLat + "," + minLng + ")");


	var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(maxLat, minLng),
      new google.maps.LatLng(minLat, maxLng))
  });
}
