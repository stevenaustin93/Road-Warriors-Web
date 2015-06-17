//
// loadanomalies.js
// This file handles the checkbox selection display of anomalies on the map
// (.csv file is loaded into a JS array)
//

var BASE_PATH = "C:\\Users\\576879\\Documents\\GitHub\\RoadWarriors\\Road-Warriors-Web"
var CRASH_ICON = BASE_PATH + "\\images\\crash_icon.png";
var SWERVE_ICON = BASE_PATH + "\\images\\swerve_icon.png";
var BREAKING_ICON = BASE_PATH + "\\images\\breaking_icon.png";
var FAST_ACCEL_ICON = BASE_PATH + "\\images\\fast_accel_icon.png";
var GENERAL_ALERT_ICON = BASE_PATH + "\\images\\general_alert.png";

/*
//
// Function to read file data from a server-side file using jquery
function readFile(inputFile) {
    
    // Input variable
	var input;

	// Load content of file into local input var
	jQuery.get(ANOMALIES_FILE, function(data) {
		alert(data);
		input = data;
	});

	// Return input
    return (input);

}
*/

//
// Function to convert .csv input to a useable 2D array
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

//
// Function to create anomaly markers
function placeMarkers() {
	alert

	// Variable Declarations
	var anomaliesArray;
	
	// Get .csv data into 2D array
	anomaliesArray = populateArray();


	// Loop through array and create markers
	for (var i = 0; i < anomaliesArray.length; i++) {
		var marker;
		var markPos;
		var markMap;
		var markIcon;
		var markTitle;

		markPos = new google.maps.LatLng(anomaliesArray[i][0], anomaliesArray[i][1]);

		switch (anomaliesArray[i][2]) {
			case "b":
				markIcon = BREAKING_ICON;
				break;
			case "y":
				markIcon = SWERVE_ICON;
				break;
			case "a":
				markIcon = FAST_ACCEL_ICON;
				break;
			default:
				markIcon = GENERAL_ALERT_ICON;
		}

		markMap = map;

		markTitle = "Anomaly detected here!";

		marker = new google.maps.Marker({
	    	position: 	markPos,
	    	map: 		markMap,
	    	title: 		markTitle,
	    	icon: 		markIcon
	  	});
	}

}
