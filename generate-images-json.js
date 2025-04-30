const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const OUTPUT_FILE = path.join(__dirname, 'public', 'images.json');

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

const tree = scanDir(IMAGES_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2), 'utf-8');
console.log('images.json згенеровано!'); 