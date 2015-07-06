<html>	
	<head>
		<link type= "text/css" rel="stylesheet" href="style.css"/> 
		<title>ASDFASDFADSF</title>
        <script type="text/javascript" src="js/c1.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script src="http://code.highcharts.com/highcharts.js"></script>
        <script type="text/javascript" src="js/exporting.js"></script>

	</head>
	<body>


		<div id= "sidebar">
			<div id= "sidebar_title">
				<h2 style="color:black">;ALKSJDF; LASKDHFASKLFADS</h2>
                <p style="color:black">Select Anomaly:</p>
				<p id="sidebar_element">


                    <input type="checkbox" name="c1" onclick="showMe('container')">Select All</input><br>
                    <input type="checkbox" name="c1" onclick="showMe('piechart')">Swerving</input><br>
                    <input type="checkbox" name="c1" onclick="showMe('braking')">Abrupt Braking</input><br>
                    <input type="checkbox" name="c1" onclick="showMe('safetyrating')">Fast Acceleration</input><br>
                    				

				</p>
                <p style="color:black">Avg Safety Rating: 7.2</p>
                <p style="color:black">Select Statistic:</p>
                <p id= "statistic">
                         
                    <input type = "checkbox"> Vehicle Collisions</input><br>
                    <input type = "checkbox"> Pedestrian Collisions</input><br>
                    
                </p>
                <p style= "color:black"> Average Safety Rating:</p>
                <p id= "Safety">
                    <input type = "checkbox">Hourly</input><br>
                    <input type = "checkbox">Daily</input><br>                    
                    <input type = "checkbox">Weekly</input><br>  
                    <input type="checkbox" name="c1" onclick="showMe('line')">Monthly</input><br><br>

                    <input type="checkbox" name="c1" onclick="showMe('speed')">Click to View Speed</input><br><br>

                </p>
               


		</div>
	<div id= "mainpage">

        <div id="container"></div>
        <div id="piechart" style= "display:none"></div>
        <div id= "line" style= "display:none"></div>
        <div id="safetyrating" style= "display:none"></div>
        <div id= "braking" style= "display:none"></div>
        <div id ="speed" style= "display:none"></div>


        <script>
            $(function () {

                 $('#speed').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Speed of Current Route'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                                'Click and drag in the plot area to zoom in' :
                                'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        title: {
                            text: 'Latitutde and Longitude Points (Numbered 1-984)'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Speed Rating 0-6, 6= >50mph'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: 'Speed Rating at Lat, Long',
                        

                        data: [3,
                            3,
                            3,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            3,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            2,
                            1,
                            2,
                            1,
                            2,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            3,
                            3,
                            3,
                            3,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            5,
                            5,
                            5,
                            4,
                            4,
                            3,
                            3,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            3,
                            3,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            3,
                            3,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            3,
                            3,
                            3,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            3,
                            3,
                            3,
                            3,
                            3,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            3,
                            3,
                            3,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            4,
                            4,
                            4,
                            4,
                            4,
                            5,
                            5,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            5,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            4,
                            5,
                            5,
                            5,
                            5,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            5,
                            5,
                            5,
                            5,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            6,
                            5,
                            5,
                            5,
                            5,
                            4,
                            4,
                            4,
                            4,
                            3,
                            3,
                            2,
                            2,
                            2,
                            3,
                            3,
                            4,
                            4,
                            4,
                            5,
                            5,
                            5,
                            5,
                            5,
  
                            
                        ]
                    }]
                });



                $('#container').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Severity of Anomalies'
                    },
                    subtitle: {
                        text: 'Severity Scale 1 to 3'
                    },
                    xAxis: {
                        categories: ['42.18133163 -83.93299103', '42.28501892 -83.74581146', '42.23044968 -83.69557953', '42.2589798  -83.708992'],
                        title: {
                            text: 'Latitude, Longitude'
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Severity',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    //tooltip: {
                       // valueSuffix: ' millions'
                    //},
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: 0,
                        y: 0,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'High Yaw Rate & Speed (Swerve)',
                        data: [2, 1, 2, 3]
                    }, {
                        name: 'Abrupt Braking',
                        data: [3, 3, 1, 2]
                    }, {
                        name: 'Fast Acceleration',
                        data: [1, 2, 1, 1]
                    }]
                });
     

                // Radialize the colors
                Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
                    return {
                        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, color],
                            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                        ]
                    };
                });

                // Build the chart
                $('#piechart').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    credits: {
                      enabled: false
                    },
                    title: {
                        text: 'Contribution to Safety Rating'
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
                                },
                                connectorColor: 'silver'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Contribution',
                        data: [
                            ['Swerving',   17.0],
                            ['Abrupt Braking',       27],
                            {
                                name: 'Safe Driving',
                                y: 32,
                                sliced: true,
                                selected: true
                            },
                            ['Fast Acceleration',    9],
                            ['Speed Variance',     15]
                            
                        ]
                    }]
                });

                $('#line').highcharts({
                    title: {
                        text: 'Vehicle Collisons',
                        x: -20 //center
                    },

                    credits: {
                        enabled: false
                    },

                    subtitle: {
                        text: 'January - May 2015',
                        x: -20
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
                    },
                    yAxis: {
                        title: {
                            text: 'Number of incidents'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [{
                        name: '42.18133163  -83.93299103',
                        data: [22, 23, 25, 20, 18]
                    }, {
                        name: '42.28501892 -83.74581146',
                        data: [21, 24, 19, 19, 12]
                    }, {
                        name: '42.23044968  -83.69557953',
                        data: [22, 14, 19, 22, 13]
                    }, {
                        name: '42.2589798   -83.708992',
                        data: [25, 33, 19, 16, 14]
                    }]
                });

                $('#safetyrating').highcharts({
                    chart: {
                        type: 'line'
                    },

                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Monthly Average Safety Rating'
                    },
                    subtitle: {
                        text: 'January - May 2015'
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
                    },
                    yAxis: {
                        title: {
                            text: 'Safety Rating'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: [{
                        name: '42.18133163  -83.93299103',
                        data: [7.0, 6.9, 9.5, 9.2, 7.6]
                    }, {
                        name: '42.28501892  -83.74581146',
                        data: [3.9, 6.5, 7.1, 8.5, 8]
                    }, {
                        name: '42.23044968  -83.69557953',
                        data: [5.4, 7.2, 7.4, 7.9, 8]
                    }, {
                        name: '42.2589798   -83.708992',
                        data: [4.3, 5.7, 6.6, 7.2, 8.8]
                    }]
                });
                $('#braking').highcharts({
                    title: {
                        text: 'Braking Anomaly',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'Freq. vs. Rows',
                        x: -20
                    },
                    credits: {
                        enabled: false
                    },                  
                    xAxis: {
                        title: {
                            text: 'Number of Rows'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Frequency (Hz)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [{
                        name: 'Data Set 1',
                        data: [100,174,39,4,138,77,39,53,45,95,41,6]

                    }]
                });

            });
    



    
        </script>
    </div>   
    </body>


</html>	

