PNGMatcher
======
A command line image matching tool for finding aesthetically similar images using difference to calculate similarity.

Installation Requirements
------
  - [NodeJS](https://nodejs.org/en/)
  - [Bluebird](http://bluebirdjs.com) - npm install bluebird
  - [pngjs](https://www.npmjs.com/package/pngjs) - npm install pngjs
	
Usage
------
	nodejs pngmatcher.js 

Arguments
------

| Argument            | Purpose                                               |
| --------------------|-------------------------------------------------------|
| --input=folder      | Select custom input folder, default is ./input        |
| --matches=folder    | Select custom matches folder, default is ./matches    |
	
Install instructions
------
1. Install NodeJS
2. Open a command line
3. Type 'npm install bluebird' to install Blurbird Promises
4. Type 'npm install pngjs' to install pngjs

Usage tutorial
------
1. Create a folder called 'input'
2. Place some PNG images you want to find the closest matches for
3. Create a folder called 'matches'
4. Place some PNG images you want to match against

Files
------
| File           | Purpose                                   |
| -------------- |-------------------------------------------|
| arglib.js      | a library to handle command-line arguments|
| pngmatcher.js  | the main program                          |
| README.md      | this file                                 |
