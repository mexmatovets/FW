// --- 
(	
function(external_parameters,masks)
{

var top_level_callee=arguments.callee;
/*
this.LPC=function LPC(opts,contexts,evntports)
{
  __LPC__(opts,contexts,evntports);
  
}
*/

this.LPC=function LPC(opts,contexts,evntports)
{
      if(this.constructor!=arguments.callee) return new arguments.callee(opts,contexts,evntports);  

 	  var  relfs = /^(lfs:)/i; 
	  var  refile = /^(file:)/i; 
	  var   retext = /^(text:\/\/)|^(text:\\\\)|^(text:)/i; 
	  var  reDOM = /^(dom:)/i; 
	  var fmain_worker;	
	  var gc_opts;
	  var $_shift=0;
	  

function Tic(){ 
  if(this.constructor!=arguments.callee) return new Tic();
  function gettime(){  return (new Date).getTime()}
  var t=gettime();
   this.start=function(){ return t=gettime(); }  
    this.ms=function(f){ var n=gettime(),dt=n-t; if(f)t=n;  return dt;}
	this.sec=function(f){ return this.ms(f)/1000;}
 }
 
function to_array(arg)
{   
   if(typeof(arg)=='string') return [arg];
   if(arg==undefined) return [];
   if(arg&&(arg.length==1)) return [arg[0]];
   else return Array.apply(null, arg); 
}

function line_array(a) {
          var a = to_array( a);
        a=([].concat).apply([],a)
		a=([].concat).apply([],a)	 
		return a
  }

        var ts=arguments.callee; 
		
        var _finstallonly,main_location=(ts.main_location)?ts.main_location:location.href,name;
		
		if(_finstallonly=(opts&&opts.install)) opts=undefined;
		
		
		
  this.rc=function(){
  var l=new LPC,c=new MessageChannel; 
    this.lexec('self.$$=$$;console.log("test::--> $$ ",$$)',new Float32Array([1.111e-20,3,455]),l,c.port1,c.port2);
   return l;
  }; 

 function expand_url(link, host) {
 
   if(link==undefined) return ;
   
   host||(host=main_location);
   
  var lparts = link.split('/');
  if (/http:|https:|blob:|ftp:/.test(lparts[0])) {
    // already abs, return
    return link;
  }

  var i, hparts = host.split('/');
  if (hparts.length > 3) {
    hparts.pop(); // strip trailing thingie, either scriptname or blank 
  }

  if (lparts[0] === '') { // like "/here/dude.png"
    host = hparts[0] + '//' + hparts[2];
    hparts = host.split('/'); // re-split host parts from scheme and domain only
    delete lparts[0];
  }

  for(i = 0; i < lparts.length; i++) {
    if (lparts[i] === '..') {
      // remove the previous dir level, if exists
      if (typeof lparts[i - 1] !== 'undefined') {
        delete lparts[i - 1];
      } else if (hparts.length > 3) { // at least leave scheme and domain
        hparts.pop(); // stip one dir off the host for each /../
      }
      delete lparts[i];
    }
    if(lparts[i] === '.') {
      delete lparts[i];
    }
  }

  // remove deleted
  var newlinkparts = [];
  for (i = 0; i < lparts.length; i++) {
    if (typeof lparts[i] !== 'undefined') {
      newlinkparts[newlinkparts.length] = lparts[i];
    }
  }

  return hparts.join('/') + '/' + newlinkparts.join('/');

}

 function isDOM(){ return (self.document) ? true:false }
  
  function check_functor(f){
	  return (typeof(f)=='function')&&(typeof(f.$transaction)=='function');
	};
	
	function for_each(o,fu)
	{  var k;
	   for(k in o)
	     if (o.hasOwnProperty(k)&&fu(k,o[k])) return true;
		 
		 return false;
	}

function FunctorFactory(context)
{
    var list={},idc=32*25+15,_this=this;
	
	function reverse(s)
	{
	  return s.split('').reverse().join('');
	}
	var _uuid=(function()
	{
	    var r=Math.floor(Math.random() * (1<<30));
		idc=Math.floor(Math.random() * (1<<30));
		var t=(new Date).getTime();
		return reverse((parseInt(r)).toString(32)+(parseInt(t)).toString(32)+'_');
	
	})()
	
	this.uuid=function(){ return _uuid };
	
	
	this.is_functor=check_functor;
	
	function  next_idc(){ return reverse((idc=parseInt(++idc)).toString(32))+_uuid; }
	this.iid=next_idc;
	
	function _execute(transaction,id)
	{
	   id=transaction.id;
	  if(transaction.data)
		{
	       
	    var f;
	    
	    var funs=transaction.funs;
	    
		 
		 
		 while(f=funs.shift()) f.call(transaction.context,transaction.data);	
		 if(transaction.state=='pending') delete list[id];              	   
		 transaction.state=(transaction.data.error)?'rejected':'resolved';

		 
		}
		else    list[id]=transaction;
     
	}
	
	
	function _cast_functor(a)
	{
	   var funs=line_array(a);
	   if(!funs[1])
	   {
	     var f=funs[0];
	      if(typeof(f)=='function') return funs[0];
		  else
		  if((typeof(f)=='object')&&(f.done||f.fail))
		  {
		    funs=[f.done,f.fail];
		  }
	   }
	   if(funs.length>1)
	   {
	     return function(d){
		   if(d.error)
		   {(typeof(funs[1])=='function')&&funs[1](d.error,id);} 
		   else 
		   {(typeof(funs[0])=='function')&&funs[0](d.result,id);}
		   }
	   }
	   
	   //throw "Functor argument type mismatch"
	}
	
   function create_functor(pack_functor)
   {  
      //pack_functor={id:t.id,data:t.data,state:t.state,__port_constructor__:'functor'};
      	  
       var id,transaction;
	   if(pack_functor)
	   {
	     
		 id=pack_functor.id;
		if(list[id]&&list[id].functor) return list[id].functor
		
	    transaction=pack_functor;
		transaction.funs=[];
	   }
	   else
	   {
	   id=next_idc();
	   transaction={funs:[],id:id,state:'pending'};
	   }
	   
	   
	   
      function __functor__( fu ,fue)
	  {
	     
		/* 
	    if(typeof(fue)=='function')	
		      fu=[fu,fue];
	    if(typeof(fu)=='function')	
        		//list[id].funs.push(fu);
				transaction.funs.push(fu);
		else if((fu instanceof Array)&&fu.length)		
		{
		  //list[id].funs.push
		  transaction.funs.push
		  (function(d){
		   if(d.error)
		   {(typeof(fu[1])=='function')&&fu[1](d.error,id);} 
		   else 
		   {(typeof(fu[0])=='function')&&fu[0](d.result,id);}
		   })
		
		
		}
		 */
		 
		 
		 
		//if(!_execute(transaction))
		  //list[id]={functor:functor,transaction:transaction};
		   //if(pack_functor)  list[id].functor=functor;      
		
		// list[id]={funs:[],state:0,functor:functor};
		    var f=_cast_functor(arguments);
			if(f)
			{
		    transaction.funs.push(f);
			_execute(transaction);
			}
			return functor;
		
	  }
	  
	  var functor=function(always_done_callback,fail_callback){ return __functor__(always_done_callback,fail_callback) }
	  functor.id=function(){return id};
	  //functor.$funs=function(){return list[id].funs};
	  functor.$clear=function(){ return functor(function(){delete transaction.data.result } ) };
	  functor.$transaction=function(){return transaction};
	  functor.$list=function(){return list};
	  functor.state=function(){return transaction.state};
	  functor.pipe=function(){// (fu,fue){
	  
	      
	      var fu=_cast_functor(arguments)
		  ,newfunctor=create_functor();//,newtransaction={};
		  
	     
	  
	      functor(function(data)
		  {
		      
		     var t,f;
			 /*
			 if(typeof(fue)=='function')
			 			   fu=[fu,fue];
			 
			 if(fu.length>1)
			 {
			   if(data.error) f=fu[1](data)
			    else f=fu[0](data)
			 }		 
			  else 	 f=fu(data);
			  */
			  //fu=_cast_functor(arguments);
			  f=fu(data);
			  
			 t=newfunctor.$transaction();    
			 if(check_functor(f))
			 {
			  f(function(newdata)
			  {
			     
				 t.data=newdata;
				 t.context=this;
				 _execute(t);
			  }
			  )			  
			  
			 }
			 else {
			     t.data=f;
			    _execute(t);
			 }
			 
		  }
		  )
	        
			   
			   return newfunctor;
	  };
	  
	  
if(self.$&&$.Deferred) 
{	
  functor.$=function(f)
   {
     var d=$.Deferred(f);
     function fu( rpc)
	 {
	   if(rpc.error) d.rejectWith(d,[rpc]);
	   else   d.resolveWith(d,[rpc]);
	 }
	 /*
	 if(list[id]) 
	 { 
	   list[id].funs.push(fu);
	   return d;
	 }
	 */
	 transaction.funs.push(fu);
	 _execute(transaction);
	   return d;
   }
   
}   
	  _execute(transaction);
	  
functor.resolve=  functor.$resolve=function(data){  if(transaction.state=='pending') { transaction.data={result:data}; _execute(transaction)}; return functor};
functor.reject=   functor.$reject=function(data){  if(transaction.state=='pending')  {transaction.data={error:data}; _execute(transaction)}; return functor};

	  return functor;
   }
  
  _this.reject_all=function(err){
  
    for_each(list,function(id,t){ _this.execute(id,{error:err})});
   list={};
  }
  
  
    
  
  _this.create=create_functor;
  _this.execute=function(id,data,context){
  
    if((typeof(id)=='function')&&(id.id))
           	id=id.id();
   if(id&&list[id])
   {
     var transaction=list[id];
	 transaction.data=data;
     transaction.context=(context)?context:self;
	  _execute(transaction);
   }
	 
	 
	/*  
      var evnt=list[id];	  
      var funs=evnt.funs;
	  var f;
	   evnt.state=(data.error)?-1:1;
	   evnt.data=data;
	  while(f=funs.shift()) f.call(context,data);
	  delete list[id];              	   
	  */
	  
	    
	 
   }
   
  
  
}		
    
      
  
	var _this=this,id_deffered=0,deffered_list={};  
	  
	  var _uuid=(function (){
	   return (Math.random()*(1<<16)).toString(32)+':'+(new Date).getTime().toString(32);	   
	})()
	
	 
	
	_this.uuid=function(){return _uuid};
	
	_this.$offset=0;
	
	  var FF=new FunctorFactory();
	  var _uiid=name=FF.iid();
	  var _closer=_this.$closer=FF.create();
	  var childwin;
	  
	  _this.terminate=function(){ _closer.$reject('terminate'); }
	  _this.close=function(){ _closer.$resolve('close'); }
	  _this.closer=_closer;

      //var port,contexts,evntports,inner_worker;
	  var port,inner_worker;
	  if(contexts||evntports)
	  {
	    port=opts;   
		opts=undefined;
	  }
	  
	  
	  function when()
	  { 
	      var state;
	      var functor=FF.create();
	       var a=line_array(arguments);
		   if(a.length==0)
		   {
		    FF.execute(functor.id(),{},this);
		   }
		   else 
		   (function check()
		   { 
		      
		     var fall=true,f=a.some(function(fd){
			  //var transaction=ftr.$transaction();
			  state=fd.state();
			  if(state=='rejected') return true;
			  fall=fall&&(state=='resolved');
			 //return ftr.$funs().length;
			 } )
		     
		     if(f||fall) 
			 {
			   var results=[],errors=[],contexts=[];
			   a.forEach(function(fd,i)
			   {
			      var t=fd.$transaction();
			     var data=t.data;
				 
				 //if(data!=undefined) 
				   results[i]=data.result;
				  if(state=='rejected') errors[i]=(data)?data.error:null;			 
				  contexts[i]=t.context;
			     
			   })
			   var data={result:results,contexts:contexts};
			   if(state=='rejected') data.error=errors;
			   
			    FF.execute(functor.id(),data,this);
			 }
			 else setTimeout(check,40);
			 
			 
		   })();
		   
		   return functor();
	  }
	  
	  function toBlob(o,btype)
	  {
	   /*
	    var bb=new BlobBuilder;
		  bb.append(o);
		  return bb.getBlob((btype)?btype:'');
		 */ 
		 
		 return (btype)? (new Blob([o],{type:btype})):(new Blob([o]));
		  
   	  }
	  
	  function fromBlob(b,fnc)
	  {
	      var  o=(new FileReaderSync).readAsArrayBuffer(b); 
	      if((!fnc)&&b.type) return (new ObjContext(o)).execOnce(b.type);
            else return o; 		  
		   
   	  }
	  
	  
 function jscon()
 {
   var jargs = JSON.stringify( to_array( arguments),null,'\r' ); 
   if(self.console)
   {
     console.log('jcon:\n',jargs);
   }
   else if(LPC.main)
   {
      //LPC.main.lexec("console.log('jcon:\n',$0);",jargs);
	  LPC.main.lexec("console.log('jcon:\\n',$0)",jargs)
   }
  
 }
	
      function log() { 
    	  if(isDOM())console.log.apply(console,arguments)
		   else if(LPC.main)
		   {
		      var a=to_array( arguments); 
			   a.unshift(self.constructor.name+'['+name+']:')
		      LPC.main.lexec("(function(arg){ console.log.apply(console,arg)})($0)",a);
		   }
	  }	
	   this.log=log;
	  if(!ts.when)
	  {
	    ts.to_array=to_array;
		ts.line_array=line_array;
	    ts.log=log;
	    ts.main_location=self.location.href;
		ts.expand_url=expand_url;
	    ts.when=when;
	    ts.dbg=function(e){ debugger ; }
	    ts.FF=FunctorFactory;
		ts.toInnerString=LPC.toString;
		ts.toString=function(){return 'constructor LPC(opts,contexts,evntports){  ... DICH ...} '}
		ts.fromBlob=fromBlob;
		ts.toBlob=toBlob;
		ts.isDOM=isDOM;
		ts.is_worker=function(){return !isDOM()};
		ts.jscon=jscon;
		ts.localEval=localEval;
        ts.globalEval=globalEval;
        ts.ObjectContext=ObjContext;
		ts.qualifyURL=qualifyURL;
		ts.for_each=for_each;
		ts.Tic=Tic;
		ts.$imports_asyn=$imports_asyn;
		ts.$require=$require
		ts.$functor=(function(){var f=new FunctorFactory;
		return function(pf){ return f.create(pf);}
		} )();
		
		ts.attach_to_worker=function(ln,opts)
		{
		     
			 
		   var count;
		   
		    
		    if(!isDOM())
			{
			
			
			
			  self.tic=new Tic;
			
			if (self.constructor.name=='SharedWorkerContext') 
              {
			    

  
               self.onconnect = function(event) {
			      var port = event.ports[0];  
				  var nn=event.ports.length,data=event.data;
				  var lpc = new LPC({port:port});
				  
				  if(!(count++))				  				    
				    self.__LPC__=self.LPC.main=lpc;
				  lpc.ping(count);
				  
/*				  
                  port.onmessage = function(e) {
          			
					port.onmessage=function(){};
					var lpc;
					if(!first)
					{
					 first=e.data;
					if(ln) LPC.main_location=ln;
                    lpc=self.__LPC__=self.LPC.main=new LPC({port:e.ports[0]});				                   
					}
					else lpc=new LPC({port:e.ports[0]});
			  		//e.ports[0].postMessage([self.onconnect.toString(),first,__LPC__.uuid()]);	  
					//self[e.data].exec('aaa=$0',[self.onconnect.toString(),first,__LPC__.uuid()]);
					lpc.inner_port.onmessage=function(d)
					{
					 lpc.inner_port.postMessage('222222222222')
					}
					lpc.inner_port.postMessage('777')
					lpc.ping([nn,data,self.onconnect.toString(),first,__LPC__.uuid()]);
					self[e.data]=lpc;
				  } 
				  */
				   //port.postMessage({ping:[self.onconnect.toString(),first,__LPC__.uuid()]});
			   }
			  }
			  else
			  {

			       ts.attach_to_worker=function(){ throw 'attach_to_worker called once only'}
			   
        			self.onmessage=function(e){
					self.onmessage=function(){};
					if(ln) LPC.main_location=ln;
					
                    self[e.data]=self.__LPC__=self.LPC.main=new LPC({port:e.ports[0]});				                   
					
					} 
    			}
				
    		 if(opts){			
			   if(opts.$offset) _this.$offset=opts.$offset;
			   
			 if(opts.imports) $imports(opts.imports)
			  revokeUrls(opts.r_urls);			 
			  }

			   
			}
			else throw 'in worker context only'
			
		}

	  }
	  
	  
	  
	  
	  
self.BlobBuilder=self.BlobBuilder||self.WebKitBlobBuilder || self.MozBlobBuilder;
self.URL=self.URL||self.webkitURL;


      _this.when=when;
	  _this.toBlob=toBlob;
	  _this.fromBlob=fromBlob;
	  _this.isDOM=isDOM;

function clone_object(o) {

    var so=JSON.stringify(o)
	return (so!=undefined)?JSON.parse(so):undefined;
/*	
   var i;
   
   if((!o)||(typeof o == "string"))      return o;
  
  var __clone__=arguments.callee;
  var newObj = (o instanceof Array) ? [] : {};
  for (i in o) 
  if(o.hasOwnProperty(i)) 
  {
    if (o[i] && typeof o[i] == "object") {
      newObj[i] = __clone__(o[i]);
    } 
	else newObj[i] = o[i];
  } 
  return newObj;
  */
};
	  
 function clone_object_port(o,contexts,ports,functors) {
 
 if(!o) return o;
 if(typeof(o)!='object')
    if(typeof(o)!='function') {return o;}
	 else 
	 {    var t, pack_functor;
	 
	      if((typeof(o.$transaction)=='function')&&(t=o.$transaction())&&( t.id )&&(!contexts)&&functors)
		  {
	            //  pack_functor={id:t.id,data:t.data,state:t.state,__port_constructor__:'FF.create'};				   
				  pack_functor={id:t.id,state:t.state,__port_constructor__:'FF.create'};				   
			
   			       if(functors&&(!functors[t.id])) functors[t.id]=o;
			  
   		 }
		  return pack_functor;	  
	          
      }
	
	
	
if( o&&( (o instanceof ArrayBuffer)||(o.buffer instanceof ArrayBuffer)||( o.constructor.name=='Blob') ||( o.constructor.name=='File')) )
       return o;
	   
if(contexts)
{	   
      
if(o.__port_constructor__)
	   {
	        if(o.__port_constructor__=="MessagePort")
			{
			  return ports[o.id];
			}
			else
			{
	   	       //var port_constructor=eval(o.__port_constructor__);			
			   //return new port_constructor(o,contexts[o.__port_constructor__],ports);
			   return eval('[ new '+o.__port_constructor__+'(o,contexts[o.__port_constructor__],ports)][0]');
		   }
	   }
if(o.__class_factory__)	   
{
   //var obj=eval()
}
	   
}	 
var i;
  var __clone__=arguments.callee;
  
if(ports instanceof Array)
{
if((o instanceof LPC))
{
    //
	ports.push(o.$transit_port());
    //ports.push((o.external_port)?o.external_port:o.inner_port);
	return {id:ports.length-1,__port_constructor__:o.__port_constructor__};
	
}
else{ if( o.constructor&&(o.constructor.name=="MessagePort"))
        {  
        		ports.push(o)
             return {id:ports.length-1,__port_constructor__:"MessagePort"};
		}
	}

 	 
}
  
  
  
  var newObj = (o instanceof Array) ? [] : {};
  for (i in o) 
  if(o.hasOwnProperty(i)) 
  {
     var oi=o[i];
	 newObj[i] = __clone__(oi,contexts,ports,functors);     
/*	 
    if (oi && typeof oi == "object") 	   
	    newObj[i] = __clone__(oi,contexts,ports);     
	    //newObj[i] = __clone__(oi,contexts);     
	else if (typeof oi != "function") newObj[i] = oi;
*/	
  } 
  
  return newObj;
};
	  
 function eval_import(s)
{
/*var bb=new BlobBuilder();
bb.append(s);
var blobURL = URL.createObjectURL(bb.getBlob());
*/
var blobURL = URL.createObjectURL(toBlob(s));
importScripts(blobURL);
URL.revokeObjectURL(blobURL);
}
function url_create(s)
{
/*
var bb=new BlobBuilder();
bb.append(s);
return URL.createObjectURL(bb.getBlob());
*/
return URL.createObjectURL(toBlob(s));
}
function create_inline_worker(s,fshared)
{
var blobURL = url_create(s);
var worker=(fshared)? new SharedWorker(blobURL):new Worker(blobURL);
if(fshared&&fshared.push) {  fshared.push(blobURL);}
else URL.revokeObjectURL(blobURL);
return worker;
}
        var fcm;
        function channel_check()
		{
		  if (!port) {
	          var channels;
			  fcm=true;
	      channels=new MessageChannel();
		  inner_port=channels.port1;		  
		  return  port=channels.port2;
	      }
		  
		}
		
		  function $transit_port(){
		  return (fcm&&(!fmain_worker))?_this.external_port:_this.inner_port;
		  }
		  _this.clone=function(){
		         
		        return new LPC({port:_this.$transit_port() })
		  };
		_this.$transit_port=$transit_port;
		
    	
		
		function reset_gc(g)
		{
		  if(g=='auto')
		 {
		   gc_opts={auto:true,time:3000,count:1000};
		  } 
		  else   gc_opts=(g)?JSON.parse(JSON.stringify(g)):undefined;
		  
		  if(gc_opts)
	    {
	     
	    if(!gc_opts.manual)
		{
	      setTimeout(function(){  _this.gc(gc_opts.count);},100);
		}
	     
	    }
		  return gc_opts;
		}
		
		_this.gc_reset=reset_gc;
	
	 function clone_opts(opts)
	 {
	    if(!opts) return opts;
		var cop;
		//cop=JSON.parse(JSON.stringify(opts));
		cop=clone_object(opts);
		//cop.port=opts.port;
		if(opts.worker&&opts.worker.imports)
		{
		
			      var i=line_array(opts.worker.imports);
			      var r=[],ii=[];
                  
				  i.forEach(function(u,k){
				  ii[k]=url_reparse(qualifyURL(u),r)}
				  );				  
				  cop.worker||(cop.worker={});
				   cop.worker.imports=ii;
				   cop.worker.r_urls=r;			  
		
		}
		return cop;
	 }
      if(opts)	  
	  {
	  
	    reset_gc(opts.gc)
	  var fshared;
	    //if(opts.onerror) _this.onerror=opts.onerror;
		if(opts.onmessage) _this.onmessage=opts.onmessage;
		contexts=opts.contexts;
		evntports=opts.evntports;
	     port=opts.port;
		 
	     if((port)&&port.constructor.name=='LPC')
			 {
			   //port=(port.external_port)?port.external_port:port.inner_port;
			     port=port.$transit_port(); 
			 }

		 
	   if(self!=port)
	   {
	     var f_in_main_thread=(!self.Worker)&&(opts.worker||opts.window);
		 var op;
		 op=clone_opts(opts);
		if(f_in_main_thread) {
		   channel_check();
		     
  		   
		   
			//op=JSON.parse(JSON.stringify(opts));
			//op=clone_object(opts);
		   		   op.port=port;
		   
		   
		   (op.worker)&&(op.worker.url=expand_url(op.worker.url,main_location))
		   
		   //LPC.main.lexec('var t=new LPC($0)',op);
		   LPC.main.lexec('if(!$t.workers) $t.workers={}; $t.workers[$1]=new LPC($0)',op,_uiid);
		   _closer(function(){ LPC.main.lexec('$t.workers[$0].terminate();delete $t.workers[$0]',_uiid)})		  
		  // inner_port=port;
		   opts={};
		   fmain_worker=true;
		 }
		 else    if(opts.worker)
		 {
		 
		       var wopts,swops='false';
			   //wopts=clone_opts(opts.worker);
			      wopts=op.worker;
			   swops=JSON.stringify(wopts)
			   
			   //var imports
			   //wopts=JSON.parse(JSON.stringify(wopts));  
			   /*
			    wopts =clone_object(opts.worker)
			   if(wopts.imports)
			   {
			      var i=line_array(wopts.imports);
			      var r=[],ii=[];
                  
				  i.forEach(function(u,k){
				  ii[k]=url_reparse(qualifyURL(u),r)}
				  );
				  
				  wopts.imports=ii;
				   wopts.r_urls=r;
				  swops=JSON.stringify(wopts)
			   }
			   */
			   
		       var workerURL=expand_url(wopts.url,main_location);
		      var wn=(wopts.name)?wopts.name:"$LPC";//"workerLPC";
			  //if(opts.worker.name) name=opts.worker.name;
		   //var s=LPC.toString()+'self.addEventListener("message", function(e) {   })';
		   var s;
		   /*
		   s='(function(){ self.LPC='+ LPC.toString()+'\n'+__LPC__.toString() +'})()';
		   s+='\n'+wn+'=new LPC({port:self});self.$import=function(s){workerLPC.$imports(s)} \n';
		   */
		    var lpctext='(function(){\n self.LPC='+ LPC.toInnerString()+'\n })();\n';
			 s=lpctext;
			 
			 var ml=(workerURL)?workerURL:main_location;
			 
			 
			 s+='new LPC({install:true});LPC.attach_to_worker("'+ml+'",'+swops+');\n'
			 //s='self.onmessage=function(e){'+lpctext+'\n self[e.data]=__LPC__=LPC.main=new LPC({port:e.ports[0]});\n'
			 //s+=';self.onmessage=function(){};}'
			 fshared=opts.worker.shared;
			 var WebWorker=(fshared)?SharedWorker:Worker;
			inner_worker=(workerURL)? new WebWorker(workerURL):create_inline_worker(s,fshared);
			
		   if(!port)
		   {
		   /*
		   s='(function(){\n self.LPC='+ LPC.toInnerString()+'\n })()\n'+wn+'=__LPC__=LPC.main=new LPC({port:self});\n self.$import=function(s){'+wn+'.$imports(s)} \n';
 		   inner_worker=create_inline_worker(s);
           inner_port=port=inner_worker;    
		   */
		   if(fshared){
		     inner_port=port=inner_worker.port;
		     }
		   else {
		    var mc=new MessageChannel;
		    inner_port=port=mc.port1;
		    //if(fshared) 	inner_worker.port.postMessage(wn,[mc.port2])					
			   inner_worker.postMessage(wn,[mc.port2])
			
		    }
		   }
		   else
		   
		   {
		     //s='(function(){\n self.LPC='+ LPC.toInnerString()+'\n })()\n __workerLPC=new LPC({port:self});\n self.$import=function(s){__workerLPC.$imports(s)} \n'; 
			 
			 
			
			//channel_check()
			//inner_worker.postMessage(wn,[port])
			if(fshared) 	inner_worker.port.postMessage(wn,[port])
			else 	inner_worker.postMessage(wn,[port])
			/*
			var l=new LPC()
			l.exec(wn+'=__LPC__=LPC.main=new LPC({port:$0})',port);//(function(d){ console.log('inner',d) });
			_this.worker_port=l;
			*/
			//if(!fcm) 
			inner_port=port;
			port=undefined;		   
		   
		  }
            _closer(function(){ 
			if(fshared) { _this.exec('self.close()')(function(){inner_worker.port.close()}) }
			else inner_worker.terminate();})		  
		}
		}
		
	    
	  }
      var id, inner_port, _contexts=contexts?contexts:{},_this=this;
	  
/*     if (!port) {
	    var channels;
	    channels=new MessageChannel();
		inner_port=channels.port1;
		port=channels.port2;		
	 }
	 else  
 */
  if(!(_finstallonly))
  {
	 channel_check();
	 if(!fcm)
	 {
      if(port.__port_constructor__&& evntports instanceof Array)
      {	
        id=port.id;	  
	    //port=undefined;
		port=inner_port=evntports[id]; 
		
	  }
	  else { inner_port=port;port=undefined;}
	  
	 }
	 
	 _closer(function(){ inner_port.close&&inner_port.close();})		  
  }
	 
	  

	  
function url_reparse(url,r)
{	  
	  //const  refile = /^(file:\/\/)|^(file:\\\\)|^(file:)/i; 
	  
	   
	  var s;
	  if(relfs.test(url))
	  {
	     s=url.replace(relfs,''); 
	     s="http://localhost:7777/::ltxsilk=::/?FD583F3CB33E4226B56558AF1F59C7C3="+self.escape(s);
	     return s;
	  }
	  if(refile.test(url))
	  {
	     s=url.replace(refile,''); 
	     s="http://localhost:7777/::ltxsilk=::/?FD583F3CB33E4226B56558AF1F59C7C3="+self.escape(s);
	     return s;
	  }
	  if(retext.test(url))
	  {
	        s=url.replace(retext,''); 
        	 /*var bb=new BlobBuilder();
             bb.append(s);
             var blobURL = URL.createObjectURL(bb.getBlob());
			 */
			 var blobURL = URL.createObjectURL(toBlob(s));
			 if (r instanceof Array) r.push(blobURL);
	  	     return blobURL;
	  }
	  return url;
	  //return expand_url(url,main_location);
	  
}
	
  this.__port_constructor__ ='LPC'; 
  this.external_port=(!fmain_worker)?port:undefined;  
  this.inner_port=inner_port;  
  this.context=function(){return _context;};  
  
  _this.$export=function(){ return _this.external_port }
  
  		if(opts&&opts.window)
		{
		  var w=opts.window;
		  var url=(w.url)?opts.window.url:'about:blank';
		  if(w.root) url=qualifyURL(url);
		  var inframe=(w.inframe)?w.inframe:true;
		  var name=(w.name)?w.name:'';
		  var params=(w.params)?w.params:undefined;
		  var wurl,marhal_url=(inframe)?null:url;
		  var drf= marshal2(marhal_url,opts.attr)
		  (function(data)
		  {
		    if(!data.error)
			{
		  //	  dnew.result={export_url:exurl,url:url,oldresult:d.result};
		  
		   var md=data.result.export_url;
		  
		  
		   if(url=='::blank') wurl=iscript(md,w.script);
		    else wurl=iiframeurl(md,url);
		  
		   if(isDOM())
            {
			 //if(!window.__ow) window.__ow=[];
			 //window.__ow.push({wurl:wurl,name:name,params:params});
  		     //window.open(ow[0],ow[1],ow[2]);
			 
			  //
			  self.cw=childwin= window.open(wurl,name,params);
			  self.wurl=wurl;
			  //self.cw=childwin= window.open(wurl);
			 _this.childwin= childwin;
			 
			 
			 //data.result.window= childwin
			 //if(inframe) _closer(function(){ win.parent.close();})		  
			   //else 
			   _closer(function(){ childwin.close();})		  
			  
			  
			}
			else if(ts.main)
			      {
				     ts.main.lcall('window.open($0,$1,$2)',wurl,name,params);
					 ts.main.lcall('if(!$t.wins) $t.wins={}; $t.wins[$3]=window.open($0,$1,$2)',wurl,name,params,_uiid);
					 _closer(function(){ ts.main.lexec('$t.wins[$0].close();delete $t.wins[$0]',_uiid)});		  
					 
//					 		   LPC.main.lexec('if(!$t.workers) $t.workers={}; $t.workers[$1]=new LPC($0)',op,_uiid);
	//	   _closer(function(){ LPC.main.lexec('$t.workers[$0].terminate();delete $t.workers[$0]',_uiid)})		  

				  }
		   }
		   
		  })
		  
		   _this.$=function(){ return drf;}
/*		  
		  if(!inframe)
		  {
		    wurl=marshal(url,opts.attr);
		  }
		  else
		  {
		   var  md=marshal(null,opts.attr);
		   if(url=='::blank') wurl=iscript(md);
		    else wurl=iiframeurl(md,url);
		  }
		  if(isDOM())
  		     self.open(wurl,name,params);
		   //md=_this.marshal((inframe)?url:null,);
	*/	  
		    
		}

  
  function revokeUrls(urls)
  {
    if (urls instanceof Array)
       urls.map(revokeUrls);
	   else    if(urls)	URL.revokeObjectURL(urls);   
  }
  
  function $import_asyn(url)
  {
     var r=[];
        url=url_reparse(qualifyURL(url),r);   
      var xdr= new XMLHttpRequest();
	    xdr.open('POST',url,true);
		xdr.responseType='text';
		xdr.setRequestHeader('Accept','*/*');
		xdr.setRequestHeader('Content-Type',"text/plain");
		var fu=FF.create();
		xdr.onreadystatechange=function(){
		 if (xdr.readyState != 4) return
		if (xdr.status == 200) {
		  try{
		  self.eval.call(self,xdr.responseText)
		  fu.$resolve(url);
		  revokeUrls(r);  
		  return;
		  }catch(e){
		  
		  }
		  revokeUrls(r);  
		}
		
		fu.$reject(url);
		}
		
    	xdr.send();
	  return fu;
  }
 

	   function xdr_get(xdr_url)
	{
	    var xdr= new XMLHttpRequest();
	    xdr.open('GET',xdr_url,false);
		if(!isDOM())
		{
		xdr.responseType='text';
		xdr.setRequestHeader('Accept','*/*');
		xdr.setRequestHeader('Content-Type',"text/plain");
		}
		xdr.send();
		if( xdr.status == 200) 
		  return xdr.response;		
		  else throw new Error(xdr.statusText);
	  
	}

	function $require(){
	var urls=line_array(arguments)
    function _require(xdr_url){
	 var st;
	  try{
	  st=xdr_get(xdr_url)
	  }catch(e)
	  {
	    console.error(e.message,e);
		return;
	  }
	  eval.call(self,st);
	}
	urls.forEach(_require);
  }
  function $imports_asyn()
  {
     var urls=line_array(arguments),
	 funs=urls.map(function(url){ return $import_asyn(url) });
	 return when(funs);
	 
  }
  
  var $import  =function(url)
  {
     if(!self.importScripts) throw Error("$import supported in worker context only!!!");
	 var r=[];
     var u=url_reparse(url,r);
	 importScripts(u);
	 revokeUrls(r);
	 return u;
  }
  
  var $imports=function()
  {
  /*      var urls = to_array( arguments); 
		//urls=Array.concat.apply([],urls);
		urls=([].concat).apply([],urls)
		urls=([].concat).apply([],urls)
		*/
		var urls= line_array(arguments),r=[];
		//for(var n=0;n<urls.length;n++) r.push($import(urls[n]));
		//return r;
		return urls.map(function(url){ return $import(url)})
  }
  
  
  function qualifyURL(url) {
  
   	  
	  var  relfs = /^(lfs:)/i; 
	  var  refile = /^(file:)/i; 
	  var   retext = /^(text:\/\/)|^(text:\\\\)|^(text:)|^(inline:)/i; 
	  var  reDOM = /^(dom:)/i; 
	  

       if(typeof(url)=='function')
	   {
	     return "text:"+((url.toInnerString)?url.toInnerString():url.toString());
	   }
        if((typeof(url)=='string')&&self.document&&(!relfs.test(url))&&(!refile.test(url))&&(!retext .test(url)))
		{
		 if(reDOM.test(url))
		 {
		   var s=url.replace(reDOM,'');
		   var el=document.querySelector(s);
		   return (el)? "text:"+el.innerHTML:url;
		 }
		 else
		 {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
		}
		}
		else return url;
      }
	  
  var $imports_to=function()
  {
      var urls= line_array(arguments);
	    var r=[],rur;
		for(var n=0;n<urls.length;n++) 
		{
           urls[n]=url_reparse(qualifyURL(urls[n]),r);   
        }
	 //inner_port.postMessage({cmd:'$t.$imports($$)',args:urls});	  
	 return _call('$r=$t.$imports($$)',urls)(function(){revokeUrls(r)});
  }
  //eval_import;
  _this.$url_reparse=url_reparse;
  _this.$qualifyURL=qualifyURL;
  _this.$import=$import;
  _this.$imports=$imports;
  _this.$imports_to=$imports_to;
  _this.$imports_asyn=$imports_asyn;
  ts.create_inline_worker=_this.create_inline_worker=create_inline_worker;
  ts.url_create=_this.url_create=url_create;
  
  
 // delete port;delete context;delete evntports;
 
   function create_deferred()
   {
     if(self.$&&$.Deferred)
	 {
	   var d=$.Deferred();
      id_deffered=parseInt(id_deffered+1);
	  	   deffered_list[id_deffered]=d;
	   return [d,id_deffered];
	  }
	  return [];
   }
   
   _this.gc=function gc(c){
        _this._gc_tic=new Tic();
		 inner_port.postMessage({gc_bd:c});
		return _this
		}
  
  _this.ping=function(d){  inner_port.postMessage({ping:d,result:'',error:''});return _this}
  
  function _call(cmd,args,flocal) 
  {
      flocal=(flocal)?true:false;
     var ports=[],functors={};
      args=clone_object_port(args,null,ports,functors);
	  //var d=create_deferred();
	  var functor=FF.create();
	  inner_port.postMessage({cmd:cmd,args:args,send_id:functor.id(),flocal:flocal},ports);	
      
       _reply_functors(functors) ;     	 
/*	  for_each(functors,function(id,f){
	    f(function(data){ 
		   _reply(id,data);  
		})
	  })	  
	  */
	  
	  return functor;	 	 
  
  }
  

  this.callf=function()
  {
     var args = to_array( arguments); 
	  var fn=args.shift();
	  if(typeof(fn)=='function') fn='('+fn.toString()+')';
      var cmd="$$.result="+fn+".apply(null,$$)";	 
     return _call(cmd,args);
  }	  
  
  this.execf=function()
  {
     var args = to_array( arguments); 
	  var fn=args.shift();
	  if(typeof(fn)=='function') fn='('+fn.toString()+')';
      var cmd=fn+".apply(null,$$)";	 
     return _call(cmd,args);
  }	  
  
  this.call=function()
  {
     var args = to_array( arguments); 
      var cmd="$$.result="+args.shift();	 
     return _call(cmd,args);
  }	  
  
  this.exec=function()
  {
     var args = to_array( arguments); 
      var cmd=args.shift();	 
     return _call(cmd,args);
  }	  
  
  this.execf=function()
  {
     var args = to_array( arguments); 
      var cmd=args.shift()+".apply(null,$$)";	 
     return _call(cmd,args);
  }	  
  this.local_call=function()
  {
     var args = to_array( arguments); 
      var cmd="$$.result="+args.shift();	 
     return _call(cmd,args,true);
  }	  
  
  this.local_exec=function()
  {
     var args = to_array( arguments); 
      var cmd=args.shift();	 
     return _call(cmd,args,true);
  }	  
  
  this.lexec=this.local_exec;
  this.lcall=this.local_call;
  
  
  
  this.send=function()
  {
     var args = to_array( arguments); 
      
     var ports=[],functors={};
      args=clone_object_port(args,null,ports,functors);
	  var functor=FF.create();
	  inner_port.postMessage({send_data:args,send_id:functor.id()},ports);	  
	  
	  return functor;
  }	  
  
  function LPC_Error(err)
  {
     this.message=err.message;
	 this.stack=err.stack;
	 this.type=err.type;
	 this.raw=err;
	 
  }
  
function read_file_sync(f,mode)
 {  
    var frs=new FileReaderSync;
	return (mode=='text')? frs.readAsText(f):frs.readAsArrayBuffer(f)
 }
  
  _this.read_file=read_file_sync;
  
function ObjContext(args,flocal,pipes)
{
  var r,offset=(_this.$offset)?_this.$offset:0;
  
  args=to_array(args);
 this.$l=this.$c=args.length;
 this.$$=args;
 this.$t=_this;
 
 this.$local=function(s){  eval('with(self.__object_context__){'+s+'}') ;return this.$$.result;}
 
 for(var k=0;k<this.$l;k++)
            		   this['$'+(k+offset)]=args[k];

  this.__defineGetter__("$pipe", function(){
        if(pipes)
		{
           if(!pipes.length) pipes[0]=FF.create();
		   
           return pipes[0];
		}
    });

   
					   
  this.__defineGetter__("$r", function(){
        return this.$$.result;
    });

   this.__defineSetter__("$r", function(val){
        this.$$.result = val;
    });

  //this.execScript=function(s){ eval.call(self,'with(this){'+s+'}')}
   this.execOnce=function(s){
    
	
	
	self.__object_context__=this; 
	
	if(flocal) return  this.$local(s);
   try
   {
     
     eval.call(self,'with(self.__object_context__){'+s+'}')
	 var r=this.$$.result;
	 if(r==this.$$) delete r.result;
	 return r;
    }
	finally
	{
    delete self.__object_context__;
	}
   }
   
   
   
}  

function localEval()
{
    var args = to_array( arguments); 
      var cmd=args.shift();	 
   return (new ObjContext(args,true)).execOnce(cmd);
}

function globalEval()
{
    var args = to_array( arguments); 
      var cmd=args.shift();	 
   return (new ObjContext(args)).execOnce(cmd);
}

_this.globalEval=globalEval;
_this.localEval=localEval
_this.ObjectContext=ObjContext;
_this.create_functor=function(){ return FF.create(); }

   function _reply_functors(functors) 
   {
    /*
	for_each(functors,function(k,f){
	     var id=k;
	    f(function(data){ 
		   _reply(id,data);
		})
	  })
	  */	    
    for_each(functors,function(id,f){
		f((function(id){ 
		return function(data){  
		//console.log('id:',id,'data:',data);
		data.id_inner=id ;_reply(id,data);  } }
		)(id))
	})
   }
   
  function _reply(id,data) 
  {
      
     var ports=[],functors={};
	 
      data=clone_object_port(data,null,ports,functors);
	  //var d=create_deferred();
	  data.ret_id=id;
	  
	  inner_port.postMessage(data,ports);
	  _reply_functors(functors);
	
  }
   
   

  var onmessage=function(e)
  {
  
  	   
	   
          e.stopPropagation(); 
		  e.defaultPrevented=true;
        var ret_id;
      try
	  {
	    var o=e.data;
		delete e.data;
		if(!o) return;
		
		 var gc_blowdown=parseInt(o.gc_bd)
		if((gc_blowdown--)>0)
		{
		  inner_port.postMessage({gc_bd:gc_blowdown});
		  if(gc_blowdown==0) 
		  { 
		  _this.last_tic=_this._gc_tic.ms();
		   if(gc_opts)
		   {
		     
		     			 //setTimeout(function(){ console.log('gc:'+gc_opts.count); _this.gc(gc_opts.count);},gc_opts.time);
		     			 setTimeout(function(){  if(gc_opts) _this.gc(gc_opts.count);},gc_opts.time);
		   }
		    
		  }
		  return;
		}
		
		if('ping' in o)
		{
		   
		   inner_port.postMessage({pong:o.ping});
		   return;
		   
		}
		if('pong' in o)
		{
		   _this.onping&&_this.onping(o);
		   return;
		}
		
		var d;
		
		 ret_id=o.ret_id;
		
		
		
		
		if(o.error)
		{
		       var err= new LPC_Error(o.error);
		  if(_this.onerror) _this.onerror(err);
		  
		  
		  if(ret_id) FF.execute(ret_id,{error:err,id:ret_id},_this);
		  
		  return;
		}
		
		
		
         o=clone_object_port(o,_contexts,e.ports);
		 
		 if(ret_id)
		{
		   //d.resolveWith(_this,[o.result]);		   	   
		   FF.execute(ret_id,{result:o.result,error:null,id:ret_id},_this);
		  return;
		}
		 
		 
		 if(o.send_data)
		 {
		   var $r;
		  if(_this.onmessage) $r=_this.onmessage(o.send_data)
		   else throw Error('onmessage not assined');
		  if(o.send_id) 
		  {
		     if(FF.is_functor($r))
			 {
			   $r(function(data){	      
			        _reply(o.send_id,data);				 
			   })
			 }
		      else _reply(o.send_id,{result:$r});
			  //inner_port.postMessage({result:$r,ret_id:o.send_id});	  
		  }
		 }
		 else //if(o.cmd)
		 {
		   //var $$=o.args;
		   //var __fexit;
		   //var objcontext={$$:o.args,$l:o.args.length,$c:o.args.length,$r:undefined,
		   //exit:function(){ __fexit=true; }};
		   
/*		   var objcontext=new ObjContext(o.args);
		              
					   
          with(objcontext){ 
		  eval(o.cmd);
		  		  }
		   var $r=objcontext.$$.result;
		   delete objcontext;
		   */
		   var pipes=[];
		   var $r=(new ObjContext(o.args,o.flocal,pipes)).execOnce(o.cmd);
		   //var d=deffered_list[ret_id];
		   //if(d) d.resolveWith(_this,[$$.result]);		   	   
		   //if(o.send_id) inner_port.postMessage({result:$r,ret_id:o.send_id});	
		     if(!o.send_id) return;
		     if(pipes[0])
			 {
			   pipes[0](function(d){
			      _reply(o.send_id,{result:d.result,error:d.error});
			   })
			 }
			 else    _reply(o.send_id,{result:$r});
		   //if(__fexit) inner_port.close();
		 }
		 
		 
      }
	  catch(err)
	  {
	    var errm={type:err.__proto__.constructor.name,message:err.message,stack:err.stack}; 
		if(ret_id) FF.execute(ret_id,{error:errm,id:ret_id},_this);
		 else inner_port.postMessage({error:errm,ret_id:o.send_id});	  
	  }
  }
   //if(port) port.onmessage=onmessage;
   if(inner_port) inner_port.onmessage=onmessage
   
// ____ connector    
   
   
   
   
function load_external_data(LPCdata)
{
if(LPC.isDOM()&&self.__shared_port_connector__&&__shared_port_connector__.port_connections(LPCdata))
{
    //if((parent!=self)&&parent.LPC) return;
   var p=__shared_port_connector__(), ports;
   if(p.external&&(ports=p.external.ports))
{   
    var fu=p.ff.create();
	p.worker.port.postMessage({cmd:'get',ports:p.external.ports[0].id,id:fu.id()})
	
	return fu(function(d){
	  if(d.error) throw Error(JSON.stringify(d.error))                     
	    if(d.__ports__&&d.__ports__.length)
		  self.__LPC__=new LPC({port:d.__ports__[0]}); 
	
	})
  /* p.worker.port.onmessage=function(e)
   {
     if(e.ports.length) self.__LPC__=new LPC({port:e.ports[0]}) 
   }
   //var ids=ports.map(function(v,i){ return v.id })
   
   //p.worker.port.postMessage({cmd:'get',ports:ports[0].ids})
   p.worker.port.postMessage({cmd:'get',ports:p.external.ports[0].id})
   */
}   
 
}
}



function shared_worker_data_startup()
{
 
  var main_function=arguments.callee;
  function get_url_params()
  {
    var o={},s=location.search.substring(1);
    s.split(/\&|\;/).forEach(function(v){ var i=v.indexOf('=');o[unescape(v.substring(0,i))]=unescape(v.substring(i+1))})
	return o;
  }

if (self.constructor.name=='SharedWorkerContext') 
{

 self.count = 0;
 self.port_list={};
  
self.onconnect = function(e) {
  count += 1;
  var port = e.ports[0];
  var f=(self.importScripts)?'self.importScripts:yes':'self.importScripts:no';
  
  port.onmessage = function(e) {
     var cmd;

 try{
	 
     var data=e.data,ports=e.ports;    
	 if(!data) return;
      cmd=data.cmd;
	  var idt=data.id;
	  
	 if(cmd=='info')
	 {
	   var l=[],k;
	     for(k in self.port_list)	   if (self.port_list.hasOwnProperty(k))
		 //l.push(JSON.stringify(self.port_list[k]));	   
		 l.push(self.port_list[k].attributes);	   
		
		port.postMessage({result:{reply:cmd,ports:l,count:count},id:idt});
	   return;
	 
	 
	 }
   
      var pp=data.ports;
	  	  if(!(pp instanceof Array)) pp=[pp];
		  
    if(data.cmd=='set')
	{
	
	  if (ports.length!=pp.length) throw new Error('ports.length!=pp.length')
	  
	           var l=[];
	  	      { pp.forEach(function(d,i){self.port_list[d.id]={port:ports[i],attributes:d }; l.push(d.id) });}
	  
			  port.postMessage({result:{reply:cmd,ports:l,count:count},id:idt});
		  return
    } 		  
	   if(data.cmd=='get')
	  {
//	    var ids=data.ids;
//		if(!(ids instanceof Array)) ids=[ids];
	   var rp=[],f,attributes=[];
	   
	    f=pp.some(function(id){ var p=self.port_list[id]; if(!(p&&p.port)) return true; attributes.push(p.attributes); rp.push(p.port) }); 
		
		if(f) port.postMessage({error:{reply:cmd,message:'id='+rp.length+'not found'},id:idt});
		 else {
		      port.postMessage({result:{reply:cmd,ports:attributes,count:count},id:idt},rp)
			  pp.forEach(function(id){ delete self.port_list[id] })
		 };
		 return
	  }
			  
	} catch(err){
	   var errm={type:err.__proto__.constructor.name,message:err.message,stack:err.stack};
	   port.postMessage({error:{reply:cmd,message:mserrm},id:idt});
	}
	
	//port.postMessage('aaaaaaaa');
  }
  }
}  
else{
       var port_connector,__LPC__;
	   
	   function port_connections(params)
	   {
	     if(params) 
		 try{ return __LPC__= JSON.parse(atob(params))}catch(e){};
	     if(!__LPC__)
		 {
		   
	   		var  pp=get_url_params();
		  if(pp.__LPC__)
		  {
		     
		     try{
			   __LPC__= JSON.parse(atob(pp.__LPC__));
			   
			 }
			 catch(err){}
		   
		  }
		  }

	      return __LPC__;
	   }

	   
	   
    function set_url_params(url,o)
  {
    if(o) 
	{
	var s='',k;
	for(k in o) 
	 if(o.hasOwnProperty(k))
	   {

		 s+=k+'='+btoa(JSON.stringify(o[k]))+';'
    	 }
	         
	  return url+'?'+s;
	}	 
        return url;
  }
  

	   function extend_urls_ports(url,port_ids,ports)
	   {
	     if(!(ports instanceof Array)) ports=[ports];
	     if(!(port_ids instanceof Array)) port_ids=[port_ids];
		 if(ports.length!=port_ids.length) throw 'Error: ports.length!=port_ids.length';
		 this.worker.port.postMessage({cmd:'set',ports:port_ids},ports);
		 if(typeof(url)!='string') return btoa(JSON.stringify({ports:port_ids,url:this.url})) 
		  url=set_url_params(url,{__LPC__:{ports:port_ids,url:this.url}})
	      return url; 	 		 
	   }
	   
   	   function extend_urls_ports2(url,port_ids,ports)
	   {
	       var _t=this;
	     if(!(ports instanceof Array)) ports=[ports];
	     if(!(port_ids instanceof Array)) port_ids=[port_ids];
		 if(ports.length!=port_ids.length) throw 'Error: ports.length!=port_ids.length';
		 
		  var fun0=_t.ff.create();
		  function _post_sw(){
		  _t.worker.port.postMessage({cmd:'set',ports:port_ids,id:fun0.id()},ports);
		  }
		  
		  //
		  setTimeout(_post_sw,10);
		  //_post_sw()
		  var funr=fun0.pipe(function(d)
		  {
		    var fp=_t.ff.create(),dnew={error:d.error};
			if(!d.error)
			{
			  var exurl;
		      if(typeof(url)!='string') exurl=btoa(JSON.stringify({ports:port_ids,url:_t.url})) 
		       else exurl=set_url_params(url,{__LPC__:{ports:port_ids,url:_t.url}})
			  dnew.result={export_url:exurl,url:url,oldresult:d.result};
			  
			  
		   }
   	          _t.ff.execute(fp,dnew);
			 return fp;		   
		  }
		  )
		 
		 return funr;		 
	   }

	   
	   
	   
	 self.__shared_port_connector__=function shared_port_connector()
	 {
	    var ff;
	    if((!port_connector)&&self.SharedWorker)
		{
        
          var s,bb,url,worker,pp,errw;
		  
		  
		   
		  if(!((pp=port_connections())&&(url=pp.url)))
		  {
		   //bb=new BlobBuilder();
           s='('+main_function.toString()+')()';           
           //bb.append(s);
           //url= URL.createObjectURL(bb.getBlob());
		   url= URL.createObjectURL(toBlob(s));
           
		   }
		   ff=new  LPC.FF(self);
		   worker=new SharedWorker(url);
           worker.onerror=function(){ throw Error('Error inSharedWorker('+url+')') }
           worker.port.onmessage=function(e)
		   {
		     var data=e.data;
			 if((data)&&(data.id))
			 {
			       data.__ports__=e.ports;
				   ff.execute(data.id,data);
			 }
		     
		   }
		   worker.port.start();

		   
		   port_connector={url:url,worker:worker,external:{ports:(pp)?pp.ports:undefined},extend_urls_ports:extend_urls_ports,
		   extend_urls_ports2:extend_urls_ports2};
		   port_connector.ff=ff;
		   
		   
		   
	   }
	   //
	     return port_connector
	   }
	   self.__shared_port_connector__.port_connections=port_connections;	    

}
}
//


_this.load_external_data=ts.load_external_data=load_external_data;   
_this.shared_worker_data_startup=ts.shared_worker_data_startup=shared_worker_data_startup;   
_this.iiframeurl=ts.iiframeurl=iiframeurl;
_this.iiframeurl=ts.iiframeurl=iiframeurl;
_this.iscript=ts.iscript=iscript;
_this.iurl=ts.iurl=iurl;
_this.marshal=marshal;
_this.marshal2=marshal2;


function marshal(url,attributes)
{
	var p=__shared_port_connector__();
	var hr=p.extend_urls_ports(url,{id:_this.uuid(),attributes:attributes},_this.$export())
	return hr;
}

function marshal2(url,attributes)
{
	var p=__shared_port_connector__();
	var port=$transit_port();
	//_this.external_port=undefined;
	var fu=p.extend_urls_ports2(url,{id:_this.uuid(),attributes:attributes},port)
	return fu;
}


function iurl(s)
{
	var b=toBlob(s,'text/html');
	var url=URL.createObjectURL(b);
	return url;
}

function iscript(externdata,addscript,fnourl)
{ 
       var _=unescape,
            doc_html5=_("%3C%21DOCTYPE%20HTML%3E%0A"),
	         tag_script_bra=_("%3Cscript%20%20type%3D%22text/javascript%22%3E%0A"),
			 tag_script_ket=_("%0A%3C/script%3E%0A"),    
             s="";
			 
	s+=doc_html5;
	s+=tag_script_bra;
	
	s+="window.__init_LPC__=";
    s+=top_level_callee.toString();
    if(externdata)
	{	 
	  s+=";\nwindow.externdata="+JSON.stringify(externdata)+";\n";
	  s+="function init_LPC_extern(mask){ __init_LPC__(externdata,mask); }";
	  
	}
	if(addscript)
		 s+=';\n'+addscript+';\n';
	
	s+=tag_script_ket;
	return (!fnourl)? iurl(s):s;
};   

function iiframeurl(extern_data,iframe_url,fi,fs)
{ 
   
    iframe_url=(iframe_url)?iframe_url:'about:blank';
	var s=(extern_data)?iscript(extern_data,false,true):"",_64=atob;
	
   s+=_64("PGlmcmFtZSBuYW1lPSJnaWZyYW1lIiBpZD0iZ2lmcmFtZSIgc3JjPSI=")
   s+=iframe_url;
   s+=_64("IiBzdHlsZT0icG9zaXRpb246YWJzb2x1dGU7IHRvcDowcHg7IGxlZnQ6MHB4OyB3aWR0aDoxMDAlOyBoZWlnaHQ6MTAwJTsgei1pbmRleDo5OTkiIG9ubG9hZD0iaW5pdF9MUENfZXh0ZXJuKHtpZnJhbWU6dGhpc30pIiBmcmFtZWJvcmRlcj0ibm8iPjwvaWZyYW1lPg==");

   
   return (!fs)? iurl(s):s;
};   



}
   
   
new LPC({install:true});



   

//lpc0=new LPC;hr=p.extend_urls_ports('mw.htm_hssh',{id:lpc0.uuid(),name:'ASAAS'},lpc0.$export())
//b=LPC.toBlob('<!DOCTYPE HTML>\n <html>\n HHHHHHHHHHHH </html>','text/html');hr=hh=URL.createObjectURL(b)

//self.testf=LPC.load_external_data;
if(!masks)
{
LPC.shared_worker_data_startup();
LPC.load_external_data(external_parameters);
//__shared_port_connector__()
}
else if(masks.iframe)
{
   var f=masks.iframe;
   window.onresize=function(e){  f.width=window.innerWidth;f.height=window.innerHeight }
  var c=f.contentWindow;
     var s
	//
	s='('+top_level_callee.toString()+')("'+external_parameters+'")';
	//	s='function LPCStart(){ ('+top_level_callee.toString()+')("'+external_parameters+'") }';
	//s='function LPCStart(){ ('+top_level_callee.toString()+')("'+external_parameters+'") }';
     c.eval(s);
}

}

)();
// bags
// l2=new LPC();LPC.main.lexec('var t=new LPC({worker:{},port:$0})',l2.external_port)
// l=new LPC;t=new LPC({window:{},port:l})