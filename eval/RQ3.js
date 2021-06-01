Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}
Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

const fs = require('fs');
const fid2NameMaps = {};
const benches = ["original", "abstracted"];
const results = {
}
for(let bench of benches) {
  const f = bench + "-DS"
  const nameMap = JSON.parse(fs.readFileSync(`raw_data/${f}/fidToName.json`));
  const fid2Name = {};
  for(let name in nameMap) {
    if ("construct" in nameMap[name]) {
      fid2Name[nameMap[name].construct] = "new " + name;
    }
    if ("call" in nameMap[name]) {
      fid2Name[nameMap[name].call] = name;
    }
  }
  fid2NameMaps[bench] = fid2Name;
  results[f] = parseFile(`raw_data/${f}/summary.tsv`);
}
function parseFile(filename) {
  const result = {};
  const lines = fs.readFileSync(filename).toString().split("\n");
  for (let line of lines) {
    const cols = line.split("\t");
    if (cols[1] !== "S") {
      continue;
    }
    const id = cols[0];
    result[id] = [cols[8], cols[9]];
  }
  return result;
}
console.log(`RQ3. Opaque Function Coverage`);
const output = {};
for(let bench of ["original", "abstracted"]) {
  const ds = results[`${bench}-DS`];
  for(let id in ds) {
    const [conc, abs] = ds[id];
    const concFuncs = new Set();
    conc.split("]").forEach((word) => {
      const fid = word.substring(1);
      if (fid in fid2NameMaps[bench]) {
        concFuncs.add(fid2NameMaps[bench][fid]);
      }
    });
    const absFuncs = new Set();
    abs.split("]").forEach((word) => {
      const fid = word.substring(1);
      if (fid in fid2NameMaps[bench]) {
        absFuncs.add(fid2NameMaps[bench][fid]);
      }
    });
    for (let name of concFuncs.union(absFuncs)) {
      if (!(name in output)) {
        output[name] = {
          "original": { replaced: 0, total: 0},
          "abstracted": { replaced: 0, total: 0}
        }
      }
      ++output[name][bench].total;
      if (concFuncs.has(name) && !absFuncs.has(name)) {
        ++output[name][bench].replaced;
      }
    }
  }
}
const logs = [];
for (let name in output) {
  if (output[name].original.replaced + output[name].abstracted.replaced === 0) {
    delete output[name];
  } else {
    logs.push(`${name.padEnd(31, " ")}: ${output[name].original.replaced.toString().padStart(3, " ")}/${output[name].original.total.toString().padEnd(3, " ")} ${output[name].abstracted.replaced.toString().padStart(3, " ")}/${output[name].abstracted.total.toString().padEnd(3, " ")}`);
  }
}
logs.sort();
console.log(logs.join("\n"));
fs.writeFileSync("RQ3_opaque_function.json", JSON.stringify(output, null, 2));
