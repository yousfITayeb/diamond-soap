const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assetsDirectory = path.join(__dirname, "assets");
const imageFiles = fs.readdirSync(assetsDirectory).filter((file) => /\.jpe?g$/i.test(file));

Promise.all(
  imageFiles.map(async (file) => {
    const inputPath = path.join(assetsDirectory, file);
    const outputPath = path.join(assetsDirectory, file.replace(/\.(jpe?g)$/i, ".webp"));
    await sharp(inputPath).webp().toFile(outputPath);
  }),
)
  .then(() => {
    console.log(`Converted ${imageFiles.length} image(s) to WebP.`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
