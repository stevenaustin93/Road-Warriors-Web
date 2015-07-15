/*function getPercentageChange(x0, xt) {
    var change = (xt - x0) / x0;
    return ( 100 * change);
}

function getFirstPoint()
*/

$(document).ready(function() {
    queryServer();
});

//
// Queries the parse database for percent change of safety ratings and number of crashes
function queryServer() {

    var percentchange = Parse.Object.extend("percentchange");
    var query = new Parse.Query(percentchange);

    query.limit(100);
    query.find({

        success: function(results) {
            console.log("Results found:" + results.length);
            makeChart(results);
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

//
// Makes a stockchart
function makeChart(results) {

    var seriesOptions = [];

    var createChart = function() {

        $('#percentchange').highcharts('StockChart', {

            rangeSelector: {
                selected: 5
            },

            title: {
                text: 'Safety Rating vs. Number of Accidents Over Time'

            },

            yAxis: {
                labels: {
                    formatter: function() {
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

            series: seriesOptions
        });
    };

    var SRarray = new Array();
    var Aarray = new Array();

    for (var i = 0; i < results.length; i++) {
        var myDate = results[i].get('date');
        myDate = myDate.split("/");
        var newDate = myDate[0] + "," + myDate[1] + "," + myDate[2];
        var dDate = new Date(newDate).getTime();

        SRarray.push([dDate, results[i].get('SR')]);
        Aarray.push([dDate, results[i].get('Count')]);
    }

    seriesOptions[0] = {
        name: "Safety",
        data: SRarray
    };

    seriesOptions[1] = {
        name: "Crashes",
        data: Aarray
    };

    createChart();
}