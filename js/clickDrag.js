//click and drag
$(document).ready(function() {
	var clickDragButtonCLICKED = false;
	var queryClicked = false;
	$('#clkDrg').click(function(){ //assuming my buttons name is #clkDrg
		clickDragFUNC(clickDragButtonCLICKED);
		if (clickDragButtonCLICKED) this.blur();
		clickDragButtonCLICKED = !clickDragButtonCLICKED;
	})

	$('#query').click(function(){
		queryClicked = true;
		if (queryClicked) this.blur();
		queryClicked = !queryClicked;
	})

}); 


function clickDragFUNC(isClicked){

	var bounds = new google.maps.LatLngBounds(  ///needs to be changed so it auto sets itself in the users viewport
      new google.maps.LatLng(51.41859298, 0.089179345),
      new google.maps.LatLng(51.45, 0.25)
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
       if(queryClicked==true){
       	//querry
       	queryClicked=false;
       }
    });

}