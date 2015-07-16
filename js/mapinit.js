var map;

function initialize() {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(42.2813, -83.7483),
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER


        },
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //apply the map-settings for panControl and zoomControl to the streetView:
    map.get('streetView')
        .setOptions({
            panControlOptions: map.get('panControlOptions'),
            zoomControlOptions: map.get('zoomControlOptions')
        });


    var center;

    function calculateCenter() {
        center = map.getCenter();
    }
    console.log(map);
    google.maps.event.addDomListener(map, 'idle', function() {

        calculateCenter();
    });
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });

    $('#closeButton').hide();

    var streetView = map.getStreetView();

    var closeButton = document.querySelector('#closeButton'),
        controlPosition = google.maps.ControlPosition.RIGHT_TOP;

    streetView.setOptions({
        enableCloseButton: false
    });

    // Add to street view
    streetView.controls[controlPosition].push(closeButton);

    google.maps.event.addDomListener(streetView, 'visible_changed', function() {



        if (streetView.getVisible()) {
            $('#closeButton').show();
            $('#closeButton').click(function() {
                streetView.setVisible(false);
            });
        }
    });
}



google.maps.event.addDomListener(window, 'load', initialize);