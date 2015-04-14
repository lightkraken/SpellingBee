//Image and sound loader

var A = {
	sounds_to_load : {},
	images_to_load : {},
	sounds : {},
	images : {},
	finished_everything_cb : null,
	counter_cb : null,
	counter : 0,
	
	add_images : function(images){  // {name: [imagefile, optionalCallback]}
		for (i in images) {
			this.images_to_load[i] = images[i];	
		}
	},
	
	add_sounds : function(sounds){  // {name: [soundfile names]}
		for (i in sounds) {
			this.sounds_to_load[i] = sounds[i];
		}
	},
	
	load_assets : function(callback){
		this.finished_everything_cb = callback;
		this.load_images();
	},
	
	load_images : function(){
		var self = this;
		this.counter_cb = this.load_sounds;		
		this.counter = Object.keys(this.images_to_load).length;
		if (this.counter === 0){
			this.counter_cb();
		}
		for (i in this.images_to_load){
			this.images[i] = new Image();
			(function(i){	
				self.images[i].onload = function(){
					if (typeof self.images_to_load[i][1] !== "undefined"){
						self.images_to_load[i][1](self.images[i]);
					}
					self.countdown();
				};
			})(i);
			this.images[i].src = this.images_to_load[i][0];
		}
	},
	
	load_sounds : function(){
		var self = this;
		this.counter_cb = this.finished_everything_cb;
		this.counter = Object.keys(this.sounds_to_load).length;
		if (this.counter === 0){
			this.counter_cb();
		}		
		for (i in this.sounds_to_load){
			this.sounds[i] = new Howl({
				urls : this.sounds_to_load[i],
				onload : function(){self.countdown();},
			});
		}
	},
	
	countdown : function(){
		this.counter -= 1;
		if (this.counter === 0) {
			this.counter_cb();
		}
	},
};