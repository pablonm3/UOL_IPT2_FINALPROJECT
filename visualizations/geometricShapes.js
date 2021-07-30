
function gen_random_color(temperature=0.5){
    // temperature must be between 0(coolest) to 1(warmest)
    var r = random(220 * temperature, 255 * temperature); 
    var g = random(255);
    var b = random(220 * (1-temperature), 255 * (1-temperature)); 
    return [r,g,b]
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

function GeometricShapes(){
    Visualization.call(this, "Geometrical shapes", ["[←→] change colors", "[↑↓] incr/decr no of figures"])
	this.no_shapes = 3;

    var colors = [],
        color_index
        

    this.inc_no_shapes = function(){
        if(this.no_shapes <4){
            this.no_shapes +=1
            this.reset_colors()
        }
    }

    this.dec_no_shapes = function(){
        if(this.no_shapes > 1){
            this.no_shapes -=1
            this.reset_colors()
        }
    }

    this.reset_colors = function(){
        colors = []
        color_index = -1
        this.next_colors()
    }

    this.gen_colors_object = function(){
        var increment = 1/this.no_shapes;
        if(increment == 1){
            increment = 0.5;
        }
        console.error("increment: ", increment)
        return {colors_ep: gen_random_color(increment *4),
            colors_re: gen_random_color(increment * 2),
            colors_tri: gen_random_color(increment),
            colors_pol: gen_random_color(increment *3)}
    }

    this.next_colors = function(){
        color_index += 1
        if(color_index >= colors.length){
            colors.push(this.gen_colors_object())
        }
    }
    this.back_colors = function(){
        color_index -= 1
        if(color_index <=0){
            color_index = 0    
            colors.unshift(this.gen_colors_object())
        }
    }

    this.keyPressed = function(keycode){
        if(37 ==keycode){
            // left arrow(back)
			this.back_colors()
		}
        if(39 ==keycode){
            // right arrow(next)
			this.next_colors()
		}

        if(40 ==keycode){
            // down arrow
			this.dec_no_shapes()
		}
        if(38 ==keycode){
            // up arrow
			this.inc_no_shapes()
		}
    }

	this.draw = function(){
		push();
		fourier.analyze()
        var color_set = colors[color_index]
        var avg_energy = fourier.getEnergy("bass", "treble")
        var low_energy = fourier.getEnergy("bass")
        var mid_energy = fourier.getEnergy("mid")
        var high_energy = fourier.getEnergy("highMid")
        var treble_energy = fourier.getEnergy("treble")
        if(this.no_shapes == 1){
            magnify_ratio = 2
             // RENDER TRIANGLE
            fill(color_set.colors_tri)
            // place in center of screen
            x_triangle = width/2
            y_triangle = height/2
            x1= x_triangle
            x2 = x_triangle - avg_energy*magnify_ratio
            x3 = x_triangle + avg_energy*magnify_ratio
            y1= y_triangle - avg_energy*magnify_ratio
            y2 = y_triangle + avg_energy*magnify_ratio
            y3 = y2
            triangle(x1, y1, x2, y2, x3, y3)
        }

        if(this.no_shapes == 2){
            magnify_ratio = 1.5
             // RENDER TRIANGLE
            fill(color_set.colors_tri)
            // place in center of screen
            x_triangle = width/4
            y_triangle = height/2
            x1= x_triangle
            x2 = x_triangle - low_energy*magnify_ratio
            x3 = x_triangle + low_energy*magnify_ratio
            y1= y_triangle - low_energy*magnify_ratio
            y2 = y_triangle + low_energy*magnify_ratio
            y3 = y2
            triangle(x1, y1, x2, y2, x3, y3)

            // RENDER SQUARE
            fill(color_set.colors_re)
            square_size = high_energy * 2 * magnify_ratio
            x_rect = width - width/4 - square_size/2
            y_rect = y_triangle - high_energy * magnify_ratio
            rect(x_rect, y_rect, square_size,  square_size)
        }

        if(this.no_shapes == 3){
             // RENDER TRIANGLE
            fill(color_set.colors_tri)
            // place in center of screen
            x_triangle = width/4
            y_triangle = height/4
            x1= x_triangle
            x2 = x_triangle - low_energy
            x3 = x_triangle + low_energy
            y1= y_triangle - low_energy
            y2 = y_triangle + low_energy
            y3 = y2
            triangle(x1, y1, x2, y2, x3, y3)

            // RENDER SQUARE
            fill(color_set.colors_re)
            square_size = mid_energy*2
            x_rect = width - width/4 - square_size/2
            y_rect = y_triangle - mid_energy
            rect(x_rect, y_rect, square_size,  square_size)


            // RENDER POLYGON
            fill(color_set.colors_pol)
            x_pol = width - width /2
            pol_size = high_energy*2
            y_pol = (height - height/4) 
            polygon(x_pol, y_pol, pol_size, 6)
        }

        if(this.no_shapes == 4){
            // RENDER TRIANGLE
           fill(color_set.colors_tri)
           // place in center of screen
           x_triangle = width/4
           y_triangle = height/4
           x1= x_triangle
           x2 = x_triangle - low_energy
           x3 = x_triangle + low_energy
           y1= y_triangle - low_energy
           y2 = y_triangle + low_energy
           y3 = y2
           triangle(x1, y1, x2, y2, x3, y3)

           // RENDER SQUARE
           fill(color_set.colors_re)
           square_size = mid_energy*2
           x_rect = width - width/4 - square_size/2
           y_rect = y_triangle - mid_energy
           rect(x_rect, y_rect, square_size,  square_size)


           // RENDER POLYGON
           fill(color_set.colors_pol)
           x_pol = width /4
           pol_size = high_energy*2
           y_pol = (height - height/4) 
           polygon(x_pol, y_pol, pol_size, 6)

            // RENDER CIRCLE
            fill(color_set.colors_ep)
            x_ellipse = width - width/4 
            y_ellipse = (height - height/4) 
            ellipse(x_ellipse, y_ellipse, treble_energy * 2)
       }

		pop();
	};
    this.reset_colors()
}
