import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'
export default {
  input: `src/index.ts`,
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
    },
  ],
  plugins: [uglify(), typescript({ useTsconfigDeclarationDir: true })],
}
