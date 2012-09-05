var options =   {     xaxes: [  {
    position: 'bottom' }
],
    yaxes: [

        { position: 'left', color:"rgb(0,77,00)"},
        { position: 'right', color:"rgb(155,0,0)"}
    ],
    series: {
        lines: { show: true },
        points: { show: false }
    }

    ,colors: ["rgb(0,77,00)","rgb(155,0,0)"],
    crosshair: { mode: "x" ,color:"rgb(0,0,100)"},
    grid:{labelMargin:-50,borderWidth:0, clickable:true,   borderColor: null,hoverable: true, autoHighlight: false }
    ,legend:{backgroundOpacity:0}
};
var plotP,plotQ,plotFP,plotFQ,plot13,plot23;
var pdata,qdata, po=[],qo=[],P1,Pc1,Q1;
var plots=[];
var N=1024,NF=1024;
var  dft;

function reduse_curve(curve,Np,NF)
{
    var mmx=  meshUtils.mm_init(), mmy=  meshUtils.mm_init();
    var c=[],cc=[],cmean=0;
    curve.forEach(function(z){
        if((!isNaN(z[0]))&&(!isNaN(z[1])))
        {
            mmx.update(z[0]);
            mmy.update(z[1]);
            c.push(z);
            cmean+=z[1];
        }

    })

    var T=mmx[1]-mmx[0];
    var dt=T/NF;t=mmx[0];

    var cn=new Array(NF),vv=c[0][0];
    var fa=new Float32Array(NF);

    var cN=c.length;
    cmean/=cN;
    var il=0,ir=0,tr;
    for(var n=0;n<NF;n++)
    {

        var v=0,np=0;
        tr=t+dt;
        vv=c[il][1];
        while((c[il++][0]<tr)&&(il<cN))
        {
            v+=c[il][1];
            np++;
        }
        vv=(np)?v/np:vv;
        fa[n]=vv-cmean;
        cn[n]=[t,vv-0];

        t=tr;

    }

    N=(c.length/Np)>>0;

    var kn=(c.length/N)>>0;

    for(var k=0;k<kn;k++)
    {
        var zz=[0,0];
        for(var m=0;m<N;m++)
        {
            zz[0]+=c[N*k+m][0]
            zz[1]+=c[N*k+m][1];
        }
        zz[0]/=N;
        zz[1]/=N;
        cc.push(zz);

    }



    return {rcurve:cc,curve:c,cn:cn,mmx:mmx,mmy:mmy,fa:fa}
}

function calc_mode1(data,nm){

    var out={};
    var fa=data.fa,N=fa.length;
    if((!dft)||(dft.buferSize!=N))
    {
        dft=new FFT(N);
    }
    dft.forward(fa);
    var spec=dft.spectrum;
    var real=dft.real;
    var imag=dft.imag;
    var mp=-1;
    if(isNaN(nm))
    {
        nm=0;

        for(var n=0;n<spec.length;n++)
        {
            if(mp<spec[n])
            {
                mp=spec[n];
                nm=n;
            }
        }

    }

    mp=spec[nm];
    var phase= Math.atan2(real[nm],imag[nm]);

    var T=data.mmx[1]-data.mmx[0];
    var T1=T/nm;
    var      mode=[],rnm=real[nm]*2/N,inm=imag[nm]*2/N,fr=2*Math.PI/(N/nm);

    mode=data.cn.map(function(v,k){
        var vv=[v[0]];
        vv[1]=rnm*Math.cos(fr*k)+inm*Math.sin(fr*k);
        return vv;
    });
      //console.log('nmode=',nm);
    out={amp:mp,nm:nm,phase:phase,T:T,T1:T1,spec:spec,mode:mode};

    return out;

}
function printh()
{
    document.getElementById('form0').hidden=1;
    print();
}
/*/function getOpts(){
    var opt={};
    opt.R=parseFloat($("#R").val());
    opt.h=parseFloat($("#h").val());
    opt.mu=parseFloat($("#mu").val());
    return opt;
}
/*/
function loadPales(){
    //if (!self.opt) self.opt={};
    var opt = getOpts();
    opt.unvalids=[];
    var temp =  $("#TextArea1").val();
    opt.unvalids[0]=[];
    var res = temp.match(/((-|)\d*\.*\d+)(\t*|\s*|\n)/g) ;
    if (res&&res.length>1)  for (var i = 0; i < res.length/2 ;i++){ opt.unvalids[0].push({x0:res[2*i]-0,x1:res[2*i+1]-0  });   }
    var temp2 =  $("#TextArea2").val();
    opt.unvalids[1]=[];
    var res2 = temp2.match(/((-|)\d*\.*\d+)(\t*|\s*|\n)/g) ;
    if (res2&&res2.length>1)for (var i = 0; i < res2.length/2;i++){ opt.unvalids[1].push({x0:res2[2*i]-0,x1:res2[2*i+1]-0});   }
    var temp3 =  $("#TextArea3").val();
    opt.unvalids[2]=[];
    var res3 = temp3.match(/((-|)\d*\.*\d+)(\t*|\s*|\n)/g) ;
    if (res3&&res3.length>1)for (var i = 0; i < res3.length/2;i++){ opt.unvalids[2].push({x0:res3[2*i]-0,x1:res3[2*i+1]-0});   }
    opt.corresponding = loadBound();
    self.opt=opt;
    return opt;
}

function loadBound(){
    var wds = new Array(6);
    var edits = ["#iselect_rate_t","#iselect_rate","#iselect_press_t","#iselect_press","#iselect_pressC_t","#iselect_pressC"];
    for (var i = 0; i < 6; i++){
        if (!isNaN(parseInt($(edits[i]).val()-0))) {
            wds[i] = parseInt($(edits[i]).val()-0)
        }
        else {
            if (self.opt&&self.opt.corresponding)
                wds[i] = self.opt.corresponding[i];
        }
    }
    if (isNaN(wds[0])||isNaN(wds[1])||isNaN(wds[2])||isNaN(wds[3])||isNaN(wds[4])||isNaN(wds[5])) {
        wds[0]=4;  wds[1]=5;  wds[2]=0;  wds[3]=1;  wds[4]=2;  wds[5]=3;
        //   throw '\nPlease set correspondence logs names& logs types!'; }
    }
    return wds;
}