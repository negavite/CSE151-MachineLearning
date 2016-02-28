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

