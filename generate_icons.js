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

        // --- PART 1: Generate Transparent Line-Art Version for Splash Screen ---
        // This preserves the transparency of the original PNG (assuming it is transparent)
        // or just resizes it. Ideally, for a colored mask, we just need the lines to be opaque 
        // and the rest transparent.
        const splashPath = path.join(ICONS_DIR, 'icon-splash.png');
        console.log(`Generating line-only splash icon at: ${splashPath}`);
        // Ensure it's 512x512 for good quality
        await originalImage.clone().resize({ w: 512, h: 512 }).write(splashPath);


        // --- PART 2: Generate White-Filled Face Versions for App Icons/Favicons ---
        const size = 512;
        const radius = size / 2 - 10;

        const bg = new Jimp({ width: size, height: size, color: 0x00000000 });

        const center = size / 2;
        const radiusSq = radius * radius;

        // Draw white circle background
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                if (dx * dx + dy * dy <= radiusSq) {
                    bg.setPixelColor(0xFFFFFFFF, x, y);
                }
            }
        }

        const iconLayer = originalImage.clone().resize({ w: size, h: size });
        bg.composite(iconLayer, 0, 0);

        for (const targetSize of SIZES) {
            let filename = `icon-${targetSize}.png`;
            if (targetSize === 16) filename = 'favicon-16x16.png';
            if (targetSize === 32) filename = 'favicon-32x32.png';

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating ${targetSize}x${targetSize} filled icon at: ${finalPath}`);

            await bg.clone().resize({ w: targetSize, h: targetSize }).write(finalPath);
        }

        const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
        console.log(`Generating maskable icon at: ${maskablePath}`);
        await bg.clone().write(maskablePath);

        console.log('All icons generated successfully!');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
