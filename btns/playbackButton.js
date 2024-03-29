//displays and handles clicks on the playback button.
function PlaybackButton(isPlaying, onPlay, onPause, x=20, y=20, width=20, height=20){
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.isPlaying = isPlaying
	this.onPlay = onPlay
	this.onPause = onPause


	this.draw = function(x=20, y=20, width=20, height=20){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		if(this.isPlaying()){
			rect(this.x, this.y, this.width/2 - 2, this.height);
			rect(this.x + (this.width/2 + 2), this.y, this.width/2 - 2, this.height);
		}
		else{	
			triangle(this.x, this.y, this.x + this.width, this.y + this.height/2, this.x, this.y+this.height);
		}
	};

	//checks for clicks on the button, starts or pauses playabck.
	//@returns true if clicked false otherwise.
	this.hitCheck  = function(){
		if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
			if (this.isPlaying()) {
    			this.onPause();
  			} else {
    			this.onPlay();
  			}
  			return true;
		}
			return false;
	};

}