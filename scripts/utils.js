const fs = require("fs-extra");

async function deleteDefinitionFile(path) {
  if (fs.statSync(path).isFile() && /\.d\.ts$/.test(path)) {
    await fs.remove(path);
    return;
  }
  if (fs.statSync(path).isDirectory()) {
    const files = await fs.readdir(path);
    await Promise.all(
      files.map(async (file) => {
        await deleteDefinitionFile(path + "/" + file);
      })
    );
    const newfiles = await fs.readdir(path);
    if (newfiles.length === 0) {
      await fs.remove(path);
    }
  }
}

exports.deleteDefinitionFile = deleteDefinitionFile;
