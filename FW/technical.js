//проводник
document.getElementById('outsdata').src=LPC.expand_url('./');
document.getElementById('outsdata2').src=LPC.expand_url('./');
var products = [    
	{productid:'Pressure time',name:'Pressure time'},
    {productid:'Pressure value',name:'Pressure value'},
    {productid:'Rate time',name:'Rate time'},
    {productid:'Rate value',name:'Rate value'}
];
function productFormatter(value){
	for(var i=0; i<products.length; i++){
		if (products[i].productid == value) return products[i].name;
	}
	return value;
}
// Таблица старая
$(function(){
	var lastIndex;
	$('#tt').datagrid({
		toolbar:[{
			text:'append',
			iconCls:'icon-add',
			handler:function(){
			$('#tt').datagrid('endEdit', lastIndex);
				$('#tt').datagrid('appendRow',{
					itemid:'',
					productid:'',
					listprice:'',
					unitprice:'',
					attr1:'',
					status:'P'
				});
				var lastIndex = $('#tt').datagrid('getRows').length-1;
				$('#tt').datagrid('selectRow', lastIndex);
				$('#tt').datagrid('beginEdit', lastIndex);
			}
		},'-',{
			text:'delete',
			iconCls:'icon-remove',
			handler:function(){
				var row = $('#tt').datagrid('getSelected');
				if (row){
					var index = $('#tt').datagrid('getRowIndex', row);
					$('#tt').datagrid('deleteRow', index);
				}
			}
		},'-',{
			text:'accept',
			iconCls:'icon-save',
			handler:function(){
				$('#tt').datagrid('acceptChanges');
			}
		},'-',{
			text:'reject',
			iconCls:'icon-undo',
			handler:function(){
				$('#tt').datagrid('rejectChanges');
			}
		},'-',{
			text:'GetChanges',
			iconCls:'icon-search',
			handler:function(){
				var rows = $('#tt').datagrid('getChanges');
				alert('changed rows: ' + rows.length + ' lines');
			}
		}],
		onBeforeLoad:function(){
			$(this).datagrid('rejectChanges');
		},
		onClickRow:function(rowIndex){
			if (lastIndex != rowIndex){
				$('#tt').datagrid('endEdit', lastIndex);
				$('#tt').datagrid('beginEdit', rowIndex);
			}
			lastIndex = rowIndex;
		}
	});
});

//Таблица
$(function(){
	var data = {"total":0,"rows":[]};
	var lastIndex;
	$('#cartcontent').datagrid({
		onClickRow:function(rowIndex){
			$('#cartcontent').datagrid('endEdit', lastIndex);		
			if (lastIndex != rowIndex){
				$('#cartcontent').datagrid('beginEdit', rowIndex);
			}
			lastIndex = rowIndex;
		},
		//onDblClickRow:function(rowIndex, rowData){
		//	$('#cartcontent').datagrid('endEdit', rowIndex);
		//},
		rowStyler:function(index,row){  
			if (row.index%2){return 'background-color:#F0FCFF;color:#00007B';} else{return 'color:#1874CD';} 
		},
		toolbar:[{
			text:'delete',
			iconCls:'icon-remove',
			handler:function(){
				var row = $('#cartcontent').datagrid('getSelected');
				if (row){
					var index = $('#cartcontent').datagrid('getRowIndex', row);
					$('#cartcontent').datagrid('deleteRow', index);
				}
			}
		}]
	});
	function addProduct(name, count){
		function add(){
			for(var i=0; i<data.total; i++){
				var row = data.rows[i];
				if (row.name == name){
					row.quantity += 1;
					return;
				}
			}
			data.total += 1;
			data.rows.push({
				wellName:"Well-1",
				logName:name,
				radius:496,
				index:count
			});
		}
		add();				
		$('#cartcontent').datagrid('loadData', data);									
	}
	var lastIndex;
	var count = 0;
	$('#cartcontent').datagrid({singleSelect:true});
	$('.item').draggable({
		revert:true,
		proxy:'clone',
		onStartDrag:function(){
			$(this).draggable('options').cursor = 'not-allowed';
			$(this).draggable('proxy').css('z-index',10);
		},
		onStopDrag:function(){
			$(this).draggable('options').cursor='move';
		}
	});
	$('.cart').droppable({
		onDragEnter:function(e,source){
			$(source).draggable('options').cursor='auto';
		},
		onDragLeave:function(e,source){
			$(source).draggable('options').cursor='not-allowed';
		},
		onDrop:function(e,source){
			var name = $(source).find('.tree-title').html();
			addProduct(name,count);
			count++;
		}
	});
});
//Дерево
treeProcessing=function (){
	var newtree=this;
	this.appendTree=function(filename, list){
		var temp={
			//"id": "1",
			"text": filename,
			"state":"opened",
			"children":[{
			//	"id": "11",
				"text":"Curves",
				"state":"opened",
				"children":[
				]
			}]
		};
		for (var i = 0; i < list.length; i++) {temp.children[0].children.push({class:"item", text:list[i]})}
		newtree.push(temp);
	}
	function updateTreeView(obj){
		if(!obj){obj=newtree}else{newtree=obj;}
		$('#treeone').tree({data:obj});
		$('#treetwo').tree({data:obj});
	}
	(this.init=function(){	
		newtree=[new Object()];
		$.get('./tree.json', function(data){
			updateTreeView([JSON.parse(data)]);
		});
	}())
	this.updateTreeView=updateTreeView;
}

function testProgressbar(){
    var value = $('#progressbar').progressbar('getValue');
    if (value < 100){
        value += Math.floor(Math.random() * 10);
        $('#progressbar').progressbar('setValue', value);
        setTimeout(arguments.callee, 200);
    }else{$('#progressbar').progressbar('setValue', 0);}
}

function showGroup(){
    $('#pg1').propertygrid({
        showGroup:true
    });
    $('#pg2').propertygrid({
        showGroup:true
    });	
}

String.prototype.repeat = function(count, seperator) {
    seperator = seperator || '';
    var a = new Array(count);
    for (var i = 0; i < count; i++){
        a[i] = this;
    }
    return a.join(seperator);
};


Date.prototype.format = function(style) {
    var o = {
        "y{4}|y{2}" : this.getFullYear(), //year  
        "M{1,2}" : this.getMonth() + 1, //month  
        "d{1,2}" : this.getDate(),      //day  
        "H{1,2}" : this.getHours(),     //hour  
        "h{1,2}" : this.getHours()  % 12,  //hour  
        "m{1,2}" : this.getMinutes(),   //minute  
        "s{1,2}" : this.getSeconds(),   //second  
        "E" : this.getDay(),   //day in week  
        "q" : Math.floor((this.getMonth() + 3) / 3),  //quarter  
        "S{3}|S{1}"  : this.getMilliseconds() //millisecond  
    };
    for(var k in o ){
        style = style.replace(new RegExp("("+ k +")"), function(m){
            return ("0".repeat(m.length) + o[k]).substr(("" + o[k]).length);
        });
    }
    return style;
};





/*/
//Открывать графики в новом окне
$(function(){
	var el=["placeholderQ1","placeholderQ2"];
	(function addEventsToHTML(){
		function divDblClick(){
			myGlob.showGraph(["rate"],"#"+this.id,["red"]);
		}
		for (var i = 0; i < el.length; i++){
			var div1 = document.getElementById(el[i]);
			div1.ondblclick = divDblClick;
		}
	}())
});
$(function showPlot() {
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);
    var plshd=["#placeholderQ1","#placeholderQ2"];
    for (var i = 0; i < plshd.length; i++){
        $.plot($(plshd[i]), [
            {
                data: d1,
            }
        ]);
    }
});
$(function(){
    var rds=["#placeholderQ1","#placeholderQ2"];
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5) d1.push([i, Math.sin(i)]);		
    for (var i = 0; i < rds.length; i++){        $(rds[i]).draggable().resizable();    }});
/*/
function addArbitrary(graphs){
	var div = document.getElementById('myView1'); 
	var divChild=document.createElement('div');
	divChild.setAttribute('id','placeholderGr'+myGlob.count);	
	divChild.setAttribute('style','width:400px;height:300px');
	// openflot event
	var toShow=[]; for (var i = 0; i < graphs.length; i++){ toShow.push({data:myGlob.graphArrays[graphs[i].name],color:graphs[i].color})}
	//function divDblClick(toShow){		flo=openflot(); flo(toShow)	}
	divChild.ondblclick = function (){		
		myGlob.showGraph("#"+this.id);
		//flo=openflot(); 
		//flo(myGlob.idMap(this.id))	;
	}//divDblClick;
	div.appendChild(divChild);
	// resize
	$("#placeholderGr"+myGlob.count).draggable().resizable();
	// data
	$.plot($("#placeholderGr"+myGlob.count), toShow);
	myGlob.appendIdGraph("#placeholderGr"+myGlob.count, toShow);
	myGlob.count+=1;
}