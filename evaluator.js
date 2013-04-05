var Evaluator = function(done) {
	this._done = done;
}

Evaluator.prototype.compute = function(options, xvals, yvals, minX, maxX) {
	var result = [minX, maxX];
	
	this._options = options;
	this._iterate = Formula.formulas[this._options.formula];
	var method = this._iterate;

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
					
					this._computeColor(method, num, result);
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
					
					this._computeColor(method, num, result);
				}
			}
		break;
	}
	
	this._done(result);
}

Evaluator.prototype._computeColor = function(method, num, result) {
	var t = this._options.threshold*this._options.threshold;
	var i = this._options.maxIterations;
	var c = this._options.c;
//	var method = this._iterate;  

	while (num[0]*num[0]+num[1]*num[1] < t && i--) {
		this._iterate(num, c);
	}
	
	if (i > 0) { /* outside */
		i = this._options.maxIterations - i;
		var val = i - Math.log(
			Math.log(
				num[0]*num[0]+num[1]*num[1]
			)/(2*Math.LN2)
		)/Math.LN2;
		ratio = (val+this._options.threshold)/this._options.maxIterations;
		
		ratio = Math.pow(ratio, 0.4); 
		var blue = Math.round(255 * ratio);
		
		result.push(0, 0, blue);
	} else { /* inside */
		
		var ratio1 = Math.abs(num[0])/t;
		var ratio2 = Math.abs(num[1])/t;
		
		ratio1 = Math.sqrt(ratio1);
		ratio2 = Math.sqrt(ratio2);
		
		var red = Math.round(255 * ratio1);
		var green = Math.round(255 * ratio2);

		result.push(red, green, 0);
	}
}
