//handy utility functions

var U = {
	randInt : function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},

	nearestMultiple : function(number, multiple, method) {
		switch (method) {
			case "floor":
				return Math.floor(number/multiple)*multiple;
			case "ceil":
				return Math.ceil(number/multiple)*multiple;
			case "round":
				return Math.round(number/multiple)*multiple;
		}
	},

	RGB : function(color) {
		return "rgb("+color[0]+","+color[1]+","+color[2]+")";
	},
	
	replaceAt : function(string, index, character) {
		return string.substr(0, index) + character + string.substr(index+character.length);
	},
	
	percentage : function(whole, part) {
		if (part === 0) {
			return "0%"
		} else {
			return Math.round(part/whole*100).toString() + "%";
		}
	},
};

U.testCanvas = document.createElement("canvas");
U.testContext = U.testCanvas.getContext("2d");

var i; //used in loops
