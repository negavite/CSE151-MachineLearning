#!/usr/bin/env node

// Files that contain the data
const trainingFile = 'hw5train.txt';
const testingFile = 'hw5test.txt';


/**
 * Classify.js
 *
 * Author: Daniel Kao
 *
 * In this problem, we will look at classifying protein sequences 
 * according to whether they belong to a particular protein family or 
 * not. For this task, we will use the string kernel that we discussed 
 * in class. Download the files hw5train.txt and hw5test.txt from the class 
 * website. These files contain your training and test data sets 
 * respectively. 
 *
 * The data files are in ASCII text format, and each line of the file 
 * contains a string, which represents a protein sequence, followed by 
 * a label, which is 1 or −1, to indicate whether the protein sequence 
 * belongs to a protein family or not. Each letter in the protein sequence 
 * represents an amino acid, and thus the alphabet size is 20. Different 
 * protein sequences in the file have different length; this is not 
 * surprising because even the same protein will have different lengths 
 * in different species, for example, in mouse and human. 
 *
 * Assume that the data is linearly separable by a hyperplane through 
 * the origin. Run a single pass of kernel perceptron algorithm on the 
 * training dataset to find a classifier that separates the two classes. 
 * For your kernel, use the string kernel function. Recall from class 
 * that given two strings s and t, the string kernel Kp(s, t) is the 
 * number of substrings of length p that are common to both s and t. For 
 * this problem, use p = 3 and p = 4. Write down the training and test 
 * errors of kernel perceptron for p = 3 and p = 4 on this dataset.
 *
 **/

// Load the data from the training file
console.log('Loading Data...');

// load math.js
var math = require('mathjs');
var fs = require('fs');

// Load Training Data
var trainingArray = loadDataFromFile(trainingFile);
console.log('Training Data elements: ' + trainingArray.length + " dimension: " + trainingArray[0].length);

// Load Test Data
var testArray = loadDataFromFile(testingFile);
console.log('Test Data elements: ' + testArray.length + " dimension: " + testArray[0].length + '\n');

var hyperplane = kernelPerceptron(trainingArray, 1, 3);
console.log('Testing Perceptron with training data...');
testHyperplane(trainingArray, hyperplane, 3);
console.log('Testing Perceptron with test data...');
testHyperplane(testArray, hyperplane, 3);
console.log();

hyperplane = kernelPerceptron(trainingArray, 1, 4);
console.log('Testing Perceptron with training data...');
testHyperplane(trainingArray, hyperplane, 4);
console.log('Testing Perceptron with test data...');
testHyperplane(testArray, hyperplane, 4);

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
		arr[i] = arr[i].split('  ');
	}
	return arr;
}

/**
 * The kernel function used to determine how many substrings of length
 * are common to both strings.
 */
function stringKernel(a, b, length) {
	var searched = [];
	var found = 0;

	for(var i = 0; i < a.length - length; i++) {
		
		var searchString = a.substring(i, i + length);
		if(searched.indexOf(searchString) < 0) {
			if(b.indexOf(searchString) >= 0) {
				found++;
			}

			searched.concat([searchString]);
		}
	}

	return found;
}

/**
 * Perceptron runs the perceptron algorithm on the vectors provided in 
 * vectors niter times.
 *
 */
function kernelPerceptron(vectors, niter, p) {

	console.log('Building Hyperplane by running perceptron algorithm ' + niter + ' times for p = ' + p + '...');

	var hyperplane = [];

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
			currValidatingLine = currValidatingLine[0];

			if(expected * calculateKernel(currValidatingLine, hyperplane, p) <= 0) {
				hyperplane = hyperplane.concat([{y: expected, x: currValidatingLine}]);
			}
		}
	}

	return hyperplane;
}

/**
 * Calculates the results of the kernel using the kernel trick
 */
function calculateKernel(string, hyperplane, p) {

	var res = 0;

	for(var i = 0; i < hyperplane.length; i++) {
		res += hyperplane[i].y * stringKernel(hyperplane[i].x, string, p);
	}

	return res;
}

function testHyperplane(vectors, hyperplane, p) {

	var error = 0;

	// Go through all of the vectors
	for(var j = 0; j < vectors.length; j++) {

		// Get current line
		var currValidatingLine = vectors[j];
		var expected = parseInt(currValidatingLine[currValidatingLine.length - 1]);
		currValidatingLine = currValidatingLine[0];

		if(expected * calculateKernel(currValidatingLine, hyperplane, p) <= 0) {
			error++;
		}
	}

	console.log('Tested Classifier with ' + ((error/vectors.length)*100) + '% error (' + error + '/' + vectors.length + ')');
}