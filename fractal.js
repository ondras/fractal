var Fractal = OZ.Class();

Fractal.prototype.init = function(container, options) {
	this._options = {
		c: [-0.8, 0.156],
		threshold: 2,
		maxIterations: 200,
		mode: Formula.MANDELBROT,
		formula: Formula.SQUARE,
		width: 750,
		height: 500,
		rangeX: [-1.5, 1.5],
		rangeY: [-1, 1],
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

	var xvals = [];
	var yvals = [];
	for (var i=0;i<width;i++) { xvals.push(minX + i*dx/width); }
	for (var j=0;j<height;j++) { yvals.push(minY + j*dy/height); }
	
	var evcount = 16;
	this._threads = evcount;
	
	for (var i=0;i<evcount;i++) {
		var min = Math.round(width/evcount*i);
		var max = Math.round(width/evcount*(i+1));
		if (window.Worker && this._options.threads) {
			var w = new Worker("worker.js");
			w.onmessage = this._message.bind(this);
			w.postMessage(JSON.stringify([this._options, xvals, yvals, min, max]));
		} else { 
			var evaluator = new Evaluator(this._evaluationDone.bind(this));
			evaluator.compute(this._options, xvals, yvals, min, max);
		}
	}
}

Fractal.prototype._message = function(e) {
	this._evaluationDone(JSON.parse(e.data));
	e.target.terminate();
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
