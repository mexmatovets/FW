var Complex = function(real, imag) {
	if (!(this instanceof Complex)) {
		return new Complex (real, imag);
	}
	if (typeof real == "object" && real.phase)
	{
	   var r = Number(real.mod) || 1, phase=Number(real.phase)||0;
	   real =r*Math.cos(phase);
	   imag =r*Math.sin(phase);
	}

	if (typeof real === "string" && imag == null) {
		return Complex.parse (real);
	}

	this.real = Number(real) || 0;
	this.imag = Number(imag) || 0;
};

Complex.parse = function(string) {
	var real, imag, regex, match, a, b, c;
	
	// TODO: Make this work better-er
	regex = /^([-+]?(?:\d+|\d*\.\d+))?[-+]?(\d+|\d*\.\d+)?[ij]$/i;
	string = String(string).replace (/\s+/g, '');

	match = string.match (regex);
	if (!match) {
		throw new Error("Invalid input to Complex.parse, expecting a + bi format");
	}

	a = match[1];
	b = match[2];
	c = match[3];

	real = a != null ? parseFloat (a) : 0;
	imag = parseFloat ((b || "+") + (c || "1"));

	return new Complex(real, imag);
};
Complex.array = function(real,imag) {
 var a=[];
   if(imag)
   {
      if(real.length!=imag.length) throw new Error("real.length!=imag.length");
	  for(var n=0;n<real.length;n++) a.push(new Complex(real[n],imag[n]));
   }
   else for(var n=0;n<real.length;n++) a.push(new Complex(real[n]));
   return a;
}
Complex.prototype.copy = function() {
	return new Complex (this.real, this.imag);
};

Complex.prototype.add = function(operand) {
	var real, imag;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}
	this.real += real;
	this.imag += imag;

	return this;
};

Complex.prototype.subtract = function(operand) {
	var real, imag;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}
	this.real -= real;
	this.imag -= imag;

	return this;
};
Complex.prototype.multiply = function(operand) {
	var real, imag, tmp;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}

	tmp = this.real * real - this.imag * imag;
	this.imag = this.real * imag + this.imag * real;
	this.real = tmp;

	return this;
};
Complex.prototype.abs=function() {
   var re=this.real, im=this.imag;
   return Math.sqrt(re*re+im*im);
  }
Complex.prototype.conj=function()
{
  this.imag=-this.imag;
  return this;
}   
Complex.prototype.phase=function() {
   var re=this.real, im=this.imag;
   return Math.atan(im/re);
  }
Complex.prototype.divide = function(operand) {
	var real, imag, denom, tmp;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}

	denom = real * real + imag * imag;
	tmp = (this.real * real + this.imag * imag) / denom;
	this.imag = (this.imag * real - this.real * imag) / denom;
	this.real = tmp;

	return this;
};
Complex.prototype.polynom = function(koeffs){
	var sum=new Complex();
	for (var i = 0; i < koeffs.length; i++){
		var tmp=new Complex(this.real, this.imag);
		for (var ii=0;ii<i;ii++) {
			var m=new Complex(this.real, this.imag);
			tmp=tmp.multiply(m);
		}
		tmp.multiply(koeffs[i]);
		sum=sum.add(tmp);
	}
	return sum;	
}
Complex.prototype.sqrt = function(){
	var real, imag;
	var r = this.abs();
	real = Math.sqrt((r+this.real)*0.5);
	if (this.imag>=0) 
		imag = Math.sqrt((r-this.real)*0.5); 
	else 
		imag = -Math.sqrt((r-this.real)*0.5);
	this.real = real;
	this.imag = imag;
	return this;
}
Complex.prototype.exp = function(){
	var real, imag;
	real=Math.exp(this.real)*Math.cos(this.imag);
	imag=Math.exp(this.real)*Math.sin(this.imag);
	this.real = real;
	this.imag = imag;	
	return this;
}
Complex.prototype.inverse= function(){
	var real, imag, zn, tmp, sopr;
	tmp = new Complex(this.real, this.imag);	
	sopr = new Complex(this.real, -this.imag);
	zn=tmp.multiply(sopr);
	sopr = Complex(this.real, -this.imag);
	tmp=sopr.divide(zn);
	this.real = tmp.real;
	this.imag = tmp.imag;	
	return this;
}
Complex.prototype.div=Complex.prototype.divide;
Complex.prototype.mul=Complex.prototype.multiply;
Complex.prototype.sub=Complex.prototype.subtract;
//var repl = require('repl');
//repl.start().context.Complex = Complex;
