import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

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
    external: ["react/jsx-runtime", "react", ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled"
        }),
        commonjs(),
        typescript()
    ],
};