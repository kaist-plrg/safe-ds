  function testcase() 
  {
    var arr = [];
    Object.defineProperty(arr, "1", {
      value : true
    });
    try
{      Object.defineProperties(arr, {
        "1" : {
          value : false
        }
      });
      return false;}
    catch (ex)
{      return (ex instanceof TypeError) && dataPropertyAttributesAreCorrect(arr, "1", true, false, false, false);}

  }
  {
    var __result1 = testcase();
    var __expect1 = true;
  }
  
function dataPropertyAttributesAreCorrect(obj,
                                          name,
                                          value,
                                          writable,
                                          enumerable,
                                          configurable) {
    var attributesCorrect = true;

    if (obj[name] !== value) {
        if (typeof obj[name] === "number" &&
            isNaN(obj[name]) &&
            typeof value === "number" &&
            isNaN(value)) {
            // keep empty
        } else {
            attributesCorrect = false;
        }
    }

    try {
        if (obj[name] === "oldValue") {
            obj[name] = "newValue";
        } else {
            obj[name] = "OldValue";
        }
    } catch (we) {
    }

    var overwrited = false;
    if (obj[name] !== value) {
        if (typeof obj[name] === "number" &&
            isNaN(obj[name]) &&
            typeof value === "number" &&
            isNaN(value)) {
            // keep empty
        } else {
            overwrited = true;
        }
    }
    if (overwrited !== writable) {
        attributesCorrect = false;
    }

    var enumerated = false;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && prop === name) {
            enumerated = true;
        }
    }

    if (enumerated !== enumerable) {
        attributesCorrect = false;
    }


    var deleted = false;

    try {
        delete obj[name];
    } catch (de) {
    }
    if (!obj.hasOwnProperty(name)) {
        deleted = true;
    }
    if (deleted !== configurable) {
        attributesCorrect = false;
    }

    return attributesCorrect;
}
