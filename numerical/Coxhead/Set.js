/*  =============================== SETS ===========================

Description: a package of Javascript routines to handle sets; stored as methods
of the global variable Set.
Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
Copyright: Peter Coxhead, 2008; released under GPLv3
  (http://www.gnu.org/licenses/gpl-3.0.html).
Last Revision: 10 Dec 2008
*/
var version = 'Set 1.00';
/*

Uses IOUtils.js.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The empty set is represented by null.

For the following functions, element values can be of any type on
which <, == and > are allowed.

Set.create(v): creates a new set with one element of value v.
Set.addElem(v,s): adds the value v to the set s.

Set.isElem(v,s): tests whether v is an element of set s.

Set.min(s): returns the minimum value in the set s.
Set.max(s): returns the maximum value in the set s.

Set.isSubset(s1,s2): tests whether set s1 is a (non strict) subset
  of set s2.
Set.equals(s1,s2): tests whether sets s1 and s2 are equal.

Set.size(s): returns the size of set s.

Set.union(s1,s2): returns the union of sets s1 and s2.
Set.intersection(s1,s2): returns the intersection of sets s1 and s2.
Set.intersects(s1,s2): determines whether sets s1 and s2 intersect.

For the following functions, the elements' values must be numbers or
strings of length 1.

Set.unionR(s1,s2): returns the 'continuous' range of values of
  which s1 and s2 are both subsets. The values of the elements of s1
  and s2 must all either be numbers or strings of length 1. 
Set.intersectionR(s1,s2): returns the 'continuous' range of values
  which covers the intersection of the sets. The values of the
  elements of s1 and s2 must all either be numbers or strings of
  length 1.

Set.toString(s): represents set s in the form {elem1,elem2,...}.
Set.toString1(s): represents set s in the form {elem1,elem2,...} BUT
  if the set is a singleton, omits the {}.
  
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Example
-------

(Also uses IOUtils.js.)

with (Set)
{ var s1 = addElem(8,addElem(6,addElem(1,create(3))));
  println('s1 = '+s1);
  var s2 = addElem(4,addElem(1,null));
  println('s2 = '+s2);
  println('s1 union s2 = '+union(s1,s2));
  println('s1 intersection s2 = '+intersection(s1,s2));
  println('s1 range-intersection {10} = '+intersectionR(s1,create(10)));
  
  var w1 = addElem('cat',addElem('dog',addElem('horse',addElem('donkey',null))));
  println('w1 = '+w1);
  var w2 = addElem('horse',addElem('donkey',null));
  println('w2 = '+w2);
  println('w1 intersection w2 = '+intersection(w1,w2));
  println('max(w1) = '+max(w1));
}

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

var Set = new createSetPackage();
function createSetPackage()
{
this.version = version;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// _chkSetArg is a utility function which checks that argument i of
//   the function whose name is fname and whose value is arg is a
//   Set object.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function _chkSetArg(fname,i,arg)
{ if(arg != null && !arg.isSet)
  { throw '***ERROR: Argument '+i+' of Set.'+fname+
            ' is not a Set; its value is "'+arg+'".';
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.create(v): creates a new set with one element of value v.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.create = _newSet;
function _newSet(v)
{ var s = new Object();
  s.val = v;
  s.nxt = null;
  s.toString = _setToString0;
  s.isSet = true;
  return s;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.addElem(v,s): adds the value v to the set s.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.addElem = function (v,s)
{ _chkSetArg('addElem',2,s);
  return _addElem(v,s);
}
// _addElem actually does the insertion
function _addElem(v,s)
{ if (_isElem(v,s)) return s; // don't create new sets unnecessarily
  return _addElem_aux(v,s);
}
function _addElem_aux(v,s)
{ if (s == null) return _newSet(v);
  if(v < s.val)
  { var e = _newSet(v);
    e.nxt = s;
    return e;
  }
  return _addElem_aux(s.val,_addElem_aux(v,s.nxt));
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.isElem(v,s): tests whether the value v is an element of set s.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.isElem = function (v,s)
{ _chkSetArg('isElem',2,s);
  return _isElem(v,s);
}
function _isElem(v,s)
{ while (s != null)
  { if (s.val == v) return true;
    s = s.nxt;
  }
  return false;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.min(s): returns the minimum value in the set s.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.min = function (s)
{ _chkSetArg('min',1,s);
  return _minSet(s);
}
function _minSet(s)
{ if(s == null) return null;
  return s.val;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.max(s): returns the maximum value in the set s.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.max = function (s)
{ _chkSetArg('max',1,s);
  return _maxSet(s);
}
function _maxSet(s)
{ if (s == null) return null;
  while (s.nxt != null) s = s.nxt;
  return s.val;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.isSubset(s1,s2): tests whether set s1 is a (non strict) subset
//   of set s2.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.isSubset = function (s1,s2)
{ _chkSetArg('isSubset',1,s1);
  _chkSetArg('isSubset',2,s2);
  return _isSubset(s1,s2);
}
function _isSubset(s1,s2)
{ if(s1 == null) return true;
  if(s2 == null) return false;
  if(s1.val < s2.val) return false;
  if(s1.val == s2.val) return _isSubset(s1.nxt,s2.nxt);
  return _isSubset(s1,s2.nxt);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.equals(s1,s2): tests whether sets s1 and s2 are equal.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.equals = function (s1,s2)
{ _chkSetArg('equals',1,s1);
  _chkSetArg('equals',2,s2);
  return _equals(s1,s2);
}
function _equals(s1,s2)
{ return _sizeSet(s1) == _sizeSet(s2) &&
         _isSubset(s1,s2);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.size(s): returns the size of set s.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.size = function (s)
{ _chkSetArg('size',1,s);
  return _sizeSet(s);
}
function _sizeSet(s)
{  var res = 0;
   while (s != null)
   { res++;
     s = s.nxt;
   }
   return res;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.union(s1,s2): returns the union of sets s1 and s2.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.union = function (s1,s2)
{ _chkSetArg('union',1,s1);
  _chkSetArg('union',2,s2);
  return _union(s1,s2);
}
function _union(s1,s2)
{ if(s1 == null) return s2;
  if(s2 == null) return s1;
  if(s1.val < s2.val) return _addElem(s1.val,_union(s1.nxt,s2));
  return _addElem(s2.val,_union(s1,s2.nxt));
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.intersection(s1,s2): returns the intersection of sets s1 and s2.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.intersection = function (s1,s2)
{ _chkSetArg('intersection',1,s1);
  _chkSetArg('intersection',2,s2);
  return _intersection(s1,s2);
}
function _intersection(s1,s2)
{ if(s1 == null) return null;
  if(s2 == null) return null;
  if(s1.val < s2.val) return _intersection(s1.nxt,s2);
  if(s1.val == s2.val) return _addElem(s1.val,_intersection(s1.nxt,s2.nxt));
  return _intersection(s1,s2.nxt);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.intersects(s1,s2): determines whether sets s1 and s2 intersect.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.intersects = function (s1,s2)
{ _chkSetArg('intersects',1,s1);
  _chkSetArg('intersects',2,s2);
  return _intersects(s1,s2);
}
function _intersects(s1,s2)
{ if(s1 == null) return false;
  if(s2 == null) return false;
  if(s1.val < s2.val) return _intersects(s1.nxt,s2);
  if(s1.val == s2.val) return true;
  return _intersects(s1,s2.nxt);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.unionR(s1,s2): returns the 'continuous' range of values of
//   which s1 and s2 are both subsets. The values of the elements of s1
//   and s2 must all either be numbers or strings of length 1. 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.unionR = function (s1,s2)
{ _chkSetArg('unionR',1,s1);
  _chkSetArg('unionR',2,s2);
  if(typeof s1.val == 'number') return _unionRN(s1,s2);
  if(typeof s1.val == 'string' && s1.val.length == 1) return _unionRS(s1,s2);
  throw '***ERROR: in Set.unionR: elements don\'t have values which are'+
        ' numbers or strings of length 1.';
}
function _unionRN(s1,s2)
{ var min = Math.min(_minSet(s1),_minSet(s2));
  var max = Math.max(_maxSet(s1),_maxSet(s2));
  var last = null;
  for(var i=max; i>=min; i--)
  { var node = _newSet(i);
    node.nxt = last;
    last = node;
  }
  return last;
}
function _unionRS(s1,s2)
{ var min = Math.min(_minSet(s1).charCodeAt(0),_minSet(s2).charCodeAt(0));
  var max = Math.max(_maxSet(s1).charCodeAt(0),_maxSet(s2).charCodeAt(0));
  var last = null;
  for(var i=max; i>=min; i--)
  { var node = _newSet(String.fromCharCode(i));
    node.nxt = last;
    last = node;
  }
  return last;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.intersectionR(s1,s2): returns the 'continuous' range of values
//   which covers the intersection of the sets. The values of the
//   elements of s1 and s2 must all either be numbers or strings of
//   length 1.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.intersectionR = function (s1,s2)
{ _chkSetArg('intersectionR',1,s1);
  _chkSetArg('intersectionR',2,s2);
  if(typeof s1.val == 'number') return _intersectionRN(s1,s2);
  if(typeof s1.val == 'string' && s1.val.length == 1) return _intersectionRS(s1,s2);
  throw '***ERROR: in Set.intersectionR: elements don\'t have values which are'+
        ' numbers or strings of length 1.';
}
function _intersectionRN(s1,s2)
{ var min = Math.max(_minSet(s1),_minSet(s2));
  var max = Math.min(_maxSet(s1),_maxSet(s2));
  if(min > max)
  { var temp = min;
    min = max;
    max = temp;
  }
  var last = null;
  for(var i=max; i>=min; i--)
  { var node = _newSet(i);
    node.nxt = last;
    last = node;
  }
  return last;
}
function _intersectionRS(s1,s2)
{ var min = Math.max(_minSet(s1).charCodeAt(0),_minSet(s2).charCodeAt(0));
  var max = Math.min(_maxSet(s1).charCodeAt(0),_maxSet(s2).charCodeAt(0));
  if(min > max)
  { var temp = min;
    min = max;
    max = temp;
  }
  var last = null;
  for(var i=max; i>=min; i--)
  { var node = _newSet(String.fromCharCode(i));
    node.nxt = last;
    last = node;
  }
  return last;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.toString(s): represents set s in the form {elem1,elem2,...}.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.toString = function (s)
{ _chkSetArg('toString',1,s);
  return _setToString(s);
}
function _setToString(s)
{ if(s == null) return '&Oslash;';
  else return '{'+_setToString_aux(s)+'}';
}
function _setToString_aux(s)
{ if(s == null) return '';
  else if(s.nxt == null) return (s.val).toString();
  else return s.val+','+_setToString_aux(s.nxt);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Adapter for a zero argument toString function.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function _setToString0()
{ return Set.toString(this);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Set.toString1(s): represents set s in the form {elem1,elem2,...} BUT
//   if the set is a singleton, omits the {}.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.toString1 = function (s)
{ _chkSetArg('toString1',1,s);
  return _setToString1(s);
}
function _setToString1(s)
{ if(s == null) return '&Oslash;';
  else if(s.nxt == null) return s.val.toString();
  else return _setToString(s);
}

}
