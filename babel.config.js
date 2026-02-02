module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '18',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ],
  plugins: [
    // React Compiler - optional but recommended
    [
      'babel-plugin-react-compiler',
      {
        // Compiler options
        compilationMode: 'annotation',
      },
    ],
  ],
};
