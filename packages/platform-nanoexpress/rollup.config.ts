import typescript from '@rollup/plugin-typescript'
import { dependencies, peerDependencies } from './package.json'
import { terser } from 'rollup-plugin-terser'
import { RollupOptions } from 'rollup'

export default {
  input: './lib/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript({ tsconfig: 'tsconfig.build.json', include: ['lib/**/*.ts'] }),
    terser(),
  ],
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
    'events',
    'node:path',
    'node:fs',
  ],
} as RollupOptions
