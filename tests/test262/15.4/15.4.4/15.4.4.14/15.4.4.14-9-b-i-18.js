  function testcase() 
  {
    var obj = {
      length : 1
    };
    Object.defineProperty(obj, "0", {
      set : (function () 
      {
        
      }),
      configurable : true
    });
    return 0 === Array.prototype.indexOf.call(obj, undefined);
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  