//
// mapinit.js
// This file initializes the Google Map element of the page
//

var map;
var mapCanvas;
var homePos;
var mapOptions;

function initialize() {
	mapCanvas = document.getElementById('map-canvas');
	homePos = new google.maps.LatLng(42.2813, -83.7483);

	mapOptions = {
    	center: homePos,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    // Actual map variable (local for now - make this global)
    map = new google.maps.Map(mapCanvas, mapOptions);
}

// Add listener to call initialize function once page has loaded
google.maps.event.addDomListener(window, 'load', initialize);