var arglib = require("./arglib.js")

//Load every png in input folder at 1/8th size
//Load every png in the match folder at 1/8th size
//For each input image
//	For each output image
//		Choose the size of the input image
//		Make a difference map, tile the smaller if necessary
//		Add the sum of the difference
//	Find the smallest difference that is greater than 0
//	In output folder,  
//		write an image file with the input file's name,  
//		but the output of a cropped or tiled output image.




//Args
//	--input=
//	--matches=
//	--output=




var args = arglib.extend({
	"input":"./input",
	"matches":"./matches",
	"output":"./output"
})

