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
var anomalyList; // list of all anomalies queried from server
var accidentList; // list of accidents queried from server
var infowindow = new google.maps.InfoWindow({});; // moving infowindow that follows marker click


//
// Wait for document ready
$(document).ready(function() {

	// Query server for list of all anomalies
	populateAnomalyArray();
	populateAccidentArray();

});

//
// Queries server for list of anomalies and appends to global array 'anomalyList'
function populateAnomalyArray() {

	anomalyList = new Array();

	// Get array of query results from server
	var realAnomalies = Parse.Object.extend("superTable");
	var query = new Parse.Query(realAnomalies);

	query.limit(200);
	query.find({

		success: function(results) {

			// Add results of anomaly query to our list of anomalies
			anomalyList.length = 0; // reset list
			anomalyList = anomalyList.concat(results);

			// Setup our action listeners
			setupListeners();
		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

}

//
// Queries server for list of anomalies and appends to global array 'anomalyList'
function populateAccidentArray() {

	accidentList = new Array();

	// Get array of query results from server
	var accidents = Parse.Object.extend("accidents_1000");
	var query = new Parse.Query(accidents);

	query.descending("Index");
	query.limit(20);
	query.find({

		success: function(results) {

			// Add results of anomaly query to our list of anomalies
			accidentList.length = 0; // reset list
			accidentList = accidentList.concat(results);

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

}

//
// Sets up listeners for button clicks
function setupListeners() {

	// Swerve button event handler
	var swerveClicked = false;
	$('#swerve').click(function() {
		swerveFunc(swerveClicked);
		if (swerveClicked) this.blur(); // remove button focus on unclick
		swerveClicked = !swerveClicked;
	});

	// Rapid decel button event handler
	var decelClicked = false;
	$('#rapidDecel').click(function() {
		decelFunc(decelClicked);
		if (decelClicked) this.blur();
		decelClicked = !decelClicked;
	});

	// Rapid accel button event handler
	var accelClicked = false;
	$('#rapidAccel').click(function() {
		accelFunc(accelClicked);
		if (accelClicked) this.blur();
		accelClicked = !accelClicked;
	});

	// Crash button event handler
	var crashClicked = false;
	$('#crash').click(function() {
		crashFunc(crashClicked);
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

function crashFunc(buttonDown) {

	// If the crash button is not already clicked, create icons for each marker and give them pop-up infowindows
	if (!buttonDown) {

		crashArray.length = 0;

		for (var i = 0; i < accidentList.length; i++) {

			// Create marker
			var markPos;
			var markIcon;
			var markTitle;
			var marker;

			markPos = new google.maps.LatLng(accidentList[i].get('Lat'), accidentList[i].get('Lng'));
			markIcon = CRASH_ICON;
			markTitle = "Accident detected here!";
			marker = new google.maps.Marker({
				position: markPos,
				icon: markIcon,
				title: markTitle
			});


			// Generate infowindow message
			var infotitle;
			var infoangle;
			var infodate;
			var infoinjury;
			var inforoadcond;
			var infoweather;
			var info;

			infotitle = "<div><h4><b>Accident</h4></b>";
			infoangle = "<div><b>Angle: </b>" + accidentList[i].get('Angle');
			infodate = "<div><b>Date - Time: </b>" + accidentList[i].get('Date') + " - " + accidentList[i].get('Time');
			infoinjury = "<div><b>Injury: </b>" + accidentList[i].get('Injury');
			inforoadcond = "<div><b>Road Condition: </b>" + accidentList[i].get('RoadCond');
			infoweather = "<div><b>Weather: </b>" + accidentList[i].get('Weather');

			info = {
				title: infotitle,
				loc: [],
				angle: infoangle,
				date: infodate,
				injury: infoinjury,
				roadcond: inforoadcond,
				weather: infoweather
			};

			marker.information = info;


			// Attach infowindow to marker and show on click
			new google.maps.event.addListener(marker, 'click', function() {
				makeInfo(this, this.information);
			});
			crashArray.push(marker);
		}

		// Place all the markers on the map
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

function swerveFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if (!buttonDown) {

		swerveArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if (anomalyList[i].get('class') === "S") {

				// Make icon marker
				var markPos;
				var markIcon;
				var markTitle;
				var marker;

				markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				markIcon = SWERVE_ICON;
				markTitle = "Swerve event detected here!";
				marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});


				// Generate infowindow content
				var infotitle;
				var infospd;
				var infotime;
				var infoyaw;
				var info;

				infotitle = "<div><h4><b>Swerve Event</h4></b>";
				infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime') / 1000);
				date.setFullYear(date.getFullYear() + 34);
				infotime = "<div><b>Time: </b>" + date.toString();
				infoyaw = "<div><b>Yaw Rate: </b>" + anomalyList[i].get("Yawrate").toPrecision(4) + " deg/sec";
				info = {
					title: infotitle,
					loc: [],
					speed: infospd,
					date: infotime,
					yaw: infoyaw
				};

				marker.information = info;


				// Attach infowindow to click of marker
				new google.maps.event.addListener(marker, 'click', function() {
					makeInfo(this, this.information);
				});

				swerveArray.push(marker);
			}
		}

		// Place all the markers on the map
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

function decelFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if (!buttonDown) {

		decelArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if ((anomalyList[i].get('class') === "B1") || (anomalyList[i].get('class') === "B2")) {

				// Create marker icon
				var markPos;
				var markIcon;
				var markTitle;
				var marker;

				markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				markIcon = BRAKING_ICON;
				markTitle = "Braking event detected here!";
				marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});


				// Generate infowindow content
				var infotitle;
				var infospd;
				var infotime;
				var infointensity;
				var info;

				if (anomalyList[i].get('class') === "B1") {
					infotitle = "<div><h4><b>Class 1 Braking Event</b></h4>"
				} else {
					infotitle = "<div><h4><b>Class 2 Braking Event</b></h4>"
				}
				infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime') / 1000);
				date.setFullYear(date.getFullYear() + 34);
				infotime = "<div><b>Time: </b>" + date.toString();
				infointensity = "<div><b>Intensity: </b>" + (anomalyList[i].get('Ax') / 9.8).toPrecision(4) + " G";
				info = {
					title: infotitle,
					loc: [],
					speed: infospd,
					date: infotime,
					intensity: infointensity
				};

				marker.information = info;


				// Attach infowindow to marker and show on click
				new google.maps.event.addListener(marker, 'click', function() {
					makeInfo(this, this.information);
				});

				decelArray.push(marker);
			}
		}

		// Place all the markers on the map
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

function accelFunc(buttonDown) {

	// If the swerve button is not already clicked, create icons for each marker and give them pop-up infowindows
	if (!buttonDown) {

		accelArray.length = 0;

		for (var i = 0; i < anomalyList.length; i++) {
			if ((anomalyList[i].get('class') === "A1") || (anomalyList[i].get('class') === "A2")) {

				// Create a marker icon
				var markPos;
				var markIcon;
				var markTitle;
				var marker;

				markPos = new google.maps.LatLng(anomalyList[i].get('Latitude'), anomalyList[i].get('Longitude'));
				markIcon = FAST_ACCEL_ICON;
				markTitle = "Acceleration event detected here!";
				marker = new google.maps.Marker({
					position: markPos,
					icon: markIcon,
					title: markTitle
				});


				// Generate infowindow message
				var infotitle;
				var infospd;
				var infotime;
				var infointensity;
				var info;

				if (anomalyList[i].get('class') === "A1") {
					infotitle = "<div><h4><b>Class 1 Acceleration Event</b></h4>"
				} else {
					infotitle = "<div><h4><b>Class 2 Acceleration Event</b></h4>"
				}
				infospd = "<div><b>Speed: </b>" + anomalyList[i].get('Speed').toPrecision(4) + " m/s";
				var date = new Date(anomalyList[i].get('Gentime') / 1000);
				date.setFullYear(date.getFullYear() + 34);
				infotime = "<div><b>Time: </b>" + date.toString();
				infointensity = "<div><b>Intensity: </b>" + (anomalyList[i].get('Ax') / 9.8).toPrecision(4) + " G";
				info = {
					title: infotitle,
					loc: [],
					speed: infospd,
					date: infotime,
					intensity: infointensity
				};

				marker.information = info;


				// Attach infowindow to marker and show on click
				new google.maps.event.addListener(marker, 'click', function() {
					makeInfo(this, this.information);
				});

				accelArray.push(marker);
			}
		}

		// Place all the markers on the map
		for (var i = 0; i < accelArray.length; i++) {
			accelArray[i].setMap(map);
		}


	} else { // Else if the button is already clicked, hide all the anomaly icons
		for (var i = 0; i < accelArray.length; i++) {
			accelArray[i].setMap(null);
		}
	}
}

//
// Makes an infowindow given an 'info' object containing relevant information
function makeInfo(marker, info) {

	// reverse geocode the lat/lng to get address then populate the infowindow
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
			'latLng': marker.position
		},
		function(results, status) {

			info.loc = "<div><b>Location: </b>" + results[1].formatted_address;

			var message = "";

			// iterate through the info object and generate message
			for (prop in info) {
				if (!info.hasOwnProperty(prop)) {
					continue;
				}
				message += info[prop];
			}

			// make an infowindow
			infowindow.setContent(message);
			infowindow.open(map, marker);

		});

}