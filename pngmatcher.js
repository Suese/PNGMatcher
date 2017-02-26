var Promise = require('bluebird')
var arglib = require("./arglib.js")
var fs = Promise.promisifyAll(require("fs"));
var png = require('pngjs').PNG

//var png = require('png-js')


//Load every png in input folder
//Load every png in the match folder
//For each input image
//	For each output image
//		Choose the size of the input image
//		Make a difference map, tile the smaller if necessary
//		Find the average difference between the two maps
//	Find the smallest difference that is greater than 0
//	In output folder,  
//		write an image file with the input file's name,  
//		but the output of a cropped or tiled output image.




//Args
//	--input=
//	--matches=
//	--output=



return (function(){
	
	
var args = arglib.extend({
	"input":"./input",
	"matches":"./matches",
	"output":"./output",
	"reduction":"8",
	"tilesize":"16",
})


var scaleArg = parseInt(args.reduction)
var scale = scaleArg > 1 ? 1 / scaleArg : 1;
var tileSize = parseInt(args.tilesize)

var inputFileList
var matchFileList
var inputImages
var matchImages


function ImageHelper( img){
	this.img = img
		
	this.GetPixelWrappedLocation = function(x,y){
		return this.GetPixelLocation(x%this.img.width,y%this.img.height)
	}
	this.GetPixelWrapped = function(x,y){
		return new Uint8Array(this.img.data,GetPixelWrappedLocation(x,y),4)
	}	
	this.GetPixelLocation = function(x,y){
		return ( y*this.img.width + x) * 4
	}
	
	this.GetAverageDifferenceFrom = function( imgB ){
		
		var imgA = this.img
		
		var datA = imgA.data
		var datB = imgB.img.data
		var locA = 0
		
		var samples = new Array()
		//~ console.log(`Analysing image of ${imgA.width}x${imgA.height}`)
		for( y = 0; y < imgA.width; y ++ ){
			for( x = 0; x < imgA.height; x++ ){
				
				var locB = imgB.GetPixelWrappedLocation(x,y)
				samples.push(
				
					// -- Greatest channel -- //
					Math.max(
						Math.abs(datA[locA++] - datB[locB++])
						, Math.abs(datA[locA++] - datB[locB++])
						, Math.abs(datA[locA++] - datB[locB++])
						, Math.abs(datA[locA++] - datB[locB++])
					)
				
					//~ //-- Sum of differences -- //
					//~ Math.abs(datA[locA++] - datB[locB++])
					//~ + Math.abs(datA[locA++] - datB[locB++])
					//~ + Math.abs(datA[locA++] - datB[locB++])
					//~ + Math.abs(datA[locA++] - datB[locB++])
				
					// -- Distance -- //
					//~ Math.pow(
						//~ Math.pow(2,Math.abs(datA[locA++] - datB[locB++]))
						//~ + Math.pow(2,Math.abs(datA[locA++] - datB[locB++]))
						//~ + Math.pow(2,Math.abs(datA[locA++] - datB[locB++]))
						//~ + Math.pow(2,Math.abs(datA[locA++] - datB[locB++]))
						//~ , 1/4
					//~ )
				)
			}
		}
		
		var sum = 0
		var lowest = Number.POSITIVE_INFINITY
		var highest = Number.NEGATIVE_INFINITY
		for ( var id in samples ){			
			var n = samples[id]
			sum += n
			if ( n < lowest ) lowest = n
			if ( n > highest ) highest = n
			
		}
		var avg = sum/samples.length
		var median = ((highest-lowest)/2)+lowest
		return avg
	}
	
}
function LoadImage(folder,file){		
	return new Promise(function(success,failure){
		fs
			.createReadStream(folder + "/" + file)
			.pipe(new png({filterType:4}))
			.on('parsed',function(){
				success(new ImageHelper(this))
			})
	})			
}
function LoadImages(folder,fileList){			
	
	var fileObj = new Object()
	for ( var fileId in fileList ){
		var fileName = fileList[fileId]
		fileObj[fileName] = LoadImage(folder,fileName)
	}
	return Promise.props(fileObj)
}


fs
	.statAsync(args.input)
	.then(function(stats){
		if ( !stats.isDirectory()){
			console.log(`Input folder ${args.input} does not exist`)
			return				
		}
		return fs.statAsync(args.matches)
	})
	.then(function(stats){
		if ( !stats.isDirectory()){
			console.log(`Matches folder ${args.matches} does not exist`)
			return				
		}	
		return fs.statAsync(args.output)
	})
	.then(function(stats){
		return new Promise(function (success,failure){
			if (!stats.isDirectory()){
				fs.mkdirAsyc(args.output)
					.then(success)
			} else {
				success()
			}
		})
	})
	.then(function(){
		return fs.readdirAsync(args.input)
	})
	.then(function(fileList){
		inputFileList = fileList
		return fs.readdirAsync(args.matches)
	})
	.then(function(fileList){
		matchFileList = fileList
		return LoadImages(args.input,inputFileList)
	})
	.then(function(imageList){
		console.log(`Loaded ${inputFileList.length} input images`)
		inputImages = imageList
		return LoadImages(args.matches,matchFileList)
	})
	.then(function(imageList){
		console.log(`Loaded ${matchFileList.length} matchable images`)
		matchImages = imageList
		
		
		var differenceProfile = new Object()
		
		//everything is loaded perform analysis
		for( var inputFile in inputImages ){
			var inputImage = inputImages[inputFile]
			var differenceList = new Object()
			var lowestFile = ""
			var lowest = Number.POSITIVE_INFINITY
			for ( var matchFile in matchImages ){
				var matchImage = matchImages[matchFile]
				var n = inputImage.GetAverageDifferenceFrom( matchImage )
				differenceList[matchFile] = n 
				if ( n < lowest ){
					lowest = n
					lowestFile = matchFile
				}
				
			}
			differenceProfile[inputFile] = differenceList
			console.log(`Closest match for '${inputFile}' is '${lowestFile}'`)
		}
		console.log("Done")
	})
	.catch(function(e){
		console.log("Failed")
		console.log(e)
	})

return 0;
	
	
})()
