var o1;
var o2;

if (@BoolTop)
	o1 = {};
else
	o1 = [];

if (@BoolTop)
	o2 = Object;
else
	o2 = Array;

var __result1 = o1 instanceof o2
var __expect1 = @BoolTop

var __result2 = o1 instanceof o2
var __expect2 = @BoolTop
