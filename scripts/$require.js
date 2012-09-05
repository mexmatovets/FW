(function(obj){

var require_path,require_root,curr_path,fxdr,require_stack=[];
require_path=require_root=curr_path=location.href;


function expand_url(link, host) {
 
   if(link==undefined) return ;
   
   host||(host=curr_path);
   
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


     function xdr_get(xdr_url)
	{
	    var xdr= new XMLHttpRequest();
	    xdr.open('GET',xdr_url,false);
		if(!self.document)
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

    function RequireError(message,e)
	{
	   var m=message;
	   this.toString=function(){ return m.toString()}; 
	   this.error=e;
	}
	

	var urls=line_array(arguments)
	

    function _require(xdr_url){
	 var st,save_path=curr_path,nstack;
	 try{
	   
	   fxdr=true;
	  try{
	  xdr_url=expand_url(xdr_url,curr_path)
	  require_stack.unshift(xdr_url);
	  nstack=1;
	  st=xdr_get(xdr_url)
	  }catch(e)
	  {
	    console&&console.error(e.message,e);
		return;
	  }
	  curr_path=xdr_url;
	  self.console&&console.warn('$requere loaded:"'+xdr_url+'"')
	  try{
	  eval.call(self,st);
	  } catch(e)
	   { 
	     throw new RequireError(xdr_url+': '+e.message,e)
	   }
	   
	  }
	  finally
	  {
	    nstack&&require_stack.shift();
	    fxdr=false;
	    curr_path=save_path;
	  }
	}
	
	  function load_script(src) {
	      
		    if(self.importScripts)
			{
			 importScripts(src);
			}
			else
			{
            var script = document.createElement("script");
            script.setAttribute("src", src);
            document.getElementsByTagName("head")[0].appendChild(script);
			}
        }
	
	    function _require2(xdr_url){
	 var st,save_path=curr_path,nstack;
	 try{
	   
	   fxdr=true;

	  xdr_url=expand_url(xdr_url,curr_path)
	  require_stack.unshift(xdr_url);
	  nstack=1;
	  //st=xdr_get(xdr_url)
	  curr_path=xdr_url;
	  load_script(xdr_url)
	  
	  self.console&&console.warn('$requere loaded:"'+xdr_url+'"')
	   
	  }
	  finally
	  { 
	    if(nstack)
		{
		  var s=require_stack.shift();
		  self.console&&console.warn('pop:',s)
		}
	    fxdr=false;
	    curr_path=save_path;
	  }
	}

	
	//(self.importScripts)? urls.forEach(_require):urls.forEach(_require2);
	//urls.forEach(_require)
	//
	urls.forEach(_require2)
	return $require;
  }


  
function get_script_path()
{
 var path;
  
 if((!(path=require_stack[0]))&&self.document){
 var scripts = document.getElementsByTagName('script');
 var thisScript = scripts[scripts.length-1];
 path=thisScript.src.replace(/\/script\.js$/, '/'); 
 }
 return path;
}
{
 
  var p;
  if(p=get_script_path())
  {
   curr_path=require_path =p ;
   $require.location=curr_path;
  }
 }

 
 function root(l)
 { 
   if((typeof(l)=='object')&&l)
   {
    if(typeof(l.href)=='string') l=l.href; 
    if(typeof(l.location)=='object') l=l.location.href; 
   }
   curr_path=(l)?l:require_path
   return $require;
 }
 
 $require.root=root;
 $require.expand_url=expand_url;
 $require.cd=function(){return expand_url('.',curr_path)}
 $require.toString=function(){return '$require(){  ... DICH ...} '}
 $require.stack=function(){return  require_stack};
 $require.xdr_get=xdr_get;
 $require.script_path=get_script_path;
 
obj.$require=$require;

})(self)