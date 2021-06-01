const fs = require('fs');
const path = require('path');

const src = process.argv[2] ?? 'source.js';
const tar = process.argv[3] ?? 'target.js';
const acorn = require('acorn');
const walk = require('acorn-walk');
const escodegen = require('./modified_escodegen');

function toCode(node) {
  return escodegen.generate(node);
}

function rewriteFile(src, tar) {
  srcCode = fs.readFileSync(src).toString();
  ast = acorn.parse(srcCode, { ecmaVersion: 2020 });
  const tarCode = toCode(ast);
  fs.writeFileSync(tar, tarCode);
}

(function() {
  rewriteFile(src, tar);
})();
