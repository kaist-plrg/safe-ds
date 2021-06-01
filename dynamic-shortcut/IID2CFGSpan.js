const fs = require('fs');
const path = require('path');
const argv = process.argv;

const iidToLocation = fs.readFileSync(argv[2]).toString();
const IIDMap = JSON.parse(iidToLocation);
const oriName = path.resolve(argv[2]).replace("_jalangi_.json", ".js");
fs.writeFileSync(path.join(__dirname, "iidToLocation.json"), `["${oriName}", ${iidToLocation}]`);
const oCFGSpanInfo = JSON.parse(fs.readFileSync(argv[3]));
const CFGSpanInfo = [];
const FMs = {};
const Ts = {};
const As = {};
for(let info of oCFGSpanInfo) {
  let [csl, csc, cel, cec, funcs, ...extra] = info;
  csl = +csl;
  csc = +csc;
  cel = +cel;
  cec = +cec;
  if(funcs === "F,M") {
    FMs[`${csl}:${csc}-${cel}:${cec}`] = info;
  } else if(funcs === "T") {
    Ts[`${csl}:${csc}-${cel}:${cec}`] = info;
  } else if(funcs === "A") {
    As[`${csl}:${csc}-${cel}:${cec}`] = info;
  } else {
    CFGSpanInfo.push(info);
  }
}

for(let s of [As, Ts]) {
  for(let key in s) {
    let info = s[key];
    if(FMs[key]) {
      let [csl, csc, cel, cec, funcs, ...extra] = info;
      FMs[key] = FMs[key].concat(extra);
    }
    CFGSpanInfo.push(info);
  }
}
for(let key in FMs) {
  CFGSpanInfo.push(FMs[key]);
}
const iidMap = {};
const iidDisMap = {};

const lineMap = new Map();

for(let info of CFGSpanInfo) {
  let [csl, ...extra] = info;
  csl = +csl
  if(!lineMap.has(csl)) {
    lineMap.set(csl, []);
  }
  lineMap.get(csl).push(info);
}

for(let iid in IIDMap) {
  if(isNaN(+iid)) continue;
  let [sl, sc, el, ec, func] = IIDMap[iid];
  let count = 0;
  let arr = lineMap.get(sl);
  if(!arr) arr = [];
  for(let info of arr) {
    let [csl, csc, cel, cec, funcs, ...extra] = info;
    csl = +csl;
    csc = +csc;
    cel = +cel;
    cec = +cec;
    funcs = funcs.split(",")
    let dis = Math.abs(csc - sc) + Math.abs(cec - ec);
    if(funcs.includes(func) && ((cel === el || cel - 1 === el) || (func === "LE" && csc === sc))) {
      if(["Se", "Fe"].includes(func)) {
        extra[0] = +extra[0];
        if(extra[1] === "") {
          extra[1] = [];
        } else {
          extra[1] = extra[1].split(",");
        }
      } else if(extra.length > 1){
        extra[1] = +extra[1];
      }
      if (!(iid in iidDisMap) || iidDisMap[iid] >= dis) {
        if(func === "F" || func === "M") {
          if(!(iid in iidDisMap)) {
            iidMap[iid] = {};
          }
          if(extra[1] === 0) {
            iidMap[iid].Call = [func].concat(extra);
          } else {
            iidMap[iid].Construct = [func].concat(extra);
          }
        } else {
          iidMap[iid] = [func].concat(extra);
        }
        iidDisMap[iid] = dis;
      }
    }
  }
}
fs.writeFileSync(path.join(__dirname, "iidMap.json"), JSON.stringify(iidMap, null, "  "));
//console.log(iidMap);
