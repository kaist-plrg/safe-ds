  function testcase() 
  {
  "use strict";
    function _10_5_7_b_4_fun() 
    {
      var _10_5_7_b_4_1 = arguments[0] === 30 && arguments[1] === 12;
      delete arguments[1];
      var _10_5_7_b_4_2 = arguments[0] === 30 && typeof arguments[1] === "undefined";
      return _10_5_7_b_4_1 && _10_5_7_b_4_2;
    }
    ;
    return _10_5_7_b_4_fun(30, 12);
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  