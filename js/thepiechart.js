function MakePieChart(results) {


	var options = {
		//Define type of chart. This chart will be a heat map
		
        chart: {
        renderTo: 'pie',
        backgroundColor: 'transparent',
        plotBorderWidth: null,
        plotShadow: false
        },
        title: {
            text: 'Safety Rating Breakdown'
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
                ['Speed Variation',   8.868783],

                {
                    name: 'Acceleration',
                    y: 22.87679,
                    sliced: true,
                    selected: true
                },
                ['Braking',    45.50295],
                ['Swerving',     22.75147],

            ]
        }]


	}

	var chart = new Highcharts.Chart(options);
}



$(document).ready(function(){

        MakePieChart();
    

});



