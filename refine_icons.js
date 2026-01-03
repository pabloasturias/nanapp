import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 32, 144, 192, 384, 512];
const MASTER_ICON_PATH = path.join(__dirname, 'master_icon.png');
const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// Target background: slate-950 (#020617)
const TARGET_R = 2;
const TARGET_G = 6;
const TARGET_B = 23;
const TARGET_A = 255;

// Tolerance for color matching (0-255)
const TOLERANCE = 60; // Increased tolerance

async function refineAndGenerate() {
    try {
        console.log(`Reading master icon from: ${MASTER_ICON_PATH}`);
        const image = await Jimp.read(MASTER_ICON_PATH);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Sample starting color from (0,0)
        const startIdx = 0;
        const startR = image.bitmap.data[startIdx + 0];
        const startG = image.bitmap.data[startIdx + 1];
        const startB = image.bitmap.data[startIdx + 2];
        const startA = image.bitmap.data[startIdx + 3];

        console.log(`Starting flood fill from (0,0) with color: R=${startR}, G=${startG}, B=${startB}`);

        // Visited set (using 1D index)
        const visited = new Uint8Array(width * height);
        const queue = [0]; // Store indices
        visited[0] = 1;

        let replacedCount = 0;

        while (queue.length > 0) {
            const idx = queue.shift();
            const x = (idx / 4) % width;
            const y = Math.floor((idx / 4) / width);

            // Replace color
            image.bitmap.data[idx + 0] = TARGET_R;
            image.bitmap.data[idx + 1] = TARGET_G;
            image.bitmap.data[idx + 2] = TARGET_B;
            image.bitmap.data[idx + 3] = TARGET_A;
            replacedCount++;

            // Check neighbors
            const neighbors = [
                { nx: x + 1, ny: y },
                { nx: x - 1, ny: y },
                { nx: x, ny: y + 1 },
                { nx: x, ny: y - 1 }
            ];

            for (const { nx, ny } of neighbors) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIdx = (ny * width + nx) * 4;

                    if (!visited[nIdx / 4]) {
                        // Check color match
                        const nr = image.bitmap.data[nIdx + 0];
                        const ng = image.bitmap.data[nIdx + 1];
                        const nb = image.bitmap.data[nIdx + 2];

                        const dist = Math.sqrt(
                            Math.pow(nr - startR, 2) +
                            Math.pow(ng - startG, 2) +
                            Math.pow(nb - startB, 2)
                        );

                        if (dist <= TOLERANCE) {
                            visited[nIdx / 4] = 1;
                            queue.push(nIdx);
                        }
                    }
                }
            }
        }

        console.log(`Flood fill complete. Replaced ${replacedCount} pixels.`);

        // Generate icons
        for (const size of SIZES) {
            let filename = `icon-${size}.png`;
            if (size === 16) filename = 'favicon-16x16.png';
            if (size === 32) filename = 'favicon-32x32.png';

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating ${size}x${size} icon at: ${finalPath}`);
            await image.clone().resize({ w: size, h: size }).write(finalPath);
        }

        const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
        await image.clone().resize({ w: 512, h: 512 }).write(maskablePath);

        console.log('Icons refined and regenerated successfully!');

    } catch (error) {
        console.error('Error processing icons:', error);
        process.exit(1);
    }
}

refineAndGenerate();
