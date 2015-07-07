//
// localTesting.js
// This is a sample file that tests the full route shape points --> safety rating process
//

//
// Testing, on document ready begin the process
$(document).ready(function() {

	// This is a 9 step process:

	// 0. Assume input is a 2D array of shape points (list of significant GPS lat/lng pairs along a route)
	/*
	var testShapepoints = [[42.34345, -85.33311],
			 [42.51111, -86.22212],
			 [42.44444, -85.88888],
			 [42.33333, -85.99999]];
			 */

	var testShapepoints = [
		[42.242753, -83.745882],
		[42.25, -83.746],
		[42.266804, -83.748016]
	];

	///// 
	// Steps 1 - 3 are accomplished by "allBoxes" function
	// 1. Convert shape points to row/col boxes (format of General Table)
	// 2. Determine all boxes along the line between step 1 boxes (forms a contiguous set of boxes)
	// 3. Concatenate the results of step 2 into a super-list
	var allBoxList = AllBoxes(testShapepoints);

	// 4. Divide superlist into a set of queries with max size = 1000 boxes
	var queryList = ConvertToQueries(allBoxList);

	// 5. Submit queries
	SubmitQueries(queryList);

	/////
	// The rest of this code is carried out in a callback function, but this is the basic overview:
	// 6. Wait for queries to finish and merge results of query into super-result
	// 7. Get list of necessary data from boxes along route from super-result
	// 8. Perform weighted average of box data
	// 9. Return weighted average 

	

});

//
// Submits up to 600 queries (burst limit for Parse) and waits for results to finish
function SubmitQueries(queryList) {
	
}

//
// Converts 2D array of lat longs to grid points
function LatLongToRowCol(coords) {

	console.log("[INFO][START] Converting GPS shapepoints to row/col...")

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
	console.log("[INFO][END] Finished converting GPS shapepoints to row/col.");
	return (gridSpots);
}

//
// Gets all boxes between all shape points along a route
function AllBoxes(pointsArray) {

	console.log("[INFO][START] Starting getting all boxes along entire route...");

	var coordArray = new Array();
	var boxes = new Array();
	//var tempArray = new Array();
	coordArray = LatLongToRowCol(pointsArray);

	console.log("[INFO] This route contains " + (coordArray.length - 1) + " segments");

	for (var i = 0; i < coordArray.length - 1; i++) {

		var boxesAlongLine = WhatBoxes(coordArray[i][0], coordArray[i][1], coordArray[i + 1][0], coordArray[i + 1][1]);

		//console.log("[INFO] Adding boxes along line segment [ID=" + i + "] to list of all boxes");
		//console.log("Found " + boxesAlongLine.length + " boxes on line segment [ID=" + i + "]");

		boxes = boxes.concat(boxesAlongLine);

	}

	console.log("[INFO][END] Finished getting all boxes along entire route...");
	console.log("[INFO] There are " + boxes.length + " boxes along this route.");
	return (boxes);
}

// 
// Finds boxes the route goes through given two row/col pairs
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

//
// Converts a set of boxes to a set of queries
function ConvertToQueries(boxList) {

	console.log("[INFO][START] Creating query set...");

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

			console.log("!!! Reached end of route");

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
		console.log("Query #: " + i + ", Size: " + querySize);
	}

	console.log("[INFO][END] Finished creating query set.");
	return (arrayOfQueries);

}