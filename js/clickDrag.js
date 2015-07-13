//click and drag
$(document).ready(function() {
	var clickDragButtonCLICKED = false;
	$('#clkDrg').click(function(){ //assuming my buttons name is #clkDrg
		clickDragFUNC(clickDragButtonCLICKED);
		if (clickDragButtonCLICKED) this.blur();
		clickDragButtonCLICKED = !clickDragButtonCLICKED;
	})

}); 

function clickDragFUNC(isClicked){
	//locks the viewport and scaling
	options = $.extend({
	    scrollwheel: false,
	    navigationControl: false,
	    mapTypeControl: false,
	    scaleControl: false,
	    draggable: false,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	}, options);

	//detects a drag, when mouse clicks down it sets the place and on mouse click up it check if it moved
	//if it did move then it will execute a function
	var isDragging = false;
	var lat1, longi1, lat2, longi2 = 0;
	$('#map_canvas') 
    .mousedown(function() {
    	//query google maps for location of mouse, save it
        isDragging = false;
        //here save first coordinate pair
    })
    .mousemove(function() {
    	//query google maps for new location of mouse and save
        isDragging = true;
        //here save second coordinate pair
     })
    .mouseup(function() {
        var wasDragging = isDragging;
        isDragging = false;
        if (wasDragging) { //if it was dragging...
            //querry server for square of data between 2 coordinate pairs
        }
        //unclick button

        //unlock map
        options = $.extend({
	    	scrollwheel: true,
	   		navigationControl: true,
	    	mapTypeControl: true,
	    	scaleControl: true,
	    	draggable: true,
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
		}, options);

    });

}