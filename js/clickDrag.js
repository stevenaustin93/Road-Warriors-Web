//click and drag
$(document).ready(function() {
	var clickDragButtonCLICKED = false;
	var queryClicked = false;
	$('#dragbtn').click(function(){ 
		alert("butt");
		clickDragFUNC(clickDragButtonCLICKED);
		if (clickDragButtonCLICKED) this.blur();
		clickDragButtonCLICKED = !clickDragButtonCLICKED;
	})

	$('#dragquery').click(function(){
		queryClicked = true;
		if (queryClicked) this.blur();
		queryClicked = !queryClicked;
	})

}); 


function clickDragFUNC(isClicked){

	var center = map.getCenter();
  	var centLat = center.lat();
  	var centLon = center.lng();
	var bounds = new google.maps.LatLngBounds(  
      new google.maps.LatLng(centLat-0.0125, centLon-0.025),
      new google.maps.LatLng(centLat+0.0125, centLon+0.025)
  	);

  	var gotBounds = new google.maps.LatLngBounds();

	var lat1, long1, lat2, long2 = 0;
	var rectangle = new google.maps.Rectangle({
    	bounds: bounds,
    	strokeColor: '#FF0000',
    	strokeOpacity: 0.8,
    	strokeWeight: 2,
    	fillColor: '#FF0000',
    	fillOpacity: 0.35,
    	draggable: true,
    	editable: true
 	 });
    rectangle.setMap(map);
    google.maps.event.addListener(rectangle, 'bounds_changed',function(event){
       gotBounds = rectangle.getBounds();
       var NE = gotBounds.getNorthEast();
       var SW = gotBounds.getSouthWest();
       var neLat = NE.lat();
       var neLng = NE.lng();
       var swLat = SW.lat();
       var swLNG = SW.lng();
       var marker = new google.maps.Marker({
      	  position: SW
 	   });

    	if(queryClicked==true){
       	//convert latlong bounds to row col
       	//adds marker at lower bound
       	//querry
       	//call info window with query data and marker
       	queryClicked=false;
       	}
    });

}

function LatLongToRowCol(coords) {

	//console.log("[INFO][START] Converting GPS shapepoints to row/col...")

	var row = 0;
	var col = 0;
	var gridSpots = new Array();

	// Loop through array and perform relevant conversion formula on each entry and push to new array
	for (var i = 0; i < coords.length; i++) {

		row = Math.floor((coords[i][0] - 35) / 0.00005);
		col = Math.floor((coords[i][1] + 90) / 0.00005);

		gridSpots.push([row, col]);

		//console.log("[INFO] Converted (" + coords[i][0] + "," + coords[i][1] + ") --> (" +
		//	row + "," + col + ")");

	}

	// Return converted list of row/col pairs
	//console.log("[INFO][END] Finished converting GPS shapepoints to row/col.");
	return (gridSpots);
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