function SongControls(player){
	this.width = 350
	this.height = 30
	this.player = player
	this.playbackButton = new PlaybackButton(this.player.isPlaying, this.player.play, this.player.pause);
	this.backButton = new BackButton(player.back);
	this.nextButton = new NextButton(player.next); // TODO: pass player.next function


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
		text_width = 250
		text_y = box_y + this.height/2 - text_height/2
		buffer = 20 // add a buffer to separate buttons from text
		text_x = box_x + this.width/3 + buffer
		const songName = this.player.current_song()
		text(songName, text_x, text_y, text_width, text_height);
		

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