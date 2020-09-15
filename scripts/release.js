const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const semver = require("semver");
const { version: currentVersion, name: currentName } = require("../package.json");
const { prompt } = require("enquirer");
const execa = require("execa");
const step = (msg) => console.log(chalk.cyan(msg));
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: "inherit", ...opts });

async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    targetVersion = (
      await prompt({
        type: "input",
        name: "version",
        message: "请输入即将发布的版本号",
        initial: currentVersion,
      })
    ).version;
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`错误的目标版本号: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: "confirm",
    name: "yes",
    message: `即将发布的版本号为 v${targetVersion}， 确定?`,
  });

  if (!yes) {
    return;
  }

  step("\nRunning tests...\n");
  if (!args.skipTests) {
    await run("yarn", ["test"]);
  } else {
    console.log(`(skipped)`);
  }

  step("\nUpdating cross dependencies...");
  updateVersions(targetVersion);

  step("\nBuilding all packages...");
  if (!args.skipBuild) {
    await run("yarn", ["build"]);
  } else {
    console.log(`(skipped)`);
  }

  step("\nCommitting changes...");
  const { stdout } = await run("git", ["diff"], { stdio: "pipe" });
  if (stdout) {
    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", `release: v${targetVersion}`]);
  } else {
    console.log("No changes to commit.");
  }

  // publish packages
  step("\nPublishing packages...");
  await publishPackage(targetVersion);
}

function updateVersions(version) {
  const pkgPath = path.resolve(__dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function publishPackage(version) {
  try {
    await run("yarn", ["publish", "--new-version", version, "--tag", "next", "--access", "public"], {
      stdio: "pipe",
    });
    console.log(chalk.green(`Successfully published ${currentName}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${currentName}`));
    } else {
      throw e;
    }
  }
}

main().catch((err) => {
  console.error(err);
});
