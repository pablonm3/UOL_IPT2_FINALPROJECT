
function gen_random_color(){
    var r = random(255); // r is a random number between 0 - 255
    var g = random(255); // g is a random number betwen 100 - 200
    var b = random(255); // b is a random number between 0 - 100
    return [r,g,b]
}

function GeometricShapes(){
	this.name = "Geometrical shapes";
    // this.forms = [{
    //     shape: "ellipse", 
    //     color: 
    // }]
    var colors_ep = gen_random_color(),
        colors_re = gen_random_color(),
        colors_tri = gen_random_color()

	this.draw = function(){
		push();
		fourier.analyze()
        var low_wnergy = fourier.getEnergy("bass")
        var mid_wnergy = fourier.getEnergy("mid")
        var high_energy = fourier.getEnergy("highMid")
	
        noStroke()
        fill(colors_ep)
        x_ellipse = width/4 
        y_ellipse = height/3
        ellipse(x_ellipse, y_ellipse, low_wnergy)

        buffer_ellipse_rect =  width/2
        buffer_y = height /4

        fill(colors_re)
        x_rect = x_ellipse + buffer_ellipse_rect
        square_size = mid_wnergy
        y_rect = y_ellipse - square_size/2
        rect(x_rect, y_rect, square_size,  square_size)

        fill(colors_tri)
        x_triangle = x_ellipse + buffer_ellipse_rect/2
        y_triangle = y_ellipse + buffer_y
        x1= x_triangle
        x2 = x_triangle - high_energy
        x3 = x_triangle + high_energy
        y1= y_triangle - high_energy
        y2 = y_triangle + high_energy
        y3 = y2
        triangle(x1, y1, x2, y2, x3, y3)

		pop();
	};
}
