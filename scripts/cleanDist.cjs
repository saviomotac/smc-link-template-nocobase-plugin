const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
fs.rmSync(distDir, { recursive: true, force: true });
