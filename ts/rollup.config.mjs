import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const env = process.env.NODE_ENV;

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    file: "dist/browser/index.js",
    format: "esm",
    externalLiveBindings: false,
    generatedCode: {
      arrowFunctions: true,
      constBindings: true,
      objectShorthand: true,
      symbols: true,
    },
    sourcemap: true,
  },
  plugins: [
    commonjs({ sourceMap: true }),
    nodeResolve({
      browser: true,
      dedupe: ["bn.js", "buffer"],
      extensions: [".js", ".ts"],
      preferBuiltins: false,
    }),
    typescript({
      tsconfig: "./tsconfig.base.json",
      sourceMap: true,
    }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(env),
        "process.env.BROWSER": JSON.stringify(true),
      },
    }),
    terser(),
  ],
  strictDeprecations: true,
  treeshake: {
    moduleSideEffects: false,
  },
  external: [
    "@juici/case",
    "@project-serum/borsh",
    "@solana/web3.js",
    "assert",
    "base64-js",
    "bn.js",
    "bs58",
    "buffer",
    "buffer-layout",
    "eventemitter3",
    "js-sha256",
    "pako",
    "toml",
    "node-fetch",
  ],
  onwarn: (warning, rollupWarn) => {
    rollupWarn(warning);
    if (warning.code === "CIRCULAR_DEPENDENCY") {
      throw new Error(
        "Please eliminate the circular dependencies listed above and retry the build"
      );
    }
  },
};
