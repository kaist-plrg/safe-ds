  function testcase() 
  {
    var arr = [1, 2, 3, ];
    Object.defineProperty(arr, "length", {
      writable : false
    });
    try
{      Object.defineProperties(arr, {
        "3" : {
          value : "abc"
        }
      });
      return false;}
    catch (e)
{      return e instanceof TypeError && arr[0] === 1 && arr[1] === 2 && arr[2] === 3 && ! arr.hasOwnProperty("3");}

  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  