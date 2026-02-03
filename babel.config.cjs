module.exports = (api) => {
  // Check if we're building for ESM
  const isESM = api.env('esm');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '18',
          },
          modules: isESM ? false : 'commonjs',
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
};
