//====
function openflot(opts)
{
 self.LPC||$require('../scripts/LPC.js');
 self.jsutils|| $require('../scripts/jsutils.js');
 var lpc=LPC({window:{url:LPC.expand_url('../Plotters/flotter.hssh_htm',LPC.main_location),params:opts}})
    lpc.$closer(function(){lpc.childwin.close()});
	if(LPC.isDOM())
	{
	  self.addEventListener('beforeunload',function(){ lpc.terminate(); })
	}
	//lpc.childwin.document.title='Flotter'
 function plot()
  {  try{
     lpc.exec('$.blockUI()');	  
     var a=jsutils.to_array(arguments);
        a.unshift('plot');
	  
      lpc.execf.apply(lpc,a);
	  
	  return plot;
	  }
	  finally
	  {
	  lpc.exec('$.unblockUI()');	
	  }
  } 
  plot.toString=function(){return 'function plot(data,options){... LPC call...}'};
  plot.close=function(){ lpc.terminate();}
  plot.lpc=lpc;
  return plot;
}
function make_pair(a,offs)
{
  offs||(offs=0)
  var an=[],N=a.length;
  if(offs instanceof Array)
  {
     var tl=offs[0],tr=offs[1]
	 ,h=(tr-tl)/N;
	 for(var n=0;n<N;n++) an.push([tl+n*h,a[n]])
  }
  else  for(var n=0;n<N;n++) an.push([n+offs,a[n]])
  return an;
}
//LPC.is_worker()&&($require.root(LPC.main_location))

