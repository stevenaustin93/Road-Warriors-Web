function CreateChart(results) {


    var options = {
        chart: {
            renderTo: 'safetyandaccid',
            type: 'column'
        },
        title: {
            text: 'Percent Change of Safety Ratings and Accidents'
        },
        xAxis: {
            type: 'datetime',
            categories: ['January','February','March','April','May','June','July','August','September','October','November','December']

        },
        yAxis: {
            title: {
                text: 'Percentage'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: '2011',
            data: [5,6,8]
        }]
    }

}


$(document).ready(function() {
    CreateChart();

});
