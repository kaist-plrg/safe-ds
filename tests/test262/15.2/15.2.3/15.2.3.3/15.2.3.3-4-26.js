  function testcase() 
  {
    var desc = Object.getOwnPropertyDescriptor(Object, "keys");
    if (desc.value === Object.keys && desc.writable === true && desc.enumerable === false && desc.configurable === true)
    {
      return true;
    }
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  