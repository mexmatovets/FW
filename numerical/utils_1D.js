//

(function Init_fgraph_1d(obj)
{
   obj||(obj=self);
   
   
	function for_each(o,fu)
	{  var k;
	   for(k in o)
	     if (o.hasOwnProperty(k)&&fu(k,o[k])) return true;
		 
		 return false;
	}
	
	function extend_0(ops,ops2)
   {
      ops||(ops={})
	  ops2||(ops2={})
      var o={};
	  for_each(ops,function(k,v){o[k]=v});
	  for_each(ops2,function(k,v){ if(!(k in o)) o[k]=v});
	  return o;
    }
   
   function set_obj_tree_value(str,value) {
      var sa=str.split('.');
	    var o={}
		while(sa.length)
		{
		  o={}; 
		  var n=sa.pop();
		  o[n]=value;
		  value=o;
		}
		return o;
   }
   
           function  check_object(o){ 
              return (typeof(o)=='object') && !(o instanceof Array)
            }

   
   function add_object_tree(names_values,o,default_propname) {
     o||(o={});
	 var ns
	 if(check_object(names_values))
	 {
	   var t=[];
	   for_each(names_values,function(k,v){ t.push([k,v]) } );
	   	   names_values=t;
	 }
	 ns=names_values.map(function(nv){ return set_obj_tree_value(nv[0],nv[1]);})
	 ns.forEach(function(oa){ o=extend_object(o,oa,default_propname) })
	 return o;
   }

   
       	function extend_object(obj1,obj2,default_propname)
   {
			
		function  clone_object(o){ 	   
		   if(!check_object(o)) return o;
		   var oc={};
		    for_each(o,function(k,v){oc[k]=clone_object(v)});
			return oc;
		}
			
          var o={};
		  
      default_propname||(default_propname='');  
	  obj1=clone_object(obj1)
	  obj2=clone_object(obj2)
	  for_each(obj1,function(k,v){o[k]=v});
	  for_each(obj2,function(k,v){ 	  
	      var f,fs;
	    if(!(k in o)) o[k]=v
		else {
		   var vs=o[k];
		  fs=check_object(vs);
		  f=check_object(v);
		  if(f&&fs)
		  {
		    o[k]=extend_object(vs,v,default_propname)
		  }
		  else if(!fs)
		  {
		    o[k]=v; 
		   if(f){
		      
		     o[k][default_propname]=vs;
			}
		  } else if(!f) o[k][default_propname]=vs;
		  
		}
	  });
	  return o;
    }

   
 function mm_init(mm0)
{
 var mm=[Infinity,-Infinity]
 mm.indexes=[NaN,NaN];
 if(mm0 instanceof Array)
 {
    mm[0]=mm0[0];mm[1]=mm0[1]; 
 }
mm.update=function(v)
{
 if(v<this[0]) this[0]=v;
 if(v>this[1]) this[1]=v;
 return this;
}
mm.update_index=function(v,i)
{
 if(v<this[0]) {this[0]=v;this.indexes[0]=i};
 if(v>this[1]) {this[1]=v;this.indexes[1]=i};
 return this;
}

  return mm;
}

function minmax_indexes(a)
{
  var mm=mm_init(mm);
  for(var n=0;n<a.length;n++) mm.update_index(a[n],n);
  return mm;  
}

function fbin_search(_array)
{

/* Search within a real ordered array.
   Parameters:
   value -- the sample,
   old -- previous result,
   array,n -- the array and its dimension.
   Returns: Left node of the array segment matching the sample. 
   In case the sample is out of the array, returns -1 (less than 
   left boundary) or (n-1) (more than the right boundary).
*/

  var array,n=_array.length,old=-1;
  
     array=(_array[0] instanceof Array)?_array.map(function(v){return v[0]}):_array;
	  
  
  function make(value){
     var left,right;

  if(value < array[0]) return(-1);
  if(value >= array[n-1]) return(n-1);
  if(old>=0 && old<n-1) {
    var inc=1;
    left = right = old;
    if(value < array[old]) {
      while(1) {
        left -= inc;
        if(left <= 0) {left=0;break;}
        if(array[left] <= value) break;
        right=left; inc<<=1;
      }
    }
    else {
      while(1) {
        right += inc;
        if(right >= n-1) {right=n-1;break;}
        if(array[right] > value) break;
        left=right; inc<<=1;
      }
    }
  }
  else {left=0;right=n-1;}

  while(left<right-1) { 
    var node=(left+right)>>1;
    if(value>=array[node]) left=node;
    else right=node;
  } 
  return old=left;  
  }
  
  return function search(value){ return make(value)}
  
}



   function max_length(q) 
   {
    return q.reduce(function(s,v){ return Math.max(s,v.length);  },0)
   }

   function transpose(q)  {
    var lm=max_length(q); 
	var r=[];
	  for(var k=0;k<lm;k++) r[k]=[];
	q.forEach(function(v,i){
	    for(var k=0;k<lm;k++)
		    r[k][i]=v[k];
	})
	return r;
   }

   function fgraph_clone(q)  {   return q.map(function(v,ind){
      return v.map(function(vv){return vv});})   }
	  
	  function fgraph_clone2(q)  {   return q.map(function(v,ind){
      return [v[0],v[1]]});}
	
	function eliminate_bad_data(q,filter){
	
	   if((!filter)&&filter.length) return q;
	   var fltr=fgraph_sort(fgraph_clone(filter)),jj=0;

	  
	  var fc;
       q.some(function(v,i){
	       var t=v[0],it=i;
		   if(!fltr.length) return true;
	       while(fltr.length&&(t>fltr[0][1])) fltr.shift();
		   fltr.forEach(function(f){
		      if((f[0]<=t)&&(t<=f[1]))
			      { q[it]=NaN;++jj}
		   })
	   })
	   return (jj)?fgraph_filter2(q):q;	   
	
	} 
   
   function fgraph_filter(q,func) {
     var fu=(func)?func:isFinite;
   return q.filter(function(v){   if(v instanceof Array ) return v.every(fu) }  )  }
   
     function fgraph_filter2(q,func) {
     var fu=(func)?func:isFinite;
   return q.filter(function(v){   return (v instanceof Array )&& fu(v[0])&& fu(v[1])  }  )  }

   function fgraph_sort(q)   {    return q.sort(function(v1,v2){ return v1[0]-v2[0] })}
   function fgraphs_domain_gap(qs){
        
		var lr=[-Infinity,+Infinity]
		//,lm=max_length(qs); 
		qs.forEach(function(q){
		    var ql=q[0][0],qr=q[q.length-1][0];
		  if(ql>lr[0]) lr[0]=ql;
		  if(qr<lr[1]) lr[1]=qr;  	  
		   
		})
		return lr;	
   }
   
   
function primitive_lin_interpolate(xx,fstep)
{
   var x,y,N1,py=[],s=0,tl=0,dts=[],tp,fp=0,dfs=[], flin=!fstep;
   
       N1=xx.length-1;
	   
	   fp=xx[1][0];
	   tl=xx[0][0];
	   
	   if(flin) xx.forEach(function(v){
	     var t=v[0],f=v[1],dt,df,dfdt2;
		   dt=t-tl;
		   df=(f-fp);
		   dfdt2=df/(2*dt);		   		   
	       
	       py.push([tl,s,fp,(isFinite(dfdt2))?dfdt2:0]);
		   s+=dt*(fp+f)/2;  		   		  		 
		   tl=t;
		   fp=f;
	   })
	   else
	    xx.forEach(function(v){
	     var t=v[0],f=v[1],dt,df,dfdt2;
		   dt=t-tl;		   
	       py.push([tl,s,fp]);
		   //s+=dt*(fp+f)/2;
           s+=dt*fp;  		   		  		 		   
		   tl=t;
		   fp=f;
	   })
	   
	   py.shift();
	   py.push([tl,s,fp,0]);
	   
	 
   
   var fbs=fbin_search(xx)
      ,f0=xx[0][1]
	  ,x0=xx[0][0];
   
   function calc(t)
   {
     var r,dt,pyi,f,dfdt2,ti;
     var it=fbs(t);
	 if(it<0)  return f0*(t-x0);
	 
	 pyi = py[it];
	 ti = pyi[0];
	 r = pyi[1];
	 dt=t-ti;
	 f = pyi[2];
	 dfdt2 = pyi[3]; 
	 r += dt*(f+dfdt2*dt);
	 return r;		  
   }
   
   function calc_step(t)
   {
     var r,dt,pyi,f;
     var it=fbs(t);
	 if(it<0)  return f0*(t-x0);
	 
	 pyi = py[it];
	 ti = pyi[0];
	 r = pyi[1];
	 dt=t-ti;
	 f = pyi[2];	 
	 r += dt*f;
	 return r;		  
   }
   function interpolate(t){ return calc(t)};
   function interpolate_step(t){ return calc_step(t)};
   interpolate_step.py=interpolate.py=py;
   interpolate_step.x=interpolate.x=x;
   interpolate_step.y=interpolate.y=y;
   
   return (flin)? interpolate:interpolate_step;
     
} 
   function preparate_data(data,ops)
   {
      ops=extend_0({},ops);
  	  if (!(data instanceof Array))
	  {
	    var f,xx;
	     //if(!((data.x)&&(data.y))) throw Error('bad interpolate data');
		 if((data.x)&&(data.y)) xx=[data.x,data.y];
		  if((!xx)&&(data.pair))  xx=[data.pair[0],data.pair[1]];
		          
		       if(!xx) throw Error('bad interpolate data format');
           ops.cloned=1;		 
		  data=transpose(xx);
	  }

      ops.cloned||(data=fgraph_clone2(data));
	  ops.filtered||(data=fgraph_filter2(data));
	  ops.sorted||(data=fgraph_sort(data));
	  ops.bad_data&&(data=eliminate_bad_data(data,ops.bad_data));
	  
	  return data;
   }
   
   function preparate_l1_interpolate(data,options)
   {
     var ops={mode:0,sorted:1,filtered:1,cloned:1,domain:0,data:preparate_data(data,{mode:0,sorted:0,filtered:0,cloned:0,domain:0})};
	  return extend_0(options,ops);
   }
   
   function l1_interpolate(ops,a2)
   {
      var data
	  if((ops instanceof Array)||(a2)){
	  data=ops;
	  ops=a2
	  }
	  else data=ops.data;
	  ops=extend_0(ops,{mode:0,delta:1,sorted:1,filtered:1,cloned:0,domain:0});	    
	  
	  
      data=preparate_data(data,ops);
	  var mm=mm_init();
	  function minmax()
	  {
	     data.forEach(function(v){mm.update(v[0])});
		return mm;
	  }
	  (ops.domain)&&minmax();
	  //if(ops.domain)
	  //data.forEach(function(v){mm.update(v[0])});
	  //data.forEach()
	  
	  var f=primitive_lin_interpolate(data,ops.mode);
	  
	  function derivate(t,dt){ 
	  dt||(dt=ops.delta);
	  return (f(t+dt/2)- f(t-dt/2))/2 
	  }
	  
	  function make_array(N,lr){ 
	    //if(!ops.domain) data.forEach(function(v){mm.update(v[0])});
		lr||(lr=minmax())
	    var maxT=(lr[1]-lr[0]),dt=maxT/N,bdt=1/dt,t=lr[0],tn;
		var r=[],fu,T,_pair;
		for(var k=0;k<N;k++)
		{
		   tn=t+dt;
		   fu=(f(tn)- f(t))*bdt;
		   //T.push(t);
		   r.push(fu);
		   t=tn;
		}
		
		function pair(){
		   	     return (this._pair)?this._pair:this._pair=r.map(function(v,i){ return [t+i*dt,v]}) 	  	  
		   		  }
		
    	r.maxT=maxT;
		r.pair=pair;
		r.gap=r.window=lr;
		
      r.zero_shift=function ZeroShift(){
	  var mean=0,len=r.length;
	   if(!len) return r;
	   	 r.forEach(function(v){ mean+=v});
		
		mean/=len;
		var rz;
		
        rz=r.map(function(v){ return v-mean });
		rz.maxT=maxT;
		rz.pair=pair;
		rz.gap=rz.window=lr;
		return rz;    	
	  }
		return r;
	  }

	  return  {interpolate:derivate,primitive:f,domain:mm,make_array:make_array};
   }
   
   function make_mesh_1D(o)
   {  
      var o=extend_object({from:0,step:1,mode:3},o)
	  var dt=(o.N)? (o.to-o.from)/o.N:o.step, res=[]
	  if('y' in o)
	  {
	   var y=(typeof(o.y)=='function')?o.y:function(){ return o.y; }
	  if(o.mode){	  
	  for(var t=o.from;t<o.to;t+=dt)
    	  res.push([t,y(t)])
		  }
		  else for(var t=o.from;t<o.to;t+=dt) res.push(y(t))
	  }
	  else for(var t=o.from;t<o.to;t+=dt)
	           	  res.push(t);
	
	  return res
	
   }
   
   function nlog(N)
   {
     	 for(var k=0;;k++) if(!(N>>=1)) return k;
   }
   function npow2(N)
   {
     var nn=1<<(nlog(N))
     return ((N-nn)>0)? (nn<<1):nn;
   }
   function Zero2Append(a)
   {
      var L=a.length,N=npow2(L),NL=N-L;
	  var tail=new Array(NL)
	   return a.concat(tail.map(function(){return 0}))
   }
   
   function correlaton(x,y,m,fn)
   {
     
	 
     var am=Math.abs(m),N=x.length,Nm=N-am;
	 if(N!=y.length) throw  Error('correlaton error a.length!=b.length ');
	 if(Nm<=0) return 0;
	 var r=0;
	 if(m>0)
	   {for(var n=0;n<Nm;n++) r+=x[n+am]*y[n];}
     else
	   {for(var n=0;n<Nm;n++) r+=x[n]*y[n+am];}
	   	  var NN=(fn)?N:Nm
	  return r/NN;
   }
   function correlaton_n(x,y,fn)
   {
     if(x.length!=y.length) throw  Error('correlaton error a.length!=b.length ');
     var _x=x.map(function(v){return  v}),_y=y.map(function(v){return  v});
	 var xx=correlaton(_x,_x,0),yy=correlaton(_y,_y,0),Z=1/Math.sqrt(xx*yy);
  	 var ts=arguments.callee;
	 function corr(m){ return Z*correlaton(_x,_y,m,fn) };
	 ts.acorr=function(m){ return (corr(m)-corr(-m))/2 }
	 ts.scorr=function(m){ return (corr(m)+corr(-m))/2 }
	 corr.acorr=ts.acorr
	 corr.scorr=ts.scorr
	 return corr;
   }
   
    
	function ZeroShift(r){
	  var mean=0,len=r.length;
	   if(!len) return r;
	   	   	 r.forEach(function(v){ mean+=v});
		
		mean/=len;
		var rz;
		
        rz=r.map(function(v){ return v-mean });
		return rz;    	
	  }
	  
  var fgraph={
    minmax:mm_init
	,minmax_indexes:minmax_indexes
    ,clone:fgraph_clone
    ,clone2:fgraph_clone2
	,filter:fgraph_filter
	,filter2:fgraph_filter2
	,sort:fgraph_sort
	,domain_gap:fgraphs_domain_gap
	,transpose:transpose
	,fbin_search:fbin_search
	,eliminate_bad_data:eliminate_bad_data
	,primitive_lin_interpolate:primitive_lin_interpolate
	,l1_interpolate:l1_interpolate
	,extend_object:extend_object
	,add_object_tree:add_object_tree
	,preparate_l1_interpolate:preparate_l1_interpolate
	,make_graph:make_mesh_1D
	,correlaton:correlaton
	,correlaton_n:correlaton_n
	,ZeroShift:ZeroShift
	,Zero2Append:Zero2Append
  }
  obj.utils_1D=fgraph;
} 
)()