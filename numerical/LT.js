function union (x,y){
    if (x.length!==y.length) throw "Error in union function";
    var res=[];
    for (var i = 0; i < x.length; i++){
        res[i]=[x[i],y[i]];
    }
    return res;
}
function norm(arr){//нормировка массива
	var res = [];
	var tm = -1e+4; 
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]>tm) {tm=arr[i];}
	} 
	for (var i = 0; i < arr.length; i++) {
		res[i]=arr[i]/tm
	}; 
	return res;
}
function eliminate_bk(o, deg){
	var res=[];
	var t = norm(o.x.data);
	var pol=polyfit(t, o.y.data, deg);
	var pp=polynom(t,pol);
	for (var i = 0; i < t.length; i++){
		res[i]=o.y.data[i]-pp[i];
	}
	return res;
}
function sin_arg_c(z){
	var r=[];
	for (var i = 0; i < z.length; i++){
		r[i]=z[i].imag/z[i].abs();
	}
	return r;
}
function angle(z){
	var r=[];
	for (var i = 0; i < z.length; i++){
		r[i]=Math.atan2(z[i].imag,z[i].real);
	}
	return r;
}
function pq_det2(pss,q,s,kappa_bounds){
	var res=[]; q=q.r[0];
	var pqd2=[]; for (var i = 0; i < kappa_bounds.length; i++) {pqd2[i]=0;}
	var bsqkk=[];for (var i = 0; i < kappa_bounds.length; i++){bsqkk[i]=s.copy().div(kappa_bounds[i]).sqrt();}
	for (var j = 0; j < pss.length; j++){
		var p1=pss[j].pss.p;
		var r1=pss[j].pss.r;
		var h1=[]; for (var ii = 0; ii < bsqkk.length; ii++){h1[ii]=besselK0a22(bsqkk[ii].copy().mul(r1));}
		for (var ii = 0; ii < kappa_bounds.length; ii++) {
			var tmp2=[]; for (var jj = 0; jj < kappa_bounds.length; jj++) {tmp2[jj]=p1.copy().div(q.copy().mul(h1[jj]));}
			var tmp = angle(tmp2);	
			res[ii] = Math.pow(tmp[ii],2);
			pqd2[ii]=pqd2[ii]+res[ii];
		}
	}	
	return pqd2;
}
function pp_det2(pss,s,kappa_bounds){
	var res=[];
	var ppd2=[]; for (var i = 0; i < kappa_bounds.length; i++) {ppd2[i]=0;}
	var bsqkk=[];for (var i = 0; i < kappa_bounds.length; i++){bsqkk[i]=s.copy().div(kappa_bounds[i]).sqrt();}
	for (var i = 0; i < pss.length; i++){
		var p0=pss[i].pss.p;
		var r0=pss[i].pss.r;
		var h0=[]; for (var ii = 0; ii < bsqkk.length; ii++){h0[ii]=besselK0a22(bsqkk[ii].copy().mul(r0));}
		for (var j = i+1; j < pss.length; j++){
			var p1=pss[j].pss.p;
			var r1=pss[j].pss.r;
			var h1=[]; for (var ii = 0; ii < bsqkk.length; ii++){h1[ii]=besselK0a22(bsqkk[ii].copy().mul(r1));}
			for (var ii = 0; ii < kappa_bounds.length; ii++) {
				var tmp2=[]; for (var jj = 0; jj < kappa_bounds.length; jj++) {tmp2[jj]=p1.copy().mul(h0[jj]).div(p0.copy().mul(h1[jj]));}
				var tmp = sin_arg_c(tmp2);	
				res[ii] = Math.pow(tmp[ii],2);
				ppd2[ii]=ppd2[ii]+res[ii];
			}
		}
	}
	return ppd2;
}
function root_arg_s(p,sq,s,kappa_bounds){
	var pqdet2=pq_det2(p,sq,s,kappa_bounds);	
	var ppdet2=pp_det2(p,s,kappa_bounds);
	var sum = []; for (var i = 0; i < pqdet2.length; i++){ sum[i]=pqdet2[i]+ppdet2[i];}
	return sum;
}
//function laguerre(n){
//
//}
//function laplase(t, F, s){
//	//laguerre
//	[lagn,pn]=laguerre(n);
//	
//	stilt
//}
//function laplase_old(t, F, s){
//     var r=new Complex(); var tl=t.length;
//	 for (var i = 0; i < tl-1; i++) {
//		r=s.copy().mul(-t[i]).exp().mul(s.copy().mul(-(t[i+1]-t[i])).exp().mul(-1).add(1)).mul(F[i]).add(r);
//	 }
//	 //r+F(n).*exp(-s*t(n)).*(1-exp(-s*(t(n+1)-t(n))));
//	 return r;
//}
function prepare_interpolate_rate_for_fft(t,q){
	var arr=[];
	if (t.length!=q.length) throw "There rate x and y lengths are not the same";
	for (var i = 0; i < q.length; i++){
		arr[i]=[t[i], q[i]];
	}
	return arr;
}
function find_pow(arr){
	var ver = 0; var i = 0;
	while(ver<arr.length){i++; ver=Math.pow(2,i);}i=i-1;
	return i;
}
function mean(arr){
    var sum=0; 
    var numel=arr.length;
    for (var i = 0; i < numel; i++){
        sum+=arr[i];
    }
    return sum/numel;
}
function polyfit(x,y,m){
	m=m+1;
    var c=[];
    var n=x.length;
    var f=Matrix.create(1,n);
    f.mat[0]=y;
    var V=Matrix.create(m,n);
    for (var i = 0; i < m; i++){
        for (var j = 0; j < n; j++){
            V.mat[i][j]=Math.pow(x[j],i);
        }
    }
    var V_transp=Matrix.transpose(V);
    var VV=Matrix.mult(V,V_transp);
    var VV_inverse=Matrix.inverse(VV);
    c=Matrix.mult(Matrix.mult(f,V_transp),VV_inverse);
    return c.mat[0];
}
function polynom(x,k){
    var y = [];
    var n = x.length;
    for (var i = 0; i < n; i++){
        y[i]=0;
        for (var j = 0; j < k.length; j++){
            y[i]+=k[j]*Math.pow(x[i],j);
        }
    }
    return y;
}
//n=18;m=48;
//x=[],y=[];
//for (var i = 0; i < m; i++){
//    x[i]=Math.PI*i/12;
//    y[i]=Math.sin(Math.PI*i/12);//x[i]*x[i];
//    //console.log(y[i]);
//}
//var k=polyfit(x,y,n);
//res=polynom(x,k);
//for (var i = 0; i < m; i++) console.log(res[i]);
function check_bounds(opt){

}

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
		for(var i = 0; i < 491; i++) {
			s[i]=((i)*0.1+1)*s0;
			z[i]=new Complex(s[i],w0);
			td[i]=1/(s[i]*Tp);
		}
		return {z:z,td:td};
	}
	this.make=function(s){
		var nr=[], err=[], ern=[];
        var N=this.NL;
        var r=[]; for(var i = 0; i < s.length; i++) r[i]=0;
        var t=this.tt;
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
	this.make_int=function(s){
		var nr=[], err=[], ern=[];
        var N=this.NL;
        var r=[]; for(var i = 0; i < s.length; i++) r[i]=new Complex();
        var t=this.tt;
		var F=this.F;
		var mF=this.mF;
		var t1,t0=t[0],Fi,er1,er0,ei1,ei0,el,sl=s.length;	
		for(var ei = 0; ei < sl; ei++){
			el=s[ei];
			for(var i = 0; i < N; i++){
				//if (!isNaN(F[i])){
					t1=t[i+1];
					Fi=F[i];
					//er1=Math.exp(-el.real*t1);
					//er0=Math.exp(-el.real*t0);
					//ei1=-el.imag*t1;
					//ei0=-el.imag*t0;
					r[ei].add(el.copy().mul(-t0).exp().mul(el.copy().mul(t0-t1).exp().mul(-1).add(1)).mul(Fi));
					t0=t1;
				//}
			}
		}	
		for(var ri = 0; ri < sl; ri++){	
			nr[ri]=r[ri].copy().abs();
			err[ri]=(s[ri].copy().mul(-t[N]).exp().mul(this.mF)).abs();
			ern[ri]=err[ri]/nr[ri];
			r[ri]=s[ri].copy().inverse().multiply(r[ri]);	
		}		
		self.err=ern;
		return {r:r, err:err, ern:ern}		
	}
	this.make_fast=function(s){
		var nr=[], err=[], ern=[];
        var N=this.NL;
        var r=[]; for(var i = 0; i < s.length; i++) r[i]=new Complex();
        var t=this.tt;
		var F=this.F;
		var mF=this.mF;
		var t1,t0=t[0],Fi,er1,er0,ei1,ei0,el,sl=s.length;		
		for(var ei = 0; ei < sl; ei++){
			el=s[ei];
			for(var i = 0; i < N; i++){
				//if (!isNaN(F[i])){
					t1=t[i+1];Fi=F[i];er1=Math.exp(-el.real*t1);er0=Math.exp(-el.real*t0);ei1=-el.imag*t1;ei0=-el.imag*t0;
					r[ei].add([Fi*(er1*Math.cos(ei1)-er0*Math.cos(ei0)),Fi*(er1*Math.sin(ei1)-er0*Math.sin(ei0))]);
					t0=t1;
				//}
			}
		}
		for(var ri = 0; ri < sl; ri++){	
			nr[ri]=r[ri].copy().abs();
			err[ri]=(s[ri].copy().mul(-t[N]).exp().mul(this.mF)).abs();
			ern[ri]=err[ri]/nr[ri];
			r[ri]=s[ri].copy().inverse().multiply(r[ri].mul(-1));	
		}		
		self.err=ern;
		return {r:r, err:err, ern:ern}
		/*/		//s.forEach(function(el,ei){
			//t.forEach(function(t1,ti){if(ti===0) return;
			//	Fi=F[ti-1];er1=Math.exp(-el.real*t1);er0=Math.exp(-el.real*t0);ei1=-el.imag*t1;ei0=-el.imag*t0;
			//	r[ei].add([Fi*(er1*Math.cos(ei1)-er0*Math.cos(ei0)),Fi*(er1*Math.sin(ei1)-er0*Math.sin(ei0))]);
			//	t0=t1;
			//})
		//});/*/
		//s.forEach(function(el,ei){	
		//	nr[ei]=r[ei].copy().abs();
		//	err[ei]=(el.copy().mul(-t[N]).exp().mul(mF)).abs();
		//	ern[ei]=err[ei]/nr[ei];
		//	r[ei]=el.copy().inverse().multiply(r[ei].mul(-1));	
		//});
		//self.err=ern;
		//return {r:r, err:err, ern:ern}/*/
	}		
	this.angle=function(l1,lq){
		if (l1.r.length!=lq.r.length) throw "Error in angle function";
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
function avoid_unvalids(data_x,data_y,unv){
	if(1){	
		var data_o = interp4({x:data_x,y:data_y}, data_x.length, unv);
		var x=[], y=[];
		for (var i = 0; i < data_o.cn.length; i++){
			x[i]=data_o.cn[i][0];
			y[i]=data_o.cn[i][1];
		}
		return {x:x,y:y};
	}
	if(0){
		return {x:data_x,y:data_y};
	}
}
function check_conditions_on_dataType(obj,flag_rate0_or_pres1){
	var x=[], y=[], name, ps=[];
	if(!flag_rate0_or_pres1){
		for (var  i = 0; i < obj.length; i++){
			if(obj[i].dataType==="Rate time")  {if (obj[i].R!==0&&obj[i].R!=="0") throw "Rates should have R=0"; x=obj[i].data; name=obj[i].wellName;}
			if(obj[i].dataType==="Rate value")  {if (obj[i].R!==0&&obj[i].R!=="0") throw "Rates should have R=0"; y=obj[i].data;}
		}
		var resUnv=avoid_unvalids(x, y); x=resUnv.x; y=resUnv.y;
		if (!x||!y||x.length!=y.length) throw "Error in rate parse!";
		appendCurve(name+" rate",x,y);
		ps.push({x:x,y:y});
	}
	else{
		var avoidTime=0;
		for (var  i = 0; i < obj.length; i++){
			if(obj[i].dataType==="Pressure time")  x.push({data:obj[i].data, wellName:obj[i].wellName, R:obj[i].R, unvalids:obj[i].unvalids});
			if(obj[i].dataType==="Pressure value") y.push({data:obj[i].data, wellName:obj[i].wellName, R:obj[i].R});
		}
		if (!x||!y||x.length!=y.length) throw "Error in pressure parse!";	
		for (var  i = 0; i < x.length; i++){
			for (var  j = 0; j < x.length; j++){
				if (x[i].wellName===y[j].wellName) {
					if (x[i].R!=y[j].R) throw "Wells with similar names must have similar R!";
					var tmpT=LPC.Tic(); var resUnv=avoid_unvalids(x[i].data, y[j].data, x[i].unvalids);x[i].data=resUnv.x;y[j].data=resUnv.y; avoidTime+=tmpT.sec();
					if (x[i].R!=0) appendCurve(x[i].wellName+" pressure",x[i].data,y[j].data);
					else appendCurve(x[i].wellName+" press_injection",x[i].data,y[j].data);
					ps.push({x:x[i],y:y[j]});
				}
			}
		}
		self.log.send({mc:["Time for pressures interpolation", avoidTime]});	
	}
	return {ps:ps};
}
function parse_rate(obj, z){
	var r=check_conditions_on_dataType(obj,0);r=r.ps[0];
	var lq=new LT(r.y, r.x);	
	return lq.make_fast(z);
}
function parse_pressures(obj, z){
    //var avoidTime=0;
	var lp=[], lps=[];
	var p=check_conditions_on_dataType(obj,1);p=p.ps;
	for (var  i = 0; i < p.length; i++){
		if (p[i].x.R!=0) lp.push({lp:(new LT(p[i].y.data, p[i].x.data)),R:p[i].x.R,wellName:p[i].x.wellName});// не учитываем давление на инжекторе
	}
	lpl=lp.length;
	lp.forEach(function(el,i){
		lps[i]={lps:el.lp.make_fast(z),R:el.R,wellName:el.wellName}; 
		self.log.send({mc:["LT maked pressure "+el.wellName, self.locTic.sec()]});self.log.send({mp:Math.round(25/lpl+75)}); self.locTic=LPC.Tic();
	});
	return lps;
}
function solve_v1(lps, lqs, z){
	var kappa_curves=[];
	for (var i = 0; i < lps.length; i++){
		var theta=(new LT([1], [1])).angle(lps[i].lps,lqs);
		//var sum = 0; for (var j = 0; j < theta.length; j++){sum+=theta[j];} sum=sum/theta.length; self.log.send({mc:["Sdvig po faze dlya "+lps[i].wellName, sum]});
		var eta=calc_eta_n(theta,z,0);
		kappa_curves[i]={kappa_curves:get_kappa(eta,lps[i].R),wellName:lps[i].wellName};
	}
	return kappa_curves;
}
function solve_v2(opt){
	var q=opt.q; var qf=[];
	var q_mean=mean(q); for (var i = 0; i < q.length; i++){qf[i]=q[i]-q_mean}// вычитание среднего значения
	var nn=find_pow(qf); var fft=new FFT(Math.pow(2,nn)); var qq=prepare_interpolate_rate_for_fft(opt.t,qf); interp_res=utils_1D.l1_interpolate(qq).make_array(Math.pow(2,nn)).zero_shift();fft.forward(interp_res);//подготовка и проведение ффт
	var sp=fft.spectrum; var ind=0; var sm = -1e+4; for (var i = 0; i < sp.length; i++) {if (sp[i]>sm) {sm=sp[i]; ind=i}} var jw0= new Complex(0, 2*Math.PI*(ind)); // нахожение главной моды спектра
	var t = norm(opt.t); var lq=new LT(q, t);//var t = opt.t; var tm = -1e+4; for (var i = 0; i < t.length; i++) {if (t[i]>tm) {tm=t[i];}}; for (var i = 0; i < t.length; i++) {t[i]=t[i]/tm}; //нормировка временной шкалы
	sq=lq.make_int([jw0]);//вычисление инреграла Лапласа
	for (var i = 0; i < opt.p.length; i++){
		var p = opt.p[i];
		var pc=eliminate_bk(p,opt.deg);
		var lp=new LT(pc,norm(p.x.data));
		var sp=lp.make_int([jw0]);
		opt.p[i].pss={r:opt.p[i].x.R/1000,p:sp.r[0]};
	}
	var bounds = [1.e-3, 15, 0.0100]; var kappa_bounds = []; var i=0,n=0; kappa_bounds[0]=bounds[0]; while (n < Math.floor((bounds[1]-bounds[0])/bounds[2])){	i++; n++; kappa_bounds[i]=bounds[2]+kappa_bounds[i-1]; }
	var root_args=root_arg_s(opt.p,sq,jw0,kappa_bounds);
	var val = 1e+9; var ind=-1; for (var i = 0; i < root_args.length; i++){if (root_args[i]<val){val=root_args[i]; ind=i;}}; if (ind===-1) throw "Root args error";//[val,inx]=min(fa);
	return kappa_bounds[ind];
}
function save_curves_in_local_memory(kappa_curves, x){
	var toPlot=[]; 
	for (var i = 0; i < kappa_curves.length; i++){
		toPlot[i]=[]; for (var j = 0; j < x.length; j++) toPlot[i][j]=[x[j],kappa_curves[i].kappa_curves[j]];
		self.log.send({aa:[kappa_curves[i].wellName+" kappa", toPlot[i]]});
	}
}
function start_LT_solver_v1(obj){
	/*------Solver------/*/			
			//парсим объект
			//отдельно обрабатывается курва с закачкой
			//заносим графики капп для всех остальных обсерверов 
			//заносим давления на инжекторах в myGlob для прорисовки
	var z = (new LT([1], [1])).generate_complex(); self.locTic=LPC.Tic();
	var lqs=parse_rate(obj, z.z); if (!lqs) {throw "Error in rate curve parse!"; }; self.log.send({mc:["LT maked rate", self.locTic.sec()]}); self.log.send({mp:75}); self.locTic=LPC.Tic();
	var lps=parse_pressures(obj, z.z); 
	var kappa_curves=solve_v1(lps, lqs, z.z);
	save_curves_in_local_memory(kappa_curves, z.td);
	/*------------------/*/
}
function start_LT_solver_v2(obj){
	/*------Solver------/*/			
			//парсим объект
			//отдельно обрабатывается курва с закачкой
			//заносим графики капп для всех остальных обсерверов 
			//заносим давления на инжекторах в myGlob для прорисовки
	var opt = preparing_for_solver_start(obj); 
	check_bounds(opt);// необходимо совпадение границ временных отрезков у закачки и давлений
	var kappa=solve_v2(opt);		
	/*------------------/*/
}
function preparing_for_solver_start(obj){
	var opt={tb:0, deg:4, p:[]};
	var r=check_conditions_on_dataType(obj,0);r=r.ps[0];appendCurve(r.name+" rate",r.x,r.y);
	var r_max=-1e+4; for (var i = 0; i < r.y.length; i++) if (r_max<r.y[i]) r_max=r.y[i]; 
	for (var i = 0; i < r.y.length; i++) r.y[i]/=r_max;
	var p=check_conditions_on_dataType(obj,1);p=p.ps;
	opt.t=r.x; opt.q=r.y; 
	for (var i = 0; i < p.length; i++) {if (p[i].x.R!=0) opt.p.push(p[i]);}
	return opt;
}
