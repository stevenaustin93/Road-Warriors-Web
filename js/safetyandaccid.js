

function MakeChart() {
    

            var options = {

                chart: {
                    renderTo: 'safetyandaccid',
                    type: 'line'
                },

                title: {
                    text: 'Percent Change of Accidents and Safety Ratings'
                },

                xAxis: {
                    title:{
                        text: 'Months (2011-2013)'
                    },
                    type: 'datetime',
                    categories: ["Mar '11", "Apr '11", "May '11","June '11", "July '11","Aug '11","Sept '11","Oct '11","Nov '11","Dec '11","Jan '12", "Feb '12", "Mar '12", "Apr '12", "May '12","June '12", "July '12","Aug '12","Sept '12","Oct '12","Nov '12","Dec '12","Jan '13", "Feb '13", "Mar '13", "Apr '13"]
                },

                yAxis: {
                    title: {
                        text: 'Percent Change (%)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },

                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Safety',
                    data: [22.75, 4.23, 30.166, 35.45, -6.35, 19.58, 62.43, 49.74, 60.85, 62.43, 43.39, 28.57, 16.93, 29.1, 33.86, 38.62, 17.99, 36.51, 56.08, 78.31, 44.97, 58.73, 74.07, 41.8, 12.76, -56.61 ],

                }, {
                    name: 'Accident',
                    data: [49.43, -9.29, 53.77, 50.23, -23.1, 71.34, 40.09, 54.96, 67.96, 72.76, -21.22, 26.81, -8.44, 28.36, 28.1, 35.78, 35.67, -0.69, 43.68, 57.75, 30.15, 97.25, 76.27, 42.01, -23.96, -44.57],

                }]
            };
            var chart = new Highcharts.Chart(options);
        }

            $(document).ready(function() {
                MakeChart();
            });
  
