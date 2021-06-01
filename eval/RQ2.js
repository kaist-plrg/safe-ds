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
    result[id] = +cols[6];
  }
  return result;
}
console.log(`RQ2. Precision Improvement`);
const output = {};
for(let bench of ["original", "abstracted"]) {
  const noDS = results[`${bench}-no-DS`];
  const ds = results[`${bench}-DS`];
  const intersection = new Set(Object.keys(noDS)).intersection(new Set(Object.keys(ds)));
  let avg = 0;
  let count = 0;
  const fails = {};
  for(let id of intersection) {
    if(noDS[id] > 0) {
      let slope = ds[id] / noDS[id];
      ++count;
      avg += slope;
      fails[id] = {
        "x (no-DS)": noDS[id],
        "y (DS)   ": ds[id]
      };
    }
  }
  avg /= count;
  output[bench] = fails;
  console.log(`Average ratio of # failed assertions for ${bench.padEnd(10, " ")} Lodash4 tests :${(avg).toFixed(2).toString().padStart(6, " ")}`);
}
fs.writeFileSync("RQ2_precision.json", JSON.stringify(output, null, 2));
