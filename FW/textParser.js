function parseText(textfile,opts){
    this.convert = function(smf){
        res = smf-0;
        if(isNaN(res)) res = smf.fro
        return res;
    }
    this.fill = function(contents,opts){
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

        var stringsArray = contents.split('\n');
        var fileObj = {};  fileObj.columns={};
        var firstStr = stringsArray[0].split("\t");

        for (var i = 1; i < stringsArray.length; i++){
            var temp = stringsArray[i].split("\t");
			//var tmp=stringsArray[i].match(/[-+]?\d*\.?\d*(e(\+?|\-?)|\.?)\d*/gi);
			//var temp=[]; for (var i = 0; i < tmp.length; i++){if (tmp[i]!=="") temp.push(tmp[i]);}
            if (temp[0]===firstStr[0]||temp[0]==="") continue;
            if (!fileObj.columns[temp[0]]) fileObj.columns[temp[0]]={};
            for (var j = 1; j < firstStr.length; j++){
                if (!fileObj.columns[temp[0]][firstStr[j]]) fileObj.columns[temp[0]][firstStr[j]]=[];
                temp[j]=convert(temp[j]);
                if (j == 3)  temp[j]=temp[j]*24;
                    fileObj.columns[temp[0]][firstStr[j]].push(temp[j]);
            }
        }
        return {fileObj:fileObj,firstStr:firstStr,newfile:self.newfile};
    }
    return this.fill(textfile,opts);
}
