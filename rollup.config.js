import react from 'react';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});
const allExternal = [...external, ...Object.keys(pkg.dependencies || {})];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

const createCommonPlugins = () => [
  babel({
    extensions,
    exclude: 'node_modules/**',
  }),
];

const main = {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      // exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: allExternal,
  plugins: [...createCommonPlugins(), resolve({ extensions, modulesOnly: true })],
};

const unpkg = {
  input: 'src/index.tsx',
  output: {
    name: pkg.name,
    file: pkg.unpkg,
    format: 'umd',
    exports: 'named',
    globals: {
      react: 'React',
    },
  },
  external,
  plugins: [
    ...createCommonPlugins(),
    uglify(),
    commonjs({
      include: /node_modules/,
      namedExports: {
        react: Object.keys(react),
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
      extensions,
      preferBuiltins: false,
    }),
  ],
};

export default [main, unpkg];
