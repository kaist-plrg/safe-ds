var x = 123;

while(@BoolTop) {
	x = 456;
	while(@BoolTop) {
		x = 789;
		break;
		x = -1;
	}
	break;
	x = -2;
}

var __result1 = x;
var __expect1 = 123;

var __result2 = x;
var __expect2 = 456;

var __result2 = x;
var __expect2 = 789;
