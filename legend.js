function Legend(){
    this.width = 700
	this.height = 30

    this.base_options = ["[ENTER] Toggle fullscreen", "[SPACE] Toggle menu"]
    this.options = this.base_options.slice()

    this.set_extra_options = function(extra_options){
        this.options = this.base_options.slice()
        extra_options.forEach(extra_option=>{
            this.options.push(extra_option)    
        })
    }

	this.draw = function(){
        push()

		// RENDER BOX
		max_height = window.innerHeight
		max_width = window.innerWidth
		box_x = max_width/2 - this.width/2
		box_y = max_height - (this.height + 10)
		fill('black');
		stroke("#00B200")
		rect(box_x, box_y, this.width, this.height, 10);
        
        // RENDER OPTIONS TEXT
        text_height = 12
        text_width = 170
		text_y = box_y + this.height/2 - text_height/2
        textSize(text_height)
        var pointer_x = box_x + 10
        this.options.forEach(option=>{
            text(option, pointer_x, text_y, text_width, text_height);
            pointer_x += text_width
        })

		pop()

	}



}
