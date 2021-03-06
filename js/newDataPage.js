<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
		</script>
		<script type="text/javascript" src="http://code.highcharts.com/highcharts.js">
		</script>
        <!-- <script type="text/javascript" src="js/exporting.js"></script> -->
		<script type="text/javascript" src="http://www.parsecdn.com/js/parse-1.4.2.min.js">
		</script>
		<script> Parse.initialize("6s0wYYKZR2sQU8zMV304cL8jv5Pdmp3PzOIwKLOp", "7C1XQAKjUdhiH6k25tRIbVOweuNMoFy0n0An4LJf"); 
		</script>
	</head>

	<body>

		<div id="container" style="width: 800px; height: 400px; margin: 0 auto"></div>

		<script>
			//Load data from accidents.csv and accidentsPerDay.csv into arrays using Parse.
$(document).ready(function() {

	var accidents = Parse.Object.extend("accidents");
	var query = new Parse.Query(accidents);
	var accidentsPerDay = Parse.Object.extend("accidentsPerDay");
	var query = new Parse.Query(accidentsPerDay);

	query.limit(200);
	query.find({
		
		success: function(results) {
				  	
			//Create an accidents array to store the accidents from the accidents.csv file.
			var accidentsArray = new Array();
			//Accidents per day array to store accidents per day from the accidentsPerDay.csv file.
			var accidentsPerDayArray = new Array();

			for (var i = 0; i <results.length; i++){
				var object = results[i];
				accidentsArray.push([object.get('UMTRI_ID'), object.get('Date'), object.get('Accident Month'), object.get('Accident Day'), object.get('Accident Year'), object.get('Time of Day'), object. get('Weather'), object.get('Total Motor Vehicles'), object.get('Gps X Coordinate'), object.get('Gps Y Coordinate')]);
				accidentsPerDayArray.push([object.get('Date'), object.get('Count')]);
			}

		},

		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}

	});

});


		</script>
	</body>
</html>