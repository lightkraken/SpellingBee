//Scene manager

var Scene = {
	scene_stack : [],
	scenes : {},
};

Scene.BasicScene = {
	init : function(name){
		this.name = name;
		return this;
	},
	entered : function(){},
	obscuring : function(){},
	revealed : function(){},
	exiting : function(){},
	update : function(){},
	draw : function(){},		
};

Scene.start = function(scene, step){	
	this.push_scene(scene);
	this.main_loop = this.main_loop(step);
	requestAnimationFrame(this.main_loop);
};

Scene.push_scene = function(scene, args){
	if (this.scene_stack.length > 0) {
		this.scene_stack[this.scene_stack.length-1].obscuring();
	}
	this.scene_stack.push(Object.create(this.scenes[scene]));	
	this.scene_stack[this.scene_stack.length-1].entered(args);
};

Scene.pop_scene = function(){
	this.scene_stack[this.scene_stack.length-1].exiting();		
	this.scene_stack.pop();
	this.scene_stack[this.scene_stack.length-1].revealed();	
};

Scene.new_scene = function(name){	
	this.scenes[name] = Object.create(this.BasicScene).init(name);
	return this.scenes[name];
};

Scene.main_loop = function(step){
	var dt = 0;
	var last = performance.now();
	var now;
	var scene_stack = this.scene_stack;
	var self = this;
	
	return function(){
		now = performance.now();
		dt = dt + Math.min(1, (now - last) / 1000);
		while (dt > 1/step) {
			dt = dt - 1/step;
			scene_stack[scene_stack.length-1].update(step);
		}
		scene_stack[scene_stack.length-1].draw();
		last = now;
		requestAnimationFrame(self.main_loop);			
	};
};