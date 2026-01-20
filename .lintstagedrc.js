module.exports = {
  // TypeScript and TypeScript React files
  '**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  // JavaScript and JavaScript React files
  '**/*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  // JSON files
  '**/*.json': [
    'prettier --write',
  ],
  // Markdown files
  '**/*.md': [
    'prettier --write',
  ],
  // YAML files
  '**/*.{yml,yaml}': [
    'prettier --write',
  ],
};
