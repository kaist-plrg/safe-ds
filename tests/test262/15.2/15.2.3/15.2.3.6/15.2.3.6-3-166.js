  function testcase() 
  {
    var obj = {
      
    };
    var arrObj = [1, 2, 3, ];
    arrObj.writable = true;
    Object.defineProperty(obj, "property", arrObj);
    var beforeWrite = obj.hasOwnProperty("property");
    obj.property = "isWritable";
    var afterWrite = (obj.property === "isWritable");
    return beforeWrite === true && afterWrite === true;
  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  