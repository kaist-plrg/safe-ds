const fs = require('fs');
const path = require('path');

const src = process.argv[2];
const dst_func = path.join(__dirname, "function.json");
const acorn = require('acorn');
const walk = require('acorn-walk');
const _ = require('lodash');
const escodegen = require('escodegen');

//const functionMap = {};
const scopes = [];
let scopeId = 0;

const scopeInst = _.cloneDeep(walk.base);
const envInst = _.cloneDeep(walk.base);
const funcCollect = _.cloneDeep(walk.base);

scopeInst.CatchClause = function (node, st, c) {
    //if (node.param) { c(node.param, st, "Pattern"); }

    const newSt = {
        scopeId: ++scopeId,
        funScopeId: st.funScopeId,
        parent: st.scopeId,
        vars: new Set(),
        captured: new Set(),
        todos: []
    };
    scopes.push(newSt);
    if (node.param && node.param.type === "Identifier") {
        newSt.vars.add(node.param.name);
    }
    c(node.body, newSt, "Statement");
};

scopeInst.VariableDeclarator = function (node, st, c) {
    //c(node.id, st, "Pattern");
    if (node.init) { c(node.init, st, "Expression"); }
};

scopeInst.Function = function (node, st, c) {
    //if (node.id) { c(node.id, st, "Pattern"); }

    const newSt = {
        scopeId: ++scopeId,
        funScopeId: scopeId,
        parent: st.scopeId,
        vars: new Set(),
        captured: new Set(),
        todos: []
    };
    scopes.push(newSt);
    //functionMap[scopeId] = escodegen.generate(node);
    for (var i = 0, list = node.params; i < list.length; i += 1) {
        var param = list[i];
        //c(param, st, "Pattern");
        if(param.type === "Identifier") {
            newSt.vars.add(param.name);
        }
    }
    c(node.body, newSt, node.expression ? "Expression" : "Statement");
}; 
scopes.push({
    scopeId,
    funScopeId: scopeId,
    parent: -1,
    vars: new Set(),
    captured: new Set(),
    todos: []
});

function oneScript(src) {
  const iidMap = JSON.parse(fs.readFileSync(path.join(__dirname, "iidMap.json")));
  const jalangi_src = src.substring(0, src.lastIndexOf(".")) + src.substring(src.lastIndexOf("."));
  const jalangi_code = fs.readFileSync(jalangi_src).toString();
  const jalangi_ast = acorn.parse(jalangi_code);

  const funcMap = {};
  const visitCheck = new Set();
  funcCollect.CallExpression = function (node, st, c) {
    c(node.callee, st, "Expression");
    if (node.arguments) {
      for (var i = 0, list = node.arguments; i < list.length; i += 1) {
        var arg = list[i];

        c(arg, st, "Expression");
      }
    }
    if(node.callee.type === "MemberExpression" && node.callee.object.name === "J$" && node.callee.property.name === "Fe") {
      if(visitCheck.has(node)) return;
      visitCheck.add(node);
      const locals = iidMap[node.arguments[0].raw][2];
      const sb = ["(J$.setPrototypeOf({\n"];
      const sb2 = [];
      for(let v of locals) {
        let idx = v.indexOf(">") + 1;
        let lidx = v.lastIndexOf("<");
        let name = v.substring(idx, lidx);
        sb2.push(`  "${v}": function () { return ${name} }`);
      }
      sb.push(sb2.join(",\n"));
      sb.push("}, null))");
      const ast = acorn.parse(sb.join(""));
      node.arguments.push(ast.body[0].expression);
    }
  };

  funcCollect.FunctionExpression = function (node, st, c) {
    const ret = c(node, st, "Function");

    if(node.body.body[0].body !== undefined) {
      const fId = iidMap[node.body.body[0].body.body.body[0].block.body[0].expression.arguments[0].raw][1];
      c(node.body, fId, node.expression ? "Expression" : "Statement");
      funcMap[fId] = escodegen.generate(node);
    }

    return ret;
  };
  funcCollect.FunctionDeclaration = function (node, st, c) {
    const ret = c(node, st, "Function");

    const fId = iidMap[node.body.body[0].body.body.body[0].block.body[0].expression.arguments[0].raw][1];
    c(node.body, fId, node.expression ? "Expression" : "Statement");
    const nid = node.id;
    delete node.id;
    funcMap[fId] = escodegen.generate(node);
    node.id = nid;

    return ret;
  };
  walk.simple(jalangi_ast, {}, funcCollect);
  funcMap[0] = escodegen.generate(jalangi_ast);

  return {
    func: JSON.stringify(funcMap, null, "  ")
  }
}

function inst(elem, home) {
    const scripts = elem.getElementsByTagName("script");
    for(script of scripts) {
        let src = script.getAttribute("src");
        let code = script.textContent
        if(src !== null) {
            code = fs.readFileSync(path.join(home, src)).toString();
        }
        script.removeAttribute("src");
        script.textContent = oneScript(code);
    }
}

switch(path.extname(src).substring(1)) {
    case "js":
        let {func} = oneScript(src);

        //for(let scope of scopes) {
        //    delete scope.todos;
        //    scope.vars = [... scope.vars];
        //    scope.captured = [... scope.captured];
        //}
        //const head = `var ____envId = ____getEnvId(() => ({${scopes[0].vars.map((v) => '"#'+v+'": ' + v).join(", ")}}), () => ({}), 0), ____0_scopeId = ____envId;\n`;
        //res = head + res;

        //let postfix = `\n\n\n${acorn_}\n${walk_}\n${escodegen_}\n(function (){\n    var functionMap = \n${JSON.stringify(functionMap, null, 4)};\nvar scopes = \n${JSON.stringify(scopes, null, 4)};\n${fs.readFileSync("postfix.js").toString()}\n})();`;
        //const output = prefix + "\n" + res + postfix;
        fs.writeFileSync(dst_func, func);
        break;
}
