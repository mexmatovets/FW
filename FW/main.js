myGlobalVariables=function (){
	this.graphArrays={};
	this.idGraphs={};
	this.count=0;
	var closuredData=this;
	this.appendGraphArray=function(name, array){
		closuredData.graphArrays[name]=array;
	}
	/*/this.showGraph=function(name, area, color){
		var tempShowedObjects=[];

			for (var i = 0; i < name.length; i++){
				tempShowedObjects[i]={
					data: myGlob.graphArrays[name[i]],
					label: name[i],
					color:color[i]
				}				
			}

        //$.plot($(area), tempShowedObjects);
		var tmp = openflot();
		tmp(tempShowedObjects);
	}/*/
	this.showGraph=function(idGraph){
		var tmp = openflot();
		tmp(closuredData.idGraphs[idGraph],{series:{lines:{ show: true }},crosshair: { mode: "x" },grid: { hoverable: true, autoHighlight: false }});//[{data:..,color:..,label:..}..]
	}
	this.appendIdGraph=function(idGraph, obj){
		closuredData.idGraphs[idGraph]=obj;
	}
}
myGlob=new myGlobalVariables();

function readFile(f)
{
	$.blockUI({ message: '<img src="../scripts/images/wait27.gif" /> '+ 'processing' })
	$('#progressbar').progressbar('setValue', 20);
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            var slas=e.target.result;
            //var o={};o.fileAsText = slas; parseText(o);
            readFileInWorker(slas);
			$('#progressbar').progressbar('setValue', 50);
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function logSelectForm(logNames,id)
{
    var newfile =  logNames.newfile;
    logNames = logNames.logs;
    id|(id='#logselectform')

    var f=$(id)[0],sels=f.getElementsByTagName('select');

    for(var i=0;i<sels.length;i++)
    {
        var ss=sels[i];
        $(ss).empty();
        var curr = '??';
        try {if (newfile) throw ''; curr = logNames[self.opt.corresponding[i]]} catch(e){};
        $(ss).append($('<option disabled selected >'+curr+'</option>'));

        for(var j=0;j<logNames.length;j++)
        {
            var t='<option value='+j+'>'+logNames[j]+'</option>';
            $(ss).append($(t))
        }
    }
    $.blockUI({message: $(id), css : { border : 'none', height: 'auto', 'cursor': 'auto', 'top': 20, 'left' : 20   } }) ;
}
function continueProcessing(){
    try{
		$('#progressbar').progressbar('setValue', 20);
        $.unblockUI();
		newcontinueProcessingInWorker()({
            done:function(r){
				print_results(r)
                plot_data(r);
				$('#progressbar').progressbar('setValue', 100);
            },
            fail:function(e){
                $.unblockUI();
                console.error(self.e=e);
                alert(e.message);
                lpc.terminate();
                delete(self.lpc);
				$('#progressbar').progressbar('setValue', 0);
            }
        });
        /*/continueProcessingInWorker()({
            done:function(r){
                plot_data(r);
            },
            fail:function(e){
                $.unblockUI();
                console.error(self.e=e);
                alert(e.message);
                lpc.terminate();
                delete(self.lpc);
            }
        });/*/
        return lpc;
    }
    catch(e){       alert('invalid LAS data ...!!! '+e); $.unblockUI(); }
}
function getOpts(){
		inputDataToWorker={};
		var rows=$('#cartcontent').datagrid('getData');//checkRows(rows);
		inputDataToWorker.rows=rows;
		var consts={};consts.h=$('#h')[0].value-0;consts.mu=$('#mu')[0].value-0;//checkConsts(consts);
		consts.poro=$('#poro')[0].value-0;
		consts.B_c=$('#Bc')[0].value-0;
		consts.B_gi=$('#Bj')[0].value-0;
		inputDataToWorker.period=$('#period')[0].value-0; 
		inputDataToWorker.consts=consts;
		try{
			inputDataToWorker.stepSearch=($('#stepSearch')[0].value-0)*1e-4;
			inputDataToWorker.topBnd=    ($('#topBnd')[0].    value-0)*1e-4;
		}catch(e){throw "Error in input data parse"}
		return inputDataToWorker;
}
function Solver(toSend){	
	//self.log.send({obj:toSend});
	try{//start_LT_solver
		self.tic=LPC.Tic();
		var kappa=start_LT_solver_v2(toSend);
		self.log.send({mc:["LT_solver is OK!", self.tic.sec().toFixed(2)]});
		self.log.send({mc:["Piesoconductivity [cm^2/sec]", (kappa*1e+4).toFixed(2)]});
	}catch (e) {
		self.log.send({unlock:1});self.log.send({alert:e});
	}

	//if (self.lasfile){self.las=newSelecting({corresponding:[4,5,0,1,2,3]});}	
	//if (self.txtfile){self.las=newSelecting({corresponding:[476,477,332,335,476,479]});}
	////не забывать, что у нагнетательной скважины R=0;
	//var rate=reduse_curve(self.las.curves[0],512,512).cn;self.log.send({aa:["rate", rate]});
	//var pInj=reduse_curve(self.las.curves[1],512,512).cn;self.log.send({aa:["pInj", pInj]});
	//var pObs=reduse_curve(self.las.curves[2],512,512).cn;self.log.send({aa:["pObs", pObs]});	
	return kappa;
};
function appendCurve(name,x,y){
	var pairs=[];
	//if (isNaN(x[0])||isNaN(y[0]) throw "Can't add NaN!";
	for (var i = 0; i<x.length; i++){pairs[i]=[x[i],y[i]]};
	var curve=reduse_curve(pairs,512,512).cn;self.log.send({aa:[name, curve]});
}
function newcontinueProcessingInWorker(opts){
    if(LPC.is_worker()){
		try{
			if (self.lasfile){									self.tic=LPC.Tic();		
				check_table(opts);								self.log.send({mu:"data reading"});self.log.send({mc:["table checked", self.tic.sec().toFixed(2)]});self.tic=LPC.Tic();self.log.send({mp:30});
				self.LAS=new DataObject(lasfile).las;			self.log.send({mc:["data reading is OK!", self.tic.sec().toFixed(2)]});self.log.send({mu:"data preparing"}); self.tic=LPC.Tic();	
				var toSend=buildInputObjToSolver(opts);			self.log.send({mc:["data preparing is OK!", self.tic.sec().toFixed(2)]});self.log.send({mu:"solver started"});self.tic=LPC.Tic();self.log.send({mp:70});
				var kappa = Solver(toSend);						self.log.send({mc:["solver finished successfully!", self.tic.sec().toFixed(2)]});self.log.send({unlock:1});	
				return find_other_values(kappa,opts);		    // kappa[m^2/sec]
			}
			if (self.txtfile){									self.tic=LPC.Tic();	
				check_table(opts);								self.log.send({mu:"data reading"});self.log.send({mc:["table checked", self.tic.sec().toFixed(2)]});self.tic=LPC.Tic();self.log.send({mp:30});
				self.LAS=textReader();							self.log.send({mc:["data reading is OK!", self.tic.sec().toFixed(2)]});self.log.send({mu:"data preparing"}); self.tic=LPC.Tic();	
				var toSend=buildInputObjToSolver(opts);			self.log.send({mc:["data preparing is OK!", self.tic.sec().toFixed(2)]});self.log.send({mu:"solver started"});self.tic=LPC.Tic();self.log.send({mp:70});
				var kappa = Solver(toSend);						self.log.send({mc:["solver finished successfully!", self.tic.sec().toFixed(2)]});self.log.send({unlock:1});	
				return find_other_values(kappa,opts);		    // kappa[m^2/sec]			
			}
		}catch (e) {
			self.log.send({unlock:1});self.log.send({alert:e});
			return {};
		}
    }
    else
        return lpc.callf('newcontinueProcessingInWorker',getOpts());
}
function find_other_values(kappa,opts){//input kappa [m^2/sec]
	var all_values={};
	all_values.kappa=kappa; //[m^2/sec]
	var AtmByPa= 101325;
	var Darcy=9.87e-13;
	var B_zv=opts.consts.poro*(opts.consts.B_gi/AtmByPa)+(opts.consts.B_c/AtmByPa); //[1/РџР°]
	//kappa*opts.consts.mu [mPa/sec]
	all_values.perm=kappa*opts.consts.mu*1e-3*B_zv;// [m^2/sec]*[(mPa*1e_3)*sec]*[1/Pa]=[m^2]
	all_values.perm/=Darcy*1e-3; //[mDa]
	all_values.hydr=kappa*B_zv*opts.consts.h; //[m^2/sec]*[1/Pa]*m=[m^3/Pa*sec]
	return all_values;
}
function print_results(all_values){
	$('#kappa')[0]. value=(all_values.kappa*1e+4).toExponential(3);//[cm^2/sec]
	$('#kappa2')[0].value=(all_values.kappa*1e+4).toExponential(3);
	$('#hyd')[0].   value=(all_values.hydr).toExponential(3);
	$('#hyd2')[0].  value=(all_values.hydr).toExponential(3);
	$('#perm')[0].  value=(all_values.perm).toExponential(3);
	$('#perm2')[0]. value=(all_values.perm).toExponential(3);
}
/*function continueProcessingInWorker(opts){
    if(LPC.is_worker()){
        if (self.lasfile){
            self.log.send({mu:"data reading"});                          self.tic=LPC.Tic();
			
            self.LAS=new DataObject(lasfile).las;
			
            self.log.send({mc:["data reading is OK!", self.tic.sec()]});
            self.log.send({mu:"data preparing"});                        self.tic=LPC.Tic();
			
            self.las=newSelecting(opts);
			
            self.log.send({mc:["selecting done!", self.tic.sec()]});     self.tic=LPC.Tic();
			
            var res = newPrepare_data_for_plotting(self.las,opts);
			
            self.log.send({mc:["Phase is calculated"]});
			
            res.s = findValues(res.phase, opts);
			
            self.log.send({mc:["data preparing is OK!", self.tic.sec()]});
            self.log.send({mu:'data plotting'});
			self.log.send({unlock:1});
			res={};
            return  res;
        }
        if (self.txtfile){
            self.log.send({mu:"data reading"});                          self.tic=LPC.Tic();
            //self.LAS=new DataObject(lasfile).las;
            self.log.send({mc:["data reading is OK!", self.tic.sec()]});
            self.log.send({mu:"data preparing"});                        self.tic=LPC.Tic();
            self.las=selecting(opts);
            self.log.send({mc:["selecting done!", self.tic.sec()]});       self.tic=LPC.Tic();
            var res = newPrepare_data_for_plotting(self.las,opts);
            self.log.send({mc:["Phase is calculated"]});
            res.s = findValues(res.phase, opts);
            self.log.send({mc:["data preparing is OK!", self.tic.sec()]});
            self.log.send({mu:'data plotting'});
            return  res;
        }
    }
    else
        return lpc.callf('continueProcessingInWorker',loadPales());
}
*/
function check_table(opts){
	if (opts.rows.rows.length<4) throw "You should append more rows to table. Use drag&drop method for instance.";
	if (opts.rows.rows.length%2) throw "Expected an even number of curves";
	//self.log.send({obj:opts});
	
	function find_pid(name, rows){
		var pair=[];
		for (var i = 0; i < rows.length; i++){
			if(rows[i].wellName===name) {
				if (!rows[i].productid) throw "Please set all curve types";
				pair.push(rows[i].productid);
			}
		}
		return pair;
	}	
	function check_presence(o,name){//если не хватает пары||или больше одного раза встречается один и тот же тип у одной скважины
		for(var i = 0; i < o.length; i++){
			switch (o[i]){
				case "Pressure time"  :{var netu=1, count=0; for(var j = 0; j < o.length; j++){ if(o[j]==="Pressure value"){ netu=0;count++;}} if (netu) throw name+" must have Pressure value type"; if (count>1) throw name+" must have only one Pressure value type"; break;}
				case "Pressure value" :{var netu=1, count=0; for(var j = 0; j < o.length; j++){ if(o[j]==="Pressure time" ){ netu=0;count++;}} if (netu) throw name+" must have Pressure time type" ; if (count>1) throw name+" must have only one Pressure time type" ; break;}
				case "Rate time"      :{var netu=1, count=0; for(var j = 0; j < o.length; j++){ if(o[j]==="Rate value"    ){ netu=0;count++;}} if (netu) throw name+" must have Rate value type"    ; if (count>1) throw name+" must have only one Rate value type"    ; break;}
				case "Rate value"     :{var netu=1, count=0; for(var j = 0; j < o.length; j++){ if(o[j]==="Rate time"     ){ netu=0;count++;}} if (netu) throw name+" must have Rate time type"     ; if (count>1) throw name+" must have only one Rate time type"     ; break;}
			}
		}
	}
	
	var hjh={}; 
	for (var i = 0; i < opts.rows.rows.length; i++){
		hjh[opts.rows.rows[i].wellName]=find_pid(opts.rows.rows[i].wellName, opts.rows.rows);
	}
	var Wcount = 0;
	for (var tmp in hjh) if (hjh.hasOwnProperty(tmp)) {check_presence(hjh[tmp],tmp); Wcount++;}
	if (Wcount<2) throw "Please set more then one well name"
	
	//обязательно одинаковое число х и у курв
	//обязательно наличие одной(!) курвы рейтов (х и у)
	//обязательно наличие хотябы одной курвы давлений на обсервере (выполняется автоматически за счет условия 1)
}
function buildInputObjToSolver(opts){ 
											function vspom_fun(s1,s2){
												var ind=-1;
												for (var i =0; i< Math.min(s1.length, s2.length); i++){
													if (s1[i]===s2[i])        ind=i;
													else break;
												}
												return ind;
											}
	var toSend=[]; var opt={};
	//self.log.send({obj:{opts:opts,curve_names:self.LAS.curve_names}});
	for (var i = 0; i < opts.rows.rows.length; i++){
		var ind=-1;for (var ii=0; ii< self.LAS.curve_names.length;ii++){
			//if(Math.abs(Math.min(opts.rows.rows[i].logName.substr(0,self.LAS.curve_names[ii].length-1).length,self.LAS.curve_names[ii].substr(0,self.LAS.curve_names[ii].length-1).length)-vspom_fun(opts.rows.rows[i].logName.substr(0,self.LAS.curve_names[ii].length-1),self.LAS.curve_names[ii].substr(0,self.LAS.curve_names[ii].length-1)))<=1){
			//	ind=ii;break;
			//}
			if (self.LAS.curve_names[ii].substr(0,self.LAS.curve_names[ii].length-1)===opts.rows.rows[i].logName.substr(0,self.LAS.curve_names[ii].length-1)) {
				ind=ii;break;
			} 
		}  
		if(ind===-1) throw "Sorry, names conflict"; var data=self.LAS.curves[ind];
		var unv=[];var tmp = opts.rows.rows[i].unvalids.match(/((-|)\d*\.*\d+)(\t*|\s*|\n)/g) ;if (tmp&&tmp.length>1)  for (var ii = 0; ii < tmp.length/2 ;ii++){ unv.push({x0:tmp[2*ii]-0,x1:tmp[2*ii+1]-0  });   }
		toSend[i]={//"[{"data":[[0,1]],"R":0.1,"unvalids":[],"logname":"inj rate","datatype":"injection rate","wellname":"wellname-1"},{"data":[[0,1]],"R":496,"unvalids":[],"logname":"obs press","datatype":"observer press","wellname":"wellname-2"}]"
			data:data,
			dataType:opts.rows.rows[i].productid,
			unvalids:unv,
			logName:opts.rows.rows[i].logName,
			R:opts.rows.rows[i].radius,
			wellName:opts.rows.rows[i].wellName
		}
	}
	opt.stepSearch=opts.stepSearch;
	opt.topBnd=    opts.topBnd;//($(topBnd)[0].    value-0)*1e-4;
	return {obj:toSend,opt:opt};	
}
function makeCancel(){
    if (self.opt&&self.opt.corresponding) delete(self.opt.corresponding);
    $.unblockUI();
}
function selecting(opts){
    if (self.lasfile){
        las=LAS;
    }
    if (self.txtfile){
        var obj=[];   var arr = [];
        var res = self.objFromTXT;
        for (tmp in res.fileObj.columns) if (res.fileObj.columns.hasOwnProperty(tmp)) arr.push(tmp);
        for (var j = 0; j < arr.length; j++){
            for (var  i = 1; i < res.firstStr.length; i++){
                obj.push(res.fileObj.columns[arr[j]][res.firstStr[i]]);
                //self.LAS_logs.push(arr[j]+'.'+res.firstStr[i]);
            }
        }
        las={curves:obj,curve_names:self.LAS_logs};
    }
    var las_obj={};
    las_obj.curves={};
    var wd1,wd2,wd3,wd4,wd5,wd6;
    if (opts&&opts.corresponding){
        wd1 = opts.corresponding[0];
        wd2 = opts.corresponding[1];
        wd3 = opts.corresponding[2];
        wd4 = opts.corresponding[3];
        wd5 = opts.corresponding[4];
        wd6 = opts.corresponding[5];
    }

    var wi;
    try{
        wi = las.curve_names[wd1].split(/\b/g)[0];
        if (!las_obj.curves[wi]) las_obj.curves[wi] = {};if (!las_obj.curves[wi]['rate']) las_obj.curves[wi]['rate'] = {};if (!las_obj.curves[wi]['rate']['time']) las_obj.curves[wi]['rate']['time'] = [];
        las_obj.curves[wi]['rate']['time'] = las.curves[wd1];

        wi = las.curve_names[wd2].split(/\b/g)[0];
        if (!las_obj.curves[wi]['rate']['value']) las_obj.curves[wi]['rate']['value'] = [];
        las_obj.curves[wi]['rate']['value'] = las.curves[wd2];

        wi = las.curve_names[wd3].split(/\b/g)[0];
        if (!las_obj.curves[wi]) las_obj.curves[wi] = {};if (!las_obj.curves[wi]['pressure']) las_obj.curves[wi]['pressure'] = {};if (!las_obj.curves[wi]['pressure']['time']) las_obj.curves[wi]['pressure']['time'] = [];
        las_obj.curves[wi]['pressure']['time'] = las.curves[wd3];

        wi = las.curve_names[wd4].split(/\b/g)[0];
        if (!las_obj.curves[wi]['pressure']['value']) las_obj.curves[wi]['pressure']['value'] = [];
        las_obj.curves[wi]['pressure']['value'] = las.curves[wd4];

        wi = las.curve_names[wd5].split(/\b/g)[0];
        if (!las_obj.curves[wi]) las_obj.curves[wi] = {};if (!las_obj.curves[wi]['pressure']) las_obj.curves[wi]['pressure'] = {};if (!las_obj.curves[wi]['pressure']['time']) las_obj.curves[wi]['pressure']['time'] = [];
        las_obj.curves[wi]['pressure']['time'] = las.curves[wd5];

        wi = las.curve_names[wd6].split(/\b/g)[0];
        if (!las_obj.curves[wi]['pressure']['value']) las_obj.curves[wi]['pressure']['value'] = [];
        las_obj.curves[wi]['pressure']['value'] = las.curves[wd6];

        var well;
        for (well in las_obj.curves){
            var dataType;
            var count = 0;
            for (dataType in las_obj.curves[well]){
                if (dataType.match('pressure')||dataType.match('rate')){
                    if (count!==0) las_obj.curves[well].wellType = 'injector'; else  las_obj.curves[well].wellType = 'observer';
                    count++;
                }
            }
        }
    }     catch(e){
        //$.unblockUI();
        e.str="bad curves names";
        throw e;
    };
    return las_obj;
}
function newSelecting(opts){
    if (self.lasfile){
        las=LAS;
    }
    if (self.txtfile){
        var obj=[];   var arr = [];
        var res = self.objFromTXT;
        for (tmp in res.fileObj.columns) if (res.fileObj.columns.hasOwnProperty(tmp)) arr.push(tmp);
        for (var j = 0; j < arr.length; j++){
            for (var  i = 1; i < res.firstStr.length; i++){
                obj.push(res.fileObj.columns[arr[j]][res.firstStr[i]]);
            }
        }
        las={curves:obj,curve_names:self.LAS_logs};
    }
    var las_obj={};
    las_obj.curves={};

    try
    {
        las_obj.curves=[[],[],[]];
        for (var i=0; i<3;i++){
            for (var j=0; j<las.curves[opts.corresponding[0]].length;j++){
                las_obj.curves[i].push([las.curves[opts.corresponding[2*i]][j],las.curves[opts.corresponding[2*i+1]][j]]);
            }
        }
    }     catch(e){
        e.str="bad curves data";
        throw e;
    };
    return las_obj;
}
function newPrepare_data_for_plotting(las,opts){
    var NCorr = 1024, NF = 2048, fcorrN = 1, alpha = 1;
    var Tmax = -5; self.las.curves[0].forEach(function findMax(value) {if (!isNaN(value[0])) Tmax = Math.max(value[0],Tmax);});
	
    var WinFun=new WindowFunction(DSP.BARTLETTHANN,alpha);
    var graphs = [];

	var rate=reduse_curve(self.las.curves[0],512,512).cn;
	var pInj=reduse_curve(self.las.curves[0],512,512).cn;
	var pObs=reduse_curve(self.las.curves[0],512,512).cn;
	//var d0 = [];for (var i = 0; i < 14; i += 0.02) d0.push([i, Math.sin(i)]);
	//var d1 = [];for (var i = 0; i < 14; i += 0.02) d1.push([i, Math.cos(i)]);
	//var d2 = [];for (var i = 0; i < 14; i += 0.02) d2.push([i, Math.sin(i)*Math.cos(i)]);
	
	self.log.send({aa:["rate", rate]});
	self.log.send({aa:["pInj", pInj]});
	self.log.send({aa:["pObs", pObs]});	
	
/*    var rate=utils_1D.l1_interpolate(self.las.curves[0]).make_array(NCorr).zero_shift();
    var pInj=utils_1D.l1_interpolate(self.las.curves[1]).make_array(NCorr).zero_shift();
    var pObs=utils_1D.l1_interpolate(self.las.curves[2]).make_array(NCorr).zero_shift();
	
	self.log.send({aa:["rate", rate]});
	self.log.send({aa:["pInj", pInj]});
	self.log.send({aa:["pObs", pObs]});
	
    var crr =utils_1D.make_graph({mode:0,from:-NCorr,to:NCorr,y:utils_1D.correlaton_n(rate,rate,fcorrN) });
    var cp12=utils_1D.make_graph({mode:0,from:-NCorr,to:NCorr,y:utils_1D.correlaton_n(pInj,pObs,fcorrN)});
    var cpq =utils_1D.make_graph({mode:0,from:-NCorr,to:NCorr,y:utils_1D.correlaton_n(pObs,rate,fcorrN)});

    crr=utils_1D.ZeroShift(crr);
    cp12=utils_1D.ZeroShift(cp12);
    cpq=utils_1D.ZeroShift(cpq);

    var cp12w=WinFun.process(cp12);
    var cpqw=WinFun.process(cpq);
    var crrw=WinFun.process(crr);

    var fft=new FFT(NF);
    fft.forward(crrw);
    var fcrr=fft.spectrum;

    var scrr=utils_1D.make_graph({mode:0,from:-NCorr,to:NCorr,y:utils_1D.correlaton_n(rate,rate,fcorrN)});
    var scrrw=WinFun.process(scrr);
    fft=new FFT(NCorr*2);
    fft.forward(scrrw);
    var sfcrr=fft.spectrum;

    var mmf=utils_1D.minmax_indexes(sfcrr);
    var mode1=mmf.indexes[1];
    var T2=2*Tmax;
    var Tp=T2/mode1;

    log.send({mc:['mode1=',mode1,'Tp=',Tp]});
    fft=new FFT(NF);
    fft.forward(cp12w);
    var fcp12=fft.spectrum;
    var fft2=fft;
    var cw12=Complex(fft.real[mode1],fft.imag[mode1]);

    fft=new FFT(NF);
    fft.forward(cpqw);
    var fcpq=fft.spectrum;

    opts.period=Tp;
    opts.QlPInj   =sfcrr[mode1]/fcpq[mode1];    // ?????????????????????
    opts.PObslPInj=fcp12[mode1]/fcpq[mode1];    // ?????????????????????
	
	
	graphs.push(self.las.curves[0]);
	graphs.push(self.las.curves[1]);
	graphs.push(self.las.curves[2]);
    var d1 = [];
    for (var i = 0; i < 14; i += 0.1)
        d1.push([i, Math.cos(i)]);
	graphs.push(d1);
	
    return {phase:cw12.phase(), graphs:graphs};*/
	return {phase:0, graphs:graphs};
}
function findValuesFromKappa(kappa){
	
}
function findValuesFromPhase(phase, opts){
    var s = "";
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var piesoConductivity = (Math.PI*Math.pow(opts.R,2))/(opts.period*(3600)*Math.pow((phase-Math.PI/8), 2));
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var hydroConductivity = opts.QlPInj*(1/3600/24)/(2*Math.PI*(101325))*Math.sqrt(Math.PI/(2*opts.R))*Math.pow(piesoConductivity*opts.period*(3600)/(2*Math.PI),0.25)*Math.exp(-opts.R*Math.sqrt(2*Math.PI/(piesoConductivity*opts.period*(3600))));               // [m^3/sec]/[Pa] = [m^3/Pa*sec]
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var gam = 1.781072418;    // Пост. Эйлера
    var adaptedRadius=(2/gam*Math.sqrt(piesoConductivity*opts.period*(3600)))/(Math.exp(Math.sqrt(Math.pow(opts.PObslPInj,2)*Math.PI/(2*opts.R)*Math.sqrt(piesoConductivity*opts.period*(3600)/(2*Math.PI))*Math.exp(-opts.R*Math.sqrt((2*Math.PI)/(piesoConductivity*opts.period*(3600))))-Math.pow(Math.PI/4,2))));
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var permability=hydroConductivity*opts.mu*(1/0.987e-12)/opts.h;   // [mPa] сокращаются с [mD] , результат в [mD]
//-----------------------------------------------------------------------------------------------------------------------------------------------------

    /*/var s=Format.sprintf(
        'first mode\n' +
            'Period=%5.3f\n' +
            'phases :\n' +
            'PcP=%5.3f [rad]\n' +
            'QPc=%5.3f [rad]\n' +
            'QP=%5.3f [rad]\n' +
            'Pc1/P1=%7.2f\n' +
            'hydraulic conductivity=%e [m^3/(Pa*sec)]\n' +
            'piezoconductivity=%e [sm^2/sec]\n' +
            'adapted radius=%5.6f [sm]\n' +
            'permability=%5.6f [mD]',
        opts.period,
        NaN,//-phasePPc,
        NaN,//phaseQPc,
        NaN,//phaseQP,
        NaN,//1/Pc1_P1,
        hydroConductivity,
        piesoConductivity*1e+4,
        adaptedRadius*100,
        permability
    );/*/

    return s;
}
function prepare_data_for_plotting(las,opts){
    unvalids=opts.unvalids;

    var o = new Object();
    qdata={};  pdata=[{},{}];

    var dataType;
    var w,well;

    for (w in las.curves){if(las.curves[w].wellType.match('injector')) well=w;}
    o = interp4(las.curves[well]['rate'], 1024, unvalids[2]);
    Q1=calc_mode1(o);
    qdata.label = well+'.'+'rate';
    qdata.data=o.cn;
    qdata.yaxis=1;
    qdata.xaxis=1;
    var nm = Q1.nm;
    log.send({mc:['nm = ', nm]});

    for (w in las.curves){if(las.curves[w].wellType.match('injector')) well=w;}
    o = interp4(las.curves[well]['pressure'], 1024, unvalids[0]);
    P1=calc_mode1(o,nm);//
    pdata[1].label= well+'.'+'pressure';
    pdata[1].yaxis=1;
    pdata[1].xaxis=1;
    pdata[1].data=o.cn;

    for (w in las.curves){if(las.curves[w].wellType.match('observer')) well=w;}
    o = interp4(las.curves[well]['pressure'], 1024, unvalids[1]);
    PC1=calc_mode1(o,nm);//
    pdata[0].label= well+'.'+'pressure';
    pdata[0].data=o.cn;
    pdata[0].yaxis=2;
    pdata[0].xaxis=1;

    /*
    if (wells.length>2){
        o = interp4(las.curves[wells[2]]['pressure'], 1024, unvalids[1]);
        PC2=calc_mode1(o,nm);//
        pdata[0].label= wells[2]+'.'+'pressure';
        pdata[0].data=o.cn;
        pdata[0].yaxis=1;
        pdata[0].xaxis=1;
    }
    if (wells.length>3){
        o = interp4(las.curves[wells[3]]['pressure'], 1024, unvalids[1]);
        PC3=calc_mode1(o,nm);//
        pdata[0].label= wells[3]+'.'+'pressure';
        pdata[0].data=o.cn;
        pdata[0].yaxis=1;
        pdata[0].xaxis=1;
    }
      */

    //plots.push(plorQ = $.plot($("#placeholderQ"),[qdata],options) );
    //plots.push(plotP = $.plot($("#placeholderP"),pdata,options));
    //pdata[0].data=PC1.mode;
    //pdata[1].data=P1.mode;
    //qdata.data=Q1.mode;
    //plots.push($.plot($("#placeholderFP"),pdata,options));
    //plots.push($.plot($("#placeholderFQ"),[qdata],options));

    //var phasePc1Pc2 =  PC2.phase-PC1.phase;
    //var phasePc1Pc3 =  PC3.phase-PC1.phase;
    //var phasePc2Pc3 =  PC2.phase-PC3.phase;
    //var phasePc0Pc1 =  P1.phase-PC1.phase;
    //var phasePc0Pc2 =  P1.phase-PC2.phase;
    // var phasePc0Pc3 =  P1.phase-PC3.phase;
    var phasePPc=PC1.phase-P1.phase,phaseQPc=(Q1.phase-PC1.phase),
        phaseQP=Q1.phase-P1.phase,Pc1_P1=(PC1.amp/P1.amp);
    //(!!!) NB params
    var Radius1=opts.R;// = 400; // [m]
    var Radius = Radius1;
    //var Radius2 = 496;  //  2818
    var Radius2 = 500;  //  7138
    //phasePPc=oboroty_disposing(phasePPc);
// ___________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var piesoConductivity = (Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phasePPc-Math.PI/8), 2));   //[m^2/sec]
    log.send({mc:'piesoConductivityOrigin = '+(Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phasePPc-Math.PI/8), 2))});
    log.send({mc:'piesoConductivityPlus = '+(Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phasePPc+Math.PI/8), 2))});
    log.send({mc:'piesoConductivityWitout = '+(Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phasePPc), 2))});
    log.send({mc:'piesoConductivityphaseQPc = '+(Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phaseQPc-Math.PI/8), 2))});
    //var piesoConductivity01 = (Math.PI*Math.pow(Radius1,2))/(Q1.T1*(3600)*Math.pow((phasePc0Pc1-Math.PI/8), 2));   //[m^2/sec]
    //var piesoConductivity02 = (Math.PI*Math.pow(Radius2,2))/(Q1.T1*(3600)*Math.pow((phasePc0Pc2-Math.PI/8), 2));   //[m^2/sec]
    //var piesoConductivity03 = (Math.PI*Math.pow(Radius3,2))/(Q1.T1*(3600)*Math.pow((phasePc0Pc3-Math.PI/8), 2));   //[m^2/sec]
// ___________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------

    log.send({mc:'piesoConductivity12 = '+Math.PI*Math.pow(Radius2-Radius1,2)/(Math.pow(phasePPc,2))/(Q1.T1*(3600))});
    //piesoConductivity = Math.PI*Math.pow(Radius2-Radius1,2)/(Math.pow(phasePPc,2))/(Q1.T1*(3600));
    //var piesoConductivity13 = Math.PI*Math.pow(Radius3-Radius1,2)/(Math.pow(phasePc1Pc3,2))/(Q1.T1*(3600));
    //var piesoConductivity23 = Math.PI*Math.pow(Radius2-Radius3,2)/(Math.pow(phasePc2Pc3,2))/(Q1.T1*(3600));
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var hydroConductivity = Q1.amp*(1/3600/24)/(2*Math.PI*PC1.amp*(101325))*Math.sqrt(Math.PI/(2*Radius))*Math.pow(piesoConductivity*Q1.T1*(3600)/(2*Math.PI),0.25)*Math.exp(-Radius*Math.sqrt(2*Math.PI/(piesoConductivity*Q1.T1*(3600))));               // [m^3/sec]/[Pa] = [m^3/Pa*sec]
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var gam = 1.781072418;    // Пост. Эйлера
    var adaptedRadius=(2/gam*Math.sqrt(piesoConductivity*Q1.T1*(3600)))/(Math.exp(Math.sqrt(Math.pow(P1.amp/PC1.amp,2)*Math.PI/(2*Radius)*Math.sqrt(piesoConductivity*Q1.T1*(3600)/(2*Math.PI))*Math.exp(-Radius*Math.sqrt((2*Math.PI)/(piesoConductivity*Q1.T1*(3600))))-Math.pow(Math.PI/4,2))));
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//_____________________________________________________________________________________________________________________________________________________
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var permability=hydroConductivity*opts.mu*(1/0.987e-12)/opts.h;   // [mPa] сокращаются с [mD] , результат в [mD]
//-----------------------------------------------------------------------------------------------------------------------------------------------------

    var s=Format.sprintf('mode 1\nPeriod=%5.3f\n phases :\nPcP=%5.3f [rad]\nQPc=%5.3f [rad]\nQP=%5.3f [rad]\nPc1/P1=%7.2f\nhydraulic conductivity=%e [m^3/(Pa*sec)]\npiezoconductivity=%e [sm^2/sec]\nadapted radius=%5.6f [sm]\npermability=%5.6f [mD]',Q1.T1,
        -phasePPc,phaseQPc,phaseQP,1/Pc1_P1, hydroConductivity, piesoConductivity*1e+4, adaptedRadius*100, permability);
    //divout.innerText=s;

    /*
     // var piesoConductivity=(Math.PI*Math.pow(Radius*(100),2))/(Q1.T1*(3600)*Math.pow((delta-Math.PI/8), 2));   //[sm^2/sec]
     var piesoConductivity=(Math.PI*Math.pow(Radius,2))/(Q1.T1*(3600)*Math.pow((delta-Math.PI/8), 2));   //[sm^2/sec]

     var hydroConductivity=(Q1.amp*(1/3600)*Math.exp(-(deltaz+Math.PI/8)))/(5.96*PC1.amp*(101325)*Math.sqrt(Math.abs(deltaz1-Math.PI/8)));               // [m^3/sec]/[Pa] = [m^3/Pa*sec]
     var adaptedRadius=Radius*Math.exp(-Math.sqrt(Math.pow(P1.amp/PC1.amp, 2)*((Math.PI*Math.exp(-2*(deltaz1+Math.PI/8)))/(2*Math.sqrt(2)*(deltaz1-Math.PI/8)))-Math.pow(Math.PI/4, 2)))/(Math.sqrt(2)*(deltaz1-Math.PI/8));// [sm]
     var permability=hydroConductivity*self.opt.mu*(1/0.987e-12)/self.opt.h;   // [mPa] сокращаются с [mD] , результат в [mD]

     var s=Format.sprintf('mode 1\nPeriod=%5.3f\n phases :\nPcP=%5.3f [rad]\nQPc=%5.3f [rad]\nQP=%5.3f [rad]\nPc1/P1=%7.2f\nhydraulic conductivity=%e [m^3/(Pa*sec)]\npiezoconductivity=%e [sm^2/sec]\nadapted radius=%5.6f [sm]\npermability=%5.6f [mD]',Q1.T1,
     -phasePPc,phaseQPc,phaseQP,1/Pc1_P1, hydroConductivity, piesoConductivity*100, adaptedRadius*100, permability);
     divout.innerText=s;
     */
    return {plots:[pdata,qdata,PC1.mode,P1.mode,Q1.mode],values:s};
}
function oboroty_disposing(fi){
    var sign = fi/Math.abs(fi);
    while (Math.abs(fi)>2*Math.PI){fi=fi-2*Math.PI*sign;}
    return fi;
}

function plot_data(data_to_be_plotted){
/*$(function showPlot() {
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);
    var plshd=["#placeholderQ1","#placeholderP1","#placeholderF1","#placeholderQ2","#placeholderP2","#placeholderF2"];
    for (var i = 0; i < plshd.length; i++){
        $.plot($(plshd[i]), [
            {
                data: d1,
            }
        ]);
    }
});*/

	/*/var plshd=["#placeholderQ1","#placeholderP1","#placeholderF1"];
	for (var i = 0; i < plshd.length; i++){
		$.plot($(plshd[i]), [
			{
				data: data_to_be_plotted.graphs[i],
			}
		]);
	}/*/



    //$.unblockUI();
    //var divout=document.getElementById('idout');
    //divout.innerText=data_to_be_plotted.s;

/*    function setCrosshairs(i,p)
    {
        for(var k=0;k<plots.length;k++)
        {
            if(k!=i)  plots[k].setCrosshair(p);
        }
    }
    function AsynCrosshairs(i,p)
    {
    }
    function lockCrosshairs(i,p,item)
    {
        if (item) {
            // Lock the crosshair to the data point being hovered
            for(var k=0;i<4;i++)
            {
                plots[k].setCrosshair({ x: item.datapoint[0], y: item.datapoint[1] });
                plots[k].lockCrosshair({ x: item.datapoint[0], y: item.datapoint[1] });
            }
        }
        else {
        }


    }
    $("#placeholderQ").bind("plothover", function (event, pos,item) {
    });
    $("#placeholderFQ").bind("plothover", function (event, pos,item) {
    });
    $("#placeholderP").bind("plothover", function (event, pos,item) {
    });
    $("#placeholderFP").bind("plothover", function (event, pos,item) {
    }); */
}