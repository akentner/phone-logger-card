import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/phone-logger-card.ts",
  output: {
    file: "dist/phone-logger-card.js",
    format: "iife",
    name: "PhoneLoggerCard",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript(),
    terser(),
  ],
};
