


// what amplitude level can trigger a beat?
var beatThreshold = 0.7; 


function Camera() {
	Visualization.call(this, "Camera video", ["[←→] Change filter"])
	this.filter_no = 0;
  this.beat_detected = false;
  this.rotation_angle = 0
  var LAST_VIZ_INDEX = 1

  this.detectBeat = function(level) {
    // detects peaks in the givel level of frequency
    if(this.beat_detected){
      return true
    }
    if (level > beatThreshold){
      this.beat_detected = true;
      setTimeout(()=>{
        this.beat_detected = false  
      }, 25)
      return true;
    } 
    return false;
  }

  this.viz_0 = function(){
      fourier.analyze()
      var low_energy = fourier.getEnergy("bass")
      var mid_energy = fourier.getEnergy("mid")
      var high_energy = fourier.getEnergy("highMid")
      var level = low_energy / 255
      if(this.detectBeat(level)){
        tint(200, 100, 100); 
      }
      else{
        tint(high_energy, mid_energy, low_energy);
      }
      image(capture, 0, 0, window.innerWidth, window.innerHeight); // place this between tint and filter got both options to take effect
      filter(POSTERIZE, 10); // reduce color range in each channel to the max value passed
  }

  this.viz_1 = function(){
    fourier.analyze()

    //var level = amplitude.getLevel();
    var level = fourier.getEnergy("bass") / 255

    if(this.detectBeat(level)){
      tint(70, 1, 150, 500); // ultraviolet
      this.rotation_angle += .1;
    }
    translate(width / 2, height / 2);
    rotate(this.rotation_angle);
    imageMode(CENTER);
    image(capture, 0, 0, window.innerWidth, window.innerHeight); // place this between tint and filter got both options to take effect

}

this.keyPressed = function(keycode){
    if(37 ==keycode){
      // left arrow(back)
      this.filter_no -= 1
      if(this.filter_no < 0){
        this.filter_no = LAST_VIZ_INDEX
      }
    }
    if(39 ==keycode){
            // right arrow(next)
      this.filter_no += 1
      if(this.filter_no > LAST_VIZ_INDEX){
        this.filter_no = 0
      }
    }
}


	this.draw = function() {
		push();
		noFill();

    if(this.filter_no == 0){
      this.viz_0()
    }
    if(this.filter_no == 1){
      this.viz_1()
    }
		pop();
	};


}