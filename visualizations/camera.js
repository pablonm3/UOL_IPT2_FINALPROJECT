

var LAST_VIZ_INDEX = 1
// height of fft == height/divisions
var divisions = 5;
var speed = 1;
var THRESHOLD_LOW = 170
// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 1;

// what amplitude level can trigger a beat?
//TODO: does ot activate only for beats or for anything w volume?
var beatThreshold = 0.7; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.5; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


function Camera() {
	Visualization.call(this, "Camera video", ["[←→] Change filter"])
	this.filter_no = 1;
  this.beat_detected = false;

  this.detectBeat = function(level) {
    if(this.beat_detected){
      return true
    }
    if (level > beatThreshold){
      this.beat_detected = true;
      setTimeout(()=>{
        this.beat_detected = false  
      }, 50)
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
    }

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