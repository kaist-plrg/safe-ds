  function testcase() 
  {
    var proto = {
      
    };
    Object.defineProperty(proto, "Father", {
      value : 10,
      configurable : true
    });
    var ConstructFun = (function () 
    {
      
    });
    ConstructFun.prototype = proto;
    var child = new ConstructFun();
    var preCheck = Object.isExtensible(child);
    Object.seal(child);
    var beforeDeleted = proto.hasOwnProperty("Father");
    delete proto.Father;
    var afterDeleted = proto.hasOwnProperty("Father");
    return preCheck && beforeDeleted && ! afterDeleted;
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  