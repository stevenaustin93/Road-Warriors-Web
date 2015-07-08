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
var infowindow = new google.maps.InfoWindow({});;		// moving infowindow that follows marker click


//
// Wait for document ready
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

//
// Sets up listeners for button clicks
function SetupListeners() {

	// Swerve checkbox event handler
	var swerveClicked = false;
	$('#swerve').click(function() {
		SwerveFunc(swerveClicked);
		if (swerveClicked) this.blur();
		swerveClicked = !swerveClicked;
	});

	// Rapid decel checkbox event handler
	var decelClicked = false;
	$('#rapidDecel').click(function() {
		DecelFunc(decelClicked);
		if (decelClicked) this.blur();
		decelClicked = !decelClicked;
	});

	// Rapid accel checkbox event handler
	var accelClicked = false;
	$('#rapidAccel').click(function() {
		AccelFunc(accelClicked);
		if (accelClicked) this.blur();
		accelClicked = !accelClicked;
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
 * On click of the crash button,
 * run through the list of anomalies,
 * plot the crashes if the button clicked,
 * or remove the icons if the button is unclicked
 */
var crashArray = new Array();
function CrashFunc(buttonDown) {

	// If the crash button is not already clicked, create icons for each marker and give them pop-up infowindows
	if ( !buttonDown ) {

		crashArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if (anomalyList[i].get('class') === "C") {

				var markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				var markIcon = CRASH_ICON;
				var markTitle = "Accident detected here!";

				var marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});

				var infotitle = "<div><b>Accident</b>";
				var infoloc = "<div><b>Location: </b>" + markPos.toString();

				var message = infotitle + infoloc;

				marker.message = message;

				new google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(this.message);
					infowindow.open(map, this);
				});

				crashArray.push(marker);
			}
		}

		
		for (var i = 0; i < crashArray.length; i++) {
			crashArray[i].setMap(map);
		}
		

	} else { // Else if the button is already clicked, hide all the anomaly icons
		for (var i = 0; i < crashArray.length; i++) {
			crashArray[i].setMap(null);
		}
	}
}

/**
 * On click of the swerve button,
 * run through the list of anomalies,
 * plot the swerves if the button clicked,
 * or remove the icons if the button is unclicked
 */
var swerveArray = new Array();
function SwerveFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if ( !buttonDown ) {

		swerveArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if (anomalyList[i].get('class') === "S") {

				var markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				var markIcon = SWERVE_ICON;
				var markTitle = "Swerve event detected here!";

				var marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});

				var infotitle = "<div><b>Swerve</b>";
				var infoloc = "<div><b>Location: </b>" + markPos.toString();
				var infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime')/1000);
				date.setFullYear(date.getFullYear() + 34);
				var infotime = "<div><b>Time: </b>" + date.toString();
				var infoyaw = "<div><b>Yaw Rate: </b>" + anomalyList[i].get("Yawrate").toPrecision(4) + " deg/sec";

				var message = infotitle + infoloc + infospd + infotime + infoyaw;

				marker.message = message;

				new google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(this.message);
					infowindow.open(map, this);
				});

				swerveArray.push(marker);
			}
		}

		
		for (var i = 0; i < swerveArray.length; i++) {
			swerveArray[i].setMap(map);
		}
		

	} else { // Else if the button is already clicked, hide all the anomaly icons
		for (var i = 0; i < swerveArray.length; i++) {
			swerveArray[i].setMap(null);
		}
	}
}


/**
 * On click of the rapid decel button,
 * run through the list of anomalies,
 * plot the rapid decels if the button clicked,
 * or remove the icons if the button is unclicked
 */
var decelArray = new Array();
function DecelFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if ( !buttonDown ) {

		decelArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if ( (anomalyList[i].get('class') === "B1") || (anomalyList[i].get('class') === "B2") ) {

				var markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				var markIcon = BRAKING_ICON;
				var markTitle = "Braking event detected here!";

				var marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});

				var infotitle;
				if (anomalyList[i].get('class') === "B1") {
					infotitle = "<div><b>Class 1 Braking Event</b>"
				} else {
					infotitle = "<div><b>Class 2 Braking Event</b>"
				}

				var infoloc = "<div><b>Location: </b>" + markPos.toString();
				var infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime')/1000);
				date.setFullYear(date.getFullYear() + 34);
				var infotime = "<div><b>Time: </b>" + date.toString();
				var infointensity = "<div><b>Intensity: </b>" + (anomalyList[i].get('Ax')/9.8).toPrecision(4) + " G";

				var message = infotitle + infoloc + infospd + infotime + infointensity;

				marker.message = message;

				new google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(this.message);
					infowindow.open(map, this);
				});

				decelArray.push(marker);
			}
		}

		
		for (var i = 0; i < decelArray.length; i++) {
			decelArray[i].setMap(map);
		}
		

	} else { // Else if the button is already clicked, hide all the anomaly icons
		for (var i = 0; i < decelArray.length; i++) {
			decelArray[i].setMap(null);
		}
	}
}

/**
 * On click of the rapid accel button,
 * run through the list of anomalies,
 * plot the rapid accels if the button clicked,
 * or remove the icons if the button is unclicked
 */
var accelArray = new Array();
function AccelFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if ( !buttonDown ) {

		accelArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if ( (anomalyList[i].get('class') === "A1") || (anomalyList[i].get('class') === "A2") ) {

				var markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				var markIcon = FAST_ACCEL_ICON;
				var markTitle = "Acceleration event detected here!";

				var marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});

				var infotitle;
				if (anomalyList[i].get('class') === "A1") {
					infotitle = "<div><b>Class 1 Acceleration Event</b>"
				} else {
					infotitle = "<div><b>Class 2 Acceleration Event</b>"
				}

				var infoloc = "<div><b>Location: </b>" + markPos.toString();
				var infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime')/1000);
				date.setFullYear(date.getFullYear() + 34);
				var infotime = "<div><b>Time: </b>" + date.toString();
				var infointensity = "<div><b>Intensity: </b>" + (anomalyList[i].get('Ax')/9.8).toPrecision(4) + " G";

				var message = infotitle + infoloc + infospd + infotime + infointensity;

				marker.message = message;

				new google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(this.message);
					infowindow.open(map, this);
				});

				accelArray.push(marker);
			}
		}

		
		for (var i = 0; i < accelArray.length; i++) {
			accelArray[i].setMap(map);
		}
		

	} else { // Else if the button is already clicked, hide all the anomaly icons
		for (var i = 0; i < accelArray.length; i++) {
			accelArray[i].setMap(null);
		}
	}
}