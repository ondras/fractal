var Evaluator = function(done) {
	this._done = done;
}

Evaluator.prototype.compute = function(options, xvals, yvals, minX, maxX) {
	var result = new Array(2 + options.height * (maxX-minX));
	result[0] = minX;
	result[1] = maxX;
	
	this._options = options;
	this._iterate = Formula.formulas[this._options.formula];
	var method = this._iterate;

	var num = [0, 0];
	var color = [0, 0, 0];
	var h = this._options.height;
	var index = 2;

	switch (this._options.mode) {
		case Formula.JULIA:
			for (var j=0;j<h;j++) {
				for (var i=minX;i<maxX;i++) {
					num[0] = xvals[i];
					num[1] = yvals[j];
					
					index = this._computeColor(method, num, result, index);
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
					
					this._computeColor(method, num, result, index);
				}
			}
		break;
	}
	this._done(result);
}

Evaluator.prototype._computeColor = function(method, num, result, index) {
	var t = this._options.threshold*this._options.threshold;
	var i = this._options.maxIterations;
	var c = this._options.c;

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
		
		ratio = Math.pow(ratio, 0.5); 
		var blue = Math.round(255 * ratio);
		
		result[index++] = 0;
		result[index++] = 0;
		result[index++] = blue;
	} else { /* inside */
		
		var ratio1 = Math.abs(num[0])/t;
		var ratio2 = Math.abs(num[1])/t;
		
		ratio1 = Math.pow(ratio1, 0.3);
		ratio2 = Math.pow(ratio2, 0.3);
		
		var red = Math.round(255 * ratio1);
		var green = Math.round(255 * ratio2);
		
		result[index++] = red;
		result[index++] = green;
		result[index++] = 0;
	}
	return index;
}
