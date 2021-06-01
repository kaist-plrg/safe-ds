  function testcase() 
  {
    try
{      var data = "data";
      var getFunc = (function () 
      {
        return 12;
      });
      var setFunc = (function (value) 
      {
        data = value;
      });
      Object.defineProperty(Object.prototype, "length", {
        get : getFunc,
        set : setFunc,
        configurable : true
      });
      var verifyValue = false;
      var argObj = (function () 
      {
        return arguments;
      })();
      verifyValue = (argObj.length === 0);
      var verifyWritable = false;
      argObj.length = 1001;
      verifyWritable = (argObj.length === 1001);
      var verifyEnumerable = false;
      for(var p in argObj)
      {
        if (p === "length")
        {
          verifyEnumerable = true;
        }
      }
      var verifyConfigurable = false;
      delete argObj.length;
      verifyConfigurable = argObj.hasOwnProperty("length");
      return verifyValue && verifyWritable && ! verifyEnumerable && ! verifyConfigurable && data === "data";}
    finally
{      delete Object.prototype.length;}

  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  