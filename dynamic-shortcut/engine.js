J$.____startTime = new Date();
(function () {
  if(process.argv[2] === "-v") J$.verbose = true;
  J$.Date = Date;
  J$.____stack = [];
  J$.____argumentsLoc = [];
  J$.____visitedEntryControlPoints = [];
  J$.____symbolMap = Object.setPrototypeOf({}, null);
  J$.____symbolRefMap = new Map();
  J$.____isGlobalMutated = false;
  J$.____mutatedObjects = new Set();
  J$.____mutatedGetters = new Set();
  J$.____mutatingBuiltinNames = ["Array.prototype.push", "Array.prototype.pop", "Array.prototype.shift", "Array.prototype.unshift"];
  J$.Set = Set;
  J$.Map = Map;
  J$.Proxy = Proxy;
  J$.defineProperty = Object.defineProperty;
  J$.setPrototypeOf = Object.setPrototypeOf;
  J$.substring = String.prototype.substring;
  J$.lastIndexOf = String.prototype.lastIndexOf;
  J$.____processExit = process.exit || (e => { throw e });
  function accessDetected(dummy) {
    const key = dummy.key;
    console.warn(`[AccessDetected] ${key}`);
    const output = J$.____dumpState(J$.____arguments.oState, true);
    J$.____arguments.fs.writeFileSync("output.json", JSON.stringify(output, null, ""));
    J$.____processExit(0);
  };
  J$.____trap = {
    getPrototypeOf: accessDetected,
    setPrototypeOf: accessDetected,
    isExtensible: accessDetected,
    preventExtensions: accessDetected,
    getOwnPropertyDescriptor: accessDetected,
    defineProperty: accessDetected,
    has: accessDetected,
    get: accessDetected,
    set: accessDetected,
    deleteProperty: accessDetected,
    ownKeys: accessDetected,
    apply: accessDetected,
    construct: accessDetected
  };

  // Adding helper functions
  Set.prototype.union = function(setB) {
    for (var elem of setB) {
      this.add(elem);
    }
    return this;
  }
  Set.prototype.difference = function(setB) {
    for (var elem of setB) {
      this.delete(elem);
    }
    return this;
  }
})();
(function () {
  // Modeling
  // Replacing functions that return non-determinstic values.
  var absFuncs = {};
  function toAbs(code, traps) {
    function aFunc() {
      let handler = {};
      for(let trap of traps) {
        handler[trap] = function () {
          throw new TypeError("Cannot perform 'apply' on a proxy that has been revoked");
        };
      }
      let sv = new J$.Proxy((function () {}), handler);
      return sv;
    }
    var func = eval(code);
    absFuncs[code] = func;
    eval(`${code} = aFunc()`);
    var props = Object.getOwnPropertyNames(func);
    for(let prop of props) {
      try {
        var desc = Object.getOwnPropertyDescriptor(func, prop);
        Object.defineProperty(eval(code), prop, desc);
      } catch (e) {
        if(J$.verbose) console.log(e);
      }
    }
    Object.setPrototypeOf(eval(code), Object.getPrototypeOf(func));
  }
  //toAbs("Math.random", ["apply"]);
  //toAbs("Date", ["apply", "construct"]);
  //toAbs("Date.now", ["apply", "construct"]);
  return absFuncs;
})();
(function (fmap, fs, input, jalangiCode, oState) {
  function VBOT() {
    return {
      "pvalue": {
        "undefval": "__BOT__",
        "nullval": "__BOT__",
        "numval": "__BOT__",
        "boolval": "__BOT__",
        "strval": []
      },
      "locset": []
    };
  }

  const top = (function () { return this; })();
  const topProps = new Set(Object.getOwnPropertyNames(top));
  const gvFromInput = `__print__ window addEventListener NaN Function location Element navigator HTMLDocument HTMLElement setInterval URIError NodeList JSON document Error Number decodeURIComponent RangeError Boolean requestAnimationFrame HTMLDivElement Node NamedNodeMap ReferenceError __num_top__ HTMLHtmlElement setTimeout encodeURIComponent Array EvalError encodeURI __str_top__ eval __bool_top__ isFinite global Object EventTarget Math parseFloat TypeError <>Global<>global clearTimeout isNaN HTMLIFrameElement Date decodeURI RegExp parseInt Infinity XMLHttpRequest SyntaxError console <>Global<>true HTMLBodyElement undefined String Document`.split(" ");

  function toSAFEValue(v) {
    if(isSymbol(v)) {
      if(J$.____refMap.has(v)) {
        return alphaValue(v);
      }
      return { ____SYMBOL: J$.____symbolRefMap.get(v) };
    } else {
      return alphaValue(v);
    }
  }

  function alphaValue(v) {
    var ret = {
      "pvalue": {
        "undefval": "__BOT__",
        "nullval": "__BOT__",
        "numval": "__BOT__",
        "boolval": "__BOT__",
        "strval": []
      },
      "locset": []
    }
    if(v === undefined) {
      ret.pvalue.undefval = "__TOP__";
    } else if(v === null) {
      ret.pvalue.nullval = "__TOP__";
    } else {
      var ty = typeof v;
      switch(ty) {
        case "boolean":
          ret.pvalue.boolval = v;
          break;
        case "number":
          if(1/(-v) === Infinity) {
            ret.pvalue.numval = "-0";
          } else if(isNaN(v)) {
            ret.pvalue.numval = "NaN";
          } else if(v === Infinity) {
            ret.pvalue.numval = "+∞";
          } else if(v === -Infinity) {
            ret.pvalue.numval = "-∞";
          } else {
            ret.pvalue.numval = v;
          }
          break;
        case "string":
          ret.pvalue.strval = [v];
          break;
        case "object":
        case "function":
          if(!J$.____refMap.has(v)) throw new Error("Unknown object!");
          ret.locset.push(J$.____refMap.get(v));
          break;
      }
    }
    return ret;
  }
  J$.____alphaValue = alphaValue;

  function isSymbol(v) {
    return J$.____symbolRefMap.has(v);
  }
  J$.isSymbol = isSymbol;

  function generateSymbol(key) {
    if(key in J$.____symbolMap) return;

    const dummy = function() {};
    dummy.key = key;
    const sv = new J$.Proxy(dummy, J$.____trap);

    J$.____symbolMap[key] = sv;
    J$.____symbolRefMap.set(sv, key);

    return sv;
  }

  function alphaIValue(v) {
    var ret = {
      "value": VBOT(),
      "fidset": []
    };
    if(v === null || typeof v !== "object") {
      ret.value = alphaValue(v);
      return ret;
    }
    if("fid" in v) {
      ret.fidset.push(v.fid);
      return ret;
    }
    if("location" in v) {
      ret.value.locset.push(v.location);
      return ret;
    }
    throw new Error("alpha IValue");
  }

  function toDSValue(v, heap) {
    if(v === null || typeof v !== "object") return v;
    if("____SYMBOL" in v) return generateSymbol(v.____SYMBOL);
    if("fid" in v) return v.fid;
    if("undefined" in v) return undefined;
    if(typeof v.number !== "undefined") {
      switch (v.number) {
        case "NaN":
          return NaN;
        case "+Infinity":
          return Infinity;
        case "-Infinity":
          return -Infinity;
        case "-0":
          return -0;
        default:
          return v.number;
      }
    }
    if(!(v.location in heap)) {
      throw new ReferenceError(JSON.stringify(v) + " " + v.location);
    }
    return heap[v.location];
  }

  function heapBuild(state, constLoc) {
    const heap = Object.setPrototypeOf({}, null);
    const refMap = new J$.Map();
    const funcInfo = new J$.Map();
    J$.____refMap = refMap;
    J$.____funcInfo = funcInfo;
    for (let loc of Object.getOwnPropertyNames(state.heap)) {
      if(loc === constLoc) continue;
      let init, cl;
      let obj = state.heap[loc];
      if("____SYMBOL" in obj) {
        init = generateSymbol(obj.____SYMBOL);
        heap[loc] = init;
        refMap.set(init, loc);
        if(J$.verbose) console.warn("multiple object " + loc);
        continue;
        //throw new Error("Not a single object\n" + countObject(obj) + "\n" + JSON.stringify(obj));
      }
      if(/[A-Za-z]/.test(loc.charAt(1))) {
        try {
          init = eval(loc.substring(1, loc.indexOf(":")).replace(/^Global/, "top").replace("top.__print__", "console.log"))
          if(typeof init === "function") {
            funcInfo.set(init, {});
          }
        } catch (e) {
          //console.log(e);
        }
      } else {
        if(!("[[Class]]" in obj.imap)) continue;
        cl = toDSValue(obj.imap["[[Class]]"]);
        switch (cl) {
          case "Array":
            init = [];
            break;
          case "Date":
          case "Number":
          case "String":
          case "Boolean":
          case "RegExp":
            let prim = toDSValue(obj.imap["[[PrimitiveValue]]"]);
            if(isSymbol(prim)) {
              throw new Error("PrimitiveValue is abstracted: " + loc);
            }
            if(cl === "String") {
              eval(`init = new ${cl}(${JSON.stringify(prim)})`);
            } else {
              eval(`init = new ${cl}(${prim})`);
            }
            break;
          case "Error":
            if(obj.nmap["message"]) {
              const msg = toDSValue(obj.nmap["message"].value);
              init = new Error(msg);
            } else {
              init = new Error();
            }
            break;
          case "Function":
            if ("[[Call]]" in obj.imap) {
              //let fId = toDSValue(obj.imap["[[Call]]"]);
              //let scope = obj.imap["[[Scope]]"];
              //if(scope === null) scope = globalLoc;
              //else scope = scope.location;
              init = funcMap[loc];
              funcInfo.set(init, {});
            }
            break;
          case "Object":
            init = {};
            break;
          case "Arguments":
            init = (function () { return arguments; })();
            break;
          default:
            try {
              eval(`init = ${cl}`);
            } catch(e) {
            }
            break;
        }
      }
      if(typeof init === "undefined") {
        if(J$.verbose) console.warn("ignored " + loc);
        continue;
      }
      heap[loc] = init;
      refMap.set(init, loc);

      if(obj.imap === undefined) throw new Error(loc);
      if("[[Class]]" in obj.imap) {
        cl = toDSValue(obj.imap["[[Class]]"]);
      }
      switch (cl) {
        case "Function":
          if ("[[Call]]" in obj.imap) {
            let fId = toDSValue(obj.imap["[[Call]]"]);
            funcInfo.get(init).____Call = fId;
          }
          if ("[[Construct]]" in obj.imap) {
            let fId = toDSValue(obj.imap["[[Construct]]"]);
            funcInfo.get(init).____Construct = fId;
          }
          if ("[[Scope]]" in obj.imap) {
            if(obj.imap["[[Scope]]"] === null) {
              funcInfo.get(init).____Scope = null;
            } else {
              const sl = obj.imap["[[Scope]]"].location;
              let getter;
              if(sl === globalLoc) {
                getter = top;
              } else {
                getter = getterMap[obj.imap["[[Scope]]"].location];
              }
              funcInfo.get(init).____Scope = getter;
            }
          }
          break;
      }
    }
    for (let loc in heap) {
      let ref = heap[loc];
      if(isSymbol(ref)) continue;
      let obj = state.heap[loc];

      if(!(/[A-Za-z]/.test(loc.charAt(1)))) {
        try {
          Object.setPrototypeOf(ref, toDSValue(obj.imap["[[Prototype]]"], heap));
        } catch(e) {
        }
      }

      let props = Object.getOwnPropertyNames(obj.nmap);
      for(let prop of props) {
        try {
          const sv = toDSValue(obj.nmap[prop].value, heap);
          const desc = Object.getOwnPropertyDescriptor(ref, prop);
          if(desc && sv === desc.value) continue;
          Object.defineProperty(ref, prop, {
            value: sv,
            writable: obj.nmap[prop].writable,
            enumerable: obj.nmap[prop].enumerable,
            configurable: obj.nmap[prop].configurable
          });
        } catch(e) {
          if(e instanceof ReferenceError || e instanceof TypeError) {
            if(J$.verbose) console.warn(e.message);
          } else {
            throw new Error(loc + " " + prop + " " + e.message + JSON.stringify(obj.nmap[prop]));
          }
        }
      }
    }
    return heap;
  }

  function initArgs(state, heap) {
    let env = state.context.map[pureLocalLoc];
    let args;
    for (let v of Object.getOwnPropertyNames(env.record)) {
      if(v.startsWith("<>arguments<>")) {
        const bindingValue = env.record[v].value;
        return toDSValue(bindingValue, heap);
      }
    }
  }

  function initCaptured(state, heap) {
    for (let loc of Object.getOwnPropertyNames(state.context.map)) {
      if(loc.startsWith("#Global")) continue;
      if(loc.startsWith("#PureLocal")) continue;
      if(loc.startsWith("#Collapsed")) continue;
      if(!(loc in setterMap)) continue;
      let env = state.context.map[loc];
      for (let v of Object.getOwnPropertyNames(env.record)) {
        let bindingValue = env.record[v].value;
        let sv = toDSValue(bindingValue, heap);
        setterMap[loc][v](sv);
      }
    }
  }

  function getReachable(obj, acc) {
    if(obj === null || (typeof obj !== "object" && typeof obj !== "function")) return;
    if(isSymbol(obj)) return;
    if(acc.has(obj)) return;
    const loc = J$.____refMap.get(obj);
    // filtering new ECMAScript built-ins
    if(loc === undefined) return;
    acc.set(obj, loc);
    const props = [...Object.getOwnPropertyNames(obj)];
    for(let prop of props) {
      if(prop.startsWith("____")) continue;
      if(prop.indexOf("J$") !== -1) continue;
      try {
        let desc = Object.getOwnPropertyDescriptor(obj, prop);
        if(desc) {
          getReachable(desc.value, acc);
        }
      } catch(e) {
        if(J$.verbose) console.warn("getReachable: " + e);
      }
    }
  }

  function getReachableEnv(env, acc) {
    if(env === null || env === top) return;
    if(acc.has(env)) return;
    acc.set(env, J$.____context.envMap.get(env));
    getReachableEnv(env.____outer, acc);
  }

  function bindingGen(value) {
    return {
      "binding": {
        "value": value,
        "uninit": "__BOT__",
        "mutable": true
      },
      "absent": "__BOT__"
    };
  }

  function envGen(outer) {
    const ret = {
      "record": {
        "decEnvRec": {
          "type": "LBindMap",
          "map": {
          }
        },
        "globalEnvRec": "__BOT__"
      },
      "outer": [],
      "nullOuter": "__BOT__"
    };
    if(outer !== null) ret.outer.push(outer);
    else {
      ret.nullOuter = "__TOP__";
      //ret.outer.push(globalLoc);
    }
    return ret;
  }

  function toLocString(loc) {
    if (loc === null) return null;
    return loc.location;
  }

  function dumpState(iState, exc) {
    //if(exc && exc.message.endsWith("a proxy that has been revoked"))
    if (!exc) try {
      const end = J$.endExecution();
      const cur = new J$.Date();
      if(J$.____SSEStartTime === undefined) {
        J$.____SSEStartTime = cur;
      }
      const elapsed = (cur - J$.____SSEStartTime);
      const constElapsed = (J$.____SSEStartTime - J$.____startTime);
      fs.writeFileSync("tmp-ds-jalangi.result", `TIME: ${elapsed} ms\nTIME: ${constElapsed}\n` + end);
      oState = {
        "state": {
          "heap": {
            "map": {
            },
            "merged": "__BOT__",
            "changed": "__BOT__"
          },
          "context": {
            "map": {
            },
            "merged": "__BOT__",
            "changed": "__BOT__",
            "thisBinding": {
              "pvalue": {
                "undefval": "__BOT__",
                "nullval": "__BOT__",
                "numval": "__BOT__",
                "boolval": "__BOT__",
                "strval": []
              },
              "locset": []
            }
          },
          "allocs": "__BOT__"
        },
        traceParition: iState.traceParition
      };
      oState.visitedEntryControlPoints = [];

      let prop = "@return";
      oState.block = -2;
      let pureLocal = envGen(toLocString(iState.state.context.map[pureLocalLoc].outer));
      oState.state.context.map[pureLocalLoc] = [pureLocal];
      if(iState.code && !iState.code.isCall) {
        J$.____refMap.set(J$.____returnValue, toLocString(iState.state.context.thisBinding));
      }
      pureLocal.record.decEnvRec.map[prop] = bindingGen(toSAFEValue(J$.____returnValue));

      const outLocs = new J$.Set();
      for(let [ref, loc] of J$.____refMap) {
        outLocs.add(loc);
      }
      for(let [getter, loc] of J$.____context.envMap) {
        outLocs.add(loc);
      }
      const allocs = outLocs.difference(originAllocs);
      // GC
      let reachable = new J$.Map();
      //for (let [getter, loc] of J$.____context.envMap) {
      //  for(let v in getter) {
      //    let value = getter[v]();
      //    getReachable(value, reachable);
      //  }
      //}
      if(J$.____isGlobalMutated) {
        getReachable(top, reachable);
        //for(let prop of Object.getOwnPropertyNames(top)) {
        //  if(prop.startsWith("____")) continue;
        //  if(prop.indexOf("J$") !== -1) continue;
        //  try {
        //    let desc = Object.getOwnPropertyDescriptor(top, prop);
        //    let value = desc.value;
        //    getReachable(value, reachable);
        //  } catch(e) {
        //  }
        //}
      }
      //let isGlobalMutated = false;
      for(let ref of J$.____mutatedObjects) {
        let loc = J$.____refMap.get(ref);
        if(!allocs.has(loc)) {
          getReachable(ref, reachable);
        }
      }
      getReachable(J$.____returnValue, reachable);
      //const reachable = J$.____refMap;

      if(J$.verbose) console.log(reachable.size);
      //const heap = Object.setPrototypeOf({}, null);
      const reachableEnv = new J$.Map();
      for(let getter of J$.____mutatedGetters) {
        let loc = J$.____context.envMap.get(getter);
        if (loc !== undefined && !allocs.has(loc)) {
          getReachableEnv(getter, reachableEnv);
        }
      }
      // fixed point
      for(;;) {
        let rSize = reachable.size;
        let rEnvSize = reachableEnv.size;
        for(let [ref, loc] of reachable) {
          if(typeof ref === "function" && !isSymbol(ref)) {
            const info = J$.____funcInfo.get(ref);
            if(info.____Scope === undefined) throw new Error(loc + " Scope undefined!");
            // filtering new ECMAScript built-ins
            const getter = J$.____funcInfo.get(ref).____Scope;
            if (J$.____context.envMap.has(getter)) {
              getReachableEnv(getter, reachableEnv);
            }
          }
        }
        for (let [getter, loc] of reachableEnv) {
          if(loc === globalLoc) continue;
          for(let v in getter) {
            let value = getter[v]();
            let ty = typeof value;
            if (ty === "object" || ty === "function") {
              //console.log(v);
              //console.log(J$.____refMap.get(value));
              getReachable(value, reachable);
            }
          }
        }
        if (rSize === reachable.size && rEnvSize === reachableEnv.size) break;
      }
      //const contextMap = Object.setPrototypeOf({}, null);
      //for(let env of [...reachableEnv]) {
      //  let loc = J$.____context.envMap.get(env);
      //  if(loc) {
      //    if(contextMap[loc]) contextMap[loc].push(env);
      //    else contextMap[loc] = [env];
      //  }
      //}

      // Cannot GC environments
      //for (let getter of reachableEnv) {
      //  let loc = J$.____context.envMap.get(getter);
      //}
      //console.log("HERE");
      //console.log(reachableEnv.size);
      //console.log(J$.____context.envMap.size);
      //console.log(reachableEnv);
      //if(J$.____context.envMap.size < 10) {
      //  console.log(J$.____context.envMap);
      //}
      //const reachableEnv = J$.____context.envMap;
      for (let [getter, loc] of reachableEnv) {
        if(loc === globalLoc) continue;
        if(!oState.state.context.map[loc]) {
          oState.state.context.map[loc] = [];
        }
        let env;
        if(getter.____outer === null) {
          env = envGen(null);
        } else {
          env = envGen(J$.____context.envMap.get(getter.____outer));
        }
        //const iEnv = iState.state.context.map[loc];
        //if(iEnv) {
        //  for(let prop of Object.getOwnPropertyNames(iEnv.record)) {
        //    env.record.decEnvRec.map[prop] = toSAFEValue(toDSValue(iEnv.record[prop]));
        //  }
        //}
        oState.state.context.map[loc].push(env);
        for(let v in getter) {
          let value = getter[v]();
          env.record.decEnvRec.map[v] = bindingGen(toSAFEValue(value));
        }
      }
      oState.state.context.map["#Collapsed:Sens[(30-CFA()|LSA[i:10,j:400]())]"] = [
        {
          "record": {
            "decEnvRec": {
              "type": "LBindMap",
              "map": {}
            },
            "globalEnvRec": "__BOT__"
          },
          "outer": [],
          "nullOuter": "__TOP__"
        }
      ];
      oState.state.context.map["#GlobalEnv:Sens[(30-CFA()|LSA[i:10,j:400]())]"] = [
        {
          "record": {
            "decEnvRec": "__BOT__",
            "globalEnvRec": "__TOP__"
          },
          "outer": [],
          "nullOuter": "__TOP__"
        }
      ];

      for(let [obj, loc] of reachable) {
        let objs = oState.state.heap.map[loc];
        if(objs === undefined) {
          objs = [];
          oState.state.heap.map[loc] = objs;
        }
        if(isSymbol(obj)) {
          objs.push({ ____SYMBOL: J$.____symbolRefMap.get(obj) });
          continue;
        }
        let curObj = {
          "nmap": {
            "map": {},
            "default": {
              "value": {
                "value": VBOT(),
                "writable": "__BOT__",
                "enumerable": "__BOT__",
                "configurable": "__BOT__"
              },
              "absent": "__TOP__"
            }
          },
          "imap": {
            "map": {},
            "default": {
              "value": {
                "value": VBOT(),
                "fidset": [],
              },
              "absent": "__TOP__"
            }
          }
        }
        Object.setPrototypeOf(curObj.nmap.map, null);
        objs.push(curObj);
        let props = new J$.Set(Object.getOwnPropertyNames(obj));
        let ty = typeof obj;
        if(props.has("callee")) {
          let str = obj.toString();
          if(str === "[object Arguments]") props.delete("callee");
        }
        for(let prop of props) {
          if(prop.startsWith("____")) continue;
          if(prop.indexOf("J$") !== -1) continue;
          if(ty === "function") {
            if(prop.indexOf("*J$") !== -1) continue;
            if(prop === "caller") continue;
            if(prop === "arguments") continue;
          }
          try {
            let desc = Object.getOwnPropertyDescriptor(obj, prop);
            let value = desc.value;
            curObj.nmap.map[prop] = {
              value: {
                value: toSAFEValue(desc.value),
                writable: !!desc.writable,
                enumerable: desc.enumerable,
                configurable: desc.configurable
              },
              absent: "__BOT__"
            };
          } catch(e) {
            if (e.message === "Unknown object!") {
              if (!(/[A-Za-z\-]/.test(loc.charAt(1)))) {
                throw new Error(obj + " " + loc + " " + (top === obj) + " " + prop + " " + obj[0] + " " + e.message + " " + [...props].join(", "));
              }
            } else {
              console.log(e);
            }
          }
        }
        //TODO: imap
        let proto = Object.getPrototypeOf(obj);
        let desc = Object.getOwnPropertyDescriptor(obj, prop);
        let imap = curObj.imap.map;
        //if(iState.state.heap[loc]) {
        //  for(let ip in iState.state.heap[loc].imap) {
        //    let ipv = iState.state.heap[loc].imap[ip];
        //    imap[ip] = {
        //      value: {
        //        value: VBOT(),
        //        fidset: []
        //      },
        //      absent: "__BOT__"
        //    };
        //    if(ipv !== null && typeof ipv === "object" && ipv.fid !== undefined) {
        //      imap[ip].value.fidset.push(ipv.fid);
        //    } else {
        //      imap[ip].value.value = toSAFEValue(toDSValue(ipv));
        //    }
        //  }
        //}
        try {
          imap["[[Prototype]]"] = {
            value: {
              value: toSAFEValue(proto),
              fidset: []
            },
            absent: "__BOT__"
          };
        } catch(e) {
          if(J$.verbose) {
            console.log("Prototype of " + loc + " " + e.message)
            console.log(JSON.stringify(imap["[[Prototype]]"]));
          }
          if(loc === globalLoc) {
            imap["[[Prototype]]"] = {
              value: {
                value: toSAFEValue(Object.prototype),
                fidset: []
              },
              absent: "__BOT__"
            };
          }
        }
        imap["[[Extensible]]"] = {
          value: {
            value: toSAFEValue(Object.isExtensible(obj)),
            fidset: []
          },
          absent: "__BOT__"
        };
        let cl;
        if(Array.isArray(obj)) cl = "Array";
        else {
          cl = Object.prototype.toString.call(obj).split(" ")[1];
          cl = cl.substring(0, cl.length - 1);
          const cls = ["Date", "Number", "String", "Boolean", "RegExp", "Function", "Error", "Arguments"];
          if(cls.indexOf(cl) === -1) {
            cl = "Object";
          }
        }
        const pvs = ["Date", "Number", "String", "Boolean", "RegExp"];
        if (pvs.indexOf(cl) !== -1) {
          let pv = obj.valueOf();
          if (cl === "RegExp") {
            pv = pv.toString();
            curObj.nmap.map.source = {
              value: {
                value: toSAFEValue(obj.source),
                writable: false,
                enumerable: false,
                configurable: true
              },
              absent: "__BOT__"
            };
            curObj.nmap.map.flags = {
              value: {
                value: toSAFEValue(obj.flags),
                writable: false,
                enumerable: false,
                configurable: true
              },
              absent: "__BOT__"
            };
          }
          imap["[[PrimitiveValue]]"] = {
            value: {
              value: toSAFEValue(pv),
              fidset: []
            },
            absent: "__BOT__"
          };
        }
        if(!("[[Class]]" in imap)) {
          if(cl === undefined) {
            if(typeof obj === "object") {
              cl = "Object";
            } else if (typeof obj === "function") {
              cl = "Function";
            }
          }
          imap["[[Class]]"] = {
            value: {
              value: toSAFEValue(cl),
              fidset: []
            },
            absent: "__BOT__"
          };
        }
        if(typeof obj === "function") {
          if(!("[[Call]]" in imap)) {
            imap["[[Call]]"] = {
              value: {
                value: VBOT(),
                fidset: []
              },
              absent: "__BOT__"
            };
            if(typeof J$.____funcInfo.get(obj).____Call === "number") {
              imap["[[Call]]"].value.fidset.push(J$.____funcInfo.get(obj).____Call);
            } else {
              imap["[[Call]]"].value.value = toSAFEValue(null);
            }
          }
          if(!("[[Construct]]" in imap)) {
            imap["[[Construct]]"] = {
              value: {
                value: VBOT(),
                fidset: []
              },
              absent: "__BOT__"
            };
            if(typeof J$.____funcInfo.get(obj).____Construct === "number") {
              imap["[[Construct]]"].value.fidset.push(J$.____funcInfo.get(obj).____Construct);
            } else {
              imap["[[Construct]]"].value.value = toSAFEValue(null);
            }
          }
          if(!("[[Scope]]" in imap)) {
            imap["[[Scope]]"] = {
              value: {
                value: VBOT(),
                fidset: []
              },
              absent: "__BOT__"
            };
            const scope = J$.____funcInfo.get(obj).____Scope;
            if(scope === null) {
              imap["[[Scope]]"].value.value.pvalue.nullval = "__TOP__";
              //imap["[[Scope]]"].value.value.locset.push(globalLoc);
            } else {
              let sc = J$.____context.envMap.get(scope);
              imap["[[Scope]]"].value.value.locset.push(sc);
            }
          }
          if(!("[[HasInstance]]" in imap)) {
            imap["[[HasInstance]]"] = {
              value: {
                fidset: []
              },
              absent: "__BOT__"
            };
            imap["[[HasInstance]]"].value.value = toSAFEValue(null);
          }
        }
      }

      //const allocs = new J$.Set(Object.getOwnPropertyNames(oState.state.heap.map).concat(Object.getOwnPropertyNames(oState.state.context.map))).difference(originAllocs);
      oState.state.allocs = [...allocs];
      oState.timeout = false;


      return oState;
    } catch(e) {
      if(J$.verbose) console.warn(e);
    }


    const cur = new J$.Date();
    if(J$.____SSEStartTime === undefined) {
      J$.____SSEStartTime = cur;
    }
    const elapsed = (cur - J$.____SSEStartTime);
    const constElapsed = (J$.____SSEStartTime - J$.____startTime);
    fs.writeFileSync("tmp-ds-jalangi.result", `TIME: ${elapsed} ms\nTIME: ${constElapsed}\n`);

    return {
      fid,
      state: "__BOT__",
      visitedEntryControlPoints: [...new J$.Set(J$.____visitedEntryControlPoints)].map((cp) => {
        const words = cp.split("+");
        return {
          fid: +words[0],
          tracePartition: words[1]
        };
      }),
      traceParition: iState.traceParition,
      timeout: false
    }
  }
  J$.____dumpState = dumpState;

  // MAIN START
  input.isConstructor = input.isConstructor || (input.code && !input.code.isCall);
  const state = input.state;

  // print trace partition
  console.warn("[FId]", input.fid);
  console.warn("[TracePartition]", tpToString.call(input.tracePartition));

  const originAllocs = new J$.Set(Object.getOwnPropertyNames(state.heap).concat(Object.getOwnPropertyNames(state.context.map)));
  const fid = input.fid;
  const iidToLocation = JSON.parse(fs.readFileSync("iidToLocation.json"));
  const globalLoc = "#Global:Sens[(30-CFA()|LSA[i:10,j:400]())]";
  const pureLocalLoc = "#PureLocal:Sens[(30-CFA()|LSA[i:10,j:400]())]";

  // fid <-> built-in name
  const fidToName = JSON.parse(fs.readFileSync("fidToName.json"));
  J$.____mutatingBuiltinFIds = J$.____mutatingBuiltinNames.map((name) => fidToName[name].call);
  const builtinInfo = {};
  builtinInfo.callFId = fidToName["Function.prototype.call"].call;
  builtinInfo.callBId = builtinInfo.callFId + ":" + 16;
  builtinInfo.applyFId = fidToName["Function.prototype.apply"].call;
  builtinInfo.applyBId = builtinInfo.applyFId + ":" + 16;
  builtinInfo.everyFId = fidToName["Array.prototype.every"].call;
  builtinInfo.everyBId = builtinInfo.everyFId + "[10]";
  builtinInfo.everyLId = builtinInfo.everyFId + ":" + 14;
  J$.__builtinInfo = builtinInfo;

  J$.filename = iidToLocation[0];
  J$.iids = iidToLocation[1];

  const {
    ____funcMap: funcMap,
    ____getters: getterMap,
    ____setters: setterMap
  } = fmap;

  const pureOuter = toLocString(state.context.map[pureLocalLoc].outer);
  J$.____context = Object.setPrototypeOf({}, null);
  J$.____context.map = Object.setPrototypeOf({}, null);
  J$.____context.envMap = new J$.Map();
  J$.____context.envMap.set(top, globalLoc);
  for(let loc in getterMap) {
    let env = getterMap[loc];
    J$.____context.map[loc] = [env];
    J$.____context.envMap.set(env, loc);
  }

  J$.____context.envLocs = [];
  for(let envLoc = pureOuter; envLoc !== globalLoc && envLoc !== null; envLoc = toLocString(state.context.map[envLoc].outer)) {
    J$.____context.envLocs.push(envLoc);
  }

  J$.____context.envMap.delete(getterMap[pureOuter]);
  delete getterMap[pureOuter];

  gvFromInput.push("J$");
  for(let prop of topProps.difference(gvFromInput)) {
    delete top[prop];
  }
  // removed ES6 or Node.js features
  delete this.Array.from;
  delete this.Object.getOwnPropertySymbols;

  J$.____context.tracePartition = input.tracePartition;
  let outerSens = [{
    "k": 30,
    "callsiteList": input.tracePartition[0].callsiteList.concat()
  }, {
    "i": 10,
    "j": 400,
    "iterList": []
  }];
  outerSens.popCallsite = popCallsite;
  outerSens.ToString = sensToString;
  function popCallsite() {
    let cs;
    do {
      cs = this[0].callsiteList.shift();
      let fid = +cs.substring(0, cs.indexOf(":"));
      if(fid >= 0) return cs;
    } while(true);
  };

  function tpToString() {
    if(this.length) {
      const k = this[0].k;
      const i = this[1].i;
      const j = this[1].j;
      return `(${this[0].k}-CFA(${this[0].callsiteList.slice(0, k).join(",")})|LSA[i:${this[1].i},j:${this[1].j}](${this[1].iterList.slice(0, i).map((cur) => {
        const lIdx = J$.lastIndexOf.call(cur, "(");
        let iter = +J$.substring.call(cur, lIdx + 1, cur.length - 1);
        if(iter > j) iter = j;
        return J$.substring.call(cur, 0, lIdx + 1) + iter + ")";
      }).join(",")}))`;
    } else {
      return `(${this.k}-CFA(${this.callsiteList.join(",")})`;
    }
  };
  function sensToString() {
    return `Sens[${tpToString.call(this)}]`;
  };
  let cs = outerSens.popCallsite();
  const iidMap = JSON.parse(fs.readFileSync("iidMap.json"));
  for(let iid in iidMap) {
    let info = iidMap[iid];
    if(info.Call) {
      if(info.Call[3] === cs) {
        J$.____argumentsLoc.push(info.Call[4] + ":" + outerSens.ToString());
        break;
      }
    }
    if(info.Construct) {
      if(info.Construct[3] === cs) {
        J$.____argumentsLoc.push(info.Construct[4] + ":" + outerSens.ToString());
        break;
      }
    }
  }

  J$.____context.tracePartition.ToString = sensToString;
  J$.____context.tracePartition.tpToString = tpToString;

  if (input.isConstructor) {
    J$.____isConstructor = toLocString(state.context.thisBinding);
    delete state.heap[J$.____isConstructor];
  }

  const heap = heapBuild(state, J$.____isConstructor);
  initCaptured(state, heap);
  let args = initArgs(state, heap);
  let func;
  const thisBinding = !input.isConstructor ? toDSValue(state.context.thisBinding, heap) : undefined;
  if(fid < 0) {
    func = eval(input.code.name.replace(/^Global/, "top"));
    if(J$.____mutatingBuiltinNames.indexOf(input.code.name) !== -1) {
      J$.____mutatedObjects.add(thisBinding);
    }
  } else {
    func = args.callee;
  }


  J$.____arguments = {
    func,
    thisBinding,
    args,
    isCall: !input.isConstructor,
    fs,
    oState
  };

  if(fid < 0) {
    if(!input.isConstructor && typeof thisBinding === "function") {
      "____#" in thisBinding;
    }
    [...args].forEach((arg, idx) => {
      if (typeof arg === "function") {
        "____#" in arg;
      }
    });
  }
}).apply(
  null,
  (function () {
    const fs = require('fs');
    const inputString = fs.readFileSync("state.json");
    const input = JSON.parse(inputString);
    try {
      const oState = JSON.parse(inputString);
      const state = input.state;
      const fid = input.fid;
      const fmap = JSON.parse(fs.readFileSync("function.json"));

      function parseIValue(v) {
        if(v === null || typeof v !== "object") return v;
        if("fid" in v) return v.fid;
        if("location" in v) return v.location;
        throw new Error("parsing IValue");
      }

      const globalLoc = "#Global:Sens[(30-CFA()|LSA[i:10,j:400]())]";

      const envName2Loc = {};
      for (let loc in state.heap) {
        let imap = state.heap[loc].imap;
        if(imap === undefined) {
          if(J$.verbose) console.warn("object is abstracted " + loc);
          continue;
        }
        if(!("[[Call]]" in imap)) continue;
        let call = parseIValue(imap["[[Call]]"]);
        if (typeof call !== "number") throw new Error("Not a single function value");
        if (call < 0) continue;
        let env = parseIValue(imap["[[Scope]]"]);
        if (env === null) env = globalLoc;
        if (envName2Loc[env]) {
          envName2Loc[env].push({loc, call});
        } else {
          envName2Loc[env] = [{loc, call}];
        }
      }

      let envs = {};
      let root = globalLoc;
      envs[root] = { loc: root, children: [] };

      for (let loc in state.context.map) {
        envs[loc] = { loc, children: [] };
      }
      for (let loc in state.context.map) {
        if(loc.startsWith("#Global")) continue;
        if(loc.startsWith("#PureLocal")) continue;
        if(loc.startsWith("#Collapsed")) continue;
        let env = state.context.map[loc];
        if("____SYMBOL" in env) throw new Error("lex env is abstracted: " + loc);
        let parent;
        if(env.outer === null) {
          parent = envs[root];
        } else {
          let outerLoc = parseIValue(env.outer);
          if(typeof outerLoc !== "string") throw new Error("outerLoc must be string " + outerLoc + " " + env.outer + " " + loc);
          parent = envs[outerLoc];
        }
        envs[loc].contents = env;
        envs[loc].parent = parent;
        parent.children.push(envs[loc]);
      }
      root = envs[root];

      function preorder(node, state, fmap, e2l, sb) {
        let funcLocs = e2l[node.loc];
        if (!funcLocs) funcLocs = [];
        const captured = Object.setPrototypeOf({}, null);
        for (let v in node.contents ? node.contents.record : {}) {
          if(v.startsWith("<>")) {
            let vName = v.substring(2, v.lastIndexOf("<>"));
            captured[vName] = v;
          }
        }
        sb.push('(function () {\n');
        if(node.loc !== globalLoc) {
          sb.push(`____getters["${node.loc}"] = J$.setPrototypeOf({}, null);\n`);
          sb.push(`____setters["${node.loc}"] = J$.setPrototypeOf({}, null);\n`);
          if(node.parent.loc === globalLoc) {
            sb.push(`J$.defineProperty(____getters["${node.loc}"], "____outer", { value: (function () { return this; })(), writable: true, enumerable: false, configurable: true });`);
          } else {
            sb.push(`J$.defineProperty(____getters["${node.loc}"], "____outer", { value: ____getters["${node.parent.loc}"], writable: true, enumerable: false, configurable: true });`);
          }
          for (let v in captured) {
            sb.push(`var ${v};\n`);
            sb.push(`____getters["${node.loc}"]["${captured[v]}"] = function (){ return ${v}; };\n`);
            sb.push(`____setters["${node.loc}"]["${captured[v]}"] = function (nv){ ${v} = nv; };\n`);
          }
        }
        for (let {loc, call} of funcLocs) {
          sb.push(`____funcMap["${loc}"] = ${fmap[call]};\n`);
        }
        for (let child of node.children) {
          sb = preorder(child, state, fmap, e2l, sb);
        }
        sb.push('})();\n');
        return sb;
      }
      const sb = preorder(root, state, fmap, envName2Loc, ["var ____funcMap = {}, ____getters = {}, ____setters = {};\n"]);
      return [sb.join(""), fs, input, fmap[0], oState];
    } catch(e) {
      console.warn(e);
      fs.writeFileSync("tmp-ds-jalangi.result", "");
      const output = {
        fid: input.fid,
        state: "__BOT__",
        visitedEntryControlPoints: [],
        traceParition: input.traceParition,
        timeout: false
      };
      fs.writeFileSync("output.json", JSON.stringify(output, null, ""));
      process.exit();
    }
  })().map(function () {
    if(arguments[1] > 0) {
      return arguments[0];
    }
    eval(arguments[0]);
    return { ____funcMap, ____getters, ____setters };
  })
);
(function () {
  try {
    if(J$.____arguments.func === Function.prototype.call) {
      J$.____context.tracePartition[0].callsiteList.unshift(J$.__builtinInfo.callBId);
    } else if(J$.____arguments.func === Function.prototype.apply) {
      J$.____context.tracePartition[0].callsiteList.unshift(J$.__builtinInfo.applyBId);
    }
    J$.____SSEStartTime = new J$.Date();
    if(J$.____arguments.isCall) {
      J$.____returnValue = Function.prototype.apply.call(J$.____arguments.func, J$.____arguments.thisBinding, J$.____arguments.args);
    } else {
      J$.____returnValue = eval(`new J$.____arguments.func(${[...J$.____arguments.args].map((arg, idx) => "J$.____arguments.args[" + idx + "]").join(", ")})`);
    }
  } catch(e) {
    console.warn(e);
    J$.____arguments.exc = e;
  } finally {
    const output = J$.____dumpState(J$.____arguments.oState, J$.____arguments.exc);
    J$.____arguments.fs.writeFileSync("output.json", JSON.stringify(output, null, ""));
  }
})();
