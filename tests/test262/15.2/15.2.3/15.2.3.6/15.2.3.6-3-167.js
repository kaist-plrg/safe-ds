  function testcase() 
  {
    var obj = {
      
    };
    var strObj = new String("abc");
    strObj.writable = true;
    Object.defineProperty(obj, "property", strObj);
    var beforeWrite = obj.hasOwnProperty("property");
    obj.property = "isWritable";
    var afterWrite = (obj.property === "isWritable");
    return beforeWrite === true && afterWrite === true;
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  