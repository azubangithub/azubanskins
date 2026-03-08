const fs = require('fs');
const path = require('path');

const SKINS_DIR = path.join(__dirname, 'skins');
const OUTPUT_FILE = path.join(__dirname, 'skins.js');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const categories = [];
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      categories.push({
        name: entry.name,
        ...scanDir(path.join(dir, entry.name))
      });
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      const filePath = path.join(dir, entry.name);
      try {
        const base64Data = fs.readFileSync(filePath, 'base64');
        files.push({
          name: entry.name,
          data: `data:image/png;base64,${base64Data}`
        });
      } catch (err) {
        console.error('Error reading file:', filePath);
      }
    }
  }

  return { categories, files };
}

console.log('Scanning directories and encoding images...');
const tree = scanDir(SKINS_DIR);
const jsContent = `window.skinsData = ${JSON.stringify(tree, null, 2)};`;
fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf-8');
console.log('skins.js згенеровано!'); 