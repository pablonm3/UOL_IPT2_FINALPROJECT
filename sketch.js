//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for p5 fast fourier transform
var fourier;
var capture

function setup(){
	 createCanvas(window.innerWidth, window.innerHeight);
	 capture = createCapture(VIDEO);
	 capture.hide()
	 console.log("window.innerHeight: ", window.innerHeight)
	 background(0);
	 controls = new ControlsAndInput();

	 //instantiate the fft object
	 fourier = new p5.FFT();

	 //create a new visualisation container and add visualisations
	 vis = new Visualisations((selectedVisual)=>{
		controls.change_legend(selectedVisual.legend)	 
	 });
	 vis.add(new Spectrum());
	 vis.add(new WavePattern());
	 vis.add(new Needles());
	 vis.add(new GeometricShapes());
	 vis.add(new Camera());

}

function draw(){
	background(0);
	//draw the selected visualisation
	vis.selectedVisual.draw();
	//draw the controls on top.
	controls.draw();
}

function mouseClicked(){
	controls.mousePressed();
}

function keyPressed(){
	controls.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized(){
	resizeCanvas(window.innerWidth, window.innerHeight);
	console.log("RESIZE")
	controls.draw();
	if(vis.selectedVisual.hasOwnProperty('onResize')){
		vis.selectedVisual.onResize();
	}
}
