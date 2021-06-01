const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const src = process.argv[2] ?? 'source.js';
const tar = process.argv[3] ?? 'target.js';
const N = process.argv[4] ?? -1;
const acorn = require('acorn');
const walk = require('acorn-walk');
const escodegen = require('escodegen');

function toCode(node) {
  return escodegen.generate(node);
}
function isTarget(node, parent) {
  let parentCode = toCode(parent);
  if (parentCode.startsWith('QUnit.module')) return false;
  if (parentCode.startsWith('QUnit.test')) return false;
  if (parentCode.startsWith('assert.expect')) return false;
  if (parentCode.startsWith('skipAssert')) return false;
  return true;
}

function literal2id(node, name) {
  node.type = 'Identifier';
  node.name = name;
  delete node.value;
  delete node.raw;
}

function subst(node) {
  let type = typeof node.value;
  switch(type) {
    case 'number': literal2id(node, '__num_top__'); break;
    case 'string': literal2id(node, '__str_top__'); break;
    case 'boolean': literal2id(node, '__bool_top__'); break;
    default:
  }
}

function rewrite(ast) {
  const literals = [];
  walk.ancestor(ast, {
    Literal(node, ancestors) {
      let parent = ancestors[ancestors.length - 2];
      if (isTarget(node, parent)) {
        literals.push(node);
        //subst(node);
      }
    }
  });
  const samples = N == -1 ? literals : _.sampleSize(literals, N);
  for(let node of samples) {
    subst(node);
  }
  return toCode(ast);
}

function rewriteFile(src, tar) {
  const srcCode = fs.readFileSync(src).toString();
  const ast = acorn.parse(srcCode, { ecmaVersion: 2020 });
  rewrite(ast);
  const tarCode = toCode(ast);
  fs.writeFileSync(tar, tarCode);
}

(function() {
  rewriteFile(src, tar);
})();
