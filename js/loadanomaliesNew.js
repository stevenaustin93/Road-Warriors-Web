//THIS CODE IS WORKING

//
// loadanomalies.js
// This (thoroughly revamped) script handles the checkbox input of anomalies on the map
//

// Icon paths:
var CRASH_ICON = "images/crash_icon.png";
var SWERVE_ICON = "images/swerve_icon.png";
var BRAKING_ICON = "images/braking_icon.png";
var FAST_ACCEL_ICON = "images/fast_accel_icon.png";
var GENERAL_ALERT_ICON = "images/general_alert.png";

// Global variables
var anomalyList; 	// list of all anomalies queried from server
var infowindow; 	// moving infowindow that follows marker click
var crashArray = new Array(); // array of crash markers


//
// On document ready
$(document).ready(function() {

	// Query server for list of all anomalies
	PopulateAnomalyArray();

});

//
// Queries server for list 
function PopulateAnomalyArray() {

	anomalyList = new Array();

	// Get array of query results from server
	var realAnomalies = Parse.Object.extend("superTable");
	var query = new Parse.Query(realAnomalies);

	query.limit(200);
	query.find({

		success: function(results) {
			// Add results of anomaly query to our list of anomalies
			anomalyList = anomalyList.concat(results);

			// Setup our action listeners
			SetupListeners();
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

}

// Function to be called that sets up listeners for stuff
function AnomalyQueryCallback(anomaliesArray) {

	// Create and populate array for each type of marker
	var swerveArray = new Array();
	var rapidAccelArray = new Array();
	var rapidDecelArray = new Array();
	var crashArray = new Array();


	// Loop through anomaliesArray and create a marker in respective arrays
	for (var i = 0; i < anomaliesArray.length; i++) {
		//GPS Position
		var markPos = new google.maps.LatLng(anomaliesArray[i][0], anomaliesArray[i][1]);

		// Set icon and title (label) accordingly
		switch (anomaliesArray[i][2]) {

			case "S":
				markIcon = SWERVE_ICON;
				markTitle = "Swerving event detected here!";
				markName = "<b>Swerving Event.</b>"
				break;
			case "A1":
				markIcon = FAST_ACCEL_ICON
				markTitle = "Fast acceleration event detected here!"
				markName = "<b>Class 1 Acceleration Event.</b>";
				break;
			case "A2":
				markIcon = FAST_ACCEL_ICON;
				markTitle = "Acceleration event detected here!";
				markName = "<b>Class 2 Acceleration Event.</b>";
				break;
			case "B1":
				markIcon = BRAKING_ICON;
				markTitle = "Rapid braking event detected here!";
				markName = "<b>Class 1 Braking Event.</b>";
				break;
			case "B2":
				markIcon = BRAKING_ICON;
				markTitle = "Braking event detected here!";
				markName = "<b>Class 2 Braking Event.</b>";
				break;
			case "C":
				markIcon = CRASH_ICON;
				markTitle = "Accident detected here!";
				markName = "<b>Accident.</b>";
				break;
			default:
				// Do nothing on default case
		}
		// Create the marker
		var marker = new google.maps.Marker({
			position: markPos,
			title: markTitle,
			icon: markIcon,
		});

		//When the user clicks on a marker, an infowindow appears that details the type of anomaly and the exact location (Lat/Lng). 

		var message = markName.toString() + '<div>' + "<b>Location:</b>" + " " + markPos.toString();
		//To post FileID as well, add:' + "<div>" + "<b>File ID:</b>" + " " + anomaliesArray[i][3]'

		//Initialize array of infowindows 
		var infoWindowsArray = new Array();

		function addInfoWindow(marker, message) {
			//initialize infowindow
			var infoWindow = new google.maps.InfoWindow({
				content: message
			});
			//add a listener for the infowindow (click)
			new google.maps.event.addListener(marker, 'click', function(event) {
				infoWindow.open(map, this);
				infoWindowsArray.push(infoWindow);
			});

			for (var i = 0; i < infoWindows.length; i++) {
				infoWindowsArray[i].setMap(map);
				if (infoWindowsArray[i] != this) {
					infoWindowsArray[i].close();
				}
			}

			/*function clearOldWindow(marker) {
				for (var i = 0; i < infoWindows.length; i++){
					new google.maps.event.addListener(marker, 'click', function(event){
					infowWindowsArray[i].setMap(null);
					})
				}
			}*/
		}
		addInfoWindow(marker, message);

		// Add the marker to respective array
		switch (anomaliesArray[i][2]) {
			case "S":
				swerveArray.push(marker);
				break;
			case "A1":
				rapidAccelArray.push(marker);
				break;
			case "A2":
				//rapidAccelArray.push(marker);
				break;
			case "B1":
				rapidDecelArray.push(marker);
				break;
			case "B2":
				//rapidDecelArray.push(marker);
				break;
			case "C":
				crashArray.push(marker);
				break;
			default:
				// Do nothing on default case
		}
	}
}

//
// Sets up listeners for 
function SetupListeners() {

	// Swerve checkbox event handler
	var swerveClicked = false;
	$('#swerve').click(function() {
		if (swerveClicked) {
			swerveClicked = false;
			for (var i = 0; i < swerveArray.length; i++) {
				swerveArray[i].setMap(null);
			}
			this.blur();
		} else {
			swerveClicked = true;
			for (var i = 0; i < swerveArray.length; i++) {
				swerveArray[i].setMap(map);
			}
		}

	});

	// Rapid decel checkbox event handler
	var decelClicked = false;
	$('#rapidDecel').click(function() {
		if (decelClicked) {
			decelClicked = false;
			for (var i = 0; i < rapidDecelArray.length; i++) {
				rapidDecelArray[i].setMap(null);
			}
			this.blur();
		} else {
			decelClicked = true;
			for (var i = 0; i < rapidDecelArray.length; i++) {
				rapidDecelArray[i].setMap(map);
			}
		}
	});

	// Rapid accel checkbox event handler
	var accelClicked = false;
	$('#rapidAccel').click(function() {
		if (accelClicked) {
			accelClicked = false;
			for (var i = 0; i < rapidAccelArray.length; i++) {
				rapidAccelArray[i].setMap(null);
			}
			this.blur();
		} else {
			accelClicked = true;
			for (var i = 0; i < rapidAccelArray.length; i++) {
				rapidAccelArray[i].setMap(map);
			}
		}
	});

	// Crash checkbox event handler
	var crashClicked = false;
	$('#crash').click(function() {
		CrashFunc(crashClicked);
		if (crashClicked) this.blur();
		crashClicked = !crashClicked;
	});
}

/**
 * On click of the swerve button,
 * run through the list of anomalies,
 * plot the swerves if the button clicked,
 * or remove the icons if the button is unclicked
 */
function CrashFunc(buttonDown) {

	var crashArray = new Array();

	// If the swerve button is not clicked
	if (!(buttonDown)) {

		for (var i = 0; i < anomalyList.length; i++) {
			if (anomalyList[i].get('class') === "C") {

				var markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				alert("position: " + anomalyList[i].get('Latitude') + "," + anomalyList[i].get('Longitude'))
				var marker = new google.maps.Marker({
					markPos: markPos,
					markIcon: CRASH_ICON,
					markTitle: "Accident detected here!",
					markName: "<b>Accident.</b>"
				});

				var message = "<b>Accident.</b>" + '<div>' + "<b>Location:</b>" + " " + markPos.toString();

				new google.maps.event.addListener(marker, 'click', function(event) {
					infowindow.setContent(message);
					infowindow.open(map, marker);
				});

				crashArray.push(marker);

				//marker.setMap(map);
			}
		}

		for (var i = 0; i < crashArray.length; i++) {
			crashArray[i].setMap(map);
		}

	}

	else {
		for (var i = 0; i < crashArray.length; i++) {
			crashArray[i].setMap(null);
		}
	}
}


