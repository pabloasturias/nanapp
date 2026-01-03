import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage() {
    try {
        const inputPath = path.join(__dirname, 'public', 'icons', 'icon-512.png');
        const outputPath = path.join(__dirname, 'public', 'icons', 'icon-transparent.png');

        console.log(`Reading image from: ${inputPath}`);
        // Jimp.read might be a static method on the named export or default.
        // If { Jimp } doesn't work, we might need default import.
        // Let's try named first.
        const image = await Jimp.read(inputPath);

        // Scan all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Check if pixel is white or very close to white
            if (red > 240 && green > 240 && blue > 240) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
            }
        });

        console.log(`Writing transparent image to: ${outputPath}`);
        await image.write(outputPath); // write is often synchronous-ish or returns promise in v1? writeAsync is safer.
        console.log('Done!');

    } catch (error) {
        console.error('Error processing image:', error);
        process.exit(1);
    }
}

processImage();
