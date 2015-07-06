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
            name: 'Browser share',
            data: [
                ['V_c',   50],

                {
                    name: 'Swerving',
                    y: 16.7,
                    sliced: true,
                    selected: true
                },
                ['Braking',    16.7],
                ['Acceleration',     16.7],

            ]
        }]


	}

	var chart = new Highcharts.Chart(options);
}



$(document).ready(function() {

        MakePieChart();
    

});



