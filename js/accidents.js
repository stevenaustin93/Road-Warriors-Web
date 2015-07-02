function QueryServer() {

				//var accidents = Parse.Object.extend("accidents");
				//var query = new Parse.Query(accidents);
				var accidentsPerDay = Parse.Object.extend("accidentsPerDay");
				var query = new Parse.Query(accidentsPerDay);

				query.limit(400);
				query.find({
					
					success: function(results) {
					  	//alert("Results found:" + results.length);

	
							  	
						//Create an accidents array to store the accidents from the accidents.csv file.
						//var accidentsArray = new Array();
						//Accidents per day array to store accidents per day from the accidentsPerDay.csv file.
						/*var accidentsPerDayArray = new Array();

						for (var i = 0; i < results.length; i++){
							var object = results[i];
							//accidentsArray.push([object.get('UMTRI_ID'), object.get('Date'), object.get('Accident Month'), object.get('Accident Day'), object.get('Accident Year'), object.get('Time of Day'), object. get('Weather'), object.get('Total Motor Vehicles'), object.get('Gps X Coordinate'), object.get('Gps Y Coordinate')]);
							accidentsPerDayArray.push([object.get('Date'), object.get('Count')]);
				
						}*/

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
									renderTo: 'accid',
									type: 'spline'
								},
								title: {
									text: 'Accident Data'
								},
								xAxis: {
									type: 'datetime',
									categories: []

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
								data: []
							}




							var dates = [];
							var c;
							var utcDate;
							var d = [];

							

							for (var i = 0; i < results.length; i++){
								amount = results[i].get('Count');
								dates.push(results[i].get('Date'));
								c = dates[i];
								d.push(c);


								utcDate = new Date(Date.UTC());
								options.xAxis.categories.push(utcDate);
								
							
								//accidentsArray.push([object.get('UMTRI_ID'), object.get('Date'), object.get('Accident Month'), object.get('Accident Day'), object.get('Accident Year'), object.get('Time of Day'), object. get('Weather'), object.get('Total Motor Vehicles'), object.get('Gps X Coordinate'), object.get('Gps Y Coordinate')]);
								//accidentsPerDayArray.push([object.get('Date'), object.get('Count')]);
		

								series0.data.push(amount);
					
							}

								
								

								
								


								

							options.series.push(series0);

					






										
								


							
							



								

							



							var chart = new Highcharts.Chart(options);
						}
						

						$(document).ready(function() {
							QueryServer();

						});
