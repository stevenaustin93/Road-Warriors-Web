//click and drag
$(document).ready(function() {
	var clickDragButtonCLICKED = true;
	var queryClicked = false;
	var Clicked =false;
	$('#dragbtn').click(function(){ 
		Clicked =true;
		clickDragFUNC(clickDragButtonCLICKED, Clicked);
		if (clickDragButtonCLICKED) this.blur();
		clickDragButtonCLICKED = !clickDragButtonCLICKED;
	})

	$('#dragquery').click(function(){
		queryClicked = true;
		if (queryClicked) this.blur();
		queryClicked = !queryClicked;
	})


}); 


function clickDragFUNC(isClicked,hasClicked){
	var boundArray = new Array(); //array to hold the lat lng cordinates for the bounds of rectangle
	//code for autoCentering the box selector on the users viewport upon creation
	var center = map.getCenter(); 
  	var centLat = center.lat();
  	var centLon = center.lng();
	var bounds = new google.maps.LatLngBounds(  
      new google.maps.LatLng(centLat-0.0125, centLon-0.025),
      new google.maps.LatLng(centLat+0.0125, centLon+0.025)
  	);
	//variable to hold the bounds once user starts editing the box
  	var gotBounds = new google.maps.LatLngBounds();
  	//creates box
	var rectangle = new google.maps.Rectangle({
    	bounds: bounds,
    	strokeColor: '#FF0000',
    	strokeOpacity: 0.8,
    	strokeWeight: 2,
    	fillColor: '#FF0000',
    	fillOpacity: 0.35,
    	draggable: false,
    	editable: true
 	 });
	if(isClicked==true){
		    rectangle.setMap(map);
	}
	else
		    rectangle.setMap(null);

    //listens for the bounds to be changed, once they are then it will...
    google.maps.event.addListener(rectangle, 'bounds_changed',function(event){
       gotBounds = rectangle.getBounds(); //get the bounds
       var NE = gotBounds.getNorthEast(); //get the north east coordinates
       var SW = gotBounds.getSouthWest(); //get the south west coordinates
       var neLat = NE.lat(); //get lat of north east coord
       var neLng = NE.lng(); //get lng of north east coord
       var swLat = SW.lat(); //get lat of south west coord
       var swLNG = SW.lng(); //get lng of south west coord
       boundArray.push([neLat, neLng], [swLat, swLng]); //adds the lat and lng coords to the bounds array
       var infoMarker = new google.maps.Marker({ //makes a marker for the info window at the south western coordinate
      	  position: SW
 	   });

    	if(queryClicked==true){ //if the user has clicked the query button then it will...
       	//querry
       	makeInfo(queryData,infoMarker); //make and infor window and display the data
       	queryClicked=false; //turn off the query button
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