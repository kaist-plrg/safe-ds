  function testcase() 
  {
    var arr = {
      10 : false,
      length : 30
    };
    var fromIndex = {
      valueOf : (function () 
      {
        delete arr[10];
        return 3;
      })
    };
    return - 1 === Array.prototype.indexOf.call(arr, false, fromIndex);
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  