//questions controller
var trendsDataSet = [];
var entitiestrendsDataSet = [];
var trendLabels = [];
showAnswers = false;
showLoading = false;
askQuestStatus = false;
Controllers.controller("questionsCtrl", function($scope, $rootScope, $http,
		restservice, $cookieStore) {

	$scope.IDs = [];
	$scope.question = {};
	$scope.topn = {};
	$scope.final_confidence = 0;
	$scope.answersList = [];
	$scope.topn.nr = 3;

	$scope.askQuestion = function() {

		showLoading = true;
		askQuestStatus = true;
		restservice.get(
				"",
				"wva_telenor_back/retrieval/telco_cluster/telenor/telenor/JSON?q="
						+ $scope.question.value + "&nr=" + $scope.topn.nr
						+ "&classifier=telenor", "UserAPI").then(
				function(data) {

					$scope.answersList = [];
					for (var i = 0; i < data.length; i++) {
						$scope.answer = {};

						$scope.answer.value = data[i].body[0];

						$scope.new_confidence = Math
								.round(data[i].confidence * 100) / 100;
						console.log($scope.new_confidence);
						if ($scope.new_confidence >= 0
								&& $scope.new_confidence <= .20) {
							$scope.final_confidence = 1;
						} else if ($scope.new_confidence > .20
								&& $scope.new_confidence <= .40) {
							$scope.final_confidence = 2;
						} else if ($scope.new_confidence > .40
								&& $scope.new_confidence <= .60) {
							$scope.final_confidence = 3;
						} else if ($scope.new_confidence > .60
								&& $scope.new_confidence <= .80) {
							$scope.final_confidence = 4;
						} else {
							$scope.final_confidence = 5;
						}
						$scope.answer.confidence = $scope.final_confidence;
						$scope.answer.id = data[i].id;
						$scope.IDs.push(data[i].id);
						$scope.answersList.push($scope.answer);
					}
					showAnswers = true;
					if (!$scope.question.value) {
						showAnswers = false;
					}

					showLoading = false;
					askQuestStatus = false;

				});

	};

	$scope.uploadFile = function() {
		var file = $scope.myFile;
		console.log('file is ');
		console.dir(file);
		var uploadUrl = "/fileUpload";
		var fd = new FormData();
		fd.append('file', file);
		$http.post("http://9.133.55.54:8080/wva/upload", fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
			alert("success...");
		}).error(function() {
			alert("error");
		});
	};

	$scope.loadingStatus = function() {
		return showLoading;
	};
	$scope.askStatus = function() {
		return askQuestStatus;
	};
	$scope.answersShow = function() {
		return showAnswers;
	};

	$scope.retrain = function() {
		restservice.get("",
				"/retrain/telco_cluster/telenor/telenor/telenor_gt", "UserAPI")
				.then(function(data) {

				});

	};

	$scope.range = function(min, max, step) {
		step = step || 1;
		var input = [];
		for (var i = min; i <= max; i += step)
			input.push(i);
		return input;
	};
	$scope.doReRanking = function(rank, id) {
		var responseJSON = {};
		var next_index = $scope.IDs.indexOf(id) + 1;
		var responseIDs = [];
		responseIDs.push(id);
		responseIDs.push(rank + "");
		responseIDs.push($scope.IDs[next_index]);
		responseIDs.push("0");
		responseJSON.name = $scope.question.value;
		responseJSON.relevance = responseIDs;

		restservice.post(responseJSON, "wva_telenor_back/feedback/telenor_gt",
				"UserAPI").then(function(data) {

			alert("You've successfully re-rated this answer.");
		});
	}

});

// conversations controller
var endconvo = false;
var context = {};

Controllers
		.controller(
				"conversationsCtrl",
				function($scope, $rootScope, $http, restservice, $cookieStore,
						$sce, $compile) {

					$scope.message = {};
					var conversation_id = 0;
					$scope.sendMessage = function() {
						var parentElement = document.getElementById('chatBox');
						var parent = angular.element(parentElement);
						var messageText = $scope.message.value;
						var sentMessage = "<div class='from-user'><div  class='message-inner'><p>"
								+ messageText + "</p></div></div>";
						var element = angular.element(sentMessage);
						$compile(element)($scope);
						parent.append(element);
						$scope.message.value = "";
						$cookieStore.put("conversation_id", "0");

						if (context.system == undefined) {
							messageText = "start_convo";
						}
						console.log(messageText);
						restservice
								.post(
										context,
										"wva_telenor_back/conversation/telco_cluster/telenor/telenor/33ee569d-902b-44d2-9708-c907f639caa9/telenor?request="
												+ messageText, "UserAPI")
								.then(
										function(data) {

											var reply = "<div class='from-watson'><div  class='message-inner'><p>"
													+ data.output.text
													+ "</p></div></div>";

											var element = angular
													.element(reply);

											$compile(element)($scope);
											parent.append(element);
											context = data.context;
											if ("Thank you for choosing Telenor. Bye" == data.output.text) {
												endconvo = true;
												$scope.convoEndedBorder = {
													"border-bottom" : "none",
													"border-bottom" : "1px solid rgb(0, 0, 0)"

												};
												$scope.convoEndedLabel = {

													"color" : "gray"

												};
											}

											if ($cookieStore
													.get("conversation_id") == 0) {

												$cookieStore
														.put(
																"conversation_id",
																context.conversation_id);
												$scope.conversation_id = "http://9.51.154.45:8089/wva_telenor_back/form?request="
														+ context.conversation_id;
											}
											document
													.getElementById("form_open")
													.setAttribute(
															"href",
															$scope.conversation_id);

										});

					};

					$scope.convoStatus = function() {

						return endconvo;
					};

					// at the bottom of your controller
					var init = function() {
						// check if there is query in url
						$scope.sendMessage();
					};
					// and fire it after definition
					init();
				});

// social media controller
var  allData ;
function setAllData(data){
	hideLoading();
	allData = data;
	console.log(data);
	var scope = angular.element(
    	    document.
    	    getElementById("SMACtrl")).
    	    scope();
    
    scope.$apply(function () {
        scope.showCharts(data);
    });
    sourcesElement = document
	.getElementById('sources-chart');
setListener(sourcesElement,
	sourcesChart,"sources-chart-header");
sentimentsElement = document
	.getElementById('sentiments-chart');
setListener(sentimentsElement,
	sentimentsChart,"sentiments-chart-header");
tonesElement = document
	.getElementById('tones-chart');
setListener(tonesElement,
	tonesChart,"tones-chart-header");

}
function getAllData(client){
	$.ajax({
		 
        type: "GET",
                        //calling cross domain servelt using jquery ajax
            url: "https://stream-test.mybluemix.net/SMA?filtered=false&client="+client+"&callback=setAllData",
        dataType: 'jsonp',
        jsonpCallback: 'setAllData', // the jsonpCallback function to call
        async: false,
        global: false,
     
    
        error: function () {
               alert("Errr is occured");
                        }
                    });
	
	

}
function getFilteredData(query,column,client){
	$.ajax({
		 
        type: "GET",
                        //calling cross domain servelt using jquery ajax
            url: "https://stream-test.mybluemix.net/SMA?filtered=true&client="+client+"&column="+column+"&query="+query+"&callback=setAllData",
        dataType: 'jsonp',
        jsonpCallback: 'setAllData', // the jsonpCallback function to call
        async: false,
        global: false,
     
    
        error: function () {
               alert("Errr is occured");
                        }
                    });
	
	

}

var initial_load = true;

var stream = "a";
var filters = {};
Controllers
		.controller(
				"smaController",
				function($scope, $rootScope, $http, restservice, $cookieStore,
						$sce, $compile, $interval) {
					$scope.snippets = [];
				   $scope.call_sent = false;
					$scope.updateTrends = function() {
						// console.log("hello");
						// console.log($scope.item.code, $scope.item.name);
					}
					$scope.prepareFilter = function(data, col) {

						$scope.query = "";

						if (filters[col] == undefined) {
							filters[col] = [];
							filters[col].push(data);
						} else if (filters[col].indexOf(data) != -1) {
							filters[col].splice(filters[col].indexOf(data), 1);
							
							if (filters[col].length == 0) {
								var ele = document.getElementById(col+"-chart-header");
								ele.innerHTML = "";
								delete filters[col];
								
							}
						} else {
							filters[col].push(data);
						}
						filter_keys = Object.keys(filters);

						for ( var key in filter_keys) {
							// skip loop if the property is from prototype
							if (!filter_keys.hasOwnProperty(key))
								continue;

							// console.log(filter_keys[key]+"
							// :"+filters[filter_keys[key]]);
							data = filters[filter_keys[key]];
							var ele = document.getElementById(filter_keys[key]+"-chart-header");
							ele.innerHTML = filter_keys[key]+": ";
							console.log(data);
							for (index in data) {
								ele.innerHTML += data[index]+" ";
								console.log(ele);
								console.log(data[index] + "\n");
								$scope.query += "\"" + filter_keys[key]
										+ "\" like " + "\'" + data[index]
										+ "\'";
								if (index < data.length - 1) {
									$scope.query += " OR ";
								}
							}

							if (key < filter_keys.length - 1) {
								$scope.query += " AND ";
							}

						}
					}
					$scope.size = function(obj) {
						var size = 0, key;
						for (key in obj) {
							if (obj.hasOwnProperty(key))
								size++;
						}
						return size;
					};
					$scope.filterData = function(data, col) {
						
						if ($scope.call_sent == true)
							{
							//alert("data is already being fetched, please wait few seconds...");
							return;
							}
						
						if(col!= null){
							$scope.last_column = col;
						}
						else if ($scope.last_column== undefined){
							$scope.updateSentiments();
							return;
						}
						
						$scope.call_sent = true;

						showLoading();
						if(data.length > 0)
						$scope.prepareFilter(data, col);
						
						if ($scope.size(filters) <= 0) {
							$scope.query = "everything";
						}
						console.log($scope.query);
						
						getFilteredData($scope.query,$scope.last_column,localStorage.tablename)
						
						
						
						
						/*restservice
								.get(
										"",
										"sma_filter/text?query="
												+ $scope.query + "&querycol="
												+ $scope.last_column+"&clientname=" + localStorage.tablename, "UserAPI")
								.then(
										function(data) {
																				});*/

					}

					$scope.showCharts = function(data) {

						var sentimentsOverall = {};
						var sourcesOverall = {};
						var tonesOverall = {};
						var locationsOverall = {};
						var conceptsOverall = {};
						var keywordsOverall = {};
						var entitiesOverall = {};
						var trendsOverall = {};
						var entitiestrendsOverall = {};

						var setimentsng = {};
						var tonesng = {};
						var sourcesng = {};
						var locationsng = {};
						var keywordsng = {};
						var entitiesng = {};
						var trendsng = {};
						var entitiestrendsng = {};
						stream = "running";

						setimentsng = data.sentiments;
						tonesng = data.tones;
						sourcesng = data.sources;
						locationsng = data.locations;
						conceptsng = data.concepts;
						keywordsng = data.keywords;
						entitiesng = data.entities;
						// trendsng = data.concepts_trends;
						trendsng = null;
						// entitiestrendsng = data.entities_trends;
						entitiestrendsng = null;

						var toneKeys = Object.keys(tonesng);
						var sentimentKeys = Object.keys(setimentsng);
						var sourcesKeys = Object.keys(sourcesng);
						var locationsKeys = Object.keys(locationsng);
						var conceptsKeys = Object.keys(conceptsng);
						var keywordsKeys = Object.keys(keywordsng);
						var entitiesKeys = Object.keys(entitiesng);
						// var trendsKeys = Object.keys(trendsng);
						// var trendsKeys = Object.keys(trendsng);
						// var entitiestrendsKeys =
						// Object.keys(entitiestrendsng);

						var conceptsVal = [];
						var sentimentsVal = [];
						var sourcesVal = [];
						var locationsVal = [];
						var trendsVal = [];
						var locationsLabels = [];
						var sentimentsLabels = [];
						var tonesVal = [];
						var tonesLabel = [];
						var sourcesLabels = [];
						var conceptsLabels = [];
						// var trendsLabels = [];

						// parsing sentiments
						for (index in sentimentKeys) {

							if (sentimentsOverall[sentimentKeys[index]] == undefined) {
								sentimentsOverall[sentimentKeys[index]] = parseInt(data.sentiments[sentimentKeys[index]]);

							} else {
								sentimentsOverall[sentimentKeys[index]] = parseInt(data.sentiments[sentimentKeys[index]]);
							}
						}

						// parsing trends
						/*
						 * for(index in trendsKeys){
						 * 
						 * if (trendsOverall[trendsKeys[index]] == undefined){
						 * trendsOverall[trendsKeys[index]] =parseInt(
						 * data.concepts_trends[trendsKeys[index]]);
						 * 
						 * }else { trendsOverall[trendsKeys[index]] =parseInt(
						 * data.concepts_trends[trendsKeys[index]]); } }
						 * 
						 * 
						 * //parsing entitiestrendsOverall for(index in
						 * trendsKeys){
						 * 
						 * if (entitiestrendsOverall[entitiestrendsKeys[index]] ==
						 * undefined){
						 * entitiestrendsOverall[entitiestrendsKeys[index]]
						 * =parseInt(
						 * data.entities_trends[entitiestrendsKeys[index]]);
						 * 
						 * }else {
						 * entitiestrendsOverall[entitiestrendsKeys[index]]
						 * =parseInt(
						 * data.entities_trends[entitiestrendsKeys[index]]); } }
						 * 
						 */
						// parsing concepts
						for (index in conceptsKeys) {

							if (conceptsOverall[conceptsKeys[index]] == undefined) {
								conceptsOverall[conceptsKeys[index]] = parseInt(data.concepts[conceptsKeys[index]]);

							} else {
								conceptsOverall[conceptsKeys[index]] = parseInt(data.concepts[conceptsKeys[index]]);
							}
						}

						// parsing keywords
						for (index in keywordsKeys) {

							if (keywordsOverall[keywordsKeys[index]] == undefined) {
								keywordsOverall[keywordsKeys[index]] = parseInt(data.keywords[keywordsKeys[index]]);

							} else {
								keywordsOverall[keywordsKeys[index]] = parseInt(data.keywords[keywordsKeys[index]]);
							}
						}

						// parsing tones
						for (index in toneKeys) {

							if (tonesOverall[toneKeys[index]] == undefined) {
								tonesOverall[toneKeys[index]] = parseInt(data.tones[toneKeys[index]]);

							} else {
								tonesOverall[toneKeys[index]] = parseInt(data.tones[toneKeys[index]]);
							}
						}

						// parsing sources
						for (index in sourcesKeys) {

							if (sourcesOverall[sourcesKeys[index]] == undefined) {
								sourcesOverall[sourcesKeys[index]] = parseInt(data.sources[sourcesKeys[index]]);

							} else {
								sourcesOverall[sourcesKeys[index]] = parseInt(data.sources[sourcesKeys[index]]);
							}
						}

						// parsing locations
						for (index in locationsKeys) {

							if (locationsOverall[locationsKeys[index]] == undefined) {
								locationsOverall[locationsKeys[index]] = parseInt(data.locations[locationsKeys[index]]);

							} else {
								locationsOverall[locationsKeys[index]] = parseInt(data.locations[locationsKeys[index]]);
							}
						}

						// parsing entities
						for (index in entitiesKeys) {

							if (entitiesOverall[entitiesKeys[index]] == undefined) {
								entitiesOverall[entitiesKeys[index]] = parseInt(data.entities[entitiesKeys[index]]);

							} else {
								entitiesOverall[entitiesKeys[index]] = parseInt(data.entities[entitiesKeys[index]]);
							}
						}

						// data preparation sentiments
						var OvrlsentimentKeys = Object.keys(sentimentsOverall);
						for (index in OvrlsentimentKeys) {

							sentimentsLabels.push(OvrlsentimentKeys[index]);
							sentimentsVal
									.push(sentimentsOverall[OvrlsentimentKeys[index]]);
						}
						// data preparation tones
						var OvrltoneKeys = Object.keys(tonesOverall);
						for (index in OvrltoneKeys) {

							tonesLabel.push(OvrltoneKeys[index]);
							tonesVal.push(tonesOverall[OvrltoneKeys[index]]);
						}
						// data preparation sources
						var OvrltsourcesKeys = Object.keys(sourcesOverall);
						for (index in OvrltsourcesKeys) {

							sourcesLabels.push(OvrltsourcesKeys[index]);
							sourcesVal
									.push(sourcesOverall[OvrltsourcesKeys[index]]);
						}
						// data preparation locations
						var locationsDatasets = [];
						var OvrllocationsKeys = Object.keys(locationsOverall);
						for (index in OvrllocationsKeys) {
							var locationsDataset = {};
							locationsDataset.label = OvrllocationsKeys[index];
							locationsDataset.data = [ locationsOverall[OvrllocationsKeys[index]] ];
							locationsDataset.backgroundColor = getColor();
							locationsDatasets.push(locationsDataset);
						}

						// data preparation concepts
						var conceptsDatasets = [];
						var foamConcepts = [];
						var OvrlconceptsKeys = Object.keys(conceptsOverall);
						for (index in OvrlconceptsKeys) {
							var conceptsDataset = {};
							var foamData = {};
							conceptsDataset.text = OvrlconceptsKeys[index];
							conceptsDataset.weight = (conceptsOverall[OvrlconceptsKeys[index]] * 2);
							foamData.label = OvrlconceptsKeys[index];
							foamData.level = 0;
							foamData.weight = (conceptsOverall[OvrlconceptsKeys[index]]);
							conceptsDataset.handlers = {
								click : function() {
									conceptsEvt(jQuery(this).html());
								}
							};
							// console.log(conceptsDataset);
							foamConcepts.push(foamData);
							conceptsDatasets.push(conceptsDataset);

						}

						// data preparation keywords
						var keywordsDatasets = [];
						var OvrlkeywordsKeys = Object.keys(keywordsOverall);
						for (index in OvrlkeywordsKeys) {
							var keywordsDataset = {};
							keywordsDataset.text = OvrlkeywordsKeys[index];
							keywordsDataset.weight = (keywordsOverall[OvrlkeywordsKeys[index]] * 2);
							keywordsDataset.handlers = {
								click : function() {
									keywordsEvt(jQuery(this).html());
								}
							};
							keywordsDatasets.push(keywordsDataset);
						}

						// data preparation trends

						/*
						 * for(index in trendsKeys){
						 * console.log(trendsng[trendsKeys[index]]); var
						 * chartColors = [ 'rgb(255, 99, 132)', 'rgb(255, 159,
						 * 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)',
						 * 'rgb(54, 162, 235)', 'rgb(153, 102, 255)',
						 * 'rgb(231,233,237)' ]; if(index<6 &&
						 * trendsKeys[index]!= "trend_label_months"){
						 * 
						 * var data_ = { label: trendsKeys[index], borderColor:
						 * chartColors[index], backgroundColor:
						 * chartColors[index], fill: false, data:
						 * trendsng[trendsKeys[index]], yAxisID: "y-axis-1", };
						 * trendsDataSet.push(data_); }
						 *  }
						 * 
						 * //data preparation entities trends
						 * 
						 * 
						 * for(index in entitiestrendsKeys){
						 * console.log(entitiestrendsng[entitiestrendsKeys[index]]);
						 * var chartColors = [ 'rgb(255, 99, 132)', 'rgb(255,
						 * 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)',
						 * 'rgb(54, 162, 235)', 'rgb(153, 102, 255)',
						 * 'rgb(231,233,237)' ]; if(index<6 &&
						 * entitiestrendsKeys[index]!= "trend_label_months"){
						 * 
						 * var entitiesdata_ = { label:
						 * entitiestrendsKeys[index], borderColor:
						 * chartColors[index], backgroundColor:
						 * chartColors[index], fill: false, data:
						 * entitiestrendsng[entitiestrendsKeys[index]], yAxisID:
						 * "y-axis-1", };
						 * entitiestrendsDataSet.push(entitiesdata_); }
						 *  }
						 * 
						 * trendLabels = trendsng.trend_label_months;
						 */
						// updateTrends(trendsDataSet,trendsng.trend_label_months);
						// data preparation entities
						var entitiesDatasets = [];
						var foamEntities = [];
						var OvrlentitiesKeys = Object.keys(entitiesOverall);
						for (index in OvrlentitiesKeys) {
							var foamData = {};
							foamData.label = OvrlentitiesKeys[index];
							foamData.level = 0;
							foamData.weight = (entitiesOverall[OvrlentitiesKeys[index]]);
							foamEntities.push(foamData);
							var entitiesDataset = {
								label : OvrlentitiesKeys[index],
								backgroundColor : getColor(),
								borderColor : getColor(),
								borderWidth : 1,
								data : [ {
									x : randomScalingFactor(),
									y : randomScalingFactor(),
									r : entitiesOverall[OvrlentitiesKeys[index]]
								} ]

							};

							entitiesDatasets.push(entitiesDataset);
						}

						if (initial_load == true) {
							hideLoading();
						}
						initial_load = false;
						// updateLocations(locationsDatasets);
						updateSentiments(sentimentsVal, sentimentsLabels);
						updateTones(tonesVal, tonesLabel);
						updateSources(sourcesVal, sourcesLabels);
						updateConcepts(conceptsDatasets);
						updateKeywords(keywordsDatasets);
						foamtree1.set("dataObject", {
							groups : foamEntities
						});
						// updateFoamTree();
						// updateEntities(entitiesDatasets);
						console.log(data.content.body);
						if (data.content.body.length > 0) {
							snippetsTemp = data.content.body;
							$scope.snippets = [];
							for (index in snippetsTemp) {
								
								sourceText = snippetsTemp[index];
								snippetSource = sourceText.substr(
										sourceText.length - 10,
										sourceText.length);
								if (snippetSource.includes("facebook")) {
									$scope.snippets.push({
										text : sourceText,
										style : "fa fa-facebook"
									});
								} else if (snippetSource.includes("twitter")) {
									$scope.snippets.push({
										text : sourceText,
										style : "fa fa-twitter"
									});
								} else {
									$scope.snippets.push({
										text : sourceText,
										style : "fa fa-rss"
									});

								}
							}
						}
						$scope.call_sent = false;

					}

					$scope.updateSentiments = function() {
						if ($scope.call_sent == true)
							return;
						if (initial_load == true) {
							showLoading();
						}
						$scope.call_sent = true;

						getAllData(localStorage.tablename);
						//data = allData;
						//$scope.showCharts(data);

						
						/*restservice
								.get(
										"",
										"sma/text?clientname=" + localStorage.tablename,
										"UserAPI")
								.then(
										function(data) {

																			});
*/
					};
					$scope.updateAllData = function() {
						$scope.skipCol = true;
						$scope.filterData([],null);
					};

					// at the bottom of your controller
					var init = function() {
						// check if there is query in url

						$scope.updateSentiments();

					};
					// and fire it after definition
					init();
					// $scope.updateSentiments();

					$interval($scope.updateAllData, 60000);

				});


function login(data){
	if(data.auth == "true"){
		param = {};
		param.client_info  = data.client_info;
		localStorage.tablename = param.client_info;
		window.location.href = "sma.html?username="+param.client_info;
}
else{
$rootScope.uiMessage = "Invalid Credentials Provided";
}
}
Controllers.controller("loginController", function($scope, $rootScope, $http,
		restservice, $cookieStore, $sce, $compile, $interval) {
	
	$rootScope.uiMessage = "";
	$scope.user = {};
	$scope.login = function() {
		$rootScope.uiMessage = "";
		if(!$scope.user.username || !$scope.user.password){
			$rootScope.uiMessage = "Username and Password is Required";
			return false;
		}
		
	
	     $.ajax({
	 
	            type: "GET",
	                            //calling cross domain servelt using jquery ajax
	                url: "https://stream-test.mybluemix.net/Auth?username="+$scope.user.username+"&password="+$scope.user.password+"&callback=login",
	            dataType: 'jsonp',
	            jsonpCallback: 'login', // the jsonpCallback function to call
	            async: false,
	            global: false,
	         
	        
	            error: function () {
	                   alert("Errr is occured");
	                            },
	                            suceess:function(data){
	                            	
	                            	
	                            }
	                        });
	     
	     /*
		restservice.get("","Auth?callback=login&username="+$scope.user.username+"&password="+$scope.user.password  , "").then(
				function(data) {
					if(data.auth == "true"){
									$scope.param = {};
									$scope.param.client_info  = data.client_info;
									console.log($scope.param.client_info);
									localStorage.tablename = $scope.param.client_info;
									window.location.href = "sma.html?username="+$scope.user.username;
					}
					else{
						$rootScope.uiMessage = "Invalid Credentials Provided";
					}
			});
		*/
	};

	
});