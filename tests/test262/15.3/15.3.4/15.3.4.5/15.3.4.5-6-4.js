  function testcase() 
  {
    var foo = (function () 
    {
      
    });
    var obj = foo.bind({
      
    });
    try
{      Object.defineProperty(Function.prototype, "property", {
        get : (function () 
        {
          return 3;
        }),
        configurable : true
      });
      Object.defineProperty(obj, "property", {
        value : 12
      });
      return obj.property === 12;}
    finally
{      delete Function.prototype.property;}

  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  