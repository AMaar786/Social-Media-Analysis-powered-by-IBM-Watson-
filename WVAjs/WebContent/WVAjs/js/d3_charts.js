var sourcesChart,sentimentsChart,tonesChart;

window.chartColors = {
	red : 'rgb(255, 99, 132)',
	orange : 'rgb(255, 159, 64)',
	yellow : 'rgb(255, 205, 86)',
	green : 'rgb(75, 192, 192)',
	blue : 'rgb(54, 162, 235)',
	purple : 'rgb(153, 102, 255)',
	grey : 'rgb(231,233,237)'
};

window.randomScalingFactor = function() {
	return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}
var randomScalingFactor = function() {
	return Math.round(Math.random() * 100);
};


function getSentimentsConfig(sentimentsData,sentimentLabels,name) {
	var config = {
			type : 'pie',
			data : {
				datasets : [ {
					data : sentimentsData,
					backgroundColor : [window.chartColors[0],window.chartColors[1],window.chartColors[2],window.chartColors[3],window.chartColors[4],window.chartColors[5],window.chartColors[6] ],
					label : name
				} ],
				labels : sentimentLabels
			},
			options : {
				responsive : true,
				legend: {
                	display: true
                }
			}
		};
	return config;
}
function getDoughnutConfig(Data,Labels,name) {
	var config = {
			type : 'doughnut',
			data : {
				datasets : [ {
					data : Data,
					backgroundColor : [window.chartColors[0],window.chartColors[1],window.chartColors[2],window.chartColors[3],window.chartColors[4],window.chartColors[5],window.chartColors[6] ],
					label : name
				} ],
				labels : Labels
			},
			options : {
				
				responsive: true,
                legend: {
                	display: true,
                	fontSize: 40
                },
                title: {
                    display: true,
                    text: ''
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
		};
	return config;
	

}


function getLineChartConfig(data1,labels){

	var labels_new = [];
	for(i=0;i<labels.length;i++){
		var name = getMonthName(labels[i]);
		labels_new.push(name);
	}
	
	var options = {
        responsive: true,
        legend: {
        	display: false
        },
        hoverMode: 'index',
        stacked: false,
        title:{
            display: true,
            text:''
        },
        scales: {
            yAxes: [{
                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: "left",
                id: "y-axis-1",
            }, {
                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: "right",
                id: "y-axis-2",
                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            }
            
            ],
        }
    };
    var lineChartData = {
            labels: labels_new,
            datasets: data1
        };
    var config = {
    	    type: 'line',
    	    data: lineChartData,
    	    options: options
    	};
    return config;
}

function getBarChartConfig(datasets){
	var barChartData = {
            labels: ["Locations"],
            datasets: datasets
        };
	var config = {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                	display: true
                },
                title: {
                    display: true,
                    text: ''
                }
            }
        };
	return config;
}

function getBubbleChartConfig(dataset){
	var bubbleChartData = {
		    animation: {
		        duration: 10000
		    },
		    datasets: dataset
		};
	var config = {
        type: 'bubble',
        data: bubbleChartData,
        options: {
            responsive: true,
            title:{
                display:true,
                text:''
            },
            legend: {
                display: true,
                fontSize: 40
             },
            tooltips: {
                mode: 'point'
            }
        }
    };
	return config;
}

function updateSentiments(dataSentiments,labelSentiments) {
	 $('#sentiments-chart').remove(); // this is my <canvas> element
	  $('#sentiments').append('<canvas height=300 style="width:300px;height:300px;" id="sentiments-chart"><canvas>');
	var ctx = document.getElementById("sentiments-chart").getContext("2d");
	sentimentsChart = new Chart(ctx, getSentimentsConfig(dataSentiments,labelSentiments,"sentiments"));
	$('#sentiments-chart').css('height', '200px');
	$('#sentiments-chart').css('width', '200px');
	$('#sentiments-chart').css('margin-top', '80px');
};

function updateTones(data,labels) {
	 $('#tones-chart').remove(); // this is my <canvas> element
	  $('#tones').append('<canvas height=300 style="width:300px;height:300px;" id="tones-chart"><canvas>');
	var ctx = document.getElementById("tones-chart").getContext("2d");
	tonesChart = new Chart(ctx, getDoughnutConfig(data,labels,"tones"));
	$('#tones-chart').css('height', '220px');
	$('#tones-chart').css('width', '220px');
	$('#tones-chart').css('margin-top', '60px');
};


function updateSources(data,labels) {
	 $('#sources-chart').remove(); // this is my <canvas> element
	  $('#sources').append('<canvas style="width:300px;height:300px;" height=300 id="sources-chart"><canvas>');
	var ctx = document.getElementById("sources-chart").getContext("2d");
	sourcesChart = new Chart(ctx, getDoughnutConfig(data,labels,"sources"));
	$('#sources-chart').css('height', '220px');
	$('#sources-chart').css('width', '220px');
	$('#sources-chart').css('margin-top', '60px');
};

function updateLocations(data) {
	 $('#locations-chart').remove(); // this is my <canvas> element
	  $('#locations').append('<canvas style="width:300px;height:300px;" height=300 id="locations-chart"><canvas>');
	var ctx = document.getElementById("locations-chart").getContext("2d");
	window.myPie = new Chart(ctx, getBarChartConfig(data));
};

function updateConcepts(words) {
	 $('#concepts').remove(); // this is my <canvas> element
	 $('#unstruct_row').append('<div id="concepts" class="col m6" height="500" style="padding: .25rem 1rem 1rem; height:500px;" ><h5 style="color:rgba(0,0,0,0);">Sources</h5><div height=300 id="concepts-chart"></div></div>');
	 $('#concepts').jQCloud(words); 
};

function updateKeywords(words) {
	/* $('#keywords').remove(); // this is my <canvas> element
	 $('#unstruct_row').append('<div id="keywords" class="col m5" height="500" style="padding: .25rem 1rem 1rem; height:500px;" ><h5 style="color:rgba(0,0,0,0);">Sources</h5><div height=300 id="keywords-chart"></div></div>');
	 $('#keywords').jQCloud(words);  */
};
function updateEntities(data) {
	 $('#entities-chart').remove(); // this is my <canvas> element
	  $('#entities').append('<canvas style="width:300px;height:300px;" height=300 id="entities-chart"><canvas>');
	var ctx = document.getElementById("entities-chart").getContext("2d");
	window.myPie = new Chart(ctx, getBubbleChartConfig(data));
	Chart.defaults.global.legend.display = false;
	$('#entities-chart').css('height', '264px');
	$('#entities-chart').css('width', '264px');
};
function updateTrends(data,labels) {
	 $('#trends-chart').remove(); // this is my <canvas> element
	  $('#trends').append('<canvas style="width:300px;height:300px;" height=300 id="trends-chart"><canvas>');
	var ctx = document.getElementById("trends-chart").getContext("2d");
	var myLineChart = new Chart(ctx, getLineChartConfig(data,labels));
	$('#trends-chart').css('height', '350px');
	
};
function getMonthName(n){
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	
	return month[n-1];
};
function showLoading() {
	foamtree1.set("dataObject",{
		groups :

			[ {
				label : "Loading...",
				level : 0,
				weight : 1
			} ]
		});
	 $('#sentiments-chart').remove(); // this is my <canvas> element
	 $('#entities-chart').remove(); // this is my <canvas> element
	 $('#tones-chart').remove(); // this is my <canvas> element
	 $('#sources-chart').remove(); // this is my <canvas> element
	 $('#locations-chart').remove(); // this is my <canvas> element
	 $('#sentiments').append('<img src="images/loading.gif" id="sentiments_loading" style="height: 70%; width: 70%;"/>');
	 $('#tones').append('<img src="images/loading.gif" id="tones_loading" style="height: 70%; width: 70%;"/>');
	 $('#sources').append('<img src="images/loading.gif" id="sources_loading" style="height: 70%; width: 70%;"/>');
	 $('#locations').append('<img src="images/loading.gif" id="locations_loading" style="height: 70%; width: 70%;"/>');
	 $('#concepts').html('');
	 $('#keywords').html('');
	 $('#concepts').append('<img src="images/loading.gif" id="concepts_loading" style="height: 38%; width: 38%;"/>');
	 //$('#keywords').append('<img src="images/loading.gif" id="keywords_loading" style="height: 38%; width: 38%;"/>');
	 $('#entities').append('<img src="images/loading.gif" id="entities_loading" style="height: 38%; width: 38%;"/>'); 
};
function hideLoading() {
	  $('#sentiments_loading').remove(); // this is my <canvas> element
	  $('#sentiments').append('<canvas style="width:300px;height:300px;" height=300 id="sentiments-chart"><canvas>');
	  $('#tones_loading').remove(); // this is my <canvas> element
	  $('#tones').append('<canvas style="width:300px;height:300px;" height=300 id="tones-chart"><canvas>');
	  $('#sources_loading').remove(); // this is my <canvas> element
	  $('#sources').append('<canvas style="width:300px;height:300px;" height=300 id="sources-chart"><canvas>');
	  $('#locations_loading').remove(); // this is my <canvas> element
	  $('#locations').append('<canvas style="width:300px;height:300px;" height=300 id="locations-chart"><canvas>');
	 // $('#keywords_loading').remove(); // this is my <canvas> element
	  $('#concepts_loading').remove(); // this is my <canvas> element
	  $('#entities_loading').remove(); // this is my <canvas> element
	  $('#entities').append('<canvas style="width:300px;height:300px;" height=300 id="entities-chart"><canvas>');
};

function setListener(chart,ChartEle,header){
	console.log(header);
	chart.onclick = function(evt){
		
	    var activeElement = ChartEle.getElementAtEvent(evt);
	    var label = activeElement[0]._chart.config.data.labels[activeElement[0]._index];
	    var colname = activeElement[0]._view.label;
	    
	    var scope = angular.element(
	    	    document.
	    	    getElementById("SMACtrl")).
	    	    scope();
	    
	    scope.$apply(function () {
	        scope.filterData(label,colname);
	    });
	    // => activePoints is an array of points on the canvas that are at the same position as the click event.
	  
	};
}

function conceptsEvt(value){
	var scope = angular.element(
    	    document.
    	    getElementById("SMACtrl")).
    	    scope();
    
    scope.$apply(function () {
        scope.filterData(value,"concepts");
    });
}
function keywordsEvt(value){
	var scope = angular.element(
    	    document.
    	    getElementById("SMACtrl")).
    	    scope();
    
    scope.$apply(function () {
        scope.filterData(value,"keywords");
    });
}
function entitiesEvt(value){
	var scope = angular.element(
    	    document.
    	    getElementById("SMACtrl")).
    	    scope();
    
    scope.$apply(function () {
        scope.filterData(value,"entities");
    });
}

