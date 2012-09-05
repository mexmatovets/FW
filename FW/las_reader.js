DataObject=function (fn,opts){
    this.init = function(){
        this.las = new Object();
        this.las.logs = new Array();
        this.las.curves = new Array();
        this.las.curve_names = new Array();
        this.las.num_logs = 0;
        this.las.Null = NaN;
        //this.las.interp=interp3;
    };

    function toDigit(arr){
        for(var i = 0; i < arr.length; i++){
            arr[i]-=0;
            var v=parseFloat(arr[i]);
            if(Math.abs(v+999.25)<1.0e-7) arr[i]=NaN;
        }
    }

    this.init();
    this.fill = function(contents){
        function xdr_get(xdr_url)
        {
            var xdr= new XMLHttpRequest();

            if(!self.document)
            {
                if(self.$require)
                {
                    xdr_url=$require.expand_url(xdr_url);
                }
                xdr.open('GET',xdr_url,false);
                xdr.responseType='text';
                xdr.setRequestHeader('Accept','*/*');
                xdr.setRequestHeader('Content-Type',"text/plain");
            }
            else xdr.open('GET',xdr_url,false);
            xdr.send();
            if( xdr.status == 200)
                return xdr.response;
            else throw new Error(xdr.statusText);

        }
        if (contents&&contents.fileAsText)  contents = contents.fileAsText;
        contents&&contents.raw_data&&(contents=contents.raw_data.contents)
        if((contents.constructor.name=='File')||(contents.constructor.name=='Blob'))
            contents=(new FileReaderSync).readAsText(contents);
        else if((typeof(contents)=='object')&&(contents.url))
            contents=xdr_get(contents.url);

        if(opts&&opts.nodata) {
            if (contents!==self.cont)
                self.newfile = 1;
            else
                self.newfile = 0;
            self.cont=contents;
        }

        this.las.sections = contents.split("~");
        var m=Math.min(this.las.sections.length, 10)
        for (var i = 0; i < m; i++)  { /**< \brief    Цикл по секциям*///
        ch = this.las.sections[i].toUpperCase().charAt(0);
            switch(ch){
                case "V" :          /**< \brief  Version information */
                    break;
                case "W" :          /**< \brief  Well information section */
                    /**< \brief  Выделение параметров */
                    var strings = this.las.sections[i].split("\n");
                    for (var ii = 1; ii < strings.length-1; ii++){
                        if (!strings[ii].search("NULL")){
                            this.las.Null = strings[ii].match(/(-|)\d+.\d+/g)-0;
                        }
                    }
                    break;
                case "C" :          /**< \brief  Curve information section */
                    /**< \brief  Парсинг имен кривых */
                    //if(opts&&opts.curveInd) break;
                    var strings = this.las.sections[i].split("\n");
                    var num_logs = 0;
                    for (var ii = 1; ii < strings.length-1; ii++){
                        if (strings[ii].search('#')) {
                            this.las.curve_names[num_logs] = strings[ii].split(/\:/g)[0];
							//self.log.send({mp: Math.round(20+num_logs*90/strings.length)});
                            num_logs++;
                        }
                    }
                    this.las.num_logs=num_logs;
                    break;
                case "P" :          /**< \brief  Parameter information section */
                    break;
                case "O" :          /**< \brief  Other information section */
                    break;
                case "A" :          /**< \brief  Log data section */
                    /**< \brief  Создание массивов данных*/
                    if(opts&&opts.nodata) break;
                    var strings = this.las.sections[i].split("\n");
                    var re=/,/;
                    for (var ii = 1; ii < strings.length; ii++){
                        var temp = strings[ii].match(/((-|)\d*(\.|\,)*\d+)(\t*|\s*|\n)/g) ;
                        if(temp&&temp.length){
                            temp=temp.map(function(v){ return v.replace(re,'.') })
                            toDigit(temp);
                            this.las.logs.push(temp);
                        }   
                    }
                    for (var iii = 0; iii < this.las.num_logs; iii++){
                        this.las.curves[iii] = new Array();
                    }
                    for (var ii = 0; ii < this.las.logs.length; ii++){
                        for (var iii = 0; iii < this.las.num_logs; iii++){
                            this.las.curves[iii].push(this.las.logs[ii][iii]);
                        }
                    }
                    break;
            }
        }
        delete (this.las.logs);
        delete (this.las.Null);
        delete (this.las.sections);
    };

    this.convert_curves=function (){
        var fmo=ltx_bind('mmap:array');
        for (var iii = 0; iii < this.las.curves.length; iii++)
            this.las.curves[iii]=fmo(this.las.curves[iii].toSAFEARRAY(),'double');
        return this.las;
    }

    this.loadFile=function (fn,fp) {
        var txt=string_from_file(filesearch(fn,fp))
        this.init();
        this.fill(txt);
    }
    this.fill(fn);
}

function FigureFileExtension(file) {
    //alert ("this = " + this);
    var fileName;
    while (file.indexOf("\\") != -1)
        file = file.slice(file.indexOf("\\") + 1);
    this.ext = file.slice(file.indexOf(".")).toLowerCase();
    this.fileName = file.slice(0, file.indexOf("."));
}
function textReader(){
    var obj=[];   var arr = [];
    var res = self.objFromTXT;
    for (tmp in res.fileObj.columns) if (res.fileObj.columns.hasOwnProperty(tmp)) arr.push(tmp);
    for (var j = 0; j < arr.length; j++){
        for (var  i = 1; i < res.firstStr.length; i++){
            obj.push(res.fileObj.columns[arr[j]][res.firstStr[i]]);
        }
    }
    return las={curves:obj,curve_names:self.LAS_logs};
}