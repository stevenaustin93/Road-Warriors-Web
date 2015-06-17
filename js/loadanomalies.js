//
// loadanomalies.js
// This file handles the checkbox selection display of anomalies on the map
// (.csv file is loaded into a JS array)
//

var BASE_PATH = "C:\\Users\\576879\\Documents\\GitHub\\RoadWarriors\\Road-Warriors-Web"
var CRASH_ICON = BASE_PATH + "\\images\\crash_icon.png";
var SWERVE_ICON = BASE_PATH + "\\images\\swerve_icon.png";

//
// Function to take data from .csv file into an input
function readCSVFile() {
	
}

//
// Function to convert .csv input to a useable 2D array
function populateArray() {

	//var reader = new FileReader();
    //var data = reader.readAsText("../csv/anomalies.csv");

	// Variable Declarations
	var anomaliesArr;	// 2D array of lat,long,type for each anomaly detected
	var input;			// .csv input

	// Sample input .csv
	input = "Lat,Long,Identifier\n42.25,-83.7,1\n42.255,-83.75,1\n42.252,-83.72,1\n42.215,-83.76,2\n42.252,-83.67,2\n42.235,-83.57,2\n42.245,-83.597,3\n42.285,-83.798,3\n42.265,-83.77,3";

	// Use jquery-csv to populate "anomaliesArr" with 
	anomaliesArr = $.csv.toArrays(input);

	// Return the array of information
	return(anomaliesArr);
}

//
// Function to create anomaly markers
function placeMarkers() {

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
			case "1":
				markIcon = CRASH_ICON;
				break;
			case "2":
				markIcon = SWERVE_ICON;
				break;
			default:
				markIcon = SWERVE_ICON;
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
