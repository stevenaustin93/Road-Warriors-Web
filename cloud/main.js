// Global variable containing results of all box queries
var allQueryResults;

/**
 * Gets route shapepoints between two locations.
 * Locations can be addressed or latitudes and 
 * longitudes in the form lat,lng.
 */
Parse.Cloud.define("route", function(request, response) {
	var startLocation = request.params.startLocation;
	var endLocation = request.params.endLocation;

	Parse.Cloud.httpRequest({
		method: "POST",
		url: 'http://open.mapquestapi.com/directions/v2/alternateroutes?key=Hz2Lsm9irTo3KVc4fLxPFKBCpxyQX8Uj',
		headers: {
			'Content-Type': 'application/json'
		},
		body: {
			maxRoutes: 3,
			locations: [
				startLocation,
				endLocation
			],
			options: {
				fullShape: true,
				shapeFormat: "raw",
				narrativeType: "text"
			}
		}
	}).then(function(httpResponse) {
		var routeData = httpResponse['data']['route'];
		response.success(organizeData(routeData));
	}, function(httpResponse) {
		response.error("Error" + httpResponse.text);
	});
});

/**
* Gets the posted speed limit of a road if exists.
* Uses latitude and longitude. If the posted
* speed limit is not known, 999 is returned.
*/
Parse.Cloud.define("speedLimit", function(request, response) {
        var lat = request.params.lat;
        var lng = request.params.lng;
        var waypoint = lat + "," + lng;
 
        var METERS_PER_SECOND_TO_MILES_PER_HOUR = 2.23694;
 
        Parse.Cloud.httpRequest({
                url: 'https://route.st.nlp.nokia.com/routing/6.2/getlinkinfo.json',
                headers:{
                        'Content-Type':'application/json'
                },
                params: {
                        waypoint: waypoint,
                        app_id: 'CKyYbS8jSu3supUT965r',
                        app_code: 'arqPVZK-UAoZZ1lUx4Q45w'
                }
        }).then(function(httpResponse) {
                var link = httpResponse['data']['Response']['Link'][0];
                var speedLimit = 999;
               
                if (link.hasOwnProperty('SpeedLimit')) {
                        var speedLimitMetersPerSecond = link['SpeedLimit'];
                        speedLimit = Math.ceil(speedLimitMetersPerSecond * METERS_PER_SECOND_TO_MILES_PER_HOUR);
                }
                response.success(speedLimit);
        }, function(httpResponse) {
                response.error(httpResponse.error);
        });
 
});

/**
 * Calls the RateSafety function and responds with a number
 *
 */
Parse.Cloud.define("rateSafety", function(request, response) {

	//did this change?

	var shapeArray = request.params.shapeArray;

	// Get all boxes along route
	var boxList = AllBoxes(shapeArray);

	// Create a set of queries where size <= 1000
	var queryList = ConvertToQueries(boxList);

	var boxQuery = Parse.Object.extend("generalTable");
	var query = new Parse.Query(boxQuery);

	var superResults = new Array();

	var counter = 0;

	var maxCount = queryList.length-1;

	console.log("[INFO] Attempting to submit " + queryList.length + " queries...");

	for (var i = 0; i < queryList.length; i++) {
		var queryObject = queryList[i];

		var querySize = ((queryObject.maxRow - queryObject.minRow)) * ((queryObject.maxCol - queryObject.minCol));

		query.lessThan("row", queryObject.maxRow);
		query.lessThan("col", queryObject.maxCol);
		query.greaterThan("row", queryObject.minRow);
		query.greaterThan("col", queryObject.minCol);
		
		console.log("Attempting query...");
		query.limit(querySize);

		query.find().then(function(results){

			console.log("Query success, # results=" + results.length);

			superResults = superResults.concat(results);

		}).then(function(){
			counter++;
			// limit the max # of queries to 20
			if ((counter >= maxCount) || (counter > 20)) {
				console.log("Reached end of query list, total # results =" + superResults.length);
				var returnValue = AverageSafety(boxList, superResults);
				returnValue = returnValue.toPrecision(3);
				response.success(returnValue);
			}
		});
	}
	
});

function AverageSafety(desiredBoxList, queryResults) {
	// desiredBoxList is a 2D array
	// queryResults is a 1D array of objects
	var neededBoxes = new Array();

	// Loop through every queryResult and see if we have a matching row/col pair in desired box list
	for (var i = 0; i < queryResults.length; i++) {
		var qrow = queryResults[i].get('row');
		var qcol = queryResults[i].get('col');

		for (var j = 0; j < desiredBoxList.length; j++) {
			if ( (desiredBoxList[j][0] === qrow) && (desiredBoxList[j][1] === qcol) ) {
				neededBoxes.push(queryResults[i]);
			}
		}
	}

	// Average the safety ratings of the neededBox list
	var sum = 0;
	for (var i = 0; i < neededBoxes.length; i++) {
		sum += neededBoxes[i].get('safety');
	}

	avg = (sum / neededBoxes.length);

	return ( avg );
}

/**
 * Organizes the data from the route oject.
 * This includes the suggested route, as well
 * as up to three alternate routes.
 */
function organizeData(routeData) {
	var routes = [];

	// For the suggested route
	routes.push(getRouteObject(routeData));

	/** 
	 * For the possible alternate routes. 
	 * Checks to make sure alternate routes are availble first.
	 */
	if (routeData.hasOwnProperty('alternateRoutes')) {
		for (index = 0; index < routeData['alternateRoutes'].length; index++) {
			routes.push(getRouteObject(routeData['alternateRoutes'][index]['route']));
		}
	}

	return routes;
}

/**
 * Organizes 1D alternating latitudes
 * and longitudes into object with a seperate array
 * for both along with other route data.
 */
function getRouteObject(route) {

	var shapePoints = route['shape']['shapePoints'];

	var routeObject = {
		lat: [],
		lng: [],
		narrative: [],
		time: "",
		distance: "",
	};

	var SECONDS_PER_MINUTE = 60;
	routeObject.time = Number(route['time']) / SECONDS_PER_MINUTE;
	routeObject.distance = route['distance'];

	for (index = 0; index < shapePoints.length; index += 2) {
		routeObject.lat.push(shapePoints[index]);
		routeObject.lng.push(shapePoints[index + 1]);
	}

	var maneuvers = route['legs'][0]['maneuvers'];

	for (index = 0; index < maneuvers.length; index++) {
		routeObject.narrative.push(maneuvers[index]['narrative']);
	}

	return (routeObject);
}

/**
 * Takes in a route (in the form of an array of GPS coordinates along route) 
 * and determines a safety rating
 */
/*
function RateTheSafety(shapeArray) {

	// Get all boxes along route
	var boxList = AllBoxes(shapeArray);

	// Create a set of queries where size <= 1000
	var queryList = ConvertToQueries(boxList);

	var promises = new Array();

	for (var i = 0; i < queryList.length; i++) {
		var p = Parse.Promise.as( SubmitQuery(queryList[i]) );
	}

	Parse.Promise.when(promises).then(function(){
		// merge results of queries
	});





	
	// Huge array of box objects
	allQueryResults = new Array();

	
	// Determine expected size of results length
	var totalSize = 0;
	for (var i = 0; i < queryList.length; i++) {
		totalSize += ((queryList[i].maxRow - queryList[i].minRow)) * ((queryList[i].maxCol - queryList[i].minCol));
	}

	console.log("Expected number of results:" + totalSize);
	// Submit queries
	for (var i = 0; i < queryList.length; i++) {
		SubmitQuery(queryList[i]);
	}

	//Wait for querying to finish
	//while (allQueryResults.length < 50) {
	// This is a bad statement to run
	//}

	var safetyRating = NetSafetyRating(allQueryResults);



	return promise;
	

}
*/


/**
 * Submits a query 
 */
 /*
function SubmitQuery(queryObject) {

	var boxQuery = Parse.Object.extend("generalTable");
	var query = new Parse.Query(boxQuery);

	
	//console.log("Querying for row range {" + queryObject.minRow + "-->" + queryObject.maxRow + "}");
	//console.log("Querying for col range {" + queryObject.minCol + "-->" + queryObject.maxCol + "}");
	var querySize = ((queryObject.maxRow - queryObject.minRow)) * ((queryObject.maxCol - queryObject.minCol));

	query.lessThan("row", queryObject.maxRow);
	query.lessThan("col", queryObject.maxCol);
	query.greaterThan("row", queryObject.minRow);
	query.greaterThan("col", queryObject.minCol);
	

	console.log("Attempting query...");
	query.limit(10);

	query.find().then(function(results){
		console.log("Query completed.");
		return (results);
	});

	
	query.find({

		success: function(results) {
			console.log("Query completed");
			MergeQueries(results);

		},

		error: function(error) {
			console.log("Query Error: " + error.code + " " + error.message);
		}

	});
	
}
*/


/**
 * Merges the queries when they finish
 */
 /*
function MergeQueries(results) {

	console.log("Finished a query, size:" + results.length);

	allQueryResults.concat(results);

}
*/

/**
 * Converts 2D array of lat longs to grid points
 */
function LatLongToRowCol(coords) {

	//console.log("[INFO][START] Converting GPS shapepoints to row/col...")

	var row = 0;
	var col = 0;
	var gridSpots = new Array();

	// Loop through array and perform relevant conversion formula on each entry and push to new array
	for (var i = 0; i < coords.length; i++) {

		row = Math.floor((coords[i][0] - 35) / 0.00005);
		col = Math.floor((coords[i][1] + 90) / 0.00005);

		gridSpots.push([row, col]);

		//console.log("[INFO] Converted (" + coords[i][0] + "," + coords[i][1] + ") --> (" +
		//	row + "," + col + ")");

	}

	// Return converted list of row/col pairs
	//console.log("[INFO][END] Finished converting GPS shapepoints to row/col.");
	return (gridSpots);
}

/**
 * Gets all boxes between all shape points along a route
 */
function AllBoxes(pointsArray) {

	//console.log("[INFO][START] Starting getting all boxes along entire route...");

	var coordArray = new Array();
	var boxes = new Array();
	//var tempArray = new Array();
	coordArray = LatLongToRowCol(pointsArray);

	//console.log("[INFO] This route contains " + (coordArray.length - 1) + " segments");

	for (var i = 0; i < coordArray.length - 1; i++) {

		var boxesAlongLine = WhatBoxes(coordArray[i][0], coordArray[i][1], coordArray[i + 1][0], coordArray[i + 1][1]);

		//console.log("[INFO] Adding boxes along line segment [ID=" + i + "] to list of all boxes");
		//console.log("Found " + boxesAlongLine.length + " boxes on line segment [ID=" + i + "]");

		boxes = boxes.concat(boxesAlongLine);

	}

	//console.log("[INFO][END] Finished getting all boxes along entire route...");
	//console.log("[INFO] There are " + boxes.length + " boxes along this route.");
	return (boxes);
}

/** 
 * Finds boxes the route goes through given two row/col pairs
 */
function WhatBoxes(row1, col1, row2, col2) {
	var returnArray = new Array();
	if (row1 == row2) { //tests horizontle case
		var i = 0;
		if (col1 > col2) { //tests positive horizontle case
			for (i = col2; i <= col1; i++) {
				returnArray.push([row1, i]);
			}
		} else if (col1 < col2) { //tests horizontle negative case
			for (i = col1; i <= col2; i++) {
				returnArray.push([row1, i]);
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	else if (col1 == col2) { //tests vertical case
		var i = 0;
		if (row1 > row2) { //tests vertical negative case
			for (i = row2; i <= row1; i++) {
				returnArray.push([i, col1]);
			}
		} else if (row1 < row2) { //tests vertical positive case
			for (i = row1; i <= row2; i++) {
				returnArray.push([i, col1]);
			}
		}
	}
	////////////////////////////////////////////////////////////////////////
	//captures every other case, slopes greater than 1, less than -1, 
	//between 0 and 1, and between 0 and -1 as well as the positive and
	//negative cases of each of those cases
	else {
		var slope = (row2 - row1) / (col2 - col1);
		var tempSlope = slope;
		var rowTemp, colTemp;
		rowTemp = row1;
		colTemp = col1;
		/////////////////////////////////
		if (slope == 1) { //tests slope =1 case
			if (row1 < row2) { //tests positive case of slope =1 
				while (rowTemp <= row2) {
					returnArray.push([rowTemp, colTemp]);
					rowTemp++;
					colTemp++;
				}
			} else if (row1 > row2) { //tests negative case of slope = 1
				while (rowTemp >= row2) {
					returnArray.push([rowTemp, colTemp]);
					rowTemp--;
					colTemp--;
				}
			}
		}
		/////////////////////////////////
		else if (slope == -1) { //tests slope =-1 case
			if (row1 < row2) { //tests positive case of slope =-1
				while (row2 >= rowTemp) {
					returnArray.push([rowTemp, colTemp]);
					rowTemp++;
					colTemp--;
				}
			} else if (row1 > row2) { //tests negative case of slope =-1
				while (row2 <= rowTemp) {
					returnArray.push([rowTemp, colTemp]);
					rowTemp--;
					colTemp++;
				}
			}
		}
		////////////////////////////////////////
		else if (slope > 0 && slope < 1) { //positive slope less then 1
			if (col1 < col2) { //positive case of + slope < 1
				while (rowTemp <= row2 && colTemp <= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope <= 0.5) {
						colTemp++;
						tempSlope = tempSlope * 2;
					} else if (tempSlope > 0.5) {
						rowTemp++;
						tempSlope = slope;
					}
				}
			} else if (col1 > col2) { //negative case of + slope < 1
				while (rowTemp >= row2 && colTemp >= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope <= 0.5) {
						colTemp--;
						tempSlope = tempSlope * 2;
					} else if (tempSlope > 0.5) {
						rowTemp--;
						tempSlope = slope;
					}
				}
			}
		}
		//////////////////////////////////////////////////
		else if (slope < 0 && slope > -1) { //tests cases where slope is between 0 and -1
			if (col1 < col2) { //positive case
				while (rowTemp >= row2 && colTemp <= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope >= -0.5) {
						colTemp++;
						tempSlope = tempSlope * 2;
					} else if (tempSlope < -0.5) {
						rowTemp--;
						tempSlope = slope;
					}
				}
			} else if (col1 > col2) { //negative case
				while (rowTemp <= row2 && colTemp >= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope >= -0.5) {
						colTemp--;
						tempSlope = tempSlope * 2;
					} else if (tempSlope < -0.5) {
						rowTemp++;
						tempSlope = slope;
					}
				}
			}
		}
		///////////////////////////////////////////////
		else if (slope > 1) { //tests cases where slope > 1
			if (row1 < row2) { //positive case
				while (rowTemp <= row2 && colTemp <= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope > 1) {
						rowTemp++;
						tempSlope = tempSlope / 2;
					} else if (tempSlope <= 1) {
						colTemp++;
						tempSlope = slope;
					}
				}
			} else if (row1 > row2) { //negative case
				while (rowTemp >= row2 && colTemp >= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope > 1) {
						rowTemp--;
						tempSlope = tempSlope / 2;
					} else if (tempSlope <= 1) {
						colTemp--;
						tempSlope = slope;
					}
				}
			}
		}
		////////////////////////////////////////////////
		else if (slope < -1) { // tests cases for slope < -1
			if (row1 > row2) {
				while (rowTemp >= row2 && colTemp <= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope < -1) { //positive case
						rowTemp--;
						tempSlope = tempSlope / 2;
					} else if (tempSlope >= -1) {
						colTemp++;
						tempSlope = slope;
					}
				}
			} else if (row1 < row2) { //negative case
				while (rowTemp <= row2 && colTemp >= col2) {
					returnArray.push([rowTemp, colTemp]);
					if (tempSlope < -1) {
						rowTemp++;
						tempSlope = tempSlope / 2;
					} else if (tempSlope >= -1) {
						colTemp--;
						tempSlope = slope;
					}
				}
			}
		}

	}
	return (returnArray);
}

/**
 * Converts a set of boxes to a set of queries
 */
function ConvertToQueries(boxList) {

	//console.log("[INFO][START] Creating query set...");

	// Initialization and declarations

	// Process:
	// 1. Select starting box
	// 2. Get next box
	//   a. If next bos is in selection, go to step 2
	//   b. Else does this next box put us over the query size limit (1000)?
	// 		i. If over limit, create query in array and reset the tracking variables
	//     ii. Else, get the next box

	// Select starting box
	var SIZE_LIMIT = 1000;
	var width = 1;
	var height = 1;
	var arrayOfQueries = new Array();

	var startBox = {
		row: boxList[0][0],
		col: boxList[0][1]
	};

	var prevBox = {
		row: [],
		col: []
	};

	var currBox = {
		row: [],
		col: []
	};
	//console.log("---Max size: " + SIZE_LIMIT + "---");
	//console.log("---Start box: (" + startBox.row + "," + startBox.col + ")---");

	for (var i = 1; i < boxList.length; i++) {
		// Set current and next boxes
		prevBox.row = boxList[i - 1][0];
		prevBox.col = boxList[i - 1][1];
		currBox.row = boxList[i][0];
		currBox.col = boxList[i][1];

		prevWidth = width;
		prevHeight = height;
		//console.log("Prev box: (" + prevBox.row + "," + prevBox.col + ")");
		//console.log("Curr box: (" + currBox.row + "," + currBox.col + ")");


		// Check advancement and adjust accordingly (for rows)
		if (currBox.row > prevBox.row) {
			// If we have positive advancement, simply update height
			height += currBox.row - prevBox.row;

		} else if (currBox.row < prevBox.row) {
			// If we have negative advancement, check to see if it is in selection, if it is not then change start box
			//console.log("! Negative row advancement");
			//console.log("! Curr row: " + currBox.row + " Start box: (" + startBox.row + "," + startBox.col + ")");
			if (currBox.row < startBox.row) {
				// Current box is not in selection! Change startbox row
				startBox.row = currBox.row;
				//console.log("!! Moved start box: (" + startBox.row + "," + startBox.col + ")");
				++height;
			}

		} // Else there is no advancement, don't change anything

		// Check advancement and adjust accordingly (for cols)
		if (currBox.col > prevBox.col) {
			// If we have positive advancement, simply update width
			width += currBox.col - prevBox.col;

		} else if (currBox.col < prevBox.col) {
			// If we have negative advancement, check to see if it is in selection, if it is not then change start box
			//console.log("! Negative col advancement");
			//console.log("! Curr col: " + currBox.col + " Start col: " + startBox.col);
			if (currBox.col < startBox.col) {
				// Current box is not in selection! Change startbox col
				startBox.col = currBox.col;
				//console.log("!! Moved start box: (" + startBox.row + "," + startBox.col + ")");
				++width;
			}

		} // Else there is no advancement, don't change anything

		//console.log("Curr selection size: [" + (height * width) + "]");

		// Check to see if we are at the end of the route
		if (i == (boxList.length - 1)) {

			//console.log("!!! Reached end of route");

			if ((height * width) > SIZE_LIMIT) {

				//console.log("! (part 1) End of route query too large, splitting, creating query, limits: (" +
				//	startBox.row + "," + startBox.col + ") --> (" + prevBox.row + "," + prevBox.col + ")");

				var queryObject = {
					maxRow: startBox.row + prevHeight,
					minRow: startBox.row,
					maxCol: startBox.col + prevWidth,
					minCol: startBox.col
				};

				arrayOfQueries.push(queryObject);

				//console.log("! (part 2) End of route query too large, splitting, creating query, limits: (" +
				//	currBox.row + "," + currBox.col + ") --> (" + currBox.row + "," + currBox.col + ")");

				queryObject = {
					maxRow: currBox.row,
					minRow: currBox.row,
					maxCol: currBox.col,
					minCol: currBox.col
				};

				arrayOfQueries.push(queryObject);

			} else {
				//console.log("!!! End of route, creating final query, limits: (" +
				//	startBox.row + "," + startBox.col + ") --> (" + currBox.row + "," + currBox.col + ")");

				var queryObject = {
					maxRow: startBox.row + height,
					minRow: startBox.row,
					maxCol: startBox.col + width,
					minCol: startBox.col
				};

				arrayOfQueries.push(queryObject);

			}

		} else if ((height * width) > SIZE_LIMIT) {
			// If area is beyond the size limit, create a query and add it to our array of queries
			//console.log("!!! Size limit reached (" + SIZE_LIMIT + ") creating query, limits: (" +
			//	startBox.row + "," + startBox.col + ") --> (" + prevBox.row + "," + prevBox.col + ")");

			var queryObject = {
				maxRow: startBox.row + prevHeight,
				minRow: startBox.row,
				maxCol: startBox.col + prevWidth,
				minCol: startBox.col
			};

			arrayOfQueries.push(queryObject);

			// Also reset the tracking variables
			startBox.row = currBox.row;
			startBox.col = currBox.col;
			//console.log("---Setting new start box: (" + startBox.row + "," + startBox.col + ")---");
			width = 1;
			height = 1;
		}

		// Else advance to the next box 
		//console.log("--Advancing--")
	}

	// Print out queries
	for (var i = 0; i < arrayOfQueries.length; i++) {
		var querySize = ((arrayOfQueries[i].maxRow - arrayOfQueries[i].minRow)) * ((arrayOfQueries[i].maxCol - arrayOfQueries[i].minCol));
		//console.log("Query #: " + i + ", Size: " + querySize);
	}

	//console.log("[INFO][END] Finished creating query set.");
	return (arrayOfQueries);

}