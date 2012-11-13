/*/function besselK0a22(arg){
	var res, res1, res2;
        var save1 =new Complex(arg.real, arg.imag);
        var save2=new Complex(arg.real, arg.imag);
        var save3=new Complex(arg.real, arg.imag);
	if (arg instanceof Complex){
		res1=(arg.inverse().multiply(Math.PI*0.5)).sqrt();//sqrt-OK
        res2=save1.multiply(-1).exp();
        res3=save2.polynom([400,256]).add(75).inverse();
        res4=save3.polynom([368,256]).add(43);
        res=res1.multiply(res2).multiply(res3).multiply(res4);
	}
	return res;
}
/*/
function besselK0a22(arg){
	var res;
	if (arg instanceof Complex){
		res=(arg.copy().inverse().multiply(Math.PI*0.5)).sqrt().mul(arg.copy().multiply(-1).exp()).mul(arg.copy().polynom([400,256]).add(75).inverse()).mul(arg.copy().polynom([368,256]).add(43));
	}
	return res;
}
function besselK1a22(arg){
	var res;
	if (arg instanceof Complex){
		res=(arg.copy().inverse().multiply(Math.PI*0.5)).sqrt().mul(arg.copy().multiply(-1).exp()).mul(arg.copy().polynom([336,256]).add(35).inverse()).mul(arg.copy().polynom([432,256]).add(131));
	}
	return res;
}