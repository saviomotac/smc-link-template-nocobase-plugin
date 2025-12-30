const fs = require('fs');
const path = require('path');

function readPackageName() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg?.name) throw new Error('[wrapClientUmd] package.json name is missing');
  return pkg.name;
}

function wrapAsUmd({ packageName, input }) {
  if (
    input.includes(`define(${JSON.stringify(packageName)}`) ||
    input.includes(`define("${packageName}"`) ||
    input.includes(`define('${packageName}'`) ||
    input.includes(`define.amd?define(${JSON.stringify(packageName)}`)
  ) {
    return input;
  }

  const replaced = input
    .replaceAll(`require("${'@nocobase/client'}")`, 'nocobaseClient')
    .replaceAll(`require('${'@nocobase/client'}')`, 'nocobaseClient')
    .replaceAll(`require("${'react'}")`, 'react')
    .replaceAll(`require('${'react'}')`, 'react')
    .replaceAll(`require("${'@formily/react'}")`, 'formilyReact')
    .replaceAll(`require('${'@formily/react'}')`, 'formilyReact')
    .replaceAll(`require("${'react/jsx-runtime'}")`, 'jsxRuntime')
    .replaceAll(`require('${'react/jsx-runtime'}')`, 'jsxRuntime');

  const header = `/*! ${packageName} */\n` +
    `(function (root, factory) {\n` +
    `  if (typeof exports === 'object' && typeof module === 'object') {\n` +
    `    module.exports = factory(require('react'), require('@nocobase/client'), require('@formily/react'), require('react/jsx-runtime'));\n` +
    `  } else if (typeof define === 'function' && define.amd) {\n` +
    `    define(${JSON.stringify(packageName)}, ['react', '@nocobase/client', '@formily/react', 'react/jsx-runtime'], factory);\n` +
    `  } else if (typeof exports === 'object') {\n` +
    `    exports[${JSON.stringify(packageName)}] = factory(require('react'), require('@nocobase/client'), require('@formily/react'), require('react/jsx-runtime'));\n` +
    `  } else {\n` +
    `    root[${JSON.stringify(packageName)}] = factory(root.react, root['@nocobase/client'], root['@formily/react'], root['react/jsx-runtime']);\n` +
    `  }\n` +
    `})(typeof self !== 'undefined' ? self : this, function (react, nocobaseClient, formilyReact, jsxRuntime) {\n` +
    `  'use strict';\n` +
    `  var module = { exports: {} };\n` +
    `  var exports = module.exports;\n` +
    `  try {\n`;

  const footer =
    `\n    var value = module.exports;\n` +
    `    return value || { default: value };\n` +
    `  } catch (error) {\n` +
    `    try { console.error('[nocobase plugin client load error]', ${JSON.stringify(packageName)}, error); } catch (e) {}\n` +
    `    throw error;\n` +
    `  }\n` +
    `});\n`;

  return header + indent(replaced, 4) + footer;
}

function indent(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n');
}

function main() {
  const packageName = readPackageName();
  const inPath = path.join(process.cwd(), 'dist', 'client', 'index.js');
  if (!fs.existsSync(inPath)) {
    console.error(`[wrapClientUmd] Missing ${inPath}. Did you run the build?`);
    process.exit(1);
  }
  const input = fs.readFileSync(inPath, 'utf8');
  const output = wrapAsUmd({ packageName, input });
  fs.writeFileSync(inPath, output, 'utf8');
  console.log(`[wrapClientUmd] Wrapped ${inPath} as UMD for ${packageName}`);
}

main();
