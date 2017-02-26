
var extend = require('util')._extend;

module.exports = {
	extend:function(options){
		
		//process arguments
		var args = {}
		var argsSliced = process.argv.slice(2)
		for (var argID in  argsSliced ){
			var arg = argsSliced[argID]
			if ( arg.substring(0,2) == "--" ){
				var seperatorIndex = arg.indexOf("=")
				if ( seperatorIndex > 0 ){
					args[arg.substring(2,seperatorIndex)]  = arg.substring(seperatorIndex+1)
				} else {
					args[arg.substring(2)] = true
				}
			} else {
				console.log("Argument ignored '" + arg + "'");
			}
		}
		
		return extend(options,args)
	}
}
