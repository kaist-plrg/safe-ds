  x = [];
  x[new String("0")] = 0;
  {
    var __result1 = x[0] !== 0;
    var __expect1 = false;
  }
  y = [];
  y[new String("1")] = 1;
  {
    var __result2 = y[1] !== 1;
    var __expect2 = false;
  }
  z = [];
  z[new String("1.1")] = 1;
  {
    var __result3 = z["1.1"] !== 1;
    var __expect3 = false;
  }
  