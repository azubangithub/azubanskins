const fs = require('fs');
const path = require('path');

const SKINS_DIR = path.join(__dirname, 'skins');

const mapping = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
    'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
    'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
    'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
    ' ': '_'
};

function transliterate(text) {
    return text.split('').map(char => mapping[char] || char).join('')
        .replace(/[^A-Za-z0-9_.\-]/g, ''); // Remove any remaining non-safe characters
}

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const oldName = entry.name;
        const newName = transliterate(oldName);
        const oldPath = path.join(dir, oldName);
        const newPath = path.join(dir, newName);

        if (oldName !== newName) {
            console.log(`Renaming: ${oldName} -> ${newName}`);
            fs.renameSync(oldPath, newPath);
        }

        // Standardize the path for recursion if it was renamed
        const currentPath = oldName !== newName ? newPath : oldPath;

        if (entry.isDirectory()) {
            processDir(currentPath);
        }
    }
}

if (!fs.existsSync(SKINS_DIR)) {
    console.error('Directory "skins" not found!');
    process.exit(1);
}

console.log('Starting transliteration in "skins" directory...');
processDir(SKINS_DIR);
console.log('Transliteration complete!');
console.log('Now run "node generate-skins-json.js" to update the gallery data.');
