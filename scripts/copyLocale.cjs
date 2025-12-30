const fs = require('fs');
const path = require('path');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const srcDir = path.join(process.cwd(), 'src', 'locale');
  const destDir = path.join(process.cwd(), 'dist', 'locale');
  copyDir(srcDir, destDir);
  console.log(`[copyLocale] Copied ${srcDir} -> ${destDir}`);
}

main();

