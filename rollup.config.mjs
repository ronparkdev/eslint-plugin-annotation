import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/bundle.esm.js',
        format: 'esm',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [
      {
        file: 'dist/bundle.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
]
