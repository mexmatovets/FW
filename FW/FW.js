
var rs=$require.script_path();

$require(
	'../FW/las_reader.js',
    '../FW/textParser.js',
    '../FW/other_func.js',
    '../FW/main.js',
    '../FW/interp.js',
	'../numerical/LT.js',
    '../scripts/formater.js',
    '../numerical/dsp.js',
    '../numerical/utils_1D.js',
    '../numerical/Complex.js',
    '../scripts/meshutils.js',
    '../scripts/flot.js',
	'../scripts/jsutils.js'
	);

self.LPC||($require('../lib/scripts/LPC.js'));

self.console&&console.log(rs)

//////////////////////////////////////////////////////////////////////////////
// my workers functions
function initLPC(log_callback)
{
    var lpc, log;
    (log=new LPC()).onmessage=log_callback;
    lpc=new LPC({worker:1})
    lpc.$imports_to($require.location);
    lpc.exec('$require.root($0)($1);log=$2;log.send({mu:"worker loaded"})',$require.location,rs,log);
    return lpc;
}
function readLogsNames(somefile)
{
    if(LPC.is_worker())
    {
        if(somefile.url.match('.las')||somefile.url.match('.LAS')){
            if(self.txtfile) delete (self.txtfile);
            var lasfile = somefile;
            self.tic=LPC.Tic();
            self.log.send({mu:"reading logs names"});
            self.LAS=new DataObject(lasfile,{nodata:1}).las;
            self.log.send({mc:["reading logs names is OK!",self.tic.sec()]});
            self.lasfile = lasfile;
            self.LAS_logs=self.LAS.curve_names;
            return  {logs:self.LAS_logs, newfile: self.newfile}
        }
        if(somefile.url.match('.txt')){
            if(self.lasfile) delete (self.lasfile);
            self.txtfile = somefile;
            self.tic=LPC.Tic();
            self.log.send({mu:"reading logs names"});
            var res=parseText(self.txtfile,{nodata:1});
            self.objFromTXT=res;
            var arr=[]; self.LAS_logs = [];
            for (tmp in res.fileObj.columns) if (res.fileObj.columns.hasOwnProperty(tmp)) arr.push(tmp);
            for (var j = 0; j < arr.length; j++){
                for (var  i = 1; i < res.firstStr.length; i++){
                    self.LAS_logs.push(arr[j]+'.'+res.firstStr[i]);
                }
            }
            self.log.send({mc:["reading logs names is OK!",self.tic.sec()]});
            return  {logs:self.LAS_logs, newfile: res.newfile}
        }
    }
    else return lpc.callf('readLogsNames',somefile);
}

function fft(buffer,ftyped)
		{
		   var _=(ftyped)? function (f){ return new Float32Array(f);}
		   : function (f){ var r=new Array(f.length); for(var n=0;n<f.length;n++){ r[n]=f[n]} ; return r;}
		   var l=buffer.length;
		   ((self.__dft__)&&(self.__dft__.real.length==l))||(self.__dft__=new DFT(l));
		   var dft=self.__dft__;
		   dft.forward(buffer)
		   return {real:_(dft.real),imag:_(dft.imag),spectrum:_(dft.spectrum)};
		}

function dbg(){ debugger}
