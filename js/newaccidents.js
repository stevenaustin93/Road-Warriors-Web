			function QueryServer() {

				var accidentsPerMonth = Parse.Object.extend("accidentsPerMonth");
				var query = new Parse.Query(accidentsPerMonth);

				query.limit(400);
				query.find({
					
					success: function(results) {
					  	alert("Results found:" + results.length);
						CreateChart(results);
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			}

			function CreateChart(results) {
				
				var options = {
					
					chart: {
						renderTo: 'container',
						type: 'spline'
					},
					
					title: {
						text: 'Accidents per Month in Ann Arbor during 2013'
					},
					
					xAxis: {
						type: 'datetime',
						categories: ['January','February','March','April','May','June','July','August','September','October','November','December']
					},

					yAxis: {
						title: {
							text: 'Accidents'
						}
					},

	                credits: {
                       	enabled: false
                    },

					series: []

				};
					
				var series0 = {
					name: ['Number of Accidents'],
					data: []
				}

				var amount;
				var months = [];
				for (var i = 0; i < results.length; i++){
					amount = results[i].get('Count');
					months.push(results[i].get('Months'));

					options.xAxis.categories.push(months);
					series0.data.push(amount);
				}


			options.series.push(series0);
			var chart = new Highcharts.Chart(options);
			}


			$(document).ready(function() {
				QueryServer();
			});

