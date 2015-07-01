//THIS CODE IS WORKING

//
// loadanomalies.js
// This (revamped) script handles the checkbox input of anomalies on the map
//

// Icon paths:
var CRASH_ICON = "images/crash_icon.png";
var SWERVE_ICON = "images/swerve_icon.png";
var BRAKING_ICON = "images/braking_icon.png";
var FAST_ACCEL_ICON = "images/fast_accel_icon.png";
var GENERAL_ALERT_ICON = "images/general_alert.png";


// On document ready
$(document).ready(function() {

	// Get array of query results from server
	var realAnomalies = Parse.Object.extend("superTable");
	var query = new Parse.Query(realAnomalies);

	query.limit(200);
	query.find({

		success: function(results) {

			// Formatted "return" array (actually pushed forward)
			var anomaliesArray = new Array();


			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				anomaliesArray.push([object.get('Latitude'), object.get('Longitude'), object.get('class'), object.get('FileId')]);
			}

			AnomalyQueryCallback(anomaliesArray);
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

});

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
			}

			function clearOldWindow(marker) {
				for (var i = 0; i < infoWindows.length; i++){
					new google.maps.event.addListener(marker, 'click', function(event){
					infowWindowsArray[i].setMap(null);
					})
				}
			}
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

	// Swerve checkbox event handler
	var swerveClicked = false;
	$('#swerve').click(function() {
		if (swerveClicked) {
			swerveClicked = false;
			for (var i = 0; i < swerveArray.length; i++) {
				swerveArray[i].setMap(null);
			}
			this.blur();
		}
		else {
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
		}
		else {
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
		}
		else {
			accelClicked = true;
			for (var i = 0; i < rapidAccelArray.length; i++) {
				rapidAccelArray[i].setMap(map);
			}
		}
	});

	// Crash checkbox event handler
	var crashClicked = false;
	$('#crash').click(function() {
		if (crashClicked) {
			crashClicked = false;
			for (var i = 0; i < crashArray.length; i++) {
				crashArray[i].setMap(null);
			}
			this.blur();
		}
		else {
			crashClicked = true;
			for (var i = 0; i < crashArray.length; i++) {
				crashArray[i].setMap(map);
			}
		}
	});

	// Clear map event handler
	$('#clearMap').click(function() {
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
}
