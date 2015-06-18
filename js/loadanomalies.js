//
// loadanomalies.js
// This (revamped) script handles the checkbox input of anomalies on the map
//

// Icon paths:
var BASE_PATH = "C:\\Users\\576879\\Documents\\GitHub\\RoadWarriors\\Road-Warriors-Web"
var CRASH_ICON = BASE_PATH + "\\images\\crash_icon.png";
var SWERVE_ICON = BASE_PATH + "\\images\\swerve_icon.png";
var BREAKING_ICON = BASE_PATH + "\\images\\breaking_icon.png";
var FAST_ACCEL_ICON = BASE_PATH + "\\images\\fast_accel_icon.png";
var GENERAL_ALERT_ICON = BASE_PATH + "\\images\\general_alert.png";

// On document ready
$(document).ready(function() {
	// The DOM is ready

	// Load .csv data into array
	var anomaliesArray = populateArray();

	// Create and populate array for each type of marker
	var swerveArray = new Array();
	var rapidDecelArray = new Array();
	var rapidAccelArray = new Array();
	var generalArray = new Array();


	// Loop through anomaliesArray and create a marker in respective arrays
	for (var i = 0; i < anomaliesArray.length; i++) {

		// GPS Position
		var markPos = new google.maps.LatLng(anomaliesArray[i][0], anomaliesArray[i][1]);

		// Set icon and title (label) accordingly
		switch (anomaliesArray[i][2]) {
			case "b":
				markIcon = BREAKING_ICON;
				markTitle = "Rapid breaking event detected here!";
				break;
			case "y":
				markIcon = SWERVE_ICON;
				markTitle = "Swerving event detected here!";
				break;
			case "a":
				markIcon = FAST_ACCEL_ICON;
				markTitle = "Fast acceleration event detected here!";
				break;
			default:
				markIcon = GENERAL_ALERT_ICON;
				markTitle = "General anomaly detected here!";
		}

		// Create the marker
		var marker = new google.maps.Marker({
	    	position: 	markPos,
	    	title: 		markTitle,
	    	icon: 		markIcon
	  	});

		// Add the marker to respective array
	  	switch (anomaliesArray[i][2]) {
	  		case "b":
				rapidDecelArray.push(marker);
				break;
			case "y":
				swerveArray.push(marker);
				break;
			case "a":
				rapidAccelArray.push(marker);
				break;
			default:
				generalArray.push(marker);
	  	}
	}

	// Swerve checkbox event handler
	$('#swerve').click(function() {
		for (var i = 0; i < swerveArray.length; i++) {
			if(document.getElementById('swerve').checked){
				swerveArray[i].setMap(map);
			}
			else {
				swerveArray[i].setMap(null);
			}
		}
	});

	// Rapid decel checkbox event handler
	$('#rapidDecel').click(function() {
		for (var i = 0; i < rapidDecelArray.length; i++) {
			if(document.getElementById('rapidDecel').checked){
				rapidDecelArray[i].setMap(map);
			}
			else {
				rapidDecelArray[i].setMap(null);
			}
		}
	});

	// Rapid accel checkbox event handler
	$('#rapidAccel').click(function() {
		for (var i = 0; i < rapidAccelArray.length; i++) {
			if(document.getElementById('rapidAccel').checked){
				rapidAccelArray[i].setMap(map);
			}
			else {
				rapidAccelArray[i].setMap(null);
			}
		}
	});

	// General anomaly checkbox event handler
	$('#general').click(function() {
		for (var i = 0; i < generalArray.length; i++) {
			if(document.getElementById('general').checked){
				generalArray[i].setMap(map);
			}
			else {
				generalArray[i].setMap(null);
			}
		}
	});

	// Clear map event handler
	$('#clearMap').click( function() {
		for (var i = 0; i < swerveArray.length; i++) {
			swerveArray[i].setMap(null);
		}
		for (var i = 0; i < rapidDecelArray.length; i++) {
			rapidDecelArray[i].setMap(null);
		}
		for (var i = 0; i < rapidAccelArray.length; i++) {
			rapidAccelArray[i].setMap(null);
		}
		for (var i = 0; i < generalArray.length; i++) {
			generalArray[i].setMap(null);
		}

		$('.chckbx').each(function() {
			this.checked = false;
		});

	})

});

function populateArray() {

	// Variable Declarations
	var anomaliesArr;	// 2D array of lat,long,type for each anomaly detected
	var input;			// .csv input

	// Get data input from the anomalies csv
	//input = readFile(ANOMALIES_FILE);
	input = "42.18133163,-83.93299103,b\n42.43674088,-83.88913727,b\n42.28501892,-83.74581146,b\n42.23044968,-83.69557953,y\n42.2589798,-83.708992,y\n42.2589798,-83.70900726,y";

	// Convert that csv to an array
	anomaliesArr = $.csv.toArrays(input);

	// Return the array of information
	return(anomaliesArr);
}
