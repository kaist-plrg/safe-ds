  var x = [, 1, ];
  var arr = x.concat([], [, ]);
  arr.getClass = Object.prototype.toString;
  {
    var __result1 = arr.getClass() !== "[object " + "Array" + "]";
    var __expect1 = false;
  }
  {
    var __result2 = arr[0] !== undefined;
    var __expect2 = false;
  }
  {
    var __result3 = arr[1] !== 1;
    var __expect3 = false;
  }
  {
    var __result4 = arr[2] !== undefined;
    var __expect4 = false;
  }
  {
    var __result5 = arr.length !== 3;
    var __expect5 = false;
  }
  