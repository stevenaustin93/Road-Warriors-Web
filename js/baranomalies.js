

	function QueryS() {
		var baranomalies = Parse.Object.extend("baranomalies");
		var query = new Parse.Query(baranomalies);
		query.limit(1000);
		query.find({
		  success: function(results) {
		  	//alert("Results found:" + results.length);

		    Create(results);

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }

		});
	}

	function Create(results) {

		var options = {
			chart: {
				renderTo: 'anom',
				type: 'column'
			},
			title: {
				text: 'Current Anomalies of Ann Arbor'
			},
			xAxis: {
				categories: ['Live Data']

			},
			yAxis: {
				title: {
					text: 'Units'
				}
			},

            credits: {
                enabled: false
            },

			series: []

			};

		var series0 = { 
					name: 'Swerving',
					data: []
					
				};

		var series2 = { 
					name: 'Major Rapid Acceleration',
					data: []
					
				};



		var series4 = {
					name: 'Major Rapid Braking', 
					data: []
					
				};
		



		for (var i = 0; i < results.length; i++) {
		var Swerving = results[i].get('Swerving');
		var Acceleration = results[i].get('Braking');
		var Braking= results[i].get('Acceleration');
		series0.data.push(Swerving);
		series2.data.push(Acceleration);
		series4.data.push(Braking);
		
		}	

		options.series.push(series0, series2, series4);			
			


		
		



			

		



		var chart = new Highcharts.Chart(options);
	}
	

	$(document).ready(function() {
		QueryS();


	});


