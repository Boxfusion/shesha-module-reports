import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';
import typescriptEngine from 'typescript';
// import multi from '@rollup/plugin-multi-entry';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

const onwarn = (warning, warn) => {
  // skip certain warnings
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

  // throw on others
  if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

  // Use default for everything else
  warn(warning);
};

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [
    postcss({
      plugins: [],
      minimize: true,
    }),
    external({
      includeDependencies: true,
    }),
    typescript({
      typescript: typescriptEngine,
      include: ['*.js+(|x)', '**/*.js+(|x)'],
      exclude: [
        'coverage',
        'config',
        'dist',
        'node_modules/**',
        '*.test.{js+(|x), ts+(|x)}',
        '**/*.test.{js+(|x), ts+(|x)}',
      ],
    }),
    commonjs(),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
      babelHelpers: 'runtime',
      exclude: /node_modules/,
    }),
    url(),
    svgr(),
    resolve(),
    terser(),
    json(),
    onwarn,
  ],
};
