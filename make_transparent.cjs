const Jimp = require('jimp');
const path = require('path');

async function processImage() {
    try {
        const inputPath = path.join(__dirname, 'public', 'icons', 'icon-512.png');
        const outputPath = path.join(__dirname, 'public', 'icons', 'icon-transparent.png');

        console.log(`Reading image from: ${inputPath}`);
        const image = await Jimp.read(inputPath);

        // Scan all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            // Check if pixel is white or very close to white
            // Tolerance of 10 for compression artifacts
            if (red > 245 && green > 245 && blue > 245) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
            }
        });

        console.log(`Writing transparent image to: ${outputPath}`);
        await image.writeAsync(outputPath);
        console.log('Done!');

    } catch (error) {
        console.error('Error processing image:', error);
        process.exit(1);
    }
}

processImage();
