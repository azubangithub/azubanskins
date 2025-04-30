import React from 'react';
import { CategoryNode } from './CategoryTree';
import { Lang, translations } from '../i18n';

function collectFiles(node: CategoryNode, basePath: string): { src: string, name: string }[] {
  let files: { src: string, name: string }[] = [];
  for (const file of node.files) {
    files.push({ src: `${basePath}/${file}`, name: file });
  }
  for (const cat of node.categories) {
    files = files.concat(collectFiles(cat, `${basePath}/${cat.name}`));
  }
  return files;
}

interface Props {
  node: CategoryNode;
  path: string;
  lang: Lang;
}

const Gallery: React.FC<Props> = ({ node, path, lang }) => {
  const files = collectFiles(node, path);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {files.map((file) => (
        <div key={file.src} style={{ width: 180, textAlign: 'center' }}>
          <img
            src={file.src}
            alt={file.name}
            style={{ width: 160, height: 160, objectFit: 'contain', border: '1px solid #ccc', borderRadius: 8 }}
          />
          <button
            style={{ marginTop: 8, padding: '4px 12px', borderRadius: 4, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(window.location.origin + file.src)}
          >
            {translations[lang].copyUrl}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Gallery; 