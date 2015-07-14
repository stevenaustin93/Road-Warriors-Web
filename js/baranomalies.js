

	function QueryS() {
		var BarAnomalies = Parse.Object.extend("BarAnomalies");
		var query = new Parse.Query(BarAnomalies);
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
		//var Accel1 = results[i].get('Accel1');
		var Accel2 = results[i].get('Accel2');
		var Brake1 = results[i].get('Brake1');
		var Brake2 = results[i].get('Brake2');
		series0.data.push(Swerving);
		series2.data.push(Accel2);
		series4.data.push(Brake2);
		
		}	

		options.series.push(series0, series2, series4);			
			


		
		



			

		



		var chart = new Highcharts.Chart(options);
	}
	

	$(document).ready(function() {
		QueryS();


	});


