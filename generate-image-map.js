import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'images');
const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));

console.log('Generating imageMap with', imageFiles.length, 'images...\n');

const mapEntries = imageFiles
  .sort()
  .map(filename => `      '${filename}': require('@/images/${filename}'),`)
  .join('\n');

const code = `  function getImageSource(imageUrl: string) {
    const imageMap: Record<string, any> = {
${mapEntries}
    };

    if (imageMap[imageUrl]) {
      return imageMap[imageUrl];
    }

    return null;
  }`;

console.log(code);
console.log(`\n✅ Generated imageMap with ${imageFiles.length} images`);

fs.writeFileSync('image-map-code.txt', code);
console.log('✅ Saved to image-map-code.txt');
