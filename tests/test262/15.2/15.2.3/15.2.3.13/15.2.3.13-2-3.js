  function testcase() 
  {
    function foo() 
    {
      
    }
    var e = Object.isExtensible(foo);
    if (e === true)
    {
      return true;
    }
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  