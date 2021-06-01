Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

const fs = require('fs');
const files = ["original-no-DS", "original-DS", "abstracted-no-DS", "abstracted-DS"];
const results = {
}
for(let f of files) {
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
    result[id] = cols[4];
  }
  return result;
}
console.log(`RQ1. Analysis Speed-up`);
const output = {};
for(let bench of ["original", "abstracted"]) {
  const noDS = results[`${bench}-no-DS`];
  const ds = results[`${bench}-DS`];
  const intersection = new Set(Object.keys(noDS)).intersection(new Set(Object.keys(ds)));
  let avg = 0;
  const speedups = {};
  for(let id of intersection) {
    let speedup = +noDS[id] / +ds[id];
    avg += speedup;
    speedups[id] = speedup;
  }
  output[bench] = speedups;
  avg /= intersection.size;
  console.log(`Average analysis speed-up for ${bench.padEnd(10, " ")} Lodash4 tests :${(avg).toFixed(2).toString().padStart(6, " ")}`);
}
fs.writeFileSync("RQ1_speed-up.json", JSON.stringify(output, null, 2));
