var Fractal = OZ.Class();

Fractal.prototype.init = function(container, options) {
	this._options = {
		c: [-0.8, 0.156],
		threshold: 2,
		maxIterations: 60,
		mode: Formula.MANDELBROT,
		formula: Formula.SQUARE,
		width: 400,
		height: 300,
		rangeX: [-2.0, 2.0],
		rangeY: [-1.5, 1.5],
		threads: true
	}
	
	for (var p in options) { this._options[p] = options[p]; }

	this._time1 = null;
	this._time2 = null;
	this._threads = 0;

	OZ.DOM.clear(container);
	this._canvas = new Canvas(this._options.width, this._options.height);
	container.appendChild(this._canvas.getElement());
	
	this.draw();
}

Fractal.prototype.draw = function() {
	this._time1 = new Date();
	var width = this._options.width;
	var height = this._options.height;
	var minX = this._options.rangeX[0];
	var minY = this._options.rangeY[0];

	var dx = this._options.rangeX[1] - minX;
	var dy = this._options.rangeY[1] - minY;
	var stepX = dx/width;
	var stepY = dy/height;

	var xvals = [];
	var yvals = [];
	for (var i=0;i<width;i++) { xvals.push(minX + i*stepX); }
	for (var j=0;j<height;j++) { yvals.push(minY + j*stepY); }
	
	var evcount = 16;
	this._threads = evcount;
	
	for (var i=0;i<evcount;i++) {
		var min = Math.round(width/evcount*i);
		var max = Math.round(width/evcount*(i+1));
		if (window.Worker && this._options.threads) {
			var w = new Worker("worker.js");
			w.onmessage = (function(event) {
				this._evaluationDone(JSON.parse(event.data));
				event.target.terminate();
			}).bind(this);
			w.postMessage(JSON.stringify([this._options, xvals, yvals, min, max]));
			
		} else { 
			var evaluator = new Evaluator(this._evaluationDone.bind(this));
			evaluator.compute(this._options, xvals, yvals, min, max);
		}
	}
}
Fractal.prototype._mergeResult = function(result) {
	var minX = result.shift();
	var maxX = result.shift();
	this._canvas.drawPart(minX, maxX, result);
}

Fractal.prototype._evaluationDone = function(result) {
	this._mergeResult(result);
	this._threads--;
	
	if (!this._threads) {
		this._time2 = new Date();
		var diff = this._time2.getTime() - this._time1.getTime();
		var sec = diff / 1000;
		if (console && console.info) {
			console.info("Time: "+sec + " seconds");
		}
	}
}

Fractal.prototype.getElement = function() {
	return this._canvas.getElement();
}

Fractal.prototype.getOptions = function() {
	return this._options;
}

function hsv2rgb(h,s,v) {
	var hi = Math.floor(h/60) % 6;
	var f = h/60 - hi;
	var p = v * (1 - s);
	var q = v * (1 - f*s);
	var t = v * (1 - (1 - f)*s);
	switch (hi) {
		case 0: return [v,t,p]; break;
		case 1: return [q,v,p]; break;
		case 2: return [p,v,t]; break;
		case 3: return [p,q,v]; break;
		case 4: return [t,p,v]; break;
		case 5: return [v,p,q]; break;
	}
}
