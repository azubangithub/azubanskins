import React, { useEffect, useState } from 'react';
import CategoryTree, { CategoryNode } from './components/CategoryTree';
import Gallery from './components/Gallery';
import { translations, Lang } from './i18n';

const IMAGES_JSON = process.env.PUBLIC_URL + '/images.json';

function findNodeByPath(node: CategoryNode, path: string[]): CategoryNode {
  if (path.length === 0 || (path.length === 1 && path[0] === '')) return node;
  const [head, ...rest] = path;
  const child = node.categories.find((cat) => cat.name === head);
  if (!child) return node;
  return findNodeByPath(child, rest);
}

const LANGS: { code: Lang; label: string }[] = [
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

const getInitialLang = (): Lang => {
  const saved = localStorage.getItem('lang');
  if (saved === 'uk' || saved === 'en' || saved === 'ru') return saved;
  return 'uk';
};

const App: React.FC = () => {
  const [tree, setTree] = useState<CategoryNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [lang, setLang] = useState<Lang>(getInitialLang());

  useEffect(() => {
    fetch(IMAGES_JSON)
      .then((res) => res.json())
      .then((data) => {
        setTree({ name: 'images', ...data });
        setSelectedPath('');
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  if (!tree) return <div>{translations[lang].loading}</div>;

  const selectedNode = findNodeByPath(tree, selectedPath.split('/').filter(Boolean));
  const basePath = '/images' + (selectedPath ? '/' + selectedPath : '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        <span>{translations[lang].selectLang}:</span>
        <select value={lang} onChange={e => setLang(e.target.value as Lang)}>
          {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ minWidth: 220 }}>
          <h2>{translations[lang].categories}</h2>
          <CategoryTree
            node={tree}
            path={''}
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
            lang={lang}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>{translations[lang].gallery}</h2>
          <Gallery node={selectedNode} path={basePath} lang={lang} />
        </div>
      </div>
    </div>
  );
};

export default App; 