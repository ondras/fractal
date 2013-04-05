var Canvas = OZ.Class();

Canvas.prototype.init = function(width, height) {
	this._elm = OZ.DOM.elm("canvas", {width:width, height:height});
	this._ctx = this._elm.getContext("2d");
	this._width = width;
	this._height = height;
	this._data = this._ctx.createImageData(this._width, this._height);
}

Canvas.prototype.getElement = function() {
	return this._elm;
}

Canvas.prototype.getWidth = function() {
	return this._width;
}

Canvas.prototype.getHeight = function() {
	return this._height;
}

Canvas.prototype.setPixel = function(x, y, r, g, b) {
	var index = 4*(y*this._width + x);
	this._data.data[index] = r;
	this._data.data[index+1] = g;
	this._data.data[index+2] = b;
	this._data.data[index+3] = 255;
}

Canvas.prototype.drawPart = function(minX, maxX, data) {
	var d = this._ctx.createImageData(maxX - minX, this._height);

	var arr = d.data;
	var len = data.length;
	var ptr = 0;
	for (var i=0;i<len;i++) {
		arr[ptr++] = data[i];
		if (i % 3 == 2) { 
			arr[ptr++] = 255;
		}
	}
	
	this._ctx.putImageData(d, minX, 0);
}

Canvas.prototype.draw = function() {
	this._ctx.putImageData(this._data, 0, 0);
}

Canvas.prototype.clear = function() {
	this._ctx.clearRect(0, 0, this._width, this._height);
}
