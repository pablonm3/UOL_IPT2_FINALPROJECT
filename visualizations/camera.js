

var LAST_VIZ_INDEX = 1
function Camera() {
	Visualization.call(this, "Camera video", ["[←→] Change filter"])
	this.filter_no = 1;
  peakDetect = new p5.PeakDetect(20, 5000);

  this.viz_0 = function(){
      fourier.analyze()
      var low_energy = fourier.getEnergy("bass")
      var mid_energy = fourier.getEnergy("mid")
      var high_energy = fourier.getEnergy("highMid")
      tint(low_energy, mid_energy, high_energy); // Tint blue
      image(capture, 0, 0, window.innerWidth, window.innerHeight); // place this between tint and filter got both options to take effect
      filter(POSTERIZE, 15); // reduce color range in each channel to the max value passed
  }

  this.viz_1 = function(){
    fourier.analyze()
    var low_energy = fourier.getEnergy("bass")
    peakDetect.update(fourier);
    var alpha = 140//low_energy

    if ( peakDetect.isDetected ) {
      alpha = 500
    } 
  
    tint(70, 1, 150, alpha); // ultraviolet
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