//
(function(obj)
{

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
	
function to_array(arg)
 {   
   if(typeof(arg)=='string') return [arg];
   if(arg==undefined) return [];
   if(arg&&(arg.length==1)) return [arg[0]];
   else return Array.apply(null, arg); 
 }

obj.jsutils={
 for_each:for_each
,extend_object:extend_object
,add_object_tree:add_object_tree
,to_array:to_array
}
}
)(self)