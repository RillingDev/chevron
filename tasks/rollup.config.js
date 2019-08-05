import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import { settings } from "../package.json";

const OUTPUT_ESM = {
    format: "es",
    file: `./dist/${settings.namespace.file}.esm.js`
};
const OUTPUT_CJS = {
    format: "cjs",
    file: `./dist/${settings.namespace.file}.common.js`
};
const OUTPUT_BROWSER = {
    format: "iife",
    name: settings.namespace.module,
    file: `./dist/${settings.namespace.file}.js`,
    sourcemap: true,
    globals: settings.browser.globals
};

const getOutputs = () => {
    const output = [OUTPUT_ESM, OUTPUT_CJS];

    if (settings.browser.enabled) {
        output.push(OUTPUT_BROWSER);
    }
    return output;
};

export default {
    input: `./src/main.ts`,
    output: getOutputs(),
    external: settings.external,
    plugins: [
        resolve(),
        typescript({
            cacheRoot: "./.cache/ts/main",
            useTsconfigDeclarationDir: true
        })
    ]
};
