var Canvas = OZ.Class();

Canvas.prototype.init = function(width, height) {
	this._elm = OZ.DOM.elm("canvas", {width:width, height:height});
	this._ctx = this._elm.getContext("2d");
}

Canvas.prototype.getElement = function() {
	return this._elm;
}

Canvas.prototype.drawPart = function(minX, maxX, data) {
	var d = this._ctx.createImageData(maxX - minX, this._elm.height);

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
