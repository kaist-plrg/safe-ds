  var re = (/x/);
  if (typeof re === 'function')
  {
    Function.prototype.bind.call(re, undefined);
  }
  else
  {
    try
{      Function.prototype.bind.call(re, undefined);
      $FAIL('#1: If IsCallable(func) is false, ' + 'then (bind should) throw a TypeError exception');}
    catch (e)
{      {
        var __result1 = ! (e instanceof TypeError);
        var __expect1 = false;
      }}

  }
  