  function testcase() 
  {
    function foo(x, y) 
    {
      
    }
    var o = {
      
    };
    var bf = foo.bind(o, 42, 101);
    if (bf.length === 0)
    {
      return true;
    }
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  