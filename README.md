PNGMatcher
======
A command line image matching tool for finding aesthetically similar images using difference to calculate similarity.

Requirements:
------
NodeJS
  - Bluebird - npm install bluebird
  - pngjs - npm install pngjs
	
Usage:
------
  - nodejs pngmatcher.js 

Arguments:
------

  - --input=<folder>		Select custom input folder, default is ./input
  - *--matches=<folder>	Select custom matches folder, default is ./matches
	
Install instructions:
------
1. Install NodeJS
2. Open a command line
3. Type 'npm install bluebird' to install Blurbird Promises
4. Type 'npm install pngjs' to install pngjs

Usage tutorial:
------
1. Create a folder called 'input'
2. Place some PNG images you want to find the closest matches for
3. Create a folder called 'matches'
4. Place some PNG images you want to match against

Files:
------
  - arglib.js		- a library for command line arguments
  - pngmatcher.js	- the main program
  - README.md	- this file
