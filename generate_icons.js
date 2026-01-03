import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 32, 144, 192, 384, 512];
const MASTER_ICON_PATH = path.join(__dirname, 'master_icon.png');
const ICONS_DIR = path.join(__dirname, 'public', 'icons');

async function generateIcons() {
    try {
        console.log(`Reading master icon from: ${MASTER_ICON_PATH}`);
        const originalImage = await Jimp.read(MASTER_ICON_PATH);

        // Step 1: Create a base with a white filled circle for the Face Background
        // The icon is assumed to be roughly centered and circular-ish.
        // We'll create a 512x512 canvas, draw a white circle, then overlay the icon.
        const size = 512;
        const radius = size / 2 - 10; // slightly smaller than edge

        // Create a new image transparent
        const bg = new Jimp({ width: size, height: size, color: 0x00000000 });

        // Create the white circle layer
        // Since Jimp drawing primitives are limited in the basic package sometimes, 
        // we can scan pixels or use a shape. 
        // Actually, easiest hack: Resize the original non-transparent pixels to be white? 
        // No, user wants "rellenado en blanco" (filled white).
        // Let's iterate pixels to draw a circle.

        const center = size / 2;
        const radiusSq = radius * radius;

        // Brute-force circle drawing (fast enough for 512x512 one time)
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                if (dx * dx + dy * dy <= radiusSq) {
                    bg.setPixelColor(0xFFFFFFFF, x, y); // White fully opaque
                }
            }
        }

        // Resize original to fit nicely on top if needed, 
        // assuming master_icon.png is already 512x512 or close.
        const iconLayer = originalImage.clone().resize({ w: size, h: size });

        // Composite: White Circle Background + Icon (Black Lines) on top
        bg.composite(iconLayer, 0, 0);

        // This 'bg' is now our new Master for generation

        for (const targetSize of SIZES) {
            let filename = `icon-${targetSize}.png`;
            if (targetSize === 16) filename = 'favicon-16x16.png';
            if (targetSize === 32) filename = 'favicon-32x32.png';

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating ${targetSize}x${targetSize} filled icon at: ${finalPath}`);

            await bg.clone().resize({ w: targetSize, h: targetSize }).write(finalPath);
        }

        // Maskable icon (safe to use same filled version)
        const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
        console.log(`Generating maskable icon at: ${maskablePath}`);
        await bg.clone().write(maskablePath);

        console.log('All icons (with white face fill) generated successfully!');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
