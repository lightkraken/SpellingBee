Game = {};

//Load Scene------------------------------------------------------------------------
Game.Load = Scene.new_scene("load");

Game.Load.entered = function() {
		this.get_html_elements();
		this.load_menu.css("display","flex");
		this.expand();

		//When finished loading assets, open the main menu
		A.load_assets(function(){
			Scene.push_scene("main_menu");
		});
};

Game.Load.obscuring = function() {
	this.load_menu.hide();
};

Game.Load.get_html_elements = function() {
	this.window = $(window);
	this.viewport = $("#viewport");
	this.load_menu = $("#loading");
};

Game.Load.expand = function() {
	this.viewport.height(this.window.height());
};
//----------------------------------------------------------------------------------



//Main Menu Scene-------------------------------------------------------------------
Game.MainMenu = Scene.new_scene("main_menu");

Game.MainMenu.entered = function() {
	this.get_html_elements();
	this.main_menu.css("display","flex");
	this.bind_events();
 	$("#viewport").css("background-color", "rgb(99, 99, 99)");
};

Game.MainMenu.obscuring = function() {
	this.main_menu.hide();
	this.release_events();
};

Game.MainMenu.revealed = function() {
	this.main_menu.show();
	this.bind_events();
 	$("#viewport").css("background-color", "rgb(99, 99, 99)");
};

Game.MainMenu.get_html_elements = function() {
	this.main_menu = $("#main_menu");
	this.start_button = $("#start_button").button();
	this.options_button = $("#options_button").button();
	this.calibrate_button = $("#calibrate_button").button();
	this.instructions_button = $("#instructions_button").button();
};

Game.MainMenu.bind_events = function() {
	this.start_button.on("click", function(){
		Scene.push_scene("level");
	});
	this.options_button.on("click", function(){
		Scene.push_scene("options_menu");
	});
	this.calibrate_button.on("click", function(){
		Scene.push_scene("calibrate_menu");
	});
	this.instructions_button.on("click", function(){
		Scene.push_scene("instructions");
	});
};

Game.MainMenu.release_events = function() {
	this.start_button.off("click");
	this.options_button.off("click");
	this.calibrate_button.off("click");
	this.instructions_button.off("click");
};
//----------------------------------------------------------------------------------



//Options Menu Scene----------------------------------------------------------------
Game.OptionsMenu = Scene.new_scene("options_menu");

Game.OptionsMenu.entered = function() {
	this.get_html_elements();
	this.orb = Object.create(Game.Orb).init(this.window.width()/2, this.window.height()/2);
	this.orb.new_answer();
	this.options_menu.css("display","flex");
	this.bind_events();
	this.update_form();
	this.expand();
	this.update_background();
	this.update_blendmode();
};

Game.OptionsMenu.exiting = function() {
	this.options_menu.hide();
	this.release_events();
};

Game.OptionsMenu.draw = function() {
	var width = this.canvas.width;
	var height = this.canvas.height;

	var color1;
	var color2;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			color1 = U.RGB(S.BLUE);
			color2 = U.RGB(S.RED);
			break;
		case (this.radio_palette_pt.prop('checked')):
			color1 = U.RGB(S.PURPLE);
			color2 = U.RGB(S.TEAL);
			break;
		case (this.radio_palette_rg.prop('checked')):
			color1 = U.RGB(S.RED2);
			color2 = U.RGB(S.GREEN);
	}

	//clear
	this.context.clearRect(0,0,width,height);

	//draw orb
	this.orb.draw(this.context, color1, color2);
};

Game.OptionsMenu.update = function() {
	var bounce_ratio;
	switch(true) {
		case (this.radio_bounce_norm.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.NORMAL;
			break;
		case (this.radio_bounce_horz.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.HORIZONTAL;
			break;
		case (this.radio_bounce_vert.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.VERTICAL;
			break;
	}

	var separation = this.vergence_slider.slider("value")*S.ORB_SEPARATION_STEP;
	var speed = this.speed_spinner.spinner("value")*S.ORB_SPEED_STEP;
	var scale = this.size_spinner.spinner("value");

	this.orb.update(this.canvas, {bounce_ratio:bounce_ratio, separation:separation, speed:speed, scale:scale});
};

Game.OptionsMenu.get_html_elements = function() {
	this.window = $(window);
	this.body = $('body');
	this.options_menu = $("#options_menu");
	this.canvas = $("#options_canvas")[0];
	this.context = this.canvas.getContext('2d');

	$("#palette_radio").buttonset();
	this.radio_palette_rb = $("#pal_rad_1");
	this.radio_palette_pt = $("#pal_rad_2");
	this.radio_palette_rg = $("#pal_rad_3");

	$("#bounce_radio").buttonset();
	this.radio_bounce_norm = $("#bounce_rad_1");
	this.radio_bounce_horz = $("#bounce_rad_2");
	this.radio_bounce_vert = $("#bounce_rad_3");

	this.time_spinner = $("#time_spinner").minute_spinner();
	this.time_spinner.minute_spinner("option", "min", 1);

	this.size_spinner = $("#size_spinner").spinner();
	this.size_spinner.spinner("option", "min", 1);
	this.size_spinner.spinner("option", "max", this.determine_max_scale());

	this.speed_spinner = $("#speed_spinner").spinner();
	this.speed_spinner.spinner("option", "min", 0);

	this.vergence_slider = $("#vergence_slider").slider();

	this.save_button = $("#options_save").button();
	this.cancel_button = $("#options_cancel").button();
};

Game.OptionsMenu.determine_max_scale = function() {
	var window_height = this.window.height();
	var ctx = U.testContext;
	var orb_height = 0;
	var scale = 0;

	do {
		scale += 1;
		ctx.font = "bold " + S.ORB_FONT_SIZE*scale+"px " + S.ORB_FONT;
		orb_height = ctx.measureText("12345678").width + S.ORB_LINE_WIDTH*scale;
	} while (orb_height <= window_height);

	return scale-1;
};

Game.OptionsMenu.expand = function() {
	this.options_menu.width(this.window.width());
	this.options_menu.height(this.window.height());
	this.canvas.width = this.window.width();
	this.canvas.height = this.window.height();
};

Game.OptionsMenu.update_background = function() {
	var bg_color;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			bg_color = S.BLACK;
			break;
		case (this.radio_palette_pt.prop('checked')):
			bg_color = S.GRAY;
			break;
		case (this.radio_palette_rg.prop('checked')):
			bg_color = S.ORANGE;
			break;
	}
	this.options_menu.css("background", U.RGB(bg_color));
	$("#viewport").css("background", U.RGB(bg_color));
};

Game.OptionsMenu.update_blendmode = function() {
	var blend;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			blend = "screen";
			break;
		case (this.radio_palette_pt.prop('checked') || this.radio_palette_rg.prop('checked')):
			blend = "multiply";
			break;
	}
	this.context.globalCompositeOperation = blend;
};

Game.OptionsMenu.bind_events = function() {
	this.body.on('keyup', function(event){
		if (event.keyCode === 27) {
			Scene.pop_scene();
		}
	});

	this.vergence_slider.on("slidestop", (function(){
										this.orb.set_xy(this.window.width()/2, this.window.height()/2);
										this.orb.new_answer();
												}).bind(this));
	this.size_spinner.spinner({stop: (function(){
										this.size_slider();
										this.orb.set_xy(this.window.width()/2, this.window.height()/2);
										this.orb.new_answer();
												}).bind(this)});
	this.radio_palette_rb.on("click", (function(){
										this.update_background();
										this.update_blendmode();
												 }).bind(this));
	this.radio_palette_pt.on("click", (function(){
										this.update_background();
										this.update_blendmode();
												 }).bind(this));
	this.radio_palette_rg.on("click", (function(){
										this.update_background();
										this.update_blendmode();
												 }).bind(this));
	this.save_button.on("click", (function(){
		this.save_form();
		Scene.pop_scene();
	}).bind(this));
	this.cancel_button.on("click", function(){
		Scene.pop_scene();
	});
};

Game.OptionsMenu.release_events = function() {
	this.body.off('keyup');
	this.radio_palette_rb.off("click");
	this.radio_palette_pt.off("click");
	this.radio_palette_rg.off("click");
	this.save_button.off("click");
	this.cancel_button.off("click");
};

Game.OptionsMenu.size_slider = function() {
	var old_value = this.vergence_slider.slider("value");

	var scale = this.size_spinner.spinner("value");
	var ctx = U.testContext;
	ctx.font = "bold " + S.ORB_FONT_SIZE*scale+"px " + S.ORB_FONT;
	var orb_width = ctx.measureText("12345678").width + S.ORB_LINE_WIDTH*scale;

	this.vergence_slider.slider("destroy");
	this.vergence_slider = $("#vergence_slider").slider();
	var max_separation = Math.floor((this.window.width() - orb_width - S.ORB_LINE_WIDTH*scale) / S.ORB_SEPARATION_STEP);

	this.vergence_slider.slider({min: -max_separation, max: max_separation})
						.slider('pips', {first: 'pip', last: 'pip', step: max_separation})
						.slider('float', {formatLabel: function(val){ if (val<0) {
																		  return val*(-1);
																	  } else {
																		  return val;
																	  } } } );
	if (old_value > max_separation) {
		old_value = max_separation;
	} else if (old_value < -max_separation) {
		old_value = -max_separation;
	}
	this.vergence_slider.slider("value", old_value);
};

Game.OptionsMenu.update_form = function() {
	switch(S.PALETTE) {
		case "redblue":
			this.radio_palette_rb.prop('checked', true);
			break;
		case "purpteal":
			this.radio_palette_pt.prop('checked', true);
			break;
		case "redgreen":
			this.radio_palette_rg.prop('checked', true);
	}
	$("#palette_radio").buttonset("refresh");

	switch(JSON.stringify(S.ORB_BOUNCE)) {
		case JSON.stringify(S.ORB_BOUNCE_VALUES.NORMAL):
			this.radio_bounce_norm.prop('checked', true);
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.HORIZONTAL):
			this.radio_bounce_horz.prop('checked', true);
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.VERTICAL):
			this.radio_bounce_vert.prop('checked', true);
			break;
	}
	$("#bounce_radio").buttonset("refresh");

	this.time_spinner.minute_spinner("value", S.GAME_LENGTH);
	this.size_spinner.spinner("value", S.ORB_SCALE);
	this.speed_spinner.spinner("value", Math.floor(S.ORB_SPEED/S.ORB_SPEED_STEP));
	this.vergence_slider.slider("value", Math.floor(S.ORB_SEPARATION/S.ORB_SEPARATION_STEP));
	this.size_slider();
};

Game.OptionsMenu.save_form = function() {
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			S.PALETTE = "redblue";
			break;
		case (this.radio_palette_pt.prop('checked')):
			S.PALETTE = "purpteal";
			break;
		case (this.radio_palette_rg.prop('checked')):
			S.PALETTE = "redgreen";
			break;
	}

	switch(true) {
		case (this.radio_bounce_norm.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.NORMAL;
			break;
		case (this.radio_bounce_horz.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.HORIZONTAL;
			break;
		case (this.radio_bounce_vert.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.VERTICAL;
			break;
	}

	S.ORB_SCALE = this.size_spinner.spinner("value");
	S.ORB_SPEED = this.speed_spinner.spinner("value")*S.ORB_SPEED_STEP;
	S.GAME_LENGTH = this.time_spinner.minute_spinner("value");
	S.ORB_SEPARATION = this.vergence_slider.slider("value")*S.ORB_SEPARATION_STEP;
};
//----------------------------------------------------------------------------------



//Calibrate Menu Scene--------------------------------------------------------------
CalibrateMenu = Scene.new_scene("calibrate_menu");

CalibrateMenu.entered = function(){
	this.get_html_elements();

	this.bind_events();
	this.calibrate_menu.show();
};

CalibrateMenu.obscuring = function(){
	this.calibrate_menu.hide();
	this.release_events();
};

CalibrateMenu.revealed = function(){
	this.calibrate_menu.show();
	this.bind_events();
};

CalibrateMenu.exiting = function(){
	this.calibrate_menu.hide();
	this.release_events();
};

CalibrateMenu.get_html_elements = function(){
	this.body = $('body');
	this.calibrate_menu = $("#calibrate_menu");
	this.rb_button = $("#cal_rb_button").button();
	this.pt_button = $("#cal_pt_button").button();
	this.rg_button = $("#cal_rg_button").button();
	this.back_button = $("#cal_back_button").button();
};

CalibrateMenu.bind_events = function(){
	this.body.on('keyup', function(event){
		if (event.keyCode === 27) {
			Scene.pop_scene();
		}
	});
	this.rb_button.on('click', function(){
		Scene.push_scene("calibrate_dialog","rb");
	});
	this.pt_button.on('click', function(){
		Scene.push_scene("calibrate_dialog","pt");
	});
	this.rg_button.on('click', function(){
		Scene.push_scene("calibrate_dialog","rg");
	});
	this.back_button.on('click', function(){
		Scene.pop_scene();
	});
};

CalibrateMenu.release_events = function(){
	this.body.off('keyup');
	this.rb_button.off('click');
	this.pt_button.off('click');
	this.rg_button.off('click');
	this.back_button.off('click');
};
//----------------------------------------------------------------------------------



//Calibrate Dialog Scene------------------------------------------------------------
Game.CalibrateDialog = Scene.new_scene("calibrate_dialog");

Game.CalibrateDialog.entered = function(colors){
	this.get_html_elements();
	this.dialog.show();
	this.set_state(colors);
	this.step_one();
};

Game.CalibrateDialog.get_html_elements = function(){
	this.dialog = $("#cal_dialog");
	this.span = $("#calib_span");
	this.slider = $("#calib_slider").slider();
	this.button = $("#cal_button").button();
	this.canvas = $("#cal_canvas")[0];
	this.context = this.canvas.getContext('2d');
};

Game.CalibrateDialog.set_state = function(colors){
	var states = {
		rb : {
			step1 : {
				minmax : function(){return [0,127];},
				start : function(){return 127;},
				bg : function(){return S.BLUE;},
				fg : function(result){return [result,result,result];},
			},
			step2 : {
				minmax : function(){return [0,255];},
				start : function(){return 255;},
				bg : function(color1){return color1;},
				fg : function(result){return [result,0,0];},
				save : function(color1, color2){S.BLACK=color1; S.RED=color2;},
			},
		},
		pt : {
			step1 : {
				minmax : function(){return [0,255];},
				start : function(){return 255;},
				bg : function(){return S.GRAY;},
				fg : function(result){return [result,0,result];},
			},
			step2 : {
				minmax : function(){return [0,255];},
				start : function(){return 255;},
				bg : function(){return S.GRAY;},
				fg : function(result){return [0,result,result];},
				save : function(color1, color2){S.PURPLE=color1; S.TEAL=color2;},
			},
		},
		rg : {
			step1 : {
				minmax : function(){return [127,255];},
				start : function(){return 0;},
				bg : function(){return S.RED2;},
				fg : function(result){return [result,127,0];},
			},
			step2 : {
				minmax : function(){return [63,191];},
				start : function(){return 63;},
				bg : function(color1){return color1;},
				fg : function(result){return [0,result,0];},
				save : function(color1, color2){S.ORANGE=color1; S.GREEN=color2;},
			},
		},
	};

	//set the state depending on which palette was chosen
	this.state = states[colors];
};

Game.CalibrateDialog.step_one = function(){
	this.span.html("&nbsp;RED&nbsp;");
	this.span.css("background","rgb(255,0,0)");

	this.slider.slider("option", {
		"min" : this.state.step1.minmax()[0],
		"max" : this.state.step1.minmax()[1],
		"value" : this.state.step1.start(),
	});

	this.fg = this.state.step1.fg;
	this.bg = this.state.step1.bg;

	this.button.off("click");
	this.button.button("option", "label", "Next");
	this.button.on("click", (function(){
		this.step1_result = this.state.step1.fg(this.slider.slider("value"));
		this.step_two();
	}).bind(this));
};

Game.CalibrateDialog.step_two = function(){
	this.span.html("&nbsp;GREEN/BLUE&nbsp;");
	this.span.css("background","rgb(0,0,255)");

	this.slider.slider("option", {
		"min" : this.state.step2.minmax()[0],
		"max" : this.state.step2.minmax()[1],
		"value" : this.state.step2.start(),
	});

	this.bg = this.state.step2.bg;
	this.fg = this.state.step2.fg;

	this.button.off("click");
	this.button.button("option", "label", "Save");
	this.button.blur();
	this.button.on("click", (function(){
		step2_result = this.state.step2.fg(this.slider.slider("value"));
		this.state.step2.save(this.step1_result, step2_result);
		this.dialog.hide();
		Scene.pop_scene();
	}).bind(this));
};

Game.CalibrateDialog.draw = function(){
	var ctx = this.context;
	var canvas = this.canvas;

	var bg = U.RGB(this.bg(this.step1_result));
	var fg = U.RGB(this.fg(this.slider.slider("value")));
	var size = canvas.width/5;
	var sides = 6;
	var x = canvas.width/2;
	var y = canvas.height/2;
	var rotation = 30 * Math.PI/180;

	var points = [];
	points.push([0 + size * Math.cos(0), 0 +  size *  Math.sin(0)]);
	for (var i = 1; i < sides;i += 1) {
		points.push([0 + size * Math.cos(i * 2 * Math.PI / sides), 0 + size * Math.sin(i * 2 * Math.PI / sides)]);
	}

 	ctx.fillStyle = bg;
	ctx.strokeStyle = fg;
	ctx.lineWidth = 25;

	ctx.fillRect(0,0, canvas.width, canvas.height);

	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(rotation);
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for (i=1; i<points.length; i++) {
		ctx.lineTo(points[i][0], points[i][1]);
	}
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
};
//----------------------------------------------------------------------------------



//Instructions Scene------------------------------------------------------------------------
Game.Instructions = Scene.new_scene("instructions");

Game.Instructions.entered = function() {
	this.get_html_elements();
	this.instructions_menu.css("display","flex");
	this.bind_events();
};

Game.Instructions.exiting = function() {
	this.instructions_menu.hide();
	this.release_events();
};

Game.Instructions.get_html_elements = function() {
	this.body = $('body');
	this.instructions_menu = $("#instructions");
	this.back_button = $("#instr_back").button();
};

Game.Instructions.bind_events = function() {
	this.body.on('keyup', function(event){
		if (event.keyCode === 27) {
			Scene.pop_scene();
		}
	});
	this.back_button.on("click", function(){
		Scene.pop_scene();
	});
};

Game.Instructions.release_events = function() {
	this.body.off('keyup');
	this.back_button.off("click");
};
//----------------------------------------------------------------------------------



//Level Scene-----------------------------------------------------------------------
Game.Level = Scene.new_scene("level");

Game.Level.entered = function(){
	this.elapsed = 0;

	this.determine_palette();
	this.get_html_elements();
	this.set_sound();
	this.expand();
	this.context.globalCompositeOperation = this.blendmode;
	this.level.css("display","flex");
	this.orb = Object.create(Game.Orb).init(this.window.width()/2, this.window.height()/2);
	this.orb.new_answer();
	this.bind_events();
};

Game.Level.obscuring = function(){
	this.release_events();
};

Game.Level.revealed = function(){
	this.bind_events();
};

Game.Level.exiting = function(){
	this.release_events();
	this.level.hide();
};

Game.Level.update = function() {
	if (this.pause.is(":hidden")) {
		this.orb.update(this.canvas);
		this.update_countdown();
	}
};

Game.Level.draw = function() {
	//clear canvas
	var width = this.canvas.width;
	var height = this.canvas.height;
	this.context.clearRect(0,0,width,height);

	//draw orb
	this.orb.draw(this.context, this.color1, this.color2);
};

Game.Level.determine_palette = function(){
	if (S.PALETTE === "purpteal") {
		this.blendmode = "multiply";
		this.color1 = U.RGB(S.PURPLE);
		this.color2 = U.RGB(S.TEAL);
		this.background = U.RGB(S.GRAY);
	} else if (S.PALETTE === "redblue") {
		this.blendmode = "screen";
		this.color1 = U.RGB(S.BLUE);
		this.color2 = U.RGB(S.RED);
		this.background = U.RGB(S.BLACK);
	} else if (S.PALETTE === "redgreen") {
		this.blendmode = "multiply";
		this.color1 = U.RGB(S.RED2);
		this.color2 = U.RGB(S.GREEN);
		this.background = U.RGB(S.ORANGE);
	}
};

Game.Level.get_html_elements = function(){
	this.window = $(window);
	this.body = $('body');
	this.level = $("#level");
	//this.level.css("background", this.background);
	$("#viewport").css("background", this.background);
	this.canvas = $("#canvas")[0];
	this.context = this.canvas.getContext('2d');
	this.countdown = $("#countdown");
	this.pause = $("#pause");
	$("#pause_tabs").tabs();
	this.info_tab = $("#info_tab");
	this.hits_graph = $("#hits_graph");
	this.misses_graph = $("#misses_graph");
	this.resume_button = $("#resume_button").button().button("enable");
	this.quit_button = $("#quit_button").button();
	this.sound = $("#sound");
};

Game.Level.set_sound = function(){
	this.sound.empty();
	if (S.MUTE){
		this.sound.append(A.images.mute);
		Howler.mute();
	} else {
		this.sound.append(A.images.unmute);
		Howler.unmute();
	}
};

Game.Level.expand = function(){
	this.level.width(this.window.width());
	this.level.height(this.window.height());
	this.canvas.width = this.window.width();
	this.canvas.height = this.window.height();
};

Game.Level.bind_events = function(){
	this.body.on('keyup', (function(event){
		var input = "";
		switch(event.keyCode) {
			case 37:
				input = "left";
				break;
			case 38:
				input = "up";
				break;
			case 39:
				input = "right";
				break;
			case 40:
				input = "down";
				break;
		}
		if (input.length > 0) {
			this.orb.check_input(input);
		}
		if (event.keyCode === 27) {
			this.pause.toggle();
			if (this.pause.is(":visible")) {
				this.update_pause();
			}
		}
	}).bind(this));

	this.resume_button.on("click", (function(){
		this.pause.toggle();
	}).bind(this));

	this.quit_button.on("click", (function(){
		this.pause.toggle();
		Scene.pop_scene();
	}).bind(this));

	this.sound.on("click", (function(){
		S.MUTE = !S.MUTE;
		this.set_sound();
	}).bind(this));
};

Game.Level.release_events = function(){
	this.body.off('keyup');
	this.resume_button.off("click");
	this.quit_button.off("click");
	this.sound.off("click");
};

Game.Level.update_countdown = function(){
	this.elapsed += 1;
	var remaining = (S.GAME_LENGTH*60) - (this.elapsed/S.TICKS);
	var minutes = Math.floor(remaining/60);
	var seconds = Math.floor(remaining%60);
	this.countdown.html(minutes + ":" + ("0"+seconds).slice(-2));

	if (this.elapsed/S.TICKS >= S.GAME_LENGTH*60) {
		this.update_pause();
		this.pause.show();
		this.resume_button.button("disable");
		this.body.off('keyup');
	}
};

Game.Level.update_pause = function(){
	//destroy old hex graph
	this.hits_graph.empty();
	this.misses_graph.empty();

	//set size of pause info tab
	this.info_tab.width(this.window.width()*0.65);
	this.info_tab.height(this.window.height()*0.65);

	//set text of info tab
	var time = S.GAME_LENGTH.toString() + " min";
	var hit_num = this.orb.correct_guesses.length;
	var miss_num = this.orb.incorrect_guesses.length;
	var hits = "&nbsp;&nbsp;&nbsp;" + U.percentage(hit_num+miss_num, hit_num);
	var misses = "&nbsp;&nbsp;&nbsp;" + U.percentage(hit_num+miss_num, miss_num);
	var size = S.ORB_SCALE;
	var speed = Math.floor(S.ORB_SPEED/S.ORB_SPEED_STEP);
	var vergence_label = "";
	var vergence = Math.floor(S.ORB_SEPARATION/S.ORB_SEPARATION_STEP);
	if (vergence === 0) {
		vergence = "";
	} else if (vergence > 0) {
		vergence_label = "Convergence";
	} else if (vergence < 0) {
		vergence_label = "Divergence";
		vergence = Math.abs(vergence);
	}
	var bounce;
	switch(JSON.stringify(S.ORB_BOUNCE)) {
		case JSON.stringify(S.ORB_BOUNCE_VALUES.NORMAL):
			bounce = A.images.b11;
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.HORIZONTAL):
			bounce = A.images.b22;
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.VERTICAL):
			bounce = A.images.b33;
			break;
	}
	$("#infotime").html(time);
	$("#infohits").html(hits);
	$("#infomiss").html(misses);
	$("#infosize").html(size);
	$("#infospeed").html(speed);
	$("#infovergence").html(vergence_label);
	$("#infovergence2").html(vergence);
	$("#infobounce").empty();
	$("#infobounce").append(bounce);

	//create new correct hex graph
	this.create_hex_graph(S.HEX_CORRECT_COLOR,"#hits_graph", this.orb.correct_guesses);

	//create new incorrect hex graph
	this.create_hex_graph(S.HEX_INCORRECT_COLOR,"#misses_graph", this.orb.incorrect_guesses);
};

Game.Level.create_hex_graph = function(color, id, data){
	//use d3 to create hexbin graph of hits and misses
	var graph_width = this.window.width()*0.65;
	var graph_height = this.window.height()*0.65;

	var data_width = this.window.width();
	var data_height = this.window.height();

	var x = d3.scale.linear()
		.domain([0, data_width])
		.range([0, graph_width]);

	var y = d3.scale.linear()
		.domain([0, data_height])
		.range([0, graph_height]);

	var points = data.map(function(xy){
		return [x(xy[0]),y(xy[1])];
	});

	var hexbin = d3.hexbin()
		.size([graph_width, graph_height])
		.radius(graph_width/20);

	var color_limit = (function(){
		var max = 1;
		var bins = hexbin(points);
		for (i=0; i<bins.length; i++){
			if (bins[i].length > max) {
				max = bins[i].length;
			}
		}
		return max;
	})();

	var color = d3.scale.linear()
		.domain([0, color_limit])
		.range(["white", color])
		.interpolate(d3.interpolateLab);

	var svg = d3.select(id).append("svg")
		.attr("width", graph_width)
		.attr("height", graph_height)
	  .append("g");

	svg.append("clipPath")
		.attr("id", "clip")
	  .append("rect")
		.attr("class", "mesh")
		.attr("width", graph_width)
		.attr("height", graph_height);

	svg.append("g")
		.attr("clip-path", "url(#clip)")
	  .selectAll(".hexagon")
		.data(hexbin(points))
	  .enter().append("path")
		.attr("class", "hexagon")
		.attr("d", hexbin.hexagon())
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("fill", function(d) { return color(d.length); });

	svg.append("svg:path")
		.attr("clip-path", "url(#clip)")
		.attr("d",hexbin.mesh())
		.style("stroke-width", 0.1)
		.style("stroke", "gray")
		.style("fill", "none");
};
//----------------------------------------------------------------------------------



//Objects used by multiple scenes---------------------------------------------------
Game.Orb = {
	init : function(center_x, center_y){
		//starting coordinates
		this.center_x = center_x;
		this.center_y = center_y;

		//set initial orb properties according to settings
		this.speed = S.ORB_SPEED;
		this.bounce_ratio = S.ORB_BOUNCE;
		this.separation = S.ORB_SEPARATION;
		this.scale = S.ORB_SCALE;
		this.outer_line_width = this.scale * S.ORB_LINE_WIDTH;
		this.font = "bold " + S.ORB_FONT_SIZE*this.scale+"px " + S.ORB_FONT;
		U.testContext.font = this.font;
		this.outer_width = 	U.testContext.measureText("12345678").width;
		this.hex_points = this.calculate_hex_points();

		//counter variables
		this.rotation_counter = 0;
		this.underline_position = 0;
		this.record_answer = true;

		//variables for movement
		this.x_dir = 1;
		this.y_dir = 1;

		//variables to store answers and guesses
		this.answer = "";
		this.correct_guesses = [];
		this.incorrect_guesses = [];

		//variables for wrong answer shake effect
		this.x_offset = 0;
		this.shaking = false;

		//variables for correct answer pulsate effect
		this.extra_thickness = 0;
		this.pulsating = false;

		//create functions that use closures
		this.shake = this.shake();
		this.pulsate = this.pulsate();

		return this;
	},

	calculate_hex_points : function(){
		var size = this.outer_width/2;
 		var sides = 6;
		var points = [];

		points.push([0 + size * Math.cos(0), 0 +  size *  Math.sin(0)]);
		for (var i = 1; i < sides;i += 1) {
			points.push([0 + size * Math.cos(i * 2 * Math.PI / sides), 0 + size * Math.sin(i * 2 * Math.PI / sides)]);
		}
		return points;
	},

	pulsate : function() {
		var total = 0;
		var polarity = 1;
		var num_of_pulses = 1;
		var time = 0.3;
		var max = Math.round(this.outer_line_width*1.5);
		var distance = num_of_pulses * max * 2;
		var speed = distance/time;
		var self = this;

		return function() {
			self.pulsating = true;
			if (total >= distance) {
				total = 0;
				polarity = 1;
				self.extra_thickness = 0;
				self.pulsating = false;
				self.new_answer();
			} else {
				self.extra_thickness += (speed/S.TICKS*polarity);
				total += (speed/S.TICKS);
				if (self.extra_thickness >= max || self.extra_thickness <= 0) {
					self.extra_thickness = (self.extra_thickness > 0) ? max : 0;
					polarity *= (-1);
					total = U.nearestMultiple(total,max,"round");
				}
			}
		};
	},

	shake : function() {
		var total = 0;
		var polarity = 1;
		var num_of_shakes = 2;
		var time = 0.3;
		var self = this;

		return function(){
			var turn_point = self.outer_width/6;
			var distance = turn_point*4*num_of_shakes;
			var speed = distance/time;
			self.shaking = true;

			if (total + (speed/S.TICKS) >= distance) {
				total = 0;
				polarity = 1;
				self.x_offset = 0;
				self.shaking = false;
			} else {
				self.x_offset += (speed/S.TICKS*polarity);
				total += (speed/S.TICKS);
				if (self.x_offset >= turn_point || self.x_offset <= -turn_point) {
					self.x_offset = turn_point * polarity;
					polarity *= (-1);
					total = U.nearestMultiple(total,turn_point,"floor");
				}
			}
		};
	},

	draw : function(ctx, color1, color2){
		this.draw_word(ctx,color1, this.word[0], 1);
		this.draw_word(ctx,color2, this.word[1], -1);
		if (this.pulsating || this.shaking) {
			this.draw_word(ctx,color1, this.word[1], 1);
			this.draw_word(ctx,color2, this.word[0], -1);
		}
		this.draw_underline(ctx, color1, 1);
		this.draw_underline(ctx, color2, -1);
		this.draw_hex(ctx, color1, 1);
		this.draw_hex(ctx, color2, -1);
	},

	draw_underline : function(ctx,color,polarity){
		ctx.strokeStyle = color;
		ctx.lineWidth = this.outer_line_width/2;
		var letter_width = ctx.measureText("m").width;
		var letter_height = ctx.measureText("m").width;
		var word_width = ctx.measureText(this.word[0]).width;
		var word_length = this.word[0].length;
		var underline = letter_width * this.underline_position;

		var x = (this.center_x - word_width/2 + underline) + polarity*(this.separation/2) + this.x_offset;
		var y = this.center_y+letter_height;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x+letter_width, y);
		ctx.stroke();
	},

	draw_hex : function(ctx, color, polarity){
		ctx.strokeStyle = color;
		ctx.lineWidth = this.outer_line_width + this.extra_thickness;

		var x = this.center_x + polarity*(this.separation/2) + this.x_offset;
		var y = this.center_y;
		var rotation = this.rotation_counter * Math.PI/180;
		var points = this.hex_points;

		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(rotation);
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (i=1; i<points.length; i++) {
			ctx.lineTo(points[i][0], points[i][1]);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	},

	draw_word : function(ctx, color, word, polarity){
		ctx.fillStyle = color;
		ctx.font = this.font;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		x = this.center_x + polarity*(this.separation/2) + this.x_offset;
		y = this.center_y;

		ctx.fillText(word,x,y);
	},

	bounce : function(axis) {
		if (axis === "x") {
			this.x_dir = this.x_dir * (-1);
		} else if (axis === "y") {
			this.y_dir = this.y_dir * (-1);
		}
	},

	update : function(canvas, options) {
		if (options !== undefined) {
			for (var key in options) {
				switch (key) {
					case "speed":
					case "bounce_ratio":
					case "separation":
						this[key] = options[key];
						break;
					case "scale":
						this[key] = options[key];
						this.font = "bold " + S.ORB_FONT_SIZE*this.scale+"px " + S.ORB_FONT;
						U.testContext.font = this.font;
						this.outer_width = 	U.testContext.measureText("12345678").width;
						this.outer_line_width = this.scale * S.ORB_LINE_WIDTH;
						this.hex_points = this.calculate_hex_points();
						break;
				}
			}
		}

		this.speed_x = this.speed*this.bounce_ratio[0] * this.x_dir;
		this.speed_y = this.speed*this.bounce_ratio[1] * this.y_dir;
		this.check_bounds(canvas);

		this.rotation_counter += S.ORB_ROTATION_SPEED/S.TICKS;
		if (this.rotation_counter >= 360) {
			this.rotation_counter -= 360;
		}

		if (this.underline_position > this.word[0].length-1) {
			this.underline_position = this.word[0].length-1;
		}

		this.move();

		if (this.shaking) {
			this.shake();
		}

		if (this.pulsating) {
			this.pulsate();
		}
	},

	check_bounds : function(canvas) {
		var radius = ((this.outer_width/2)+this.outer_line_width/2);
		if (this.center_x + this.speed_x/S.TICKS + radius + this.separation/2 >= canvas.width ||
			this.center_x + this.speed_x/S.TICKS + radius - this.separation/2 >= canvas.width ||
			this.center_x + this.speed_x/S.TICKS - radius - this.separation/2  <= 0 ||
			this.center_x + this.speed_x/S.TICKS - radius + this.separation/2  <= 0){
				this.bounce("x");
		}
		if (this.center_y + this.speed_y/S.TICKS + radius >= canvas.height || this.center_y + this.speed_y/S.TICKS - radius <= 0) {
			this.bounce("y");
		}
	},

	move : function() {
		this.center_x += this.speed_x/S.TICKS;
		this.center_y += this.speed_y/S.TICKS;
	},

	new_answer : function() {
		var word = Game.Word.new_word();

		this.answer = word[0];
		this.word = [word[1], word[2]];
		this.record_answer = true;
	},

	set_xy : function(new_x, new_y) {
		this.center_x = new_x;
		this.center_y = new_y;
	},

	check_input : function(input) {
		//if not currently shaking or pulsating, check answers
		if (!this.shaking && !this.pulsating) {
			if (input === "up" || input === "down") {
				if ((this.answer === "spelled" && input === "up") || (this.answer === "misspelled" && input === "down")) {
					if (this.record_answer) {
						this.correct_guesses.push([this.center_x, this.center_y]);
					}
					A.sounds.correct.play();
					this.pulsate();
				} else {
					if (this.record_answer) {
						this.incorrect_guesses.push([this.center_x, this.center_y]);
					}
					this.record_answer = false;
					A.sounds.incorrect.play();
					this.shake();
				}
			}
			if (input === "right") {
				this.underline_position += 1;
				if (this.underline_position > this.word[0].length-1) {
					this.underline_position = 0;
				}
			}
			if (input === "left") {
				this.underline_position -= 1;
				if (this.underline_position < 0) {
					this.underline_position = this.word[0].length-1;
				}
			}
		}
	},
};

Game.Word = {
	new_word : function(){
		var word = this.words[U.randInt(0,this.words.length-1)];
		var answer;
		if (U.randInt(1,100) > 50) {
			answer = "spelled";
		} else {
			answer = "misspelled";
			word = this.transpose(word);
		}
		word = this.split(word);
		return [answer, word[0], word[1]];
	},

	transpose : function(word){
		var start;
		var new_word = word;

		do {
			start = U.randInt(0,word.length-2);
		} while (word[start] === word[start+1]);

		new_word = U.replaceAt(new_word, start, word[start+1]);
		new_word = U.replaceAt(new_word, start+1, word[start]);

		return new_word;
	},

	split : function(word){
		var split_word;
		var pattern;
		var five = ["xooxo", "oxoox", "xoxxo", "oxxox"];
		var six = ["xooxxo", "oxxoox"];
		var parse = function(wrd, pttrn){
			var word1 = "";
			var word2 = "";
			for (i=0; i < wrd.length; i++) {
				if (pttrn[i] === "x") {
					word1 += wrd[i];
					word2 += " ";
				} else if (pttrn[i] === "o") {
					word1 += " ";
					word2 += wrd[i];
				}
			}
			return [word1, word2];
		};

		if (word.length === 5) {
			pattern = five[U.randInt(0, five.length-1)];
			split_word = parse(word, pattern);
		} else if (word.length === 6) {
			pattern = six[U.randInt(0, six.length-1)];
			split_word = parse(word, pattern);
		}

		return split_word;
	},

	words : (function(){
		var words = 'about above accent accept access accuse across acted acting active actor actors actual adapt adapts ' +
					'added adding admire admit admits adult adults advice advise affair affect afford afraid after again ' +
					'agent agents aging agree agreed agrees ahead aided aiding aired airing alarm alarms alive allow ' +
					'allows almost alone along alters always amaze amazed amazes among amount amuse amused amuses anger ' +
					'angers angry animal annoy annoys answer anyhow anyone anyway apart appeal appear apply areas argue ' +
					'argued argues around arrive artist asked asking asleep assist assume assure attach attack attend august ' +
					'auntie aunts aunty autumn avoid avoids awake awaken awakes aware awful awoke awoken babies backed ' +
					'backs bacon bagged baked baker bakers bakery bakes baking balled balls banana banded bands banged ' +
					'bangs banked banker banks barest barks barred based bases basic basics basing basket batted batter ' +
					'battle beach beans bears beaten beater beauty became become beefy beers before began beggar begged ' +
					'begin begins begun behind being beings bells belong below belted bends bendy beside better beyond ' +
					'bigger biked biker bikers bikes biking billed bills binder binds birds biter biters bites biting ' +
					'bitten bitter black blacks blame blamed blames blank blanks bleed bleeds bless blind blinds block ' +
					'blocks blocky blond blonde blood bloody bloom blooms blower blown blows blues board boards boated ' +
					'bodies bodily boiled boiler boils bombed bomber bombs bonded bonds bones books boomed booms booted ' +
					'bored bores boring borne borrow bossed bosses bossy bother bottle bottom bought bounce bouncy bound ' +
					'bowed bowing bowled bowler bowls boxes boyish brain brains brainy brake brakes branch brand brands ' +
					'brave braved braver bread breads break breaks breast breath brick bricks bridge brief briefs bright ' +
					'bring brings broad broke broken brown browns brush bucked bucket bucks bugged build builds built ' +
					'bumped bumper bumps bunch burial buried buries burned burner burns burst bursts bushes bushy busier ' +
					'busily butter button buyer buyers buying cable cables caged cages caging cakes called caller calls ' +
					'calmed calmer calmly camera camped camper camps canned cannot canoe canoed canoes capes capped cards ' +
					'career caring carpet carrot carry carts cases cashed castle casts catch catchy caught cause caused ' +
					'causes cents chain chains chair chairs champ chance change charge charm charms chase chased chaser ' +
					'chats chatty cheap cheat cheats check checks cheek cheeks cheer cheers cheery cheese chest chests ' +
					'chewed chewer chews chewy chick chicks chief chiefs child chips choice choose choosy chops chose ' +
					'chosen church circle cities claim claims class classy clean cleans clear clears clever cliff cliffs ' +
					'climb climbs clips clock clocks close closed closer closes cloth cloths cloud clouds cloudy clubs ' +
					'clues coach coasts coffee colder coldly color colors comes coming commit common cooked cooks cooled ' +
					'cooler cools coped copied copier copies coping corner costly costs cotton cough coughs could count ' +
					'counts county couple course court courts cousin cover covers crack cracks crash crawl crawls crazy ' +
					'cream creams creamy credit crept cried crier criers crime crimes crisp crisps crispy cross crowd ' +
					'crowds crown crowns cruel crying cupped cured curing curled curler curls curly cutter daddy daily ' +
					'damage dance danced dancer dances danger dared dares daring darken darker darkly dated dates dating ' +
					'dawned dawns deaden deadly dealer deals dealt dearly death deaths debtor debts decent decide decks ' +
					'deepen deeper deeply degree demand denial denied denies depend depth depths desert design desire desks ' +
					'detail detect dieted dieter digger dined diner diners dines dining dinner direct dirty dished dishes ' +
					'dived diver divers dives divide diving doctor doggie doggy doing doings dollar dolls dolly double ' +
					'doubly doubt doubts downed dozen dozens dragon drags drama dramas drank drawer drawn draws dream ' +
					'dreams dreamy dress dried driers dries drink drinks drive driven driver drives drove drugs drums ' +
					'drunk drunks dryer dryers drying dryly ducked ducks dumped dumps during dusted duster dusts dusty ' +
					'duties dying earful early earned earner earns earth earths earthy eased eases easier easily easing ' +
					'eaten eater eaters eating edged edger edges edging edited editor edits effect effort eight eighth ' +
					'eights eighty either elder elders elect elects eleven email emails empire employ empty ended ending ' +
					'enemy energy engage engine enjoy enjoys enough enter enters entire equal equals equip equips escape ' +
					'estate event events exact exams except excite excuse exists expect expose extend extra extras eyeful ' +
					'eyeing faced faces facing facts failed fails faint faints fairer fairly fairy faith faiths fallen ' +
					'falls family famous fancy fanned farms faster father fatten fatter fatty fault faults faulty favor ' +
					'favors feared fears feeder feeds feeler feels fella fellow female fence fenced fences fetch fewer ' +
					'fewest fields fifth fifths fifty fight fights figure filing filled filler fills filmed films filmy ' +
					'final finals finder finds finely finer finest finger finish firing firmed firmer firmly first fished ' +
					'fishes fishy fitted fives fixed fixer fixes fixing flags flame flamed flames flash flatly flight ' +
					'flips floaty flood floods floor floors flowed flower flown flows flyer flyers flying folded folds ' +
					'folks follow foods fooled fools force forced forces forest forget forgot formed forms forty fought ' +
					'found fours fourth foxed foxes foxier foxily frame frames freed freely freeze fresh fridge friend ' +
					'fright froggy frogs front fronts frost frosts frosty froze frozen fruit fruits fruity fryer fryers ' +
					'frying fuller fully funded funder funds funny furry future gaily gained gains games gaming garage ' +
					'garden gases gates gather geared gears gentle gently gents ghost ghosts giant giants gifted gifts ' +
					'gimme girls girly given giver givers gives giving gladly glance glass glassy glory godly going ' +
					'golden golfer goner goody gotten govern grace graced graces grade graded grader grades grand grands ' +
					'grant grants grass grassy great greats green greens grocer ground group groups grower grown grows ' +
					'growth guard guards guess guest guests guide guided guides guilt guilty habit habits hairs hairy ' +
					'halls halves handed handle hands handy hanged hanger hangs happen happy harden harder hardly harmed ' +
					'harms hated hater haters hating hatter haven having headed heads health heaped heaps heard hears ' +
					'heart hearts heated heater heaven heavy hedge hedged hedges height hello helped helper helps heroes ' +
					'heroic hidden hider hides hiding higher highly highs hills hilly hired hires hiring hitter hobby ' +
					'holder holds holed holes homed homes homing honest honey honeys honor honors hooked hooks hoped ' +
					'hopes hoping horse horses horsey horsy hotel hotels hotly hotter hourly hours house housed houses ' +
					'hugely human humans hunger hungry hunted hunter hunts hurry icily ideas idiot idiots ignore image ' +
					'imaged imager images impure income indeed indoor inform injure injury inner inside insist insure intend ' +
					'intent invite inward island issue issued issuer issues items itself jacket jammed jeans joined joins ' +
					'joked joker jokers jokes jokey joking joyful joyous judge judged judges juice juices juicy jumped ' +
					'jumper jumps jumpy junior keeper keeps keyed kicked kicker kicks killed killer kills kinder kindly ' +
					'kinds kingly kings kissed kisser kisses kneed knees knife knifed knits knives knock knocks known ' +
					'knows labor labors lacked lacks ladies lakes lambs lamps landed lands lanes large larger lasted ' +
					'lastly lasts lately latest laugh laughs lawful lawns lawyer laying lazier lazily leader leads league ' +
					'leaned leaped leaper leaps learn learns least leave leaves lefts legal leggy lender lends length ' +
					'lessen lesser lesson letter level levels lidded lifted lifter lifts light lights liked likely likes ' +
					'liking limit limits lined listed listen lists little lived lives living loaded loader loads loaned ' +
					'loans local locals locate locked locks logged logger lonely loner loners longer looked looker looks ' +
					'loose loosed loosen looser lorded lords loser losers losing losses louder loudly loved lovely lover ' +
					'lovers loves loving lower lowers lowest lowly lucky lumped lumps lumpy lunch lying madden madder ' +
					'madly magic mailed mails mainly major maker makers makes making males mamma manage manly manned ' +
					'manner mapped march marked marker market marks marry marvel masked masks massed masses master match ' +
					'mates maths matter maybe meals means meant meats meaty melted melts member memory mental merry ' +
					'messed messes messy metal metals metric midair midday middle midway might miles milked milks milky ' +
					'milled miller mills minded minds minor minors minus mirror misled missed misses mister misuse mixed ' +
					'mixer mixers mixes mixing model models modern moment mommy money monkey month months moods moody ' +
					'mostly mother motor motors mount mounts mousy mouth mouths mouthy moved mover movers moves movie ' +
					'movies moving mowed mower mowers mowing muddy mummy murder muscle music musics myself nailed named ' +
					'namely names naming nanny narrow nasty nation native nature naval nearby neared nearer nearly nears ' +
					'neater neatly necks needed needs nerve nerves nested nests never newer newest newish newly nicely ' +
					'nicer night nights nines ninety ninth ninths nobody noise noises noisy normal north nosed noses ' +
					'nosing noted notes notice noting number nurse nursed nurses oaken object occur occurs odder oddest ' +
					'oddity oddly offer offers office often oiled oiler oilers oiling older oldest oldie oldies onion ' +
					'onions opened opener openly opens oppose orange order orders other others ought ovens overly owing ' +
					'owned owner owners owning packed packer packs pages pained paint paints paired panic panics paper ' +
					'papers papery pardon parent parked parks partly party passed passer passes pasts patch paths patted ' +
					'pause paused pauses payed payee payees payer payers paying peace penned penny people period person ' +
					'phone phoned phones photo photos piano pianos picked picker picks picky piece pieced pieces pigged ' +
					'piggy piglet piling pines pinker pinky pinned piped pipes piping pitch pitied pities place placed ' +
					'places plain plane planes planet plans plant plants plate plated plates played player plays please ' +
					'plenty plugs pocket poetic poetry poets point points pointy poison poles police policy polish polite ' +
					'pooled poorer poorly popped ports postal posted posts potato potted potter pound pounds poured pours ' +
					'power powers prayed prayer prays prefer prepay press pretty price priced prices pricey prided prides ' +
					'prime primed primes prince print prints prison proper proud prove proved proven proves public pulled ' +
					'pulls pumped pumps punch punish puppy purely purer purest purist purity purple pushed pusher pushes ' +
					'pushy queen queens quick quits quote quoted quotes rabbit racer racers races radio radios rained ' +
					'rainy raised range ranged ranges rapid rapids rarely rarer rarity rated rates rather rating ratty ' +
					'reach react reacts reader reads ready really reason reborn recall recent recipe reckon record redden ' +
					'redder redone redraw reduce refer refers refill refuse regard region regrow reheat rejoin relate relax ' +
					'relied relief relies reload remade remain remake remark remind remove rename renew renews rental rented ' +
					'rents reopen repair repeat replay reply report reread rerun reruns resale reseal resell resold rested ' +
					'rests result retake retell retire retold retook return reused reuses rices richer riches richly ridden ' +
					'rider riders rides riding right rights ringed rings ripped risen rises rising risked risks risky ' +
					'river rivers roads roared roars robbed robber rocks rocky rolled roller rolls roofed roofs rooms ' +
					'roomy rooted roped ropes rotted rotten rough round rounds rowed rower rowers rowing royal royals ' +
					'rubbed rudely ruder rudest ruined ruins ruled ruler rulers rules ruling runner runny rushed rushes ' +
					'sadden sadder sadly safely safer safes safest safety sailed sailor saint saints sakes salad salads ' +
					'salary sales sanded sander sands sandy sauce sauces saved saver savers saves saving saying scale ' +
					'scaled scales scare scares scary scene scenes scenic school score scored scorer scores scream screen ' +
					'screw screws sealed sealer seals search season seated seater seats second secret secure seeded seeds ' +
					'seeing seeker seeks seemed select seller sells selves sender senior sense series serve served server ' +
					'serves settle seven sevens sewed sewing shade shaded shades shadow shady shake shaken shaker shakes ' +
					'shaky shall shame shamed shames shape shaped shaper shapes share shared shares sharp shave shaved ' +
					'shaven shaver shaves sheds sheep sheet sheets shelf shell shells shelve shift shifts shine shined ' +
					'shines shiny ships shirt shirts shock shocks shoed shoes shone shook shoot shoots shops short ' +
					'shots should shout shouts shove shoved shoves showed shower shown shows shuts shyly sicken sicker ' +
					'sickly sided sides siding sight sights signal simple simply since single singly sinks sister sitter ' +
					'sixes sixth sixths sixty sized sizes sizing skied skiers skiing skill skills skins skirt skirts ' +
					'sleep sleeps sleepy slept slide slider slides slight slips slowed slower slowly slows small smart ' +
					'smarty smash smell smells smelly smile smiled smiles smoke smoked smoker smokes smokey smoky smooth ' +
					'snake snaked snakes snaps snowed snows snowy social socks soften softer softly soils sonny sooner ' +
					'sorely sorer sores sorest sorry sorted sorts sought sound sounds soups soupy south space spaced ' +
					'spacer spaces spare spared speak speaks speech speed speeds speedy spell spells spend spends spent ' +
					'spins spirit splits spoil spoils spoke spoken sport sports sporty spots spotty sprang spray sprays ' +
					'spread spring sprung square stable staff staffs stage staged stages stair stairs stamp stamps stand ' +
					'stands stare stared stares starry start starts starve state stated states stayed stays steady steak ' +
					'steaks steals steam steams steamy steps stick sticks stiff stiffs still stills stirs stock stocks ' +
					'stole stolen stone stoned stones stony stood stops store stored storm storms stormy stream street ' +
					'stress strike string stroke strong struck strung stuck study stuff stupid style styled styles subset ' +
					'sucked sucks sudden suffer sugar sugars sugary suited suits summer sunken sunned sunny super supply ' +
					'surely surer surest sweep sweeps sweet sweets swept swims swing swings switch sword swords swore ' +
					'sworn swung system table tabled tables tailed tails taken taker takers takes taking talked talker ' +
					'talks taller tanks taped tapes taping tapped taste tasted taster tastes tasty taught taxed taxes ' +
					'taxied taxing taxis teach teamed teams tears tease teased teases teeth tells tempt tempts tended ' +
					'tends tense tensed tenses tented tenth tenths tents terms tested tester tests thank thanks their ' +
					'theirs these thick thief thing things think thinks thinly thins third thirds thirst thirty those ' +
					'though threat threw throat throw thrown throws ticket tidal tides tight tights timed timely timer ' +
					'timers times timing tinier tinny tipped tipper tiring title titles toast toasts toasty toilet tomato ' +
					'tonal toned toner tones tongue toning tooled tools tooth toothy topic topics topped topper total ' +
					'totals touch tough toured toward towel towels tower towers towns toyed toying trace traced traces ' +
					'track tracks trade traded trader trades train trains travel trays treat treats trees trick tricks ' +
					'tricky trips truck trucks truer truest truly trunk trunks trust trusts trusty truth truths tuned ' +
					'tuner tuners tunes tuning turned turns twelve twenty twice twins twists twisty tying types uglier ' +
					'unbend unbent unbind unborn uncle uncles uncool uncurl uncut undead undid undoes undone unease uneasy ' +
					'unfair unfed unfit unfold unhook unhurt union unions units unkind unless unlit unload unlock unmask ' +
					'unmet unpack unpaid unplug unreal unroll unsafe unseen unsent unsold unsure until untold untrue unused ' +
					'unwed unwell unwise unworn unwrap upper upset upsets upside useful usual valley value valued values ' +
					'varied varies veggie victim video videos viewed viewer views visit visits voice voiced voices voted ' +
					'voter voters votes voting waged wages waging waited wakens wakes waking walked walker walks walled ' +
					'walls wander wanted wants warmed warmer warmly warms warmth warned warns warred washed washer washes ' +
					'waste wasted waster wastes watch water waters watery waved waves waving weaken weaker weakly weapon ' +
					'wearer wears wedded weeded weeds weedy weekly weeks weight weird weirdo wetly wetter wheel wheels ' +
					'where which while whilst whips white whiten whiter whites whole whose wicked widely widen widens ' +
					'wider widest width widths wilder wildly wilds willed winded window winds windy winery wines winged ' +
					'wings wining winner winter wintry wiped wiper wipers wipes wiping wiring wisdom wisely wiser wisest ' +
					'wished wisher wishes within wives woken wolves woman women wonder wooden woods woody woolen worded ' +
					'words wordy worked worker works world worlds wormed worms wormy worry worse worsen worthy would ' +
					'wound wounds write writer writes wrong wrongs wrote yards yearly years yelled yellow yells young ' +
					'yours zeros';
		return words.split(" ");
	})(),
};
//----------------------------------------------------------------------------------


//Game application starts up here---------------------------------------------------
Game.set_custom_widgets = function(){
	$.widget( "ui.minute_spinner", $.ui.spinner, {
		_format: function(value) { return value + ' min'; },
		_parse: function(value) { return parseInt(value); }
	});
};

Game.set_default_values = function(){
	S.set_defaults({
		TICKS : 60,
		GRAY : [127,127,127],
		BLUE : [0,0,255],
		WHITE : [255,255,255],
		RED2 : [255,0,0],
		ORB_FONT_SIZE : 8,
		ORB_FONT : "monaco, Lucida Console, monospace",
		ORB_LINE_WIDTH : 2,
		ORB_SPEED_STEP : 5,
		ORB_SEPARATION_STEP : 15,
		ORB_ROTATION_SPEED : 45, //degrees per second
		ORB_BOUNCE_VALUES : {NORMAL: [1,1], HORIZONTAL: [1,0.1], VERTICAL: [0.1,1]},
		HEX_CORRECT_COLOR : "darkgreen",
		HEX_INCORRECT_COLOR : "darkred",

		MUTE : false,
		GAME_LENGTH : 5, //minutes
		ORB_SEPARATION : 0,
		ORB_SCALE : 9,
		ORB_SPEED : 50, //pixels per second
		PALETTE : "purpteal",  // purpteal, redblue, redgreen
		PURPLE : [132,0,132],
		TEAL : [0,129,129],
		RED : [255,0,0],
		BLACK : [0,0,0],
		ORANGE : [255,127,0],
		GREEN : [0,127,0],
	});

	S.set_defaults({ORB_BOUNCE : S.ORB_BOUNCE_VALUES.NORMAL});
};

Game.set_images_and_sounds = function(){
	A.add_images({
		b1 : ["images/b1.png", function(img){ $("#b1").append(img); }],
		b2 : ["images/b2.png", function(img){ $("#b2").append(img); }],
		b3 : ["images/b3.png", function(img){ $("#b3").append(img); }],
		b11 : ["images/b1.png"],
		b22 : ["images/b2.png"],
		b33 : ["images/b3.png"],
		mute : ["images/mute.png"],
		unmute : ["images/unmute.png"],
		menu_bg : ["images/logo.png", function(){ $(".menu_bg").css('background-image', 'url(' + "images/logo.png" + ')'); }],
	});

	A.add_sounds({
		correct : ["sounds/correct.mp3"],
		incorrect : ["sounds/incorrect.mp3"],
	});
};

Game.start = function(){
	this.set_custom_widgets();
	this.set_default_values();
	this.set_images_and_sounds();
	Scene.start("load",S.TICKS);
};
//----------------------------------------------------------------------------------
