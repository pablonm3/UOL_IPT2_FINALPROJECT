//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){
	
	this.menuDisplayed = true;
	this.menu = new Menu()
	this.songControls = new SongControls()

	//make the window fullscreen or revert to windowed
	this.mousePressed = function(){
		console.log("mouse click")
		this.menu.mousePressed()
		this.songControls.mousePressed()
		return false
	};

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode){
		if(keycode == 32){
			//space key pressed, toggle fullscreen
			//TODO: activate playback when user clicks on play rather that upon space button press
			var fs = fullscreen();
			fullscreen(!fs);
		}
		if(keyCode == 27){
			// ESC key pressed, toggle menu
			this.menuDisplayed = !this.menuDisplayed;
		}

		// if(keycode > 48 && keycode < 58){
		// 	var visNumber = keycode - 49;
		// 	vis.selectVisual(vis.visuals[visNumber].name); 
		// }
	};

	//draws the playback button and potentially the menu
	this.draw = function(){
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(34);
		this.songControls.draw()
		//only draw the menu if menu displayed is set to true.
		if(this.menuDisplayed){
			this.menu.draw();
		}	
		pop();

	};
}

function SongControls(){
	this.width = 290
	this.height = 30
	this.playbackButton = new PlaybackButton();
	this.backButton = new BackButton();
	this.nextButton = new NextButton();

	this.songName = "Default Song"

	this.mousePressed = function(){
		var r1 = this.playbackButton.hitCheck()
		var r2 = this.backButton.hitCheck()
		var r3 = this.nextButton.hitCheck()
		return r1 || r2 || r3
	};

	this.draw = function(){
		push()

		// RENDER BOX
		max_height = window.innerHeight
		max_width = window.innerWidth
		box_x = max_width/2 - this.width/2
		box_y = 10
		fill('black');
		stroke("#00B200")
		rect(box_x, box_y, this.width, this.height, 10);


		// RENDER SONG NAME
		stroke("#00B200")
		text_height = 12
		noFill()
		textSize(text_height)
		text_width = 100
		text_y = box_y + this.height/2 - text_height/2
		buffer = 20 // add a buffer to separate buttons from text
		text_x = box_x + this.width/3 + buffer
		console.log("text_y: ", text_y)
		text(this.songName, text_x, text_y, text_width, text_height);
		

		//RENDER BUTTONS
		btn_width = 12
		btn_height = 12
		btn_buffer = 12

		//back btn
		back_x = box_x + buffer
		back_y = text_y
		this.backButton.draw(back_x, back_y, btn_width, btn_height);


		// play btn
		play_x = back_x + btn_width + btn_buffer
		play_y = back_y 
		this.playbackButton.draw(play_x, play_y, btn_width, btn_height);

		//next btn
		next_x = play_x + btn_width + btn_buffer
		next_y = text_y
		this.nextButton.draw(next_x, next_y, btn_width, btn_height);

		pop()
	}

}


//TODO: move this class to its own file
function Menu(){
	this.menuOptions = []
	menu_size = 400
	this.rendered = false 


	this.loadOptions = function(max_height, max_width, menu_start_x){
		console.log(`max_height: ${max_height}, max_width: ${max_width}, menu_start_x: ${menu_start_x}`)
		console.log("window.innerHeight: ", window.innerHeight)
		for(var i = 0; i < vis.visuals.length; i++){
			// menu is a squared box, x and y loc are coordinates of the top left corner,
			//we want the center of the box to be as close as the center of the screen as possible so need to subtract box_length/2 from every corner otherwise the corner itself would end uo in the middle of screen
			var yLoc = max_height/2 - menu_size/3 + i*40;
			var xLoc = max_width/2 - menu_size/2 +  20
			let vis_name = vis.visuals[i].name //IMPORTANT: use let vaar type so that a new var is stored for every iteration, otherwise the same var will get overwritten on every iteration
			var on_click = function(){
				console.log("changing viz to: ", vis_name)
				vis.selectVisual(vis_name); 
			}
			if(this.rendered){
				option = this.menuOptions[i]
				option.onResize(xLoc, yLoc, menu_size, menu_start_x)
			}
			else{
				var option = new MenuOption("Change visualization: " + vis.visuals[i].name, xLoc, yLoc, menu_size, menu_start_x, on_click);
				this.menuOptions.push(option)
			}
		}  
	}

	this.draw = function(){
		max_height = window.innerHeight
		max_width = window.innerWidth
		menu_start_x = max_width/2 -  menu_size/2
		this.loadOptions(max_height, max_width, menu_start_x)
		fill('#009999');
		rect(menu_start_x, max_height/2 - menu_size/2, menu_size, menu_size, 20);
		//draw out menu items for each visualisation
		this.menuOptions.forEach(o=>o.draw())
		this.rendered = true
	}

	this.mousePressed = function() {
		console.log("Clicked inside MENU!!")
		this.menuOptions.forEach(e => {
			e.mousePressed()
		});
		return false
	  }

}

function MenuOption(option_text, xLoc, yLoc, menu_width, menu_x_loc, on_click){

	this.load_dinmentions = function(xLoc, yLoc, menu_width, menu_x_loc){
		this.xLoc = xLoc
		this.yLoc = yLoc
		WIDTH = menu_width // width from beggining of the text up to when menu box ends
		this.x_buffer_menu_text = this.xLoc - menu_x_loc
	}


	this.option_text = option_text
	DEFAULT_FONT_COLOR = "#EE82EE"
	SELECTED_FONT_COLOR = "red"
	this.font_color = DEFAULT_FONT_COLOR
	var WIDTH;
	this.load_dinmentions(xLoc, yLoc, menu_width, menu_x_loc)
	HEIGHT = 20
	this.x_buffer_menu_text = this.xLoc - menu_x_loc
	this.on_click = on_click

	this.draw = function(){
		textSize(20)
		fill(this.font_color)
		text(this.option_text, this.xLoc, this.yLoc, WIDTH, HEIGHT);
	}

	this.selectOption = function(){
		// if user clicked on it: change color to selected color for 1 sec AND run action linked to the option
		fill("red")
		this.font_color = SELECTED_FONT_COLOR
		this.draw()
		setTimeout(()=>{
			// revert font color to normal after .5 sec
			this.font_color = DEFAULT_FONT_COLOR
			this.draw()
		}, 500)
		console.log("CLICKED ON: ", this.on_click)
		this.on_click()
	}

	this.mousePressed = function(){
		//TODO: check if user clicked option and run action: https://www.youtube.com/watch?v=DEHsr4XicN8&ab_channel=TheCodingTrain
		if(mouseX >= this.xLoc && mouseX <= (this.xLoc + WIDTH - this.x_buffer_menu_text) && mouseY >= this.yLoc && mouseY <= (this.yLoc + HEIGHT)){
			console.error("clicked option")
			this.selectOption()
		}
		return false
	}

	this.onResize = function(xLoc, yLoc, menu_width, menu_x_loc){
		this.load_dinmentions(xLoc, yLoc, menu_width, menu_x_loc)
		this.draw()
	}

}