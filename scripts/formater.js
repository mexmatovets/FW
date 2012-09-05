(
function()
{
function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return (o.join('')); }

    function vsprintf(args) {
        var i = 0, a, f = args[i++], o = [], m, p, c, x;
        while (f) {
            if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
            else if (m = /^\x25{2}/.exec(f)) o.push('%');
            else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
                if (((a = args[m[1] || i++]) == null) || (a == undefined)) throw ("Too few arguments.");
                if (/[^s]/.test(m[7]) && (typeof (a) != 'number'))
                    throw ("Expecting number but found " + typeof (a));
                switch (m[7]) {
                    case 'b': a = a.toString(2); break;
                    case 'c': a = String.fromCharCode(a); break;
                    case 'd': a = parseInt(a); break;
                    case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                    case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                    case 'o': a = a.toString(8); break;
                    case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                    case 'u': a = Math.abs(a); break;
                    case 'x': a = a.toString(16); break;
                    case 'X': a = a.toString(16).toUpperCase(); break;
                }
                a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
                c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                x = m[5] - String(a).length;
                p = m[5] ? str_repeat(c, x) : '';
                o.push(m[4] ? a + p : p + a);
            }
            else throw ("Huh ?!");
            f = f.substring(m[0].length);
        }
        return o.join('');
    }

   function sprintf() 
   {
   return vsprintf(arguments);
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
 function _parse_tree(a){
   var ac=a.map(function(v){ return [v[0],v[1]] });
     ac.sort(function(v1,v2){ return v2[0].localeCompare(v1[0])});
	return ac 
} 
   

this.Format=this.Format||
{
     vsprintf:vsprintf,
     sprintf:sprintf,
	 set_obj_tree_value:set_obj_tree_value
	 ,_parse_tree:_parse_tree
}
}
 )()