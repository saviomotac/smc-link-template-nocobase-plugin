const fs = require('fs');
const path = require('path');
const { builtinModules } = require('module');

function walkFiles(dir, predicate, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, acc);
    } else if (entry.isFile() && predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function isBuiltin(specifier) {
  if (specifier.startsWith('node:')) return true;
  return builtinModules.includes(specifier);
}

function toPackageName(specifier) {
  if (!specifier) return null;
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file:')) return null;
  if (isBuiltin(specifier)) return null;

  const parts = specifier.split('/');
  if (specifier.startsWith('@')) {
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  }
  return parts[0];
}

function uniq(arr) {
  return [...new Set(arr)];
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractSpecifiers(code) {
  const specifiers = [];

  const importFromRe = /\bfrom\s+['"]([^'"]+)['"]/g;
  const importCallRe = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const requireCallRe = /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const re of [importFromRe, importCallRe, requireCallRe]) {
    let match;
    while ((match = re.exec(code))) {
      specifiers.push(match[1]);
    }
  }

  return specifiers;
}

function resolvePkgJson(packageName) {
  try {
    return require.resolve(`${packageName}/package.json`, { paths: [process.cwd()] });
  } catch {
    return null;
  }
}

function readPkgVersion(packageName) {
  const pkgJsonPath = resolvePkgJson(packageName);
  if (!pkgJsonPath) return null;
  try {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    return pkgJson && typeof pkgJson.version === 'string' ? pkgJson.version : null;
  } catch {
    return null;
  }
}

function main() {
  const distDir = path.join(process.cwd(), 'dist');
  const distFiles = walkFiles(distDir, (p) => p.endsWith('.js') || p.endsWith('.mjs') || p.endsWith('.cjs'));
  if (distFiles.length === 0) {
    console.error('[genExternalVersion] No dist JS files found. Did you run the build?');
    process.exit(1);
  }

  const allSpecifiers = distFiles.flatMap((filePath) => extractSpecifiers(readText(filePath)));
  const packageNames = uniq(allSpecifiers.map(toPackageName).filter(Boolean));

  const externalVersion = {};
  for (const packageName of packageNames) {
    const version = readPkgVersion(packageName);
    if (version) {
      externalVersion[packageName] = version;
    }
  }

  const outPath = path.join(distDir, 'externalVersion.js');
  const content =
    'module.exports = ' +
    JSON.stringify(externalVersion, null, 2) +
    ';\n';

  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[genExternalVersion] Wrote ${outPath} with ${Object.keys(externalVersion).length} entries.`);
}

main();
