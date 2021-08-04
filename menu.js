function Menu(player){
	this.menuOptions = []
	menu_size = 400
	this.rendered = false 
	this.player = player
	this.menuDisplayed = true;

	this.loadOptions = function(max_height, max_width, menu_start_x){
		console.log(`max_height: ${max_height}, max_width: ${max_width}, menu_start_x: ${menu_start_x}`)
		console.log("window.innerHeight: ", window.innerHeight)
		var xLoc = max_width/2 - menu_size/2 +  20
		var yLoc = max_height/2 - menu_size/3
		var option = new MenuOption("Upload song", xLoc, yLoc, menu_size, menu_start_x, ()=>{
			document.getElementById('fileid').click();
		});
		document.getElementById('fileid').addEventListener('change', ()=>{
			console.log("file is ready")
			let file = document.getElementById("fileid").files[0];
			console.log("file: ", file)
			this.player.upload(file)
		});

		this.menuOptions.push(option)
		for(var i = 0; i < vis.visuals.length; i++){
			// menu is a squared box, x and y loc are coordinates of the top left corner,
			//we want the center of the box to be as close as the center of the screen as possible so need to subtract box_length/2 from every corner otherwise the corner itself would end uo in the middle of screen
			var yLoc = max_height/2 - menu_size/3 + this.menuOptions.length * 40;
			let vis_name = vis.visuals[i].name //IMPORTANT: use let vaar type so that a new var is stored for every iteration, otherwise the same var will get overwritten on every iteration
			var on_click = function(){
				console.log("changing viz to: ", vis_name)
				vis.selectVisual(vis_name); 
			}
			var option = new MenuOption("Change visualization: " + vis.visuals[i].name, xLoc, yLoc, menu_size, menu_start_x, on_click);
			this.menuOptions.push(option)
		}  
	}

	this.onResize = function(max_height, max_width, menu_start_x){
		var xLoc = max_width/2 - menu_size/2 +  20
		this.menuOptions.forEach((option, i)=>{
			var yLoc = max_height/2 - menu_size/3 + i* 40;
			option.onResize(xLoc, yLoc, menu_size, menu_start_x)
		})
	}

	this.toggle_show = function(){
		this.menuDisplayed = !this.menuDisplayed;
	}

	this.draw = function(){
		if(!this.menuDisplayed){
			return;
		}
		max_height = window.innerHeight
		max_width = window.innerWidth
		menu_start_x = max_width/2 -  menu_size/2
		if(this.rendered){
			this.onResize(max_height, max_width, menu_start_x)	
		}
		else{
			this.loadOptions(max_height, max_width, menu_start_x)	
		}
		fill('#009999');
		rect(menu_start_x, max_height/2 - menu_size/2, menu_size, menu_size, 20);
		//draw out menu items for each visualisation
		this.menuOptions.forEach(o=>o.draw())
		this.rendered = true
	}

	this.mousePressed = function() {
		if(!this.menuDisplayed){
			return;
		}
		this.menuOptions.forEach(e => {
			e.mousePressed()
		});
		return;
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
	var DEFAULT_FONT_COLOR = "#EE82EE"
	var SELECTED_FONT_COLOR = "red"
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