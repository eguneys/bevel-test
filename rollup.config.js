import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
const htmlTemplate = require('rollup-plugin-generate-html-template')

import babel from '@rollup/plugin-babel'

const { string } = require('rollup-plugin-string')
const image = require('@rollup/plugin-image')
const copy = require('rollup-plugin-copy')

const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')

const { terser } = require('rollup-plugin-terser')

let extensions = ['.ts', '.js']
export default args => {
  let prod = args['config-prod']
  return {
    input: 'src/main.ts',
    output: {
      format: 'iife', 
      name: 'Space',
      dir: 'dist',
      ...(prod ? {
        entryFileNames: '[name].min.js',
        plugins: [terser({mangle: {properties: { keep_quoted: true } }})]
      } : {
        sourcemap: true
      })
    },
    watch: {
      clearScreen: true
    },
    plugins: [
      nodeResolve({ extensions, preferBuiltins: false }),
      commonjs(),
      string({
        include: '**/*.frag'
      }),
      babel({ extensions, babelHelpers: 'bundled' }),
      image(),
      copy({
        targets: [ { src: 'assets', dest: 'dist' }]
      }),
      htmlTemplate({
        template: 'src/index.html',
        target: 'index.html'
      }),
      ...(prod ? [] : [
        serve({ contentBase: 'dist', port: 3000 }),
        livereload({ watch: 'dist', port: 8080 })
      ])
    ]
  }
}
