(function(context)
{


/*
#define MAXIT 100 Maximum allowed number of iterations.
#define EULER 0.5772156649 Euler’s constant 
.
#define FPMIN 1.0e-30 Close to smallest representable floating-point number.
#define EPS 1.0e-7 Desired relative error, not smaller than the machine pre-cision.
*/

function expint( n, x)//Evaluates the exponential integral En(x).
{
  var MAXIT=100,EULER=0.5772156649,FPMIN=1.0e-30,EPS=1.0e-7;
  var nrerror=function(s){ throw Error(s);}
   var i,ii,nm1;
   var  a,b,c,d,del,fact,h,psi,ans;
   var exp=Math.exp,fabs=Math.abs,log=Math.log;

   nm1=n-1;
  if (n < 0 || x < 0.0 || (x==0.0 && (n==0 || n==1)))
    nrerror("bad arguments in expint");
  else {
 if (n == 0) ans=exp(-x)/x; //Special case.
 else {
if (x == 0.0) ans=1.0/nm1; //Another special case.
else {
if (x > 1.0) { //Lentzs algorithm (5.2).
b=x+n;
c=1.0/FPMIN;
d=1.0/b;
h=d;
for (i=1;i<=MAXIT;i++) {
a = -i*(nm1+i);
b += 2.0;
d=1.0/(a*d+b); //Denominators cannot be zero.
c=b+a/c;
del=c*d;
h *= del;
if (fabs(del-1.0) < EPS) {
ans=h*exp(-x);
return ans;
}
}
nrerror("continued fraction failed in expint");
} else { //Evaluate series.
ans = (nm1!=0 ? 1.0/nm1 : -log(x)-EULER); //Set first term.
fact=1.0;
for (i=1;i<=MAXIT;i++) {
fact *= -x/i;
if (i != nm1) del = -fact/(i-nm1);
else {
psi = -EULER; //Compute  (n).
for (ii=1;ii<=nm1;ii++) psi += 1.0/ii;
del=fact*(-log(x)+psi);
}
ans += del;
if (fabs(del) < fabs(ans)*EPS) return ans;
}
nrerror("series failed in expint");
}
}
}
}
return ans;
}

var sf=context.SpecFunctions||(window.SpecFunctions={});
sf.expint=expint;
})(window)