  this.p1 = 1;
  var result = "result";
  var myObj = {
    p1 : 'a',
    value : 'myObj_value',
    valueOf : (function () 
    {
      return 'obj_valueOf';
    })
  };
  try
{    var f = (function () 
    {
      with (myObj)
      {
        throw value;
        p1 = 'x1';
      }
    });
    f();}
  catch (e)
{    result = p1;}

  {
    var __result1 = result !== 1;
    var __expect1 = false;
  }
  {
    var __result2 = p1 !== 1;
    var __expect2 = false;
  }
  {
    var __result3 = myObj.p1 !== "a";
    var __expect3 = false;
  }
  