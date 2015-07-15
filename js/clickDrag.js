//
// clickDrag.js
// This file handles the draggable selection box element
//

// Global variables
var rectangle;
var rectInfo = new google.maps.InfoWindow({});


$(document).ready(function() {

	$('#analyzebtn').prop('disabled', true);

	var dragClicked = false;
	$('#dragbtn').click(function() {

		clickDragFunc(dragClicked);
		if (dragClicked) this.blur();
		dragClicked = !dragClicked;

	});



});

//
// Places/removes a draggable selection box to the map
function clickDragFunc(buttonDown) {

	if (!buttonDown) {

		// Place the rectangle in the center of the map
		var center = map.getCenter();
		var centLat = center.lat();
		var centLon = center.lng();
		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(centLat - 0.0125, centLon - 0.025),
			new google.maps.LatLng(centLat + 0.0125, centLon + 0.025)
		);

		//creates box
		rectangle = new google.maps.Rectangle({
			bounds: bounds,
			strokeColor: 'Blue',
			strokeOpacity: 0.7,
			strokeWeight: 2,
			fillColor: '#Blue',
			fillOpacity: 0.1,
			draggable: true,
			editable: true,
			visible: true
		});

		rectangle.setMap(map);

		google.maps.event.addListener(rectangle, 'bounds_changed', function() {
			rectInfo.setMap(null);
		});

		$('#analyzebtn').prop('disabled', false);

		$('#analyzebtn').click(function() {

			$('#analyzebtn').prop('disabled', true);
			$('#analyzebtn').text("Loading...");

			var ne = rectangle.getBounds().getNorthEast();
			var sw = rectangle.getBounds().getSouthWest();

			rectQuery(ne, sw);

		});

	} else {

		rectangle.setMap(null);
		rectInfo.setMap(null);
		$('#analyzebtn').prop('disabled', true);

	}

}

//
// Queries general table for 1000 points of data between the given bounds
function rectQuery(ne, sw) {
	var topLat = ne.lat();
	var topLng = ne.lng();
	var botLat = sw.lat();
	var botLng = sw.lng();

	// Convert to row/col
	var trow = Math.floor((topLat - 35) / 0.00005);
	var tcol = Math.floor((topLng + 90) / 0.00005);
	var brow = Math.floor((botLat - 35) / 0.00005);
	var bcol = Math.floor((botLng + 90) / 0.00005);

	// Determine minimum row and col
	var maxrow;
	var minrow;
	var maxcol;
	var mincol;

	if (trow > brow) {
		maxrow = trow;
		minrow = brow;
	} else {
		maxrow = brow;
		minrow = trow;
	}

	if (tcol > bcol) {
		maxcol = tcol;
		mincol = bcol;
	} else {
		maxcol = bcol;
		mincol = tcol;
	}

	// Get array of query results from server
	// First query for nonzero event entries, then query for only zero entries, to form "pseudo results"
	var allQuerResults = new Array();
	var boxQuery = Parse.Object.extend("generalTable");
	var query = new Parse.Query(boxQuery);

	

	var a1q = new Parse.Query(boxQuery);
	var a2q = new Parse.Query(boxQuery);
	var b1q = new Parse.Query(boxQuery);
	var b2q = new Parse.Query(boxQuery);
	var sq = new Parse.Query(boxQuery);

	a1q.greaterThan("accel1", 0);
	a2q.greaterThan("accel2", 0);
	b1q.greaterThan("brake1", 0);
	b2q.greaterThan("brake2", 0);
	sq.greaterThan("swerve", 0);


	
	query = Parse.Query.or(a1q, a2q, b1q, b2q, sq);

	query.lessThan("row", maxrow);
	query.lessThan("col", maxcol);
	query.greaterThan("row", minrow);
	query.greaterThan("col", mincol);
	

	query.limit(1000);
	query.find({

		success: function(results) {

			allQuerResults = allQuerResults.concat(results);
			console.log("Found " + results.length + " nonzero results");

			var boxQuery2 = Parse.Object.extend("generalTable");
			var query2 = new Parse.Query(boxQuery2);

			query2.lessThan("row", maxrow);
			query2.lessThan("col", maxcol);
			query2.greaterThan("row", minrow);
			query2.greaterThan("col", mincol);
			query2.equalTo("accel1", 0);
			query2.equalTo("accel2", 0);
			query2.equalTo("brake1", 0);
			query2.equalTo("brake2", 0);
			query2.equalTo("swerve", 0);

			query2.limit(1000);
			query2.find({

				success: function(results2) {

					console.log("Found " + results2.length + " zero results");

					allQuerResults = allQuerResults.concat(results2);

					makeRectInfo(allQuerResults);

				},

				error: function(error) {
					alert("Error: " + error.code + " " + error.message);
				}

			});

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});
}

//
// Makes an infowindow 

function makeRectInfo(results) {
	var ne = rectangle.getBounds().getNorthEast();
	var sw = rectangle.getBounds().getSouthWest();

	// Create a list of information for the infowindow
	var numaccels = 0;
	var numswerves = 0;
	var numbrakes = 0;
	var avgcar = 0;
	var avgsafety = 0;

	for (var i = 0; i < results.length; i++) {
		numaccels += results[i].get("accel1");
		numaccels += results[i].get("accel2");
		numbrakes += results[i].get("brake1");
		numbrakes += results[i].get("brake2");
		numswerves += results[i].get("swerve");
		avgcar += results[i].get("cars");
		avgsafety += results[i].get("safety");
	}

	avgcar = avgcar / results.length;
	avgsafety = avgsafety / results.length;

	var message = "";

	message += "<div><h4><b>Area Selection Information</b></h4>";
	message += "<div><b>Bounds: </b> (" + ne.lat().toPrecision(4) + "," + ne.lng().toPrecision(4) + ") to (" +
		sw.lat().toPrecision(4) + "," + sw.lng().toPrecision(4) + ")";
	message += "<div><b>Acceleration Events: </b> " + numaccels;
	message += "<div><b>Swerve Events: </b> " + numswerves;
	message += "<div><b>Braking Events: </b> " + numbrakes;
	//message += "<div><b>Average Car Density: </b> " + avgcar.toPrecision(4);
	message += "<div><b>Average Safety Rating: </b> " + avgsafety.toPrecision(4);

	// Set the info window's content and position.
	rectInfo.setContent(message);
	rectInfo.setPosition(ne);

	rectInfo.open(map);

	$('#analyzebtn').prop('disabled', false);
	$('#analyzebtn').text("Analyze");
	$('#analyzebtn').css('font-weight', 'bold');
}