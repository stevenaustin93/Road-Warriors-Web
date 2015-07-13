function MakePieChart(results) {


	var options = {
		//Define type of chart. This chart will be a heat map
		
        chart: {
        renderTo: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
        },
        title: {
            text: 'Safety Rating'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },

        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Contribution to Safety Rating',
            data: [
                ['Speed Variation',   99.04],

                {
                    name: 'Acceleration',
                    y: 0.96,
                    sliced: true,
                    selected: true
                },
                ['Braking',    0],
                ['Swerving',     0],

            ]
        }]


	}

	var chart = new Highcharts.Chart(options);
}



$(document).ready(function() {

        MakePieChart();
    

});



