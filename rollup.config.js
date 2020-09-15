import path from "path";
import packageJson from "./package.json";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
const devPackage = process.env.DEV_PACKAGE;
const defaultFormatsMap = {
  esm: {
    fileName: "mvvm.esm.js",
    formatType: "es",
  },
  "esm-prod": {
    fileName: "mvvm.esm.prod.js",
    formatType: "es",
  },
  cjs: {
    fileName: "mvvm.cjs.js",
    formatType: "cjs",
  },
  "cjs-prod": {
    fileName: "mvvm.cjs.prod.js",
    formatType: "cjs",
  },
  umd: {
    fileName: "mvvm.umd.js",
    formatType: "umd",
  },
  "umd-prod": {
    fileName: "mvvm.umd.prod.js",
    formatType: "umd",
  },
};

const packageConfigs = () => {
  if (devPackage) {
    return formatsConfig(devPackage);
  } else {
    return Object.keys(defaultFormatsMap).map((format) => {
      return formatsConfig(format);
    });
  }
};

/**
 * 设置banner
 *
 * @return {string}
 */
function setBanner() {
  const { version } = packageJson;
  return `/*!
  * MVVM v${version}
  * https://github.com/zhaoky/mvvm
  * (c) 2019-present korey zhao
  * @license MIT
  */`;
}

/**
 * 创建多个bundle
 *
 * @param {object} format
 * @return {config}
 */
function formatsConfig(format) {
  const { fileName, formatType } = defaultFormatsMap[format];
  const plugins = /prod$/.test(format) ? [terser(), babel({ extensions: [".ts"], babelHelpers: "runtime" })] : [];
  return {
    input: path.resolve(__dirname, "./src/index.ts"),
    plugins: [
      typescript({
        clean: true,
      }),
      commonjs(),
      nodeResolve(),
      ...plugins,
    ],
    output: {
      file: path.resolve(__dirname, `./dist/${fileName}`),
      format: formatType,
      exports: "auto",
      name: "MVVM",
      banner: setBanner(),
      sourcemap: !!devPackage,
    },
  };
}

export default packageConfigs();
