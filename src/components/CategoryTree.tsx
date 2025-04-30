import React from 'react';
import { Lang, translations } from '../i18n';

export interface CategoryNode {
  name: string;
  categories: CategoryNode[];
  files: string[];
}

interface Props {
  node: CategoryNode;
  path: string;
  selectedPath: string;
  onSelect: (path: string) => void;
  lang: Lang;
}

const CategoryTree: React.FC<Props> = ({ node, path, selectedPath, onSelect, lang }) => {
  const isRoot = path === '';
  const isSelected = path === selectedPath;
  return (
    <div style={{ marginLeft: isRoot ? 0 : 16 }}>
      <div
        style={{ fontWeight: isSelected ? 'bold' : 'normal', cursor: 'pointer' }}
        onClick={() => onSelect(path)}
      >
        {isRoot ? translations[lang].root : node.name}
      </div>
      {node.categories && node.categories.map((cat) => (
        <CategoryTree
          key={cat.name}
          node={cat}
          path={path ? path + '/' + cat.name : cat.name}
          selectedPath={selectedPath}
          onSelect={onSelect}
          lang={lang}
        />
      ))}
    </div>
  );
};

export default CategoryTree; 