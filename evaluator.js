var Evaluator = function(done) {
	this._done = done;
}

Evaluator.prototype.compute = function(options, xvals, yvals, minX, maxX) {
	var result = [minX, maxX];
	
	this._options = options;
	this._iterate = Formula.formulas[this._options.formula];

	var num = [0, 0];
	var color = [0, 0, 0];
	var x = 0;
	var y = 0;
	
	var h = this._options.height;

	switch (this._options.mode) {
		case Formula.JULIA:
			for (var j=0;j<h;j++) {
				for (var i=minX;i<maxX;i++) {
					num[0] = xvals[i];
					num[1] = yvals[j];
					
					this._computeColor(num, color);
					result.push(color[0]);
					result.push(color[1]);
					result.push(color[2]);
				}
			}
		break;
		case Formula.MANDELBROT:
			var c = this._options.c;
			for (var j=0;j<h;j++) {
				for (var i=minX;i<maxX;i++) {
					num[0] = 0;
					num[1] = 0;
					c[0] = xvals[i];
					c[1] = yvals[j];
					
					this._computeColor(num, color);
					result.push(color[0]);
					result.push(color[1]);
					result.push(color[2]);
				}
			}
		break;
	}
	
	this._done(result);
}

Evaluator.prototype._computeColor = function(num, color) {
	var it = -1;
	var t = this._options.threshold;
	var max = this._options.maxIterations;

	for (var i=0;i<max;i++) {
		this._iterate(num);
		if (num[0]*num[0]+num[1]*num[1] > t*t) {
			it = i;
			break;
		}
	}
	
	if (it > -1) { /* outside */
		/* A */
		// var ratio = (it+1) / max;
		/**/
		
		/* B */
		var val = it - Math.log(
			Math.log(
				num[0]*num[0]+num[1]*num[1]
			)/(2*Math.LN2)
		)/Math.LN2;
		ratio = (val+this._options.threshold)/max;
		/**/
		
		ratio = Math.pow(ratio, 0.4); 
		var blue = Math.round(255 * ratio);
		
		color[0] = 0;
		color[1] = 0;
		color[2] = blue;
	} else { /* inside */
		
		var ratio1 = Math.abs(num[0])/t;
		var ratio2 = Math.abs(num[1])/t;
		
		ratio1 = Math.sqrt(ratio1);
		ratio2 = Math.sqrt(ratio2);
		
		var red = Math.round(255 * ratio1);
		var green = Math.round(255 * ratio2);

		color[0] = red;
		color[1] = green;
		color[2] = 0;

/*
		var r = Math.sqrt(num[0]*num[0]+num[1]*num[1]);
		var ang = (Math.atan2(num[1], num[0]) + Math.PI) / (2*Math.PI) * 360;

		var rgb = hsv2rgb(ang, 1, r);
		color[0] = Math.round(255*rgb[0]);
		color[1] = Math.round(255*rgb[1]);
		color[2] = Math.round(255*rgb[2]);
*/
	}
}
