//
// loadanomalies.js
// This (revamped) script handles the checkbox input of anomalies on the map
//

// MOST RECENT EDITS

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

// Set icon and title (label) accordingly
		switch (anomaliesArray[i][2]) {
			
			case "S":
				markIcon = SWERVE_ICON;
				markTitle = "Swerving event detected here!";
				markName = "<b>Swerving Event.</b>" 
				break;
			case "A1":
				markName = "<b>Class 1 Acceleration Event.</b>";
			case "A2":
				markIcon = FAST_ACCEL_ICON;
				markTitle = "Fast acceleration event detected here!";
				markName = "<b>Class 2 Acceleration Event.</b>";
				break;
			case "B1":
				markName = "<b>Class 1 Braking Event.</b>";
			case "B2":
				markIcon = BRAKING_ICON;
				markTitle = "Rapid braking event detected here!";
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
		// Add the marker to respective array
		switch (anomaliesArray[i][2]) {
			case "S":
				swerveArray.push(marker);
				break;
			case "A1":
			case "A2":
				rapidAccelArray.push(marker);
				break;
			case "B1":
			case "B2":
				rapidDecelArray.push(marker);
				break;		
			case "C":
				crashArray.push(marker);
				break;
			default:
				// Do nothing on default case
		}
	}

	function initialize() { 
		for (var i = 0; i < anomaliesArray.length; i++) {
		//GPS Position
			var markPos = new google.maps.LatLng(anomaliesArray[i][0], anomaliesArray[i][1]);
		var myOptions = {
				zoom: 12,
				center: new google.maps.LatLng(anomaliesArray[i][0], anomaliesArray[i][1]),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false
			}
		//create map
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		//create marker object
		var marker = new google.maps.Marker({
			position: markPos,
			title: markTitle,
			icon: markIcon,
			draggable: true
			});

		function addInfoWindow(marker, message) {

			//create a variable 'contentString' to hold content of infowindow
			var contentString = '<div id = "content" style = "width:200px;height:200px;"></div">';

			//initialize infowindow
			var infoWindow = new google.maps.InfoWindow({
				content: contentString
			});
			
			//add a listener for the infowindow (click)
			new google.maps.event.addListener(marker, 'click', function () {
				infoWindow.open(map, this);
			});

			var pano = null;
			google.maps.event.addListener(infowindow, 'domready', function() {
			if(pano != null){
				pano.unbind("position");
				pano.setVisible(false);
			}
			pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
				navigationControl: true,
				navigationControlOptions: {style: google.maps.NavigationControlStyle.ANDROID},
				enableCloseButtion: false,
				addressControl: false,
				linksControl: false
			});
			google.maps.event.addListener(infowindow, 'closeclick', function() {
				pana.unbind("position");
				pano.setVisible(false);
				pano = null;
			});
		})
		addInfoWindow(marker, contentString); 
		}
	}
	
	}
//When the user clicks on a marker, an infowindow appears that details the type of anomaly and the exact location (Lat/Lng). 
		/*var message = '<div>Porcelain Factory of Vista Alegre</div>' +
                      '<div>History</div>' +
                      '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
                      '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                      '<div class="iw-subTitle">Contacts</div>' +
                      '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
                      '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';*/


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
