#!/usr/bin/env node

// Files that contain the data
const trainingFile = 'hw3train.txt';
const testingFile = 'hw3test.txt';


/**
 * Classify.js
 *
 * Author: Daniel Kao
 * PID: A10546439
 *
 * In this problem, we will look at the task of classifying iris 
 * flowers into sub-species based on their features using ID3 
 * Decision Trees. We will use four features of the flowers – 
 * the petal width, petal length, sepal width, and sepal length. 
 * It turns out that these four features will be enough to give 
 * us a fairly accurate classification.
 *
 **/

console.log('Loading Data...');

var fs = require('fs');

// Load Training Data
var trainingObj = loadDataFromFile(trainingFile);
console.log('Training Data elements: ' + trainingObj.length + " dimension: " + trainingObj[0].length);

var decisionTree = {
	'name': 'o',
	'elements': trainingObj
}

decisionTree = grow(decisionTree);

console.log('Testing Classifier...');

var testingObj = loadDataFromFile(testingFile);
var error = 0;

for(var i in testingObj) {
	if(testingObj[i][testingObj[i].length - 1] != runClassifier(decisionTree, testingObj[i])) {
		error++;
	}
}

console.log("Classifier ran with " + (error/testingObj.length) * 100 + "% error")


/////////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////////

/**
 * Loads the data from the specified file
 *
 */
function loadDataFromFile(file) {

	// Separate out each line
	var arr = fs.readFileSync(file).toString().split('\n');	

	arr = arr.slice(0, arr.length - 1);	

	for(var i in arr) {
		arr[i] = arr[i].split(' ');
		arr[i] = arr[i].slice(0, arr[i].length - 1);
	}

	return arr;
}


/**
 * Given an array of elements, tell me if all of the last items in the
 * array are identical.
 *
 **/
function isPure(elements) {

	// If the node is already pure
	var initial = elements[0][elements[0].length - 1];
	var isPure = true;
	for (var i in elements) {
		if(elements[i][elements[i].length - 1] != initial) {
			return false;
		}
	}
	return true;

}


/**
 * Given a node of a tree, grow out the tree until the bottom leaves
 * are all pure.
 *
 **/
function grow(tree) {

	// If the node has no elements
	if(tree.elements.length == 0 || isPure(tree.elements)) {
		console.log("Pure node " + tree.name + " with label " + tree.elements[0][tree.elements[0].length - 1]);
		return tree;
	}

	var split, highestEntropy, index;

	// Calculate information gained for each dimension provided
	for(var i = 0; i < tree.elements[0].length - 1; i++) {

		var ig = highestIG(tree, i);

		if(highestEntropy == undefined) {
			highestEntropy = ig.entropy;
			split = ig.split;
			index = i;
		}
		else {
			if(ig.entropy > highestEntropy) {
				highestEntropy = ig.entropy;
				split = ig.split;
				index = i;
			}
		}
	}

	tree.split = split;
	tree.index = index;

	console.log("Splitting node " + tree.name + " at index " + index + " with values >= " + split);

	for(i = 0; i < tree.elements.length; i++) {
		if(tree.elements[i][index] >= split) {
			if(!tree.yes) {
				tree.yes = {elements: [tree.elements[i]]};
			}
			else {
				tree.yes.elements = tree.yes.elements.concat([tree.elements[i]]);
			}
		}
		else {
			if(!tree.no) {
				tree.no = {elements: [tree.elements[i]]};
			}
			else {
				tree.no.elements = tree.no.elements.concat([tree.elements[i]]);
			}
		}
	}

	tree.yes.name = tree.name + 'y';
	tree.no.name = tree.name + 'n';

	tree.yes = grow(tree.yes);
	tree.no = grow(tree.no);

	return tree;
}


function highestIG(tree, index) {

	// Keep track of which value we are on
	var seen = [];

	// Default values
	var mostIG = {
		entropy: -9999,
		split: null,
	};

	// Sort the values so we know what is happening
	tree.elements.sort(function(a, b) {return a[index] - b[index]});
	seen = seen.concat([tree.elements[0][index]]);

	for(var i in tree.elements) {

		// If we haven't calculated the IG yet
		if(seen.indexOf(tree.elements[i][index]) < 0) {

			// Set the split to be everything greater than or equal to the current value
			var curr = tree.elements[i][index];

			var entropy = calculateSplit(tree.elements, curr, index);

			if(entropy > mostIG.entropy) {
				mostIG.entropy = entropy;
				mostIG.split = curr;
			}

			// Add this element into the seen array
			seen = seen.concat([curr]);
		}
	}

	return mostIG;
}


function calculateSplit(elements, curr, index) {

	var yes = [], no = [];
	var yesLabels = {}, noLabels = {};

	for(var j = 0; j < elements.length; j++) {
		if (elements[j][index] >= curr) {
			yes = yes.concat([elements[j]]);
			var label = elements[j][elements[j].length - 1];
			if(!yesLabels[label]) {
				yesLabels[label] = 1;
			}
			else {
				yesLabels[label]++;
			}
		}
		else {
			no = no.concat([elements[j]]);
			var label = elements[j][elements[j].length - 1];
			if(!noLabels[label]) {
				noLabels[label] = 1;
			}
			else {
				noLabels[label]++;
			}
		}
	}

	// calculate the Entropy
	var yesEntropy = 0, noEntropy = 0;
	for(var i in yesLabels) {
		yesEntropy -= ((yesLabels[i]/yes.length) * Math.log(yesLabels[i]/yes.length));
	}
	for(var i in noLabels) {
		noEntropy -= ((noLabels[i]/no.length) * Math.log(noLabels[i]/no.length));
	}

	var entropy = - ((yes.length/elements.length) * Math.log(yes.length/elements.length)) - ((no.length/elements.length) * Math.log(no.length/elements.length));

	return entropy - (yes.length/elements.length) * yesEntropy - (no.length/elements.length) * noEntropy;
}



function runClassifier(tree, test) {

	if(isPure(tree.elements)) {
		return tree.elements[0][tree.elements[0].length - 1];
	}

	if(test[tree.index] >= tree.split) {
		return runClassifier(tree.yes, test);
	}
	else {
		return runClassifier(tree.no, test);
	}
}