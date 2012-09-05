var curve={x:[],y:[]};
for (var i = 0; i < 1000; i++){
    curve.x[i]=i;
    curve.y[i]=2*i;//Math.sin(2*Math.PI*i/100);
}
for (var i = 0; i < 2000; i++){
    curve.x.push(i/2+1000);
    curve.y.push(i+2000);//Math.sin(2*Math.PI*i/100);
}

var curve2={x:[],y:[]};
curve2.x[0]=0; curve2.y[0]=177.7;
curve2.x[1]=121; curve2.y[1]=176.6;
curve2.x[2]=242; curve2.y[2]=182.2;
curve2.x[2]=363; curve2.y[2]=155.5;

function my_show(curve,flag, ch){
    if (flag==1){
    // /flag==1 , curve1[i].x
        var val;
        for (var i = 0; i < curve.length; i++){
            if (ch=='x') val = curve[i].x;
            if (ch=='y') val = curve[i].y;
            console.log('',val );
        }
    }
    if (flag==0){
        // /flag==0 , curve.x[i]
        for (var i = 0; i < curve.x.length; i++){
            if (ch=='x') console.log('',curve.x[i] );
            if (ch=='y') console.log('',curve.y[i] );
        }
    }
    if (flag==2){
        // /flag==0 , curve.x[i]
        for (var i = 0; i < curve.length; i++){
            var val;
            if (ch=='x') val = curve[i][0];
            if (ch=='y') val = curve[i][1];
                console.log('',val );
        }
    }
}

function interp(curve, n){
    var a,b;
    var x = [], y = [];
    var xLen = curve.x[curve.x.length-1]-curve.x[0];
    //var curveDx = xLen/(curve.x.length-1);     // равномерный шаг (100)
    var dx = xLen/n; // равномерный шаг (1000)
    for (var i = 0; i < n; i++){
        j=Math.floor(i*(curve.x.length-1)/n);
        a=(curve.y[j+1]-curve.y[j])/(curve.x[j+1]-curve.x[j]);
        b=curve.y[j]-a*curve.x[j];
        x.push(curve.x[0]+i*dx);
        y.push(a*x[i]+b);
    }
    return {x:x, y:y};
}
function interp2(curve, n){
    var a,b;
	var x=[], y =[];
    var xLen = curve.x[curve.x.length-1]-curve.x[0];
    var dx = xLen/n;
    for (var i = 0; i < n; i++) {x.push(i*dx);}
    x.forEach(function(val,i){
        j=Math.floor(i*(curve.x.length-1)/n);
        a=(curve.y[j+1]-curve.y[j])/(curve.x[j+1]-curve.x[j]);
        b=curve.y[j]-a*curve.x[j];
        y.push(a*x[i]+b);
    });
    return {x:x, y:y};
}
var newCurv2 = interp2(curve, 1000);
var i = 0;

//var unvalid = [{x0:120,x1:122},{x0:241,x1:243}];
var unvalid = [{x0:4,x1:12}];

curve.y[22]=121;
curve.y[23]=122;
/*
** Интерполирование заданной кривой на необходимое количество точек
** Предположение: x монотонно возрастает
** Равномерные шаги по x
*/
function interp3(curve,n,unvalid){
    function mySort(curve,unvalid){
        function validity(val, unvalid){
            unvalid.forEach(function(e){
                if(val>=e.x0&&val<=e.x1) {
                    val = undefined;
                };
            })
            return val;
        }

        var processing=[];
		var mmx = meshUtils.mm_init(), mmy = meshUtils.mm_init();
        var j = 0;
        for (var i = 0; i < curve.length; i++){
            if (unvalid) curve[i][0] = validity(curve[i][0],unvalid);
            if (curve[i][0]||curve[i][0]==0)    {
				mmx.update(curve[i][0]);
				mmy.update(curve[i][1]);
                processing[j]={x:curve[i][0],y:curve[i][1]};
                j++;
            }
        }
        //qsort(processing);
        processing.sort(function(e0, e1){
            if (e0.x<e1.x) return -1;
            if (e0.x>e1.x) return 1;
            return 0;
        });
        return {curve:processing, mmx:mmx, mmy:mmy};
    }

    var a, b;
    var x=[], processing2 = [], y;
    var fa=new Float32Array(n);
    var j=0;
    var curve1 = mySort(curve,unvalid);             // проверка и сортировка исходных данных
	var mmx = curve1.mmx;
	var mmy = curve1.mmy;
	curve1 = curve1.curve;
    var curr_x = curve1[0].x;
    var xLen = curve1[curve1.length-1].x-curve1[0].x;
    var dx = xLen/(n-1);
    var cmean = 0;
    curve1.forEach(function(z){
        cmean+= z.y;
    });
    cmean/=curve1.length;

    for (var i = 0; i < n; i++){
        x.push(i*dx+curve1[0].x);
        while (x[i]>curve1[j+1].x)  {j++; if (j>curve1.length-2) { j--; break;}}
        a=(curve1[j+1].y-curve1[j].y)/(curve1[j+1].x-curve1[j].x);
        b=curve1[j].y-a*curve1[j].x;
        y = a*x[i]+b;
        processing2[i]=[x[i],y];
        fa[i]=y-cmean;
    }
    return {c:curve1, cn:processing2, fa:fa, mmx:mmx, mmy:mmy};
}
//my_show(curve,0,'y');

//var newCurv3 = interp3(curve, 1024, unvalid);
//my_show(newCurv3,2,'y');


/*
 ** Интерполирование заданной кривой на необходимое количество точек
 ** Предположение: x монотонно возрастает
 ** Равномерные шаги по x
 */
function interp4(curve_obj,n,unvalid){
    function mySort(curve,unvalid){
        function validity(val, unvalid){
            unvalid.forEach(function(e){
                if(val>=e.x0&&val<=e.x1) {
                    val = undefined;
                };
            })
            return val;
        }

        var processing=[];
        var mmx = meshUtils.mm_init(), mmy = meshUtils.mm_init();
        var j = 0;
        for (var i = 0; i < curve.length; i++){
            if (unvalid) curve[i][0] = validity(curve[i][0],unvalid);
            if (curve[i][0]||curve[i][0]==0)    {
                mmx.update(curve[i][0]);
                mmy.update(curve[i][1]);
                processing[j]={x:curve[i][0],y:curve[i][1]};
                j++;
            }
        }
        //qsort(processing);
        processing.sort(function(e0, e1){
            if (e0.x<e1.x) return -1;
            if (e0.x>e1.x) return 1;
            return 0;
        });
        return {curve:processing, mmx:mmx, mmy:mmy};
    }

    var a, b;
    var x=[], processing2 = [], y;
    var fa=new Float32Array(n);
    var j=0;
    var curve=[];
    var k1;
    var xy=[];
    for (k1 in curve_obj) if (curve_obj.hasOwnProperty(k1)){
        xy.push(k1);
    }
    for (var i = 0; i < curve_obj[xy[0]].length; i++){
        curve.push([curve_obj[xy[0]][i], curve_obj[xy[1]][i]]);
    }

    var curve1 = mySort(curve,unvalid);             // проверка и сортировка исходных данных
    var mmx = curve1.mmx;
    var mmy = curve1.mmy;
    curve1 = curve1.curve;
    var curr_x = curve1[0].x;
    var xLen = curve1[curve1.length-1].x-curve1[0].x;
    var dx = xLen/(n-1);
    var cmean = 0;
    curve1.forEach(function(z){
        cmean+= z.y;
    });
    cmean/=curve1.length;

    for (var i = 0; i < n; i++){
        x.push(i*dx+curve1[0].x);
        while (x[i]>curve1[j+1].x)  {j++; if (j>curve1.length-2) { j--; break;}}
        a=(curve1[j+1].y-curve1[j].y)/(curve1[j+1].x-curve1[j].x);
        b=curve1[j].y-a*curve1[j].x;
        y = a*x[i]+b;
        processing2[i]=[x[i],y];
        fa[i]=y-cmean;
    }
    return {c:curve1, cn:processing2, fa:fa, mmx:mmx, mmy:mmy};
}
var i = 0;


/* Profiler::
* // Запускаем таймер в начале выполнения сценария
 var start = new Date();
 // Код, время которого необходимо измерить
 for (var i = 0; i < 10000; i++)
 { Do nothing }
// Еще один таймер в конце
var end = new Date();
// Вычисляем разницу в ms
var result = end.getTime() - start.getTime();
// Вывод результата
alert(result + 'ms');
*/