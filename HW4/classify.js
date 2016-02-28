#!/usr/bin/env node

// Files that contain the data
const trainingFileA = 'hw4atrain.txt';
const testingFileA = 'hw4atest.txt';
const trainingFileB = 'hw4btrain.txt';
const testingFileB = 'hw4btest.txt';


/**
 * Classify.js
 *
 * Author: Daniel Kao
 *
 * In this problem, we look at the task of classifying images of digits 
 * again, but this time we will use perceptron instead of k-nearest 
 * neighbor classification in Homework 2. Download the files hw4atrain.txt 
 * and hw4atest.txt from the class website. These files contain your 
 * training and test data sets respectively.
 *
 **/


 // Load the data from the training file
console.log('Loading Data...');

// load math.js
var math = require('mathjs');
var fs = require('fs');

// Load Training Data
var trainingArray = loadDataFromFile(trainingFileA);
console.log('Training Data elements: ' + trainingArray.length + " dimension: " + trainingArray[0].length);

// Load Test Data
var testArray = loadDataFromFile(testingFileA);
console.log('Test Data elements: ' + testArray.length + " dimension: " + testArray[0].length + '\n');

// Build the hyperplane with one iteration and the test it
var hyperplane = perceptron(trainingArray, 1, [6]);
console.log('Testing Perceptron with training data...');
testHyperplane(trainingArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with training data...');
votedTestHyperplane(trainingArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with training data...');
averageTestHyperplane(trainingArray, hyperplane.voted, [6]);

console.log('Testing Perceptron with test data...');
testHyperplane(testArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with test data...');
votedTestHyperplane(testArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with test data...');
averageTestHyperplane(testArray, hyperplane.voted, [6]);
console.log();

// Build the hyperplane with two iterations and the test it
hyperplane = perceptron(trainingArray, 2, [6]);
console.log('Testing Perceptron with training data...');
testHyperplane(trainingArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with training data...');
votedTestHyperplane(trainingArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with training data...');
averageTestHyperplane(trainingArray, hyperplane.voted, [6]);

console.log('Testing Perceptron with test data...');
testHyperplane(testArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with test data...');
votedTestHyperplane(testArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with test data...');
averageTestHyperplane(testArray, hyperplane.voted, [6]);
console.log();

// Build the hyperplane with three iterations and the test it
hyperplane = perceptron(trainingArray, 3, [6]);
console.log('Testing Perceptron with training data...');
testHyperplane(trainingArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with training data...');
votedTestHyperplane(trainingArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with training data...');
averageTestHyperplane(trainingArray, hyperplane.voted, [6]);

console.log('Testing Perceptron with test data...');
testHyperplane(testArray, hyperplane.hyperplane, [6]);
console.log('Testing Voted Perceptron with test data...');
votedTestHyperplane(testArray, hyperplane.voted, [6]);
console.log('Testing Averaged Perceptron with test data...');
averageTestHyperplane(testArray, hyperplane.voted, [6]);
console.log();

// Load Training Data
trainingArray = loadDataFromFile(trainingFileB);
console.log('Training Data elements: ' + trainingArray.length + " dimension: " + trainingArray[0].length);

// Load Test Data
testArray = loadDataFromFile(testingFileB);
console.log('Test Data elements: ' + testArray.length + " dimension: " + testArray[0].length + '\n');

hyperplane = {};
for(var i = 0; i < 10; i++) {
	hyperplane[i] = perceptron(trainingArray, 1, [i]);
}

var confusionMatrix = Array.apply(null, Array(11)).map(function() {return Array.apply(null, Array(10)).map(Number.prototype.valueOf,0)});
var countArr = Array.apply(null, Array(10)).map(Number.prototype.valueOf,0);

// Loop through all the lines of the test array
for(var j in testArray) {

	// Get current line
	var currValidatingLine = testArray[j];
	var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
	currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);
	var label = getPerceptronLabel(currValidatingLine, hyperplane);
	countArr[parseInt(expected)]++;

	confusionMatrix[parseInt(label)][parseInt(expected)]++;
}

// Divide each by Nj
for(var i in confusionMatrix) {
	for(var j in confusionMatrix[i]) {
		confusionMatrix[i][j] = (confusionMatrix[i][j] / countArr[j]).toFixed(3);
	}
}


console.log();

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
 * Perceptron runs the perceptron algorithm on the vectors provided in 
 * vectors niter times.
 *
 */
function perceptron(vectors, niter, correct) {

	console.log('Building Hyperplane by running perceptron algorithm ' + niter + ' times for labels ' + correct + '...');

	var hyperplane = Array.apply(null, Array(vectors[0].length - 1)).map(Number.prototype.valueOf, 0);

	var voted = [];
	var iterations = 1;

	// If niter is not set, set it to 1
	if(!niter) {
		niter = 1;
	}

	// Run the perceptron algorithm niter times.
	for (var i = 0; i < niter; i++) {

		// Go through all of the vectors
		for(var j = 0; j < vectors.length; j++) {

			// Get current line
			var currValidatingLine = vectors[j];
			var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
			currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);

			expected = (correct.indexOf(expected) >= 0) ? 1 : -1;

			if(expected * math.dot(hyperplane, currValidatingLine) <= 0) {
				hyperplane = math.add(hyperplane, math.multiply(expected, currValidatingLine));
				voted = voted.concat([{hyperplane: hyperplane, count: iterations}]);
				iterations = 1;
			}
			else {
				iterations++;
			}
		}
	}

	return {
		hyperplane: hyperplane,
		voted: voted
	};
}

/**
 * Given a vector that represents the hyperplane of the decision boundary, 
 * iterate over all vectors to see the error generated by each.
 * 
 */
function testHyperplane(vectors, hyperplane, correct) {

	var bad = 0;

	// Go through all of the vectors
	for(var j = 0; j < vectors.length; j++) { 

		// Get current line
		var currValidatingLine = vectors[j];
		var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
		currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);

		expected = (correct.indexOf(expected) >= 0) ? 1 : -1;

		if(expected * math.dot(hyperplane, currValidatingLine) <= 0) {
			bad++;
		}
	}

	console.log('Tested Hyperplane with ' + (bad/vectors.length) * 100 + '% error');
}


/**
 * Given a vector that represents the hyperplane of the decision boundary, 
 * iterate over all vectors to see the error generated by each.
 * 
 */
function votedTestHyperplane(vectors, classifiers, correct) {

	var bad = 0;

	// Go through all of the vectors
	for(var j = 0; j < vectors.length; j++) { 

		// Get current line
		var currValidatingLine = vectors[j];
		var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
		currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);

		expected = (correct.indexOf(expected) >= 0) ? 1 : -1;

		var yes = 0;
		var no = 0;

		for(var i = 0; i < classifiers.length; i++) {
			if(math.dot(classifiers[i].hyperplane, currValidatingLine) <= 0) {
				no += classifiers[i].count;
			}
			else {
				yes += classifiers[i].count;
			}
		}

		var label = (yes >= no) ? 1 : -1;
		if(label != expected) {
			bad++;
		}
	}

	console.log('Tested Hyperplane with ' + (bad/vectors.length) * 100 + '% error');
}


/**
 * Given a vector that represents the hyperplane of the decision boundary, 
 * iterate over all vectors to see the error generated by each.
 * 
 */
function averageTestHyperplane(vectors, classifiers, correct) {

	var bad = 0;

	var hyperplane = Array.apply(null, Array(vectors[0].length - 1)).map(Number.prototype.valueOf, 0);
	
	for(var i = 0; i < classifiers.length; i++) {
		hyperplane = math.add(hyperplane, math.multiply(classifiers[i].count, classifiers[i].hyperplane));
	}

	// Go through all of the vectors
	for(var j = 0; j < vectors.length; j++) { 

		// Get current line
		var currValidatingLine = vectors[j];
		var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
		currValidatingLine = currValidatingLine.slice(0, currValidatingLine.length - 1);

		var label;
		expected = (correct.indexOf(expected) >= 0) ? 1 : -1;

		if(math.dot(hyperplane, currValidatingLine) >= 0) {
			label = 1;
		}
		else {
			label = -1;
		}

		if(label != expected) {
			bad++;
		}
	}

	console.log('Tested Hyperplane with ' + (bad/vectors.length) * 100 + '% error');
}


/**
 * Returns the label if there is only one. Returns 10 if there are 0 labels or multiple.
 */
function getPerceptronLabel(currValidatingLine, hyperplane) {

	var label;

	for(var i in hyperplane) {
		if(math.dot(hyperplane[i].hyperplane, currValidatingLine) >= 0) {
			if(label) {
				return 10;
			}
			else {
				label = i;
			}
		}
	}

	if(label) {
		return label;
	}
	return 10;
}