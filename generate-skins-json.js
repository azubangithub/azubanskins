const fs = require('fs');
const path = require('path');

const SKINS_DIR = path.join(__dirname, 'skins');
const OUTPUT_FILE = path.join(__dirname, 'skins.json');

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
      files.push(entry.name);
    }
  }

  return { categories, files };
}

const tree = scanDir(SKINS_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2), 'utf-8');
console.log('skins.json згенеровано!'); 