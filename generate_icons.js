import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 32, 144, 192, 384, 512];
const MASTER_ICON_PATH = path.join(__dirname, 'master_icon.png');
const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// Helper to determine if a color is "background dark"
// The uploaded image has a dark blue background. We want to remove it for favicons/splash.
function isBackgroundColor(r, g, b) {
    // Background seems to be around #0f172a (R=15, G=23, B=42) or similar dark slate
    // Let's use a threshold.
    return (r < 60 && g < 60 && b < 80);
}

async function generateIcons() {
    try {
        console.log(`Reading master icon from: ${MASTER_ICON_PATH}`);
        const originalImage = await Jimp.read(MASTER_ICON_PATH);

        // --- PART 1: Create Transparent "Silhouette" Version ---
        // We iterate pixels. If pixel is background color, make transparent.
        const transparentImage = originalImage.clone();
        const width = transparentImage.bitmap.width;
        const height = transparentImage.bitmap.height;

        transparentImage.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            if (isBackgroundColor(r, g, b)) {
                this.bitmap.data[idx + 3] = 0; // Alpha 0
            }
        });

        // Save the splash/mask icon (Line Art Only)
        // This is used for the CSS Mask in SplashScreen
        const splashPath = path.join(ICONS_DIR, 'icon-splash.png');
        console.log(`Generating transparent splash icon at: ${splashPath}`);
        await transparentImage.clone().resize({ w: 512, h: 512 }).write(splashPath);


        // --- PART 2: Generate Icons ---

        for (const targetSize of SIZES) {
            let filename = `icon-${targetSize}.png`;
            let sourceImage = originalImage; // Default: Use the full square with background

            // User Request: "el favicone... dejar solo la silueta"
            // For small favicons (16, 32), we use the transparent silhouette
            if (targetSize === 16) {
                filename = 'favicon-16x16.png';
                sourceImage = transparentImage;
            }
            if (targetSize === 32) {
                filename = 'favicon-32x32.png';
                sourceImage = transparentImage;
            }

            // For Manifest Icons (144+), user said "el que subo es el icono... sustituir en el manifiesto"
            // The uploaded image is the nice rounded square with background. 
            // So we use originalImage for these.

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating ${targetSize}x${targetSize} icon (${sourceImage === transparentImage ? 'transparent' : 'full'}) at: ${finalPath}`);

            await sourceImage.clone().resize({ w: targetSize, h: targetSize }).write(finalPath);
        }

        // Maskable icon: Needs to be the full square version
        // Usually safe to use the icon-512 version.
        const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
        console.log(`Generating maskable icon at: ${maskablePath}`);
        await originalImage.clone().resize({ w: 512, h: 512 }).write(maskablePath);

        console.log('All icons generated successfully!');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
