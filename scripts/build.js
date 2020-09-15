const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const execa = require("execa");
const { gzipSync } = require("zlib");
const { compress } = require("brotli");
const { deleteDefinitionFile } = require("./utils");
const { Extractor, ExtractorConfig } = require("@microsoft/api-extractor");
const distDir = path.resolve(__dirname, "../dist");
/**
 * 构建入口
 *
 * @return {Array}
 */
async function buildAssets() {
  await fs.remove(distDir);
  await execa("rollup", ["-c"], { stdio: "inherit" });
  console.log(chalk.bold(chalk.yellow(`\nRolling up type definitions for mvvm.js...\n`)));
  setApiExtractor();
  await deleteDefinitionFile(distDir);
  checkAllSizes();
}
/**
 * 设置 api-extractor
 *
 */
function setApiExtractor() {
  const extractorConfigPath = path.resolve(__dirname, "../api-extractor.json");
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath);
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    console.log(`API Extractor completed successfully\n`);
  } else {
    console.error(`API Extractor completed with ${extractorResult.errorCount} errors` + ` and ${extractorResult.warningCount} warnings\n`);
    process.exitCode = 1;
  }
}
/**
 * 检查体积
 *
 */
async function checkAllSizes() {
  const files = await fs.readdir(distDir);
  const targets = files.filter((file) => /\.prod\.js$/.test(file));
  for (const target of targets) {
    checkFileSize(`${distDir}/${target}`);
  }
}
/**
 * 检查每一个文件体积
 *
 * @param {string} filePath
 * @return {*}
 */
function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const file = fs.readFileSync(filePath);
  const minSize = (file.length / 1024).toFixed(2) + "kb";
  const gzipped = gzipSync(file);
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + "kb";
  const compressed = compress(file);
  const compressedSize = (compressed.length / 1024).toFixed(2) + "kb";
  console.log(`${chalk.gray(chalk.bold(path.basename(filePath)))} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`);
}
buildAssets().catch(() => {
  process.exitCode = 1;
});
