#!/usr/bin/env node

// Files that contain the data
const trainingFile = 'hw2train.txt';
const validateFile = 'hw2validate.txt';
const testingFile = 'hw2test.txt';

// K values to run
const k = [1, 3, 5, 11, 16, 21];
//const k = [];


/**
 * Classify.js
 *
 * Author: Daniel Kao
 *
 * In this problem, we look at the task of classifying images of digits using 
 * k-nearest neighbor classification. Download the files hw2train.txt, 
 * hw2validate.txt and hw2test.txt from the class website. These files contain 
 * your training, validation and test data sets respectively.
 *
 **/

// Load the data from the training file
console.log('Loading Data...');

var fs = require('fs');

// Load Training Data
var trainingArray = loadDataFromFile(trainingFile);
console.log('Training Data elements: ' + trainingArray.length + " dimension: " + trainingArray[0].length);

// Load Validation Data
var validatingArray = loadDataFromFile(validateFile);
console.log('Validation Data elements: ' + validatingArray.length + " dimension: " + validatingArray[0].length);

// Load Validation Data
var testArray = loadDataFromFile(testingFile);
console.log('Test Data elements: ' + testArray.length + " dimension: " + testArray[0].length + '\n');

// Validate each KNN Classifier
for(var i in k) {
	var currk = k[i];

	console.log('Running on Training Data for K = ' + currk + '...');

	var resTraining = runOnData(trainingArray, trainingArray);

	console.log("Correct Labels: " + resTraining.correct + " Incorrect Labels: " + resTraining.incorrect + " Percent Error: " + (Math.floor((resTraining.incorrect / (resTraining.correct + resTraining.incorrect)) * 100000) / 1000) + '%');

	console.log('Running on Validation Data for K = ' + currk + '...');

	var resValidate = runOnData(validatingArray, trainingArray);

	console.log("Correct Labels: " + resValidate.correct + " Incorrect Labels: " + resValidate.incorrect + " Percent Error: " + (Math.floor((resValidate.incorrect / (resValidate.correct + resValidate.incorrect)) * 100000) / 1000) + "%");

	console.log('Running on Test Data for K = ' + currk + '...');

	var resTest = runOnData(testArray, trainingArray);

	console.log("Correct Labels: " + resTest.correct + " Incorrect Labels: " + resTest.incorrect + " Percent Error: " + (Math.floor((resTest.incorrect / (resTest.correct + resTest.incorrect)) * 100000) / 1000) + "% \n");
}

// Generate confusion matrix for k = 3.
const confusionk = 3;

console.log("Generating Confusion Matrix for K = " + confusionk + '...');

// Create 10x10 array of zeros
var confusionMatrix = Array.apply(null, Array(10)).map(function() {return Array.apply(null, Array(10)).map(Number.prototype.valueOf,0)});
var countArr = Array.apply(null, Array(10)).map(Number.prototype.valueOf,0);

// Loop through all the lines of the test array
for(var j in testArray) {

	// Get current line
	var currValidatingLine = testArray[j];
	var expected = currValidatingLine[currValidatingLine.length - 1];
	currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);
	var label = getNearestLabel(confusionk, currValidatingLine, testArray);
	countArr[parseInt(expected)]++;

	confusionMatrix[parseInt(label)][parseInt(expected)]++;
}

// Divide each by Nj
for(var i in confusionMatrix) {
	for(var j in confusionMatrix[i]) {
		confusionMatrix[i][j] = (confusionMatrix[i][j] / countArr[j]).toFixed(3);
	}
}

// Print the confusion array
for(var j in confusionMatrix) {
	console.log(JSON.stringify(confusionMatrix[j]));
}




console.log();

const trainingFile4 = 'hw4btrain.txt';
const testingFile4 = 'hw4btest.txt';

// Load Training Data
var trainingArray = loadDataFromFile(trainingFile4);
console.log('Training Data elements: ' + trainingArray.length + " dimension: " + trainingArray[0].length);

// Load Validation Data
var testArray = loadDataFromFile(testingFile4);
console.log('Test Data elements: ' + testArray.length + " dimension: " + testArray[0].length + '\n');

// Generate confusion matrix for k = 3.
console.log("Generating HW4 Confusion Matrix for K = " + confusionk + '...');

// Create 10x10 array of zeros
confusionMatrix = Array.apply(null, Array(10)).map(function() {return Array.apply(null, Array(10)).map(Number.prototype.valueOf,0)});
countArr = Array.apply(null, Array(10)).map(Number.prototype.valueOf,0);

// Loop through all the lines of the test array
for(var j in testArray) {

	// Get current line
	var currValidatingLine = testArray[j];
	var expected = currValidatingLine[currValidatingLine.length - 1];
	currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);
	var label = getNearestLabel(confusionk, currValidatingLine, trainingArray);
	countArr[parseInt(expected)]++;

	confusionMatrix[parseInt(label)][parseInt(expected)]++;
}

// Divide each by Nj
for(var i in confusionMatrix) {
	for(var j in confusionMatrix[i]) {
		confusionMatrix[i][j] = (confusionMatrix[i][j] / countArr[j]).toFixed(3);
	}
}

// Print the confusion array
for(var j in confusionMatrix) {
	console.log(JSON.stringify(confusionMatrix[j]));
}


/////////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////////

/**
 * Loads the data from the specified file
 *
 */
function loadDataFromFile(file) {
	var arr = fs.readFileSync(file).toString().split('\n');	
	arr = arr.slice(0, arr.length - 1);	
	for(var i in arr) {
		arr[i] = arr[i].split(' ');
		arr[i] = arr[i].slice(0, arr[i].length - 1);
	}
	return arr;
}

/**
 * Calculates the distance between two points.
 *
 */
function getDistance(p1, p2) {

	// Base Case return -1 if different lengths
	if(p1.length != p2.length) {
		return -1;
	}

	// Use Euclidean distance formula for computation
	var sum = 0;
	for (var i = 0; i < p1.length; i++) {
		sum += Math.pow((parseFloat(p1[i]) - parseFloat(p2[i])), 2);
	}

	// Returns the square root of the sum
	return Math.sqrt(sum);
}

/**
 * Returns the n closest neighbors
 *
 */
function getNClosest(k, currValidatingLine, trainingArray) {

	// Stores all of our counts
	var closest = [];

	for(var i = 0; i < trainingArray.length; i++) {

		// Get the lines and calculate the distances
		var currTrainingLine = trainingArray[i];
		var currTrainingLabel = trainingArray[i][trainingArray[i].length - 1];
		currTrainingLine = currTrainingLine.slice(0, trainingArray[i].length - 1);
		var distance = getDistance(currTrainingLine, currValidatingLine);

		// Add the element to the array
		closest = closest.concat([{
			'index': i,
			'distance': distance,
			'label': currTrainingLabel
		}]);

		// Sort the array
		closest.sort(function(a, b) {return a.distance - b.distance});
		
		// Remove the one that does not belong
		if(closest.length > k) {
			closest = closest.slice(0, k);
		}
	}
	return closest;
}

/**
 * Returns the Label of the line that has k closest neighbors
 *
 */
function getNearestLabel(k, currValidatingLine, trainingArray) {

	// Stores all of our counts
	var count = {};

	var closest = getNClosest(k, currValidatingLine, trainingArray);

	for(var i in closest) {
		if(!count[closest[i].label]) {
			count[closest[i].label] = 0;
		}
		count[closest[i].label]++;
	}

	var label, largest = 0;
	for(var i in count) {
		if(count[i] >= largest) {
			label = i;
			largest = count[i];
		}
	}
	return label;
}

/**
 * Runs the test array on the data array.
 * 
 */
function runOnData(test, data) {

	var res = {
		'incorrect': 0,
		'correct': 0
	};

	// Loop through all the lines of the validation array
	for(var j in test) {

		// Get current line
		var currValidatingLine = test[j];
		var expected = currValidatingLine[currValidatingLine.length - 1];
		currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);

		// Get the nearest lines
		if(expected != getNearestLabel(currk, currValidatingLine, data)) {
			res.incorrect++;
		}
		else {
			res.correct++;
		}
	}

	return res;
}