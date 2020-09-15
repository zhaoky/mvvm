const path = require("path");
const execa = require("execa");
const args = require("minimist")(process.argv.slice(2));
const { deleteDefinitionFile } = require("./utils");
const distDir = path.resolve(__dirname, "../dist");

async function main() {
  if (["esm", "cjs", "umd"].includes(args.package)) {
    await execa("rollup", ["-wc", "--environment", `DEV_PACKAGE:${args.package}`], {
      stdio: "inherit",
    });
    deleteDefinitionFile(distDir);
  } else {
    console.log('请具体选择一个打包方式进行dev操作\n选项:["esm", "cjs", "umd"]\neg：`yarn dev -- --package=esm`');
  }
}

main();
