//displays and handles clicks on the playback button.
function BackButton(on_click, x=20, y=20, width=20, height=20){
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
    var DEFAULT_FONT_COLOR = "#00B200"
	var SELECTED_FONT_COLOR = "#EE82EE"
    this.font_color = DEFAULT_FONT_COLOR


	this.draw = function(x=20, y=20, width=20, height=20){
        push()
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
        fill(this.font_color)
        triangle_width = this.width/2
        height_buffer = this.height/4
        //height of the triangle is a little smaller than the heght of the button, also need to move the triangle up to let buffer/2 pixels below and above
        actual_height = this.height - height_buffer
        actual_y = this.y + height_buffer/2
	    triangle(this.x, actual_y + actual_height/2, this.x + triangle_width, actual_y, this.x + triangle_width, actual_y + actual_height);
        sec_triangle_x = this.x+triangle_width
        triangle(sec_triangle_x, actual_y + actual_height/2, sec_triangle_x + triangle_width, actual_y, sec_triangle_x + triangle_width, actual_y + actual_height);
        pop()
	};
    
    this.on_click = function(){
		// if user clicked on it: change color to selected color for 1 sec AND run action linked to the option
		this.font_color = SELECTED_FONT_COLOR
		this.draw()
		setTimeout(()=>{
			// revert font color to normal after .5 sec
			this.font_color = DEFAULT_FONT_COLOR
			this.draw()
		}, 500)
        on_click()
	}


	//checks for clicks on the button, starts or pauses playabck.
	//@returns true if clicked false otherwise.
	this.hitCheck  = function(){
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
            this.on_click()
  			return true;
		}
			return false;
	};

}