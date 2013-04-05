var Formula = {};

Formula.SQUARE = 0;
Formula.CUBIC = 1;
Formula.FOUR = 2;
Formula.TRICORN = 3;
Formula.SHIP = 4;

Formula.JULIA = 0;
Formula.MANDELBROT = 1;

Formula.formulas = {};

Formula.formulas[Formula.SQUARE] = function(num, c) {
	var real = num[0]*num[0] - num[1]*num[1];
	var imag = 2*num[0]*num[1];
	num[0] = real + c[0];
	num[1] = imag + c[1];
}

Formula.formulas[Formula.CUBIC] = function(num, c) {
	var real = num[0]*num[0]*num[0] - 3*num[0]*num[1]*num[1];
	var imag = 3*num[0]*num[0]*num[1] - num[1]*num[1]*num[1];
	num[0] = real + c[0];
	num[1] = imag + c[1];
}

Formula.formulas[Formula.FOUR] = function(num, c) {
	var a = num[0];
	var b = num[1];
	var real = a*a*a*a + b*b*b*b - 6*a*a*b*b;
	var imag = 4*a*a*a*b - 4*a*b*b*b;
	num[0] = real + c[0];
	num[1] = imag + c[1];
}

Formula.formulas[Formula.TRICORN] = function(num, c) {
	var a = num[0];
	var b = -num[1];

	var real = a*a - b*b;
	var imag = 2*a*b;
	
	num[0] = real + c[0];
	num[1] = imag + c[1];
}

Formula.formulas[Formula.SHIP] = function(num, c) {
	var a = Math.abs(num[0]);
	var b = Math.abs(num[1]);

	var real = a*a-b*b;
	var imag = 2*a*b;
	
	num[0] = real + c[0];
	num[1] = imag + c[1];
}
