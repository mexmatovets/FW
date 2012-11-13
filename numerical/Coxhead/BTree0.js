/*  =========================== BINARY TREES =======================

Description: Javascript routines to handle binary trees with no
  ordering imposed on the node values. Stored as methods of the
  global variable BTree0.
Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
Copyright: Peter Coxhead, 2008; released under GPLv3
  (http://www.gnu.org/licenses/gpl-3.0.html).
Last Revision: 15 Dec 2008
*/
var version = 'BTree0 1.01a';
/*

Uses IOUtils.js.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The empty tree is represented by null.

Useful fields of each node of a tree are:
  isLeaf   boolean indicating whether the node is a leaf or not.
  t.val    the value stored at the node (interior or leaf).
  t.pa     the node's parent node (null for the root node).
  t.lc     the node's left child (null for a leaf).
  t.rc     the node's right child (null for a leaf).

BTree0.leaf(v): returns a new (binary) tree which has only a leaf with
  the value v.
BTree0.create(t1,t2): returns a new binary tree with t1 as its left
  subtree and t2 as the right subtree. Neither argument may be
  null.
BTree0.createFromArray(arr): returns a new binary tree created from
  the 'array representation' in arr (e.g. [[1,2],[3,4]]).

BTree0.copy(t): returns a copy of a tree's nodes (but not of the values
  stored at these nodes).
  
BTree0.equals(t1,t2,eq): decides whether two trees are the same
  (using the binary function eq to decide whether two leaf values are
  equal. If eq is omitted or null, string equality will be used.

BTree0.size(t): returns the total number of nodes in a tree.

BTree0.standardizeAt(node): standardizes a tree at the given node by
  making the size of the left subtree not greater than the size of
  the right subtree; subtrees of equal size will be ordered
  alphabetically.
  NOTE: standardizeAt alters the tree rather than returning a new
  one.
BTree0.standardize(tree): standardizes a tree by making the size of
  each left subtree not greater than the size of the corresponding
  right subtree; subtrees of equal size will be ordered alphabetically.
  NOTE: standardize alters the tree rather than returning a new one.

BTree0.find(t,val,toStr): returns the first found subtree of the tree t
  whose root has the value of the string val.
  In searching, it uses toStr to convert the value of a tree node to
  a string; if toStr is omitted (or null), the Javascript default
  method will be substituted.

BTree0.reroot(t,val,toStr): returns a new tree formed by re-rooting
  the tree t by inserting the new root immediately above the first
  found subtree whose root has the value of the string val.
  See BTree0.find for how toStr is used.

BTree0.allExtended(t,val): returns an array containing ALL trees
  which can be constructed from tree t by adding a new leaf with
  value val anywhere in the tree. 

BTree0.toString(t,toStr): returns a string in which the leaves of the
  binary tree t are shown in parenthesized form, using the function
  toStr to convert the value of a leaf to a string.  If toStr is
  omitted, the Javascript default will be used.

BTree0.display(t,toStr): displays a binary tree in a 'graphical'
  form.
  It uses toStr to convert the value of both interior and leaf
  nodes to strings; if toStr is omitted (or null), a default
  method will be substituted.
  
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Example
-------

(Also uses IOUtils.js.)

with (BTree0)
{
  var t1 = createFromArray([[[4,5],[2,3]],1]);
  println('t1 = '+t1);
  display(t1);
  standardize(t1);
  println('After standardization');
  display(t1);
  var t2 = reroot(t1,2);
  println('After re-rooting at 2');
  display(t2);
  var forest = allExtended(t2,0);
  println('There are '+forest.length+' extended trees:');
  for (var i = 0; i < forest.length; i++) println(forest[i]);
}

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

var BTree0 = new createBTree0Package();
function createBTree0Package()
{
this.version = version;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Representation: each node has the accessible fields: isLeaf (whether
// a leaf or not), pa (parent), lc (left child), rc (right child),
// val (value), mark.
// Leaves have lc == rc == null. The root has pa == null.
// The mark field is available for various uses.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// _chkBTree0Arg is a utility function which checks that argument i of
//   the function whose name is fname and whose value is arg is a
//   binary tree object.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function _chkBTree0Arg(fname,i,arg)
{ if (arg != null && !arg.isBTree0)
  { throw '***ERROR: Argument '+i+' of BTree0.'+fname+
          ' is not a binary tree; its value is "'+arg+'".';
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.leaf(v): returns a new binary tree which is only a leaf with
//   the value v.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.leaf = _newLeaf;
function _newLeaf(v)
{ var t = new Object();
  t.isLeaf = true;
  t.val = v;
  t.pa = null;
  t.lc = null;
  t.rc = null;
  t.mark = null;
  t.toString = _treeToString0;
  t.isBTree0 = true;
  return t;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.create(t1,t2): returns a new binary tree with t1 as its left
//   subtree and t2 as the right subtree. Neither argument may be
//   null.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.create = function (t1,t2)
{ _chkBTree0Arg('create',1,t1);
  _chkBTree0Arg('create',2,t2);
  return _newTree(t1,t2);
}
function _newTree(t1,t2)
{ var t = new Object();
  t.isLeaf = false;
  t.val = null;
  t.pa = null;
  t.lc = t1;
  t1.pa = t;
  t.rc = t2;
  t2.pa = t;
  t.mark = null;
  t.toString = _treeToString0;
  t.isBTree0 = true;
  return t;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.createFromArray(arr): returns a new binary tree created from
//   the 'array representation' in arr (e.g. [[1,2],[3,4]]).
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.createFromArray = function (arr)
{ if (!(arr instanceof Array))
  { throw '***ERROR: in BTree0.createFromArray: argument is not an array.';
  }
  return _newTreeFromArray(arr);
}
function _newTreeFromArray(a)
{ if (!(a instanceof Array)) // i.e. it's a leaf
  { return _newLeaf(a);
  }
  else if (a.length == 2)
  { return _newTree(_newTreeFromArray(a[0]),_newTreeFromArray(a[1]));
  }
  else
  { throw '***ERROR: in BTree0.createFromArray: the array does not correctly'+
          ' represent a binary tree.';
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.copy(t): returns a copy of a tree's nodes (but not of the values
//  stored at these nodes).
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.copy = function (t)
{ _chkBTree0Arg('copy',1,t);
  return _copyTree(t);
}
function _copyTree(t)
{ if (t == null) return null;
  else if (t.isLeaf) return _newLeaf(t.val);
  else return _newTree(_copyTree(t.lc),_copyTree(t.rc));
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.equals(t1,t2,eq): decides whether two trees are the same
//   (using the binary function eq to determine equality of the leaves).
//   If eq is omitted or null, string equality will be used.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var _eq;
this.equals = function (t1,t2,eq)
{ _chkBTree0Arg('equals',1,t1);
  _chkBTree0Arg('equals',2,t2);
  if (eq == null)
  { _eq = function (v1,v2) { return v1+'' == v2+''; };
  }
  else _eq = eq;
  return _equals(t1,t2);
}
function _equals(t1,t2)
{ if (t1.isLeaf && t2.isLeaf) return _eq(t1.val,t2.val);
  if (!t1.isLeaf && !t2.isLeaf)
    return _equals(t1.lc,t2.lc) && _equals(t1.rc,t2.rc) ||
           _equals(t1.lc,t2.rc) && _equals(t1.rc,t2.lc);
  return false;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.size(t): returns the total number of nodes in a tree.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.size = function (t)
{ _chkBTree0Arg('size',1,t);
  return _sizeTree(t);
}
function _sizeTree(t)
{ if (t == null) return 0;
  else if (t.isLeaf) return 1;
  else return 1 + _sizeTree(t.lc) + _sizeTree(t.rc);
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.standardizeAt(node): standardizes a tree at the given node by
//   making the size of the left subtree not greater than the size of
//   the right subtree; subtrees of equal size will be ordered
//   alphabetically.
//   NOTE: standardizeAt alters the tree rather than returning a new
//   one.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.standardizeAt = function (t)
{ _chkBTree0Arg('standardizeAt',1,t);
  _standardizeTreeAt(t);
}
function _standardizeTreeAt(t)
{ var res = _standardizeTreeAt_aux(t);
  if (res[0] > res[1] ||
      res[0] == res[1] && res[1] > res[2])
  { var temp = t.lc;
    t.lc = t.rc;
    t.rc = temp;
  }
}
function _standardizeTreeAt_aux(t)
{ if (t == null) return [0,0,'',''];
  if (t.isLeaf) return [1,0,t.val,''];
  else
  { var lres = _standardizeTreeAt_aux(t.lc);
    var rres = _standardizeTreeAt_aux(t.rc);
    return [lres[0]+lres[1], rres[0]+rres[1], lres[1]+lres[2], rres[1]+rres[2]]; 
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.standardize(tree): standardizes a tree by making the size of
//   each left subtree not greater than the size of the corresponding
//   right subtree; subtrees of equal size will be ordered
//   alphabetically.
//   NOTE: standardize alters the tree rather than returning a new one.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.standardize = function (t)
{ _chkBTree0Arg('standardize',1,t);
  _standardizeTree(t);
}
function _standardizeTree(t)
{ if (t.isLeaf) return [1,0,''+t.val,''];
  else
  { var lres = _standardizeTree(t.lc);
    var rres = _standardizeTree(t.rc);
    var res = [lres[0]+lres[1], rres[0]+rres[1], lres[1]+lres[2], rres[1]+rres[2]]; 
    if (res[0] > res[1] ||
       res[0] == res[1] && (lres[1] > rres[1] ||
                            lres[1] == rres[1] && lres[2] > rres[2]))
    { var temp = t.lc;
      t.lc = t.rc;
      t.rc = temp;
    }
    return res;
  }
}
 // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.find(t,val,toStr): returns the first found subtree of the tree t
//   whose root has the value of the string val.
//   In searching, it uses toStr to convert the value of a tree node to
//   a string; if toStr is omitted (or null), the Javascript default
//   method will be substituted.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.find = function (t,val,toStr)
{ _chkBTree0Arg('find',1,t);
  return _find(t,val,toStr);
}
var _toStr;
function _find(t,val,toStr)
{ if (toStr == null) _toStr = function(x) { return ''+x; };
  else _toStr = toStr;
  return _find_aux(t,val);
}
function _find_aux(t,val)
{ if (t == null) return null;
  else if (_toStr(t.val) == val) return t;
  else
  { var res = _find_aux(t.lc,val);
    if (res != null) return res;
    else return _find_aux(t.rc,val);
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.reroot(t,val,toStr): returns a new tree formed by re-rooting
//   the tree t by inserting the new root immediately above the first
//   found subtree whose root has the value of the string val.
//   See BTree0.find for how toStr is used.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.reroot = function (t,val,toStr)
{ _chkBTree0Arg('reroot',1,t);
  return _reroot(t,val,toStr);
}
function _reroot(t,val,toStr)
{ var t1 = _copyTree(t);// because destructive operations!
  // first find the node above which the new root goes.
  var target = _find(t1,val,toStr);
  if (target == null) { alert('target not found in reroot!'); return null; }
  if (target == t1) return t1;
  // create the new root and splice it in;
  // initially it has a dummy child
  var targetParent = target.pa;
  var root = _newTree(target,_newLeaf(''));
  root.rc = targetParent;
  if (targetParent.lc == target) targetParent.lc = null;
  else targetParent.rc = null;
  // reverse links up the tree
  var last = root;
  var curr = targetParent;
  while (curr.pa != null)
  { pa = curr.pa;
    if (curr.lc == null) curr.lc = pa;
    else curr.rc = pa;
    if (pa.lc == curr) pa.lc = null;
    else pa.rc = null;
    curr.pa = last;
    last = curr;
    curr = pa;
  }
  // curr is now the old root; cut it out
  if (last.lc == curr)
  { if (curr.lc == null)
    { last.lc = curr.rc; curr.rc.pa = last; }
    else
    { last.lc = curr.lc; curr.lc.pa = last; }
  }
  else
  { if (curr.lc == null)
    { last.rc = curr.rc; curr.rc.pa = last; }
    else
    { last.rc = curr.lc; curr.lc.pa = last; }
  }
  // return the new root
  return root;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// _numberTree(t): a private function which numbers each node using the
//   'spare' mark field.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var _i;
function _numberTree(t)
{ _i = 0;
  _numberTree_aux(t);
}
function _numberTree_aux(t)
{ if (t == null) return;
  t.mark = _i;
  _i++;
 _numberTree_aux(t.lc);
 _numberTree_aux(t.rc); 
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.allExtended(t,val): returns an array containing ALL trees
//   which can be constructed from tree t by adding a new leaf with
//   value v anywhere in the tree. 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.allExtended = function allExtended(t,val)
{ _chkBTree0Arg('allExtended',1,t);
  return _allExtendedTrees(t,val);
}
function _allExtendedTrees(t,val)
{ var n = _sizeTree(t);
  var res = new Array(n);
  for(var i = 0; i < n; i++)
  { // must copy both the tree and the leaf each time, since they
    // are both changed
    var t1 = _copyTree(t);
    var leaf = _newLeaf(val);
    _numberTree(t1);
    _extendTree(t1,i,leaf);
    res[i] = t1;
  }
  return res;
}
function _extendTree(t,i,leaf)
{ if (t == null) return false;
  if (t.mark == i)
  { if (t.isLeaf)
    { var tParent = t.pa;
      var newT = _newTree(leaf,t);
      if (tParent.lc == t) tParent.lc = newT;
      else tParent.rc = newT;
      newT.pa = tParent;
     }
    else
    { var newT = _newTree(t.lc,t.rc);
      t.lc = leaf;
      leaf.pa = t;
      t.rc = newT;
      newT.pa = t;
    }
    return true;
  }
  else return _extendTree(t.lc,i,leaf) || _extendTree(t.rc,i,leaf);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.toString(t,toStr): converts the leaves of a binary tree to
//   parenthesized form, using the function toStr to convert the
//   value of a leaf to a string.  If toStr is omitted, the Javascript
//   default will be used.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.toString = function (t,toStr)
{ if (t == null) return '()';
  _chkBTree0Arg('toString',1,t);
  return _treeToString(t,toStr);
}
var _toStr;
function _treeToString(t,toStr)
{ if (toStr == null) _toStr = function(x) { return ''+x; };
  else _toStr = toStr;
  return _treeToString_aux(t);
}
function _treeToString_aux(t)
{ if (t != null)
  { if (t.isLeaf) return _toStr(t.val);
    else return '('+_treeToString_aux(t.lc)+
                ', '+_treeToString_aux(t.rc)+')';
  }
  else return '()';
}
// Utility function
function _treeToString0()
{ return BTree0.toString(this,null);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BTree0.display(t,toStr): displays a binary tree in a 'graphical'
//   form, using toStr to convert the values of both
//   the interior nodes and the leaves to strings.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.display =  function (t,toStr)
{ if (t == null) return '()';
  _chkBTree0Arg('display',1,t);
  _displayTree(t,toStr);
}
var _toStr;
var _warned;
function _displayTree(t,toStr)
{ if (toStr == null) _toStr = function (x) { return ''+x; };
  else _toStr = toStr;
  _warned = false;
  _numberTree(t);
  _displayTree_aux(t,'','');
}
function _displayTree_aux(t,pad,lpad)
{ if (t != null)
  { 
    if (t.pa == null)
    { write(pad); write('--');
    }
    else if (t.pa.rc == t)
    { write(lpad); write('--');
    }
    else if (t.pa.lc == t)
    { write(pad); write('--');
    }
    var isLeaf = t.isLeaf;
    if (isLeaf) write('x');
    else write('o');
    if (t.val != null && typeof t.val != 'undefined')
    { write(' = ');
      write(_toStr(t.val));
    }
    nl();
    lpad = pad+'&nbsp;&nbsp;|';
    var rpad = pad+'&nbsp;&nbsp;&nbsp;';
    if (isLeaf) writeln(rpad);
    else
    { writeln(lpad);
      _displayTree_aux(t.lc,lpad,lpad);
      _displayTree_aux(t.rc,rpad,lpad);
    }
  }
  else 
  { if (!_warned) alert('BTree0.display: tree is not binary; null subtree(s) ignored.');
    _warned = true;
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// validateTree(t,toStr): validates a tree.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function validateTree(t,toStr)
{ _chkBTree0Arg('validate',1,t);
  return _validateTree(t);
}
var _toStr;
function _validateTree(t,toStr)
{ if (toStr == null) _toStr = function(x) { return ''+x; };
  else _toStr = toStr;
  return _validateTree_aux(t);
}
function _validateTree_aux(t)
{ _chkBTree0Arg('validate',1,t);
  if (t == null) return true;
  else if (t.isLeaf)
  { writeln('Validated '+_toStr(t.val));
    return true;
  }
  else if (t.isLeaf)
  { writeln('***ERROR: validate error in tree; node with only one child. Node value = '+_toStr(t.val));
    return false;
  }
  else if (t.lc.pa != t || t.rc.pa != t)
  { writeln('***ERROR: validate error in tree; one of node\'s children not linked back. Node value = '+_toStr(t.val)+
            '; child values = '+_toStr(t.lc.val)+', '+_toStr(t.rc.val));
    return false;
  }
  else if (!_validateTree_aux(t.lc)) return false;
  else return _validateTree_aux(t.rc);
}

}
