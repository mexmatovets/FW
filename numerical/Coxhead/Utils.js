/* ========================== Utilities =============================

Description: Javascript general utility routines.
Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
Copyright: Peter Coxhead, 2008; released under GPLv3
  (http://www.gnu.org/licenses/gpl-3.0.html).
Last Revision: 16 Dec 2008
*/
var version = 'Utils 1.00';
/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Utils.shuffle(a): returns a shuffled copy of the array a; no
  assumptions are made about the array entries.

Utils.sort(a,comp): returns a sorted copy of the array a using the
  binary function comp, which must return true if its first
  argument should come before its second argument.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

var Utils = new createUtilsPackage();
function createUtilsPackage()
{
this.version = version;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// shuffle(a): returns a shuffled copy of the array a; no assumptions
//   are made about the array entries.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.shuffle = function (a)
{ var n = a.length;
  // copy a before shuffling it
  var t = new Array(n);
  for (var i = 0; i < n; i++) t[i] = a[i];
  // now shuffle the copy
  for (var i = 0; i < n; i++)
  { // generate a random number j where i <= j <= n-1
    with (Math) var j = i + floor((n - i) * random());
    // and swap t[i] and t[j]
    if (j != i)
    { var temp = t[i];
      t[i] = t[j];
      t[j] = temp;
    } 
  }
  return t;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// sort(a,comp): returns a sorted copy of the array a using the binary
//   function comp to decide whether two entries need to be reordered.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
this.sort = function (a,comp)
{ if (comp != null) _comp = comp;
  else _comp = function (x,y) { return x <= y; };
  var n = a.length;
  // copy a before sorting it
  var t = new Array(n);
  for (var i = 0; i < n; i++) t[i] = a[i];
  _quicksort(t, 0, n-1);
  return t;
}
function _quicksort(a, left, right)
{ if (right > left)
  { pivotNewIndex = _partition(a, left, right, left);
    _quicksort(a, left, pivotNewIndex - 1);
    _quicksort(a, pivotNewIndex + 1, right);
  }
}
function _partition(a, left, right, pivotIndex)
{ var pivotValue = a[pivotIndex];
  var temp = a[pivotIndex];
  a[pivotIndex] = a[right];
  a[right] = temp;
  var storeIndex = left;
  for (var i = left; i < right; i++)
  { if (_comp(a[i], pivotValue))
    { temp = a[i];
      a[i] = a[storeIndex];
      a[storeIndex] = temp;
      storeIndex++;
    }
  }
  temp = a[storeIndex];
  a[storeIndex] = a[right];
  a[right] = temp;
  return storeIndex;
}

}