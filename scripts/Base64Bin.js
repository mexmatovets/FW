/*	
copyToClipboard=function (text)
{
  var input = document.getElementById( 'url' );
  input.value = text;
  input.focus();
  input.select();
  document.execCommand( 'Copy' );
}	
*/


function setZeroTimeout(callback) {

 var channel = new MessageChannel();

 channel.port1.onmessage = callback;

 channel.port2.postMessage('');

}
	
var base64_bin = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	_keyA : [],
     //is_SynchoApi=function(){ try{ return self.FileReaderSync;}catch(e){} },
	// public method for encoding
	encode_o : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		//input = Base64._utf8_encode(input);
		var input = new Uint8Array(input);

		while (i < input.length) {

			//chr1 = input.charCodeAt(i++);
			//chr2 = input.charCodeAt(i++);
			//chr3 = input.charCodeAt(i++);
			
			chr1=input[i++];
			chr2=input[i++];
			chr3=input[i++];

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},
	
		encode : function (arrayBuffer) {
		
		//if(is_SynchoApi()) 		     return encode2(arrayBuffer);
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}
	,	
	
			 get_hash: function (t) 
		  {   
		       if(!t) t=this; 
		     if(!(t._hashkey)) 
			 {
			   var hashkey=new Int16Array(256);
			   var key=t._keyStr;
			   for(var j=0;j<256;++j) hashkey[j]=-1;
          	   for(var j=0;j<65;++j)
				  	   hashkey[key.charCodeAt(j)]=j;
			    t._hashkey=hashkey;		
		     }
		    return t._hashkey;
		  }
,	
encode2 : function (arrayBuffer) {
  
  
	
	var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  
  var bytes         =(arrayBuffer.buffer)? new Uint8Array(arrayBuffer.buffer): new Uint8Array(arrayBuffer);
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
  

  var a, b, c, d
  var chunk
  
   var	 hash=(
   function()
   {
      if(! this._enc_cache)
	  {
	    var hk=new Int16Array(68);
		for(var k=0;k<64;k++) hk[k]=encodings.charCodeAt(k);
		this._enc_cache=hk;
	  }
	  return this._enc_cache;
   }
   )();

  
  //var encode_len=  parseInt((4*byteLength)/3)+((byteRemainder)?0:2);
  //var encode_len=  parseInt((4*byteLength)/3)+byteRemainder;
  //
  var encode_len=  parseInt((4*mainLength)/3)+((byteRemainder)?4:0);
  //var encode_len=  parseInt((4*byteLength)/3)+4;
  
  var base64=new Uint8Array(encode_len);
   base64[encode_len-1]=base64[encode_len-2]=base64[encode_len-3]='?';
   var k=0;
   
     for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    //base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]=hash[c];
	base64[k++]=hash[d];
	
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    //base64 += encodings[a] + encodings[b] + '=='
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]='='.charCodeAt(0);
	base64[k++]='='.charCodeAt(0);
	
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]=hash[c];
	base64[k++]='='.charCodeAt(0);

    //base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }   
    
	//base64=base64.subarray(0,k);
	
	function convert(b)
	{
	   if(self.FileReaderSync)
	   {
	      var bb=new BlobBuilder,b;
		  bb.append(b.buffer);
		  b=bb.getBlob();
		  return (new FileReaderSync).readAsText(b);
		  
	   }
	   else
	   {
	     var s='',l=b.byteLength;
	     for(var k=0;k<l;k++)
	     s+=String.fromCharCode(b[k]);
		 return s;
		}
	}
  
       return convert(base64);
    
},

convert:	function convert(a,frs)
	{
	   if((!frs)&&self.FileReaderSync)
	   {
	      var bb=new BlobBuilder,b;
		  bb.append(a.buffer);
		  b=bb.getBlob();
		  return (new FileReaderSync).readAsText(b);
		  
	   }
	   else
	   {
	     var s='',l=b.byteLength;
	     for(var k=0;k<l;k++)
	     s+=String.fromCharCode(b[k]);
		 return s;
		}
	},
	
deconvert:	function deconvert(s){

        return this.concat([s]);
},
	
concat: function concat(a,ind){

      if(!self.FileReaderSync) throw  'FileReaderSync not supported !!'
      var bb=new BlobBuilder,b;
	  var f=ind instanceof Array,pos=0;
	  a.forEach(function(v){ 
	  
          if(!v) throw new TypeError('blob');
		  
		  if(v.buffer) bb.append(v.buffer);
                      else bb.append(v);		  
	      
		  if(f){
		  ind.push([pos,pos=bb.getBlob().size])
		  } 
	  })
	  b=bb.getBlob();
	  return (new FileReaderSync).readAsArrayBuffer(b);
},
encode3 : function (arrayBuffer,frs) {
  
  
	
	var base64    = ''
  

  
  var bytes         =(arrayBuffer.buffer)? new Uint8Array(arrayBuffer.buffer): new Uint8Array(arrayBuffer);
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
  

  var a, b, c, d
  var chunk
  
   var	 hash=(
   function()
   {
     var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      if(! this._enc_cache)
	  {
	    var hk=new Int16Array(68);
		for(var k=0;k<64;k++) hk[k]=encodings.charCodeAt(k);
		this._enc_cache=hk;
	  }
	  return this._enc_cache;
   }
   )();

  
  
  var encode_len=  parseInt((4*mainLength)/3)+((byteRemainder)?4:0);
  
  
  var base64=new Uint8Array(encode_len);
  // base64[encode_len-1]=base64[encode_len-2]=base64[encode_len-3]='?';
  
   var k=0;
   
     for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    var chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
/*    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    //base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]=hash[c];
	base64[k++]=hash[d];
	*/
	
	base64[k++]=hash[(chunk & 16515072) >> 18];
	base64[k++]=hash[(chunk & 258048)   >> 12];
	base64[k++]=hash[(chunk & 4032)     >>  6];
	base64[k++]=hash[chunk & 63 ];
	
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    //base64 += encodings[a] + encodings[b] + '=='
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]='='.charCodeAt(0);
	base64[k++]='='.charCodeAt(0);
	
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
	base64[k++]=hash[a];
	base64[k++]=hash[b];
	base64[k++]=hash[c];
	base64[k++]='='.charCodeAt(0);

    //base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }   
    
	//base64=base64.subarray(0,k);
	
  
       return convert(base64,frs);
    
}	,
      
	 
	decode : function (input,fnosafe) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0,k=0;
		var outbuf;
		
		var decode_length= function(i){
	
	         var l=i.length;
			 var n=3*(l/4);
			 if(i.charAt(l-1)=='=') --n;
			 if(i.charAt(l-2)=='=') --n;
			 return n;
			 }
		var	 get_hash = function (t) 
		  {
		     if(!(t._hashkey)) 
			 {
			   var hashkey=new Int16Array(256);
			   var key=t._keyStr;
			   for(var j=0;j<256;++j) hashkey[j]=-1;
          	   for(var j=0;j<65;++j)
				  	   hashkey[key.charCodeAt(j)]=j;
			    t._hashkey=hashkey;		
		     }
		    return t._hashkey;
		  }
	    
	     
	     
         
		if(!fnosafe)
		    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			
		var l=decode_length(input);
		//outbuf=new ArrayBuffer(l);
		var output=new Uint8Array(l);
		
		var hash=get_hash(this);

		while (i < input.length) {

		// 		
		/*
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			//*/
			// 			/*
			enc1 = this._hashkey[input.charCodeAt(i++)];
			enc2 = this._hashkey[input.charCodeAt(i++)];
			enc3 = this._hashkey[input.charCodeAt(i++)];
			enc4 = this._hashkey[input.charCodeAt(i++)];
			// */

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			//output = output + String.fromCharCode(chr1);
			output[k++]=chr1;
			if (enc3 != 64) output[k++]=chr2;
			if (enc4 != 64) output[k++]=chr3;
			
		}

			return output.buffer;

	},
	test : function(a)
	{     
	       var o={};
            o.fs=new Float64Array(a);
			o.bsfs=this.encode(o.fs.buffer);
			o.buf=this.decode(o.bsfs);
			o.fd=new Float64Array(o.buf);
		   return o;	
	}
	
	
	};

for(var n=0;n<65;n++)	base64_bin._keyA[n]=base64_bin._keyStr[n];
Base64bin=base64_bin;	


	