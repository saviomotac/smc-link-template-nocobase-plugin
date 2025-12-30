const fs = require('fs');
const path = require('path');

function readPackageName() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg?.name) throw new Error('[verifyDist] package.json name is missing');
  return pkg.name;
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[verifyDist] Missing ${filePath}`);
  }
}

function main() {
  const packageName = readPackageName();

  const distIndex = path.join(process.cwd(), 'dist', 'index.js');
  const distServerIndex = path.join(process.cwd(), 'dist', 'server', 'index.js');
  const distClientIndex = path.join(process.cwd(), 'dist', 'client', 'index.js');

  assertExists(distIndex);
  assertExists(distServerIndex);
  assertExists(distClientIndex);

  const client = fs.readFileSync(distClientIndex, 'utf8');
  const hasAmdDefine =
    client.includes(`define(${JSON.stringify(packageName)}`) ||
    client.includes(`define("${packageName}"`) ||
    client.includes(`define('${packageName}'`);
  if (!hasAmdDefine) {
    throw new Error(
      `[verifyDist] dist/client/index.js is not AMD/UMD for ${packageName} (missing define("${packageName}", ...)).`
    );
  }

  console.log('[verifyDist] OK');
}

main();

