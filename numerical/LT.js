LT=function(F,t){
	var self=this;
	this.generate_complex=function (){
		var day=24*60*60 // sec
		var Tp=10*day;
		var Np=17;
		var Tmax=Tp*Np;
		var s0=1/Tmax;
		var w0=2*Math.PI/Tp;
		var s=[],z=[],td=[];
		for(var i = 0; i < 39; i++) {
			s[i]=(i*1.1+1)*s0;
			z[i]=new Complex(s[i],w0);
			td[i]=1/(s[i]*Tp)
		}
		return {z:z,td:td};
	}
	this.make=function(s){
		var nr=[], err=[], ern=[];
        N=this.NL;
        r=[]; for(var i = 0; i < s.length; i++) r[i]=0;
        t=this.tt;
		for(var ri = 0; ri < s.length; ri++){
			for(var i = 0; i < N; i++){
				r[ri]=s[ri].copy().mul(-t[i+1]).exp().sub(s[ri].copy().mul(-t[i]).exp()).mul(this.F[i]).add(r[ri]);		
			}
        }
		for(var ri = 0; ri < s.length; ri++){	
			nr[ri]=r[ri].copy().abs();
			err[ri]=(s[ri].copy().mul(-t[N]).exp().mul(this.mF)).abs();
			ern[ri]=err[ri]/nr[ri];
			r[ri]=s[ri].copy().inverse().multiply(r[ri].mul(-1));	
		}
		self.err=ern;
		return {r:r, err:err, ern:ern}
	}
	this.make_fast=function(s){
		var nr=[], err=[], ern=[];
        N=this.NL;
        r=[]; for(var i = 0; i < s.length; i++) r[i]=0;
        t=this.tt;
		for(var ri = 0; ri < s.length; ri++){
			for(var i = 0; i < N; i++){
				r[ri]=new Complex(
					this.F[i]*(Math.exp(-s[ri].real*t[i+1])*Math.cos(-s[ri].imag*t[i+1])-Math.exp(-s[ri].real*t[i])*Math.cos(-s[ri].imag*t[i])),
					this.F[i]*(Math.exp(-s[ri].real*t[i+1])*Math.sin(-s[ri].imag*t[i+1])-Math.exp(-s[ri].real*t[i])*Math.sin(-s[ri].imag*t[i]))
					).add(r[ri]);
			}
        }
		for(var ri = 0; ri < s.length; ri++){	
			nr[ri]=r[ri].copy().abs();
			err[ri]=(s[ri].copy().mul(-t[N]).exp().mul(this.mF)).abs();
			ern[ri]=err[ri]/nr[ri];
			r[ri]=s[ri].copy().inverse().multiply(r[ri].mul(-1));	
		}
		self.err=ern;
		return {r:r, err:err, ern:ern}
	}	
	this.angle=function(l1,lq){
		if (l1.r.length!=lq.r.length) self.log.send({mu:"Ooops... angle function, call to developer"});
		var res = [];
		for (var i = 0; i < l1.r.length; i++){
			res[i]=lq.r[i].copy().inverse().mul(l1.r[i]).phase();
		}
		return res;
	}
	var init=function (F,t){
		self.F=F;
           var N=F.length-1;
           self.NL=N;
           if (!t){t=[]; for (var i=0; i<N;i++) t.push(i);}
           self.tt=t;
           self.mF=-1e+6; for (var i=0; i<F.length;i++)  self.mF=Math.max(self.mF,Math.abs(F[i]));			
	}
	init(F,t);
}
function calc_eta_n(theta,z,N,eta){
	var res;
	var pha=[], pha_s=[], eta_n=[], deta=[];
	function dH_phase2(esq,sq){
		var res=[];
		for (var i = 0; i < esq.length; i++){
			res[i]=sq[i].mul(besselK1a22(esq[i]).div(besselK0a22(esq[i]))).imag;//(besselk(1,esq[i])/besselk(0,esq[i]));
		}
		return res;
	}
	function calc_eta(theta,z,eta){
		if(!eta){
			for (var i = 0; i < theta.length; i++){
				pha[i]=-(theta[i]+z[i].copy().sqrt().sqrt().phase());
				while(pha[i]<0) pha[i]+=Math.PI;
				pha[i]=((2*pha[i])%(2*Math.PI))/2;
				pha_s[i]=z[i].copy().sqrt().imag;
				eta_n[i]=pha[i]/pha_s[i];
				deta[i]=Infinity;	
			}	
			return {eta:eta_n, deta:deta};
		}	
		var sq=[], esq=[], H1=[];
		for (var i = 0; i < z.length; i++){
			sq[i]=z[i].copy().sqrt();
			esq[i]=sq[i].copy().mul(eta[i]);
			H1[i]=dH_phase2(esq[i], sq[i]);
			deta[i]=(theta[i]-besselK0a22(esq[i]).phase())/H1[i];
			eta_n[i]=eta[i]-deta[i];
		}
		return {eta:eta_n, deta:deta};
	}
	while(N>=0){
		res=calc_eta(theta,z,eta);
		eta=res.eta;
		deta=res.deta;
		N=N-1;
	}
	return eta;
}
function get_kappa(eta,R){
	var res=[];
	for (var i = 0; i < eta.length; i++){
		res[i]=Math.pow(R/eta[i],2);
	}
	return res;
}
function debug_LT(obj){
	console.log(['process started']);self.tic=LPC.Tic();
	self. lp1=new LT(obj[0].obj[3].data,obj[0].obj[2].data);
	self. lq=new LT(obj[0].obj[5].data,obj[0].obj[4].data);		
	self. z = lp1.generate_complex(); 

	self. lps1 =lp1. make_fast(z.z);	
	self. lqs   =lq.  make_fast(z.z);	
	console.log(['process finished',self.tic.sec()]);
	self. thetaq1=new LT([1],[1]).angle(lps1,lqs);

	self.et1=calc_eta_n(thetaq1,z.z,0);
	
	self.kappa_et1=get_kappa(self.et1,464);
	
	toPlot=[]; for (var i = 0; i < z.td.length; i++) toPlot[i]=[z.td[i],self.kappa_et1[i]];
	flo=openflot(); flo([{data:toPlot}]);
}