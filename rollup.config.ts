import typescript from '@rollup/plugin-typescript'
import { dependencies, peerDependencies } from './package.json'
import { terser } from 'rollup-plugin-terser'
import { RollupOptions } from 'rollup'

export default {
  input: 'index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [typescript({ tsconfig: './tsconfig.build.json' }), terser()],
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
    'events',
  ],
} as RollupOptions
