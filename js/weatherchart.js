function MakeHeatChart(results) {


	var options = {
		//Define type of chart. This chart will be a heat map
		chart: {
			renderTo: 'weather',
			type: 'heatmap',
			marginTop:40,
			marginBottom:80,
		},

		//Title of chart
		title: {
			text: 'Heat Map of Accidents per Month/Weather Conditions'
		},

		//Categories of x axis
		xAxis: {	
			categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		},

		//Categories of y axis
		yAxis: {
			categories: ['Clear','Cloudy', 'Fog/Smoke', 'Rain', 'Severe Wind', 'Sleet/hail', 'Snow/blowing Snow']
		},

		//Colors of heat map
		colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    	},

    	//Sets up legend for colors
    	legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    	},

    	tooltip: {
        	formatter: function () {
            	return 'During </b>' + this.series.xAxis.categories[this.point.x] + '</b>, there were <br><b>' +
                	this.point.value + '</b> accidents under weather conditions: <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
        	}
    	},

    	series: [{
        	name: 'Number of Accidents during',
        	borderWidth: 1,
        	data: [[0,0,10],[0,1,19],[0,2,8],[0,3,24],[0,4,67],[1,0,92],[1,1,58],[1,2,78],[1,3,117],[1,4,48],[2,0,35],[2,1,15],[2,2,123],[2,3,64],[2,4,52],[3,0,72],[3,1,132],[3,2,114],[3,3,19],[3,4,16],[4,0,38],[4,1,5],[4,2,8],[4,3,117],[4,4,115],[5,0,88],[5,1,32],[5,2,12],[5,3,6],[5,4,120],[6,0,13],[6,1,44],[6,2,88],[6,3,98],[6,4,96],[7,0,31],[7,1,1],[7,2,82],[7,3,32],[7,4,30],[8,0,85],[8,1,97],[8,2,123],[8,3,64],[8,4,84],[9,0,47],[9,1,114],[9,2,31],[9,3,48],[9,4,91],[10,0,43],[10,1,49],[10,2,41],[10,3,51],[10,4,5], [11, 0, 3], [11,1,5],[11,2,6],[11,3,20],[11,4,26],[11,5,20],[12,6,21]],
        	dataLabels: {
            	enabled: true,
            	color: 'black',
            	style: {
                	textShadow: 'none'
            	}
        	}
    	}]
  
	}

	var chart = new Highcharts.Chart(options);
}



$(document).ready(function() {

        MakeHeatChart();
    

});



