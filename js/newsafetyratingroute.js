

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
                            text: 'Safety Rating Along Current Route'
                        },
                        subtitle: {
                            text: document.ontouchstart === undefined ?
                                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                        },
                        xAxis: {
                            title:{
                                text: 'Current Route'
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
                        name: 'Safety Rating per Latitutde and Longitude',
                        data:[]
                    };

                    var series1 = {
                        name: 'Safety Rating of Entire Route',
                        color: 'red',
                        data:[]
                    };


                    var latitude;
                    var longitude;
                    var safetyrating
                    

                    for (var i = 0; i < results.length; i++){
                        latitude = results[i].get('Lat');
                        longitude = results[i].get('Long');
                        safetyrating = results[i].get('SR');
                        entireroute = results[i].get('entireroute');

               


                        series0.data.push(safetyrating);
                        series1.data.push(entireroute)
                        options.xAxis.categories.push([latitude,longitude]);
                    }


                    options.series.push(series0,series1);



                    var chart = new Highcharts.Chart(options);
                }
                

                $(document).ready(function() {
                    QueryServer();

                });

