import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json' assert { type: "json" };

export default {
    input: 'src/module.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        }, {
            file: pkg.module,
            format: 'es',
        }
    ],
    external: ["react/jsx-runtime", ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        commonjs(),
        typescript()
    ],
};