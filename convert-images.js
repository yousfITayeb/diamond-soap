const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assetsDirectory = path.join(__dirname, "assets");
// Only process original source images, not generated variants
const sourceImages = ["hero-poster-logo.jpg", "image-1.jpg", "image-2.jpg", "image-3.jpg", "image-4.jpg"];

const widths = [400, 800, 1200];
const formats = [
  { ext: "avif", options: { quality: 50 } },
  { ext: "webp", options: { quality: 75 } },
  { ext: "jpeg", options: { quality: 75, mozjpeg: true } },
];

async function processImage(file) {
  const inputPath = path.join(assetsDirectory, file);
  const baseName = file.replace(/\.(jpe?g)$/i, "");
  
  for (const width of widths) {
    for (const fmt of formats) {
      const outputName = `${baseName}-${width}w.${fmt.ext}`;
      const outputPath = path.join(assetsDirectory, outputName);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        [fmt.ext](fmt.options)
        .toFile(outputPath);
      console.log(`Generated: ${outputName}`);
    }
  }
  
  // Also generate full-size AVIF, WebP, and JPEG for lightbox
  for (const fmt of formats) {
    const outputName = `${baseName}.${fmt.ext}`;
    const outputPath = path.join(assetsDirectory, outputName);
    await sharp(inputPath)
      [fmt.ext](fmt.options)
      .toFile(outputPath);
    console.log(`Generated: ${outputName}`);
  }
}

Promise.all(
  sourceImages.map(processImage)
)
  .then(() => {
    console.log(`Converted ${sourceImages.length} source image(s) to responsive AVIF/WebP/JPEG variants.`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
