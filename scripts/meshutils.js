//

var meshUtils={

colormap:[[0,0,0.5625],[0,0,0.625],[0,0,0.6875],[0,0,0.75],[0,0,0.8125],[0,0,0.875],[0,0,0.9375],[0,0,1],[0,0.0625,1],[0,0.125,1],[0,0.1875,1],[0,0.25,1],[0,0.3125,1],[0,0.375,1],[0,0.4375,1],[0,0.5,1],[0,0.5625,1],[0,0.625,1],[0,0.6875,1],[0,0.75,1],[0,0.8125,1],[0,0.875,1],[0,0.9375,1],[0,1,1],[0.0625,1,0.9375],[0.125,1,0.875],[0.1875,1,0.8125],[0.25,1,0.75],[0.3125,1,0.6875],[0.375,1,0.625],[0.4375,1,0.5625],[0.5,1,0.5],[0.5625,1,0.4375],[0.625,1,0.375],[0.6875,1,0.3125],[0.75,1,0.25],[0.8125,1,0.1875],[0.875,1,0.125],[0.9375,1,0.0625],[1,1,0],[1,0.9375,0],[1,0.875,0],[1,0.8125,0],[1,0.75,0],[1,0.6875,0],[1,0.625,0],[1,0.5625,0],[1,0.5,0],[1,0.4375,0],[1,0.375,0],[1,0.3125,0],[1,0.25,0],[1,0.1875,0],[1,0.125,0],[1,0.0625,0],[1,0,0],[0.9375,0,0],[0.875,0,0],[0.8125,0,0],[0.75,0,0],[0.6875,0,0],[0.625,0,0],[0.5625,0,0],[0.5,0,0]]
,colormap2:[[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0],[0,0,1],[0.66667,0,1],[1,0,0],[1,0.5,0],[1,1,0],[0,1,0]]
,meshIndices0: function (xp,yp){
    var  indices = [],
        i, j, p1, p2;
   
    for (i = 0; i < xp -2; i++) {
      p1 = [i, i+1, i+1],
      p2 = [i+1, i, i];
      
      for (j = 0; j < yp -2; j++) {
        indices.push( p1[0] + j * (xp),
                      p1[1] + j * (xp),
                      p1[2] + (j +1) * (xp),

                      p2[0] + (j+1) * (xp),
                      p2[1] + (j+1) * (xp),
                      p2[2] + (j) * (xp));
      }
    }
    return indices;
  }
  
, mm_init: function (mm0)
{
 var mm=[Infinity,-Infinity];
 if(mm0 instanceof Array)
 {
    mm[0]=mm0[0];mm[1]=mm0[1];
 }
mm.update=function(v)
{
 if(v<this[0]) this[0]=v;
 if(v>this[1]) this[1]=v;
 return this;
}
  return mm;
}
  
,meshIndices: function (xp,yp){

     
    var  indices = [],
        i, j, p1, p2;
		
		var v00=0,v01,v10,v11,v=0;
   
    for (i = 0; i < xp -1; i++) {
       
	    
      
      for (j = 0; j < yp -1; j++) {
	  
	    v00=v+j;
		v01=v00+1;
		v10=v00+yp;
        v11=v10+1;
		indices.push(v00,v10,v01,v01,v10,v11);
      }
	   v+=yp;
    }
    return indices;
  }
  
 ,calc_vertices_normal:function(mesh) 
 {
 
  var calc_face_normal=function(i0,i1,i2,vertices,normals)
  {
     var v0x=vertices[i0],v0y=vertices[i0+1],v0z=vertices[i0+2];
     var dx=vertices[i1]-v0x,dy=vertices[i1+1]-v0y,dz=vertices[i1+2]-v0z;
     var vx=vertices[i2]-v0x,vy=vertices[i2+1]-v0y,vz=vertices[i2+2]-v0z;
	  var nx=dy * vz - dz * vy,ny=dz * vx - dx * vz,
                      nz=dx * vy - dy * vx;
	 				  
     normals[i0+0]+=nx;
     normals[i0+1]+=ny;
     normals[i0+2]+=nz;
	 normals[i1+0]+=nx;
     normals[i1+1]+=ny;
     normals[i1+2]+=nz;
	 normals[i2+0]+=nx;
     normals[i2+1]+=ny;
     normals[i2+2]+=nz;
    
  };
     var lv=mesh.vertices.length;
	 
	 if(mesh.normals&&mesh.normals.lengh==lv)
   	  {for(var n=0;n<lv;++n) mesh.normals[n]=0;}
      else mesh.normals=new Float32Array(lv);
		  
		  var normals=mesh.normals;
		for(var i=0;i<mesh.indices.length;i+=3)  
		{	  
		  calc_face_normal(3*mesh.indices[i],3*mesh.indices[i+1],3*mesh.indices[i+2],mesh.vertices,mesh.normals)   		   
		}
	return mesh; 
 }
  
  
    ,blank:'' 
  }
  
  


meshUtils.color_setter=function(zmin,zmax,_colormap)
   {
      var zmax_=zmax,zmin_=zmin; 
      var colormap=(_colormap)?_colormap:meshUtils.colormap
	  ,scale=(zmax>zmin)?colormap.length/(zmax-zmin):0,
	   offset= (zmax>zmin)? 0:colormap.length/2;
	   var nn=0;
	   this.pushto=function(mesh ,z )
	   {
	       var ca=mesh.colors;
	       var ind=(scale*(z-zmin_)+offset)>>0;
		   if(ind>=colormap.length) ind=colormap.length-1;
		    //ind=(Math.random()*colormap.length)>>0;
		   var c=colormap[ind];
		   //if(c)
		   {
		   
		    ca[nn++]=c[0];
			ca[nn++]=c[1];
			ca[nn++]=c[2];
			ca[nn++]=(c.length>3)?c[3]:1;
			
		   /*
		   ca.push(c[0]);
		   ca.push(c[1]);
		   ca.push(c[2]);
		   ca.push((c.length>3)?c[3]:1);
		   */
		   }
		   return ind;
   	   }
	   	  
   }

meshUtils.updatez=function(mesh,zf,_colormap)
{
   var zmax=-Infinity,zmin=Infinity;
   var l3=mesh.vertices.length,l=l3/3,l4=l*4,nnn=0;
   
   if(!((mesh.colors instanceof Float32Array)&&(l4==mesh.colors.length)))
   {
     mesh.colors=new Float32Array(l4);
   }
   if(!zf)
   for(var n=2;n<l3;n+=3)
   {
          var z=mesh.vertices[n];
           if(z>zmax) zmax=z;
		   if(z<zmin) zmin=z;
   }
   else if(typeof(zf)==='function')
         for(var n=0;n<l;++n)
        {
           var z=zf(mesh.vertices[3*n],mesh.vertices[3*n+1])
		   mesh.vertices[n]=z;
           if(z>zmax) zmax=z;
		   if(z<zmin) zmin=z;
        }
		else 
    	   for(var n=2;n<l3;n+=3)
        {
           var z=zf[nnn++];
		   mesh.vertices[n]=z;
           if(z>zmax) zmax=z;
		   if(z<zmin) zmin=z;
        }
		
   
   var  mm=new meshUtils.color_setter(zmin,zmax,_colormap);
   for(var n=2;n<l3;n+=3)
   {
          var z=mesh.vertices[n];
		  mm.pushto(mesh,z);
   }
   return mesh;
}


meshUtils.gridxy=function(grid,fpolar)
{
   var x = grid.x,
        y = grid.y,
        xFrom = x.from,
        xTo = x.to,
        xStep = x.step,
        yFrom = y.from,
        yTo = y.to,
        yStep = y.step,
        xp = ((xTo - xFrom) / xStep) >> 0,
        yp = ((yTo - yFrom) / yStep) >> 0,
         i, j,k, p1, p2;
		 
		 var x=xFrom,zmax=-Infinity,zmin=Infinity,z,zz=[];
		 
		 var vertices=new Float32Array(3*xp*yp);
		 var nn=0;
		 
		 
  for(i=0;i<xp;++i)	
	  {
        var y=yFrom;
	    for(j=0;j<yp;++j)	
		{
  		   var xc=x,yc=y;
		   if(fpolar)
           {		   
		    xc=x*Math.cos(y);
		    yc=x*Math.sin(y);
		   }
		   vertices[nn++]=xc;
		   vertices[nn++]=yc;
		   vertices[nn++]=0;
		   
	    	y+=yStep;
		 }
 
		 x+=xStep;

      }
  
  return   vertices;
  
}

  
meshUtils.update_from_ltx=function(mesh,opts) 
{
     var mm=meshUtils.mm_init(opts.mesh.zmm);
	 var za=opts.mesh.z.array;
	 
	 var colormap=(opts.colormap)?opts.colormap:meshUtils.colormap;
	 var vertices=mesh.vertices;
	 		
			var lv=za.length;
		
		for(var k=0,kv=0;k<lv;++k,kv+=3)		
     	  mm.update(vertices[kv+2]=za[k]);
  
   var  mcs=new meshUtils.color_setter(mm[0],mm[1],colormap);
	   
    for(var n=2;n<lv*3;n+=3)
    {
          var z=vertices[n];
		  mcs.pushto(mesh,z);
    }
	
		

	 
    return mesh;
}



meshUtils.mesh_from_ltx=function( o,_colormap)
{
         o=o.mesh;
        var colormap=(_colormap)?_colormap:meshUtils.colormap;
        var xa=o.x,ya=o.y,za=o.z;
		var N=xa.sizes[0],M=xa.sizes[1],l3;
		
		var vertices=new Float32Array(l3=3*N*M);
		var mesh={vertices:vertices,indices:meshUtils.meshIndices(M,N)};
		
		o.zmm=meshUtils.mm_init(o.zmm);
		var lv=xa.array.length;
		
		for(var k=0,kv=0;k<lv;++k,kv+=3)
		{
		  
		  vertices[kv+0]=xa.array[k];
		  vertices[kv+1]=ya.array[k];
     	  o.zmm.update(vertices[kv+2]=za.array[k]);
  
		}
	 
	   mesh.colors=new Float32Array(4*lv);
	 
	   var  mcs=new meshUtils.color_setter(o.zmm[0],o.zmm[1],colormap);
	   
	   
    for(var n=2;n<l3;n+=3)
    {
          var z=mesh.vertices[n];
		  mcs.pushto(mesh,z);
    }
	
   return mesh;	
	

}
 
meshUtils.drawf=function( grid,fun,fpolar,_colormap)
  {
  
     var colormap=(_colormap)?_colormap:meshUtils.colormap;
	 var fid=function(x){ return x};

      if(!fun) fun=grid.fun;
     var x = grid.x,
        y = grid.y,
        xFrom = x.from,
        xTo = x.to,
        xStep = x.step,
        yFrom = y.from,
        yTo = y.to,
        yStep = y.step,
        xp = ((xTo - xFrom) / xStep) >> 0,
        yp = ((yTo - yFrom) / yStep) >> 0,
         i, j,k, p1, p2,
		 vertices=[],colors=[];
		 var x=xFrom,zmax=-Infinity,zmin=Infinity,z,zz=[];
		 
		 var fx=(grid.x.fun)?grid.x.fun:fid,
		  fy=(grid.y.fun)?grid.y.fun:fid;
		 
		 
	  for(i=0;i<xp;++i)	
	  {
	    var y=yFrom;
		var xf=fx(x);
		
   	    for(j=0;j<yp;++j)	
	     {
		   var yf=fy(y);   
		   
		   
		   if(fpolar)
           {		   
		    xc=xf*Math.cos(yf);
		    yc=xf*Math.sin(yf);
		   }
		   else 
		   {
		      xc=xf;
			  yc=yf;
		   }
		   
		   z=fun(xc,yc);
		   if(z>zmax) zmax=z;
		   if(z<zmin) zmin=z;
		   vertices.push(xc);
		   vertices.push(yc);
		   vertices.push(z);
		   zz.push(z);
		   y+=yStep;
		 }
		   
		 
		 x+=xStep;
	   }
	   
	  var cs=new meshUtils.color_setter(zmin,zmax,colormap);
	  var mesh={vertices:vertices,colors:colors,indices:meshUtils.meshIndices(xp,yp),zvalue:zz};
	  var cc=[];
	  for(var k=0;k<zz.length;++k) 
	  {
	    cc.push(cs.pushto(mesh,zz[k]));
      }
		//var indices=meshUtils.meshIndices(xp,yp);
		mesh.vertices=new Float32Array(mesh.vertices);
		mesh.colors=new Float32Array(mesh.colors);
       return mesh;		
  
  }
  
  
    