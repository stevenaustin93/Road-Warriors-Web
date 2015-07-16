

function QueryServer() {

            var safetyratingroute = Parse.Object.extend("safetyratingroute");
            var query = new Parse.Query(safetyratingroute);

            query.limit(400);
            query.find({
                
                success: function(results) {
                    //alert("Results found:" + results.length);
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
                            renderTo: 'safetyratingroute',
                            type: 'line',
                            zoomType: 'x'
        
                        },
                        title: {
                            text: '<h4>Safety Rating Along Current Route</h4>',
                            margin: 40,
                            y: 35,
                            useHTML: true

                        },
        
                        xAxis: {
                            title:{
                                text: 'Current Route',
                            },
                                        
                            categories: [],

                            labels:
                            {   
                              enabled: false
                            }
                        },  
                        yAxis: {
                            title: {
                                text: 'Safety Rating (1-10)'
                            }
                        },

                        credits: {
                            enabled: false
                        },



                        series: []



                        };
                    


                    var series0 = {
                        name: 'Safety Rating',
                        data:[]
                    };


                    var latitude;
                    var longitude;
                    var safetyrating
                    

                    for (var i = 0; i < results.length; i++){
                        latitude = results[i].get('Lat');
                        longitude = results[i].get('Long');
                        safetyrating = results[i].get('SR');


               


                        series0.data.push(safetyrating);
                        options.xAxis.categories.push([latitude,longitude]);
                    }


                    options.series.push(series0);



                    var chart = new Highcharts.Chart(options);
                }
                

                $(document).ready(function() {
                    QueryServer();

                });

