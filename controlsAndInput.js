//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){
	
	this.menuDisplayed = true;
	this.player = new Player()
	this.menu = new Menu(this.player)
	this.songControls = new SongControls(this.player)

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