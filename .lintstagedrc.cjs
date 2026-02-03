module.exports = {
  // TypeScript and TypeScript React files
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  // JavaScript config files (eslint ignores these, only format)
  '**/*.{js,jsx}': ['prettier --write'],
  // JSON files
  '**/*.json': ['prettier --write'],
  // Markdown files
  '**/*.md': ['prettier --write'],
  // YAML files
  '**/*.{yml,yaml}': ['prettier --write'],
};
