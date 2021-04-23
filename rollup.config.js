import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import analyze from 'rollup-plugin-analyzer'
// import { terser } from 'rollup-plugin-terser'
import builtins from 'builtin-modules'
import postcssCopy from 'postcss-copy'

export default [
  {
    input: 'src/index.js',

    external: builtins,
    context: 'window',

    plugins: [
      postcss({
        extract: path.resolve('lib/index.css'),
        extensions: [ '.css' ],
        modules: {
          scopeBehaviour: 'global',
          camelCase: true,
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
        plugins: [
          postcssCopy({
            basePath: [
              path.resolve('node_modules/blockly')
            ],
            dest: path.resolve('lib')
          }),
        ],
      }),

      // json(),
      resolve(),
      commonjs(),
      // terser(),
      analyze({ limit: 5 }),
    ],

    output: [
      {
        file: 'lib/index.js',
        format: 'umd',
        name: 'Blockly',
      },
    ],

    onwarn (warning, warn) {
      if (warning.code === 'EVAL') {
        return
      }

      warn(warning)
    }
  }
]
