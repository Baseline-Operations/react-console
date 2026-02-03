import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.ts', '.tsx'];

// Entry points matching package.json exports
const entryPoints = [
  'src/index.ts',
  'src/cli.ts',
  'src/router.ts',
  'src/selection.ts',
  'src/layout.ts',
  'src/animations.ts',
  'src/theme.ts',
  'src/storage.ts',
  'src/hooks.ts',
];

// External dependencies (don't bundle these)
const external = [
  'react',
  'react/jsx-runtime',
  'react-reconciler',
  'ansi-escapes',
  'cli-cursor',
  /^node:/,
];

// Shared plugins
const plugins = [
  resolve({ extensions }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    extensions,
    exclude: 'node_modules/**',
  }),
];

export default [
  // ESM build
  {
    input: entryPoints,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    external,
    plugins,
  },
  // CJS build
  {
    input: entryPoints,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].cjs',
      exports: 'named',
    },
    external,
    plugins,
  },
];
