

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
var beatThreshold = 0.011; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.1; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


function Camera() {
	Visualization.call(this, "Camera video", ["[←→] Change filter"])
	this.filter_no = 0;

  amplitude = new p5.Amplitude();
  amplitude.smooth(0.9);

  function detectBeat(level) {
    if (level  > beatCutoff && level > beatThreshold){
      beatCutoff = level *1.2;
      framesSinceLastBeat = 0;
      return true;
    } 
    else{
      if (framesSinceLastBeat <= beatHoldFrames){
        framesSinceLastBeat ++;
      }
      else{
        beatCutoff *= beatDecayRate;
        beatCutoff = Math.max(beatCutoff, beatThreshold);
      }
    }
    return false;
  }

  this.viz_0 = function(){
      fourier.analyze()
      var low_energy = fourier.getEnergy("bass")
      var mid_energy = fourier.getEnergy("mid")
      var high_energy = fourier.getEnergy("highMid")
      var level = amplitude.getLevel();
      if(detectBeat(level)){
        tint(200, 100, 100); 
      }
      else{
        tint(high_energy, mid_energy, low_energy);
      }
      image(capture, 0, 0, window.innerWidth, window.innerHeight); // place this between tint and filter got both options to take effect
      filter(POSTERIZE, 10); // reduce color range in each channel to the max value passed
  }

  this.viz_1 = function(){
    var spectrum = fourier.analyze();
    peakDetect.update(fourier);
    var alpha = 140//low_energy

    if ( peakDetect.isDetected ) {
      alpha = 500
    } 
  
    tint(70, 1, 150, alpha); // ultraviolet
    image(capture, 0, 0, window.innerWidth, window.innerHeight); // place this between tint and filter got both options to take effect


    var h = height/divisions;
    var newBuffer = [];
  
    var scaledSpectrum = splitOctaves(spectrum, 12);
    var len = scaledSpectrum.length;
  
    //background(200, 200, 200, 1);
    // copy before clearing the background
    //copy(canvas,0,0,width,height,0,speed,width,height);
  
    // draw shape
    beginShape();
  
    // one at the far corner
    curveVertex(0, h);
    var curve_points = {}

    for (var i = 0; i < len; i++) {
      var point = smoothPoint(scaledSpectrum, i, 2);
      var x = map(i, 0, len-1, 0, width);
      var y = map(point, 0, 255, h, 0);
      curve_points[x] = y
      curveVertex(x, y);
    }

    // one last point at the end
    curveVertex(width, h);
  
    endShape();

    // change color of pixels

    loadPixels();
    let d = pixelDensity();
    let max_pixels = 4 * (width * d) * (height * d);
    loadPixels();
    // for (let i = 0; i < max_pixels; i++) {
    //   var is_above_curve = is_above_curve[i]
    //   if(is_above_curve){
    //     pixels[i] = pixels[i] /1.1;
    //   }
    //   else{
    //     // do nothing?
    //   }
    // }
    //TODO: UPDATING PIXELS MANUALLY IS TOO SLOW, MAYBE DONT DO THIS?
    // for(let x=0; x<width; x++){
    //   for(let y=0; y<height; y++){
    //     pixels_section = get(x, y)
    //     var len_pixels_section = pixels_section.length
    //     for (let i = 0; i < len_pixels_section; i++) {
    //       var is_above_curve = true//is_above_curve[i]
    //       if(is_above_curve){
    //         pixels_section[i] = pixels_section[i] /1.1;
    //       }
    //       else{
    //         // do nothing?
    //       }
    //     }
    //   }
    
    // }
    updatePixels();
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



/**
 *  Divides an fft array into octaves with each
 *  divided by three, or by a specified "slicesPerOctave".
 *  
 *  There are 10 octaves in the range 20 - 20,000 Hz,
 *  so this will result in 10 * slicesPerOctave + 1
 *
 *  @method splitOctaves
 *  @param {Array} spectrum Array of fft.analyze() values
 *  @param {Number} [slicesPerOctave] defaults to thirds
 *  @return {Array} scaledSpectrum array of the spectrum reorganized by division
 *                                 of octaves
 */
function splitOctaves(spectrum, slicesPerOctave) {
  var scaledSpectrum = [];
  var len = spectrum.length;

  // default to thirds
  var n = slicesPerOctave|| 3;
  var nthRootOfTwo = Math.pow(2, 1/n);

  // the last N bins get their own 
  var lowestBin = slicesPerOctave;

  var binIndex = len - 1;
  var i = binIndex;


  while (i > lowestBin) {
    var nextBinIndex = round( binIndex/nthRootOfTwo );

    if (nextBinIndex === 1) return;

    var total = 0;
    var numBins = 0;

    // add up all of the values for the frequencies
    for (i = binIndex; i > nextBinIndex; i--) {
      total += spectrum[i];
      numBins++;
    }

    // divide total sum by number of bins
    var energy = total/numBins;
    scaledSpectrum.push(energy);

    // keep the loop going
    binIndex = nextBinIndex;
  }

  // add the lowest bins at the end
  for (var j = i; j > 0; j--) {
    scaledSpectrum.push(spectrum[j]);
  }

  // reverse so that array has same order as original array (low to high frequencies)
  scaledSpectrum.reverse();

  return scaledSpectrum;
}


// average a point in an array with its neighbors
function smoothPoint(spectrum, index, numberOfNeighbors) {

  // default to 2 neighbors on either side
  var neighbors = numberOfNeighbors || 2;
  var len = spectrum.length;

  var val = 0;

  // start below the index
  var indexMinusNeighbors = index - neighbors;
  var smoothedPoints = 0;

  for (var i = indexMinusNeighbors; i < (index+neighbors) && i < len; i++) {
    // if there is a point at spectrum[i], tally it
    if (typeof(spectrum[i]) !== 'undefined') {
      val += spectrum[i];
      smoothedPoints++;
    }
  }

  val = val/smoothedPoints;

  return val;
}
}