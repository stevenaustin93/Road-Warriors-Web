
function QueryServer() {

            var percentchange = Parse.Object.extend("percentchange");
            var query = new Parse.Query(percentchange);

            query.limit(100);
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
                        var seriesOptions = [],
                        seriesCounter = 0,
                        //names = ['MSFT', 'AAPL', 'GOOG'],
                        // create the chart when all data is loaded

                        rangeSelector: {
                            selected: 4
                        },

                        yAxis: {
                            labels: {
                                formatter: function () {
                                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                                }
                            },
                            plotLines: [{
                                value: 0,
                                width: 2,
                                color: 'silver'
                            }]
                        },

                        plotOptions: {
                            series: {
                                compare: 'percent'
                            }
                        },

                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                            valueDecimals: 2
                        },

                        series: data: []
                    });
                };

                       