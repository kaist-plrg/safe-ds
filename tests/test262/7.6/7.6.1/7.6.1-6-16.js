  function testcase() 
  {
    var tokenCodes = {
      
    };
    tokenCodes.undefined = 0;
    tokenCodes.NaN = 1;
    tokenCodes.Infinity = 2;
    var arr = ['undefined', 'NaN', 'Infinity', ];
    for(var i = 0;i < arr.length;i++)
    {
      if (tokenCodes[arr[i]] !== i)
      {
        return false;
      }
      ;
    }
    return true;
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  