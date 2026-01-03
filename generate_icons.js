import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 32, 144, 192, 384, 512];
const MASTER_ICON_PATH = path.join(__dirname, 'master_icon.png');
const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// --- Color Helpers ---

// Calculate Euclidean distance between two colors (simplified RGB)
function colorDist(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(
        (r1 - r2) ** 2 +
        (g1 - g2) ** 2 +
        (b1 - b2) ** 2
    );
}

// Target Colors based on User Brand/Image
const TARGET_BLUE = { r: 15, g: 23, b: 42 }; // Approx #0f172a
const TARGET_GOLD = { r: 254, g: 199, b: 111 }; // Approx #fec76f
const TARGET_WHITE = { r: 255, g: 255, b: 255 };

// Thresholds
const BLUE_THRESHOLD = 80;  // Generous for compression artifacts
const GOLD_THRESHOLD = 80;
const WHITE_THRESHOLD = 50; // White corners usually distinct

function isBlueish(r, g, b) {
    // Check minimal brightness too to distinguish from black? 
    // Actually, simple distance to target blue is simpler.
    // Also, dark colors generally.
    return colorDist(r, g, b, TARGET_BLUE.r, TARGET_BLUE.g, TARGET_BLUE.b) < BLUE_THRESHOLD || (r < 60 && g < 60 && b < 80);
}

function isGoldish(r, g, b) {
    return colorDist(r, g, b, TARGET_GOLD.r, TARGET_GOLD.g, TARGET_GOLD.b) < GOLD_THRESHOLD;
    // Or just "Very Red/Green dominant"? 
    // r > 200, g > 150, b < 150?
    // Let's stick to distance + backup heuristic if needed.
}

function isWhiteish(r, g, b) {
    return (r > 200 && g > 200 && b > 200);
}



async function generateIcons() {
    try {
        console.log(`Reading master icon from: ${MASTER_ICON_PATH}`);
        const originalImage = await Jimp.read(MASTER_ICON_PATH);
        const width = originalImage.bitmap.width;
        const height = originalImage.bitmap.height;

        // --- PART 1: Generate Splash Mask (Line Art ONLY) ---
        console.log("Generating Splash Mask...");
        const splashImage = originalImage.clone();
        splashImage.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            if (isGoldish(r, g, b)) {
                this.bitmap.data[idx + 3] = 255;
            } else {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        const splashPath = path.join(ICONS_DIR, 'icon-splash.png');
        await splashImage.resize({ w: 512, h: 512 }).write(splashPath);


        // --- PART 2: Generate App Icons (Gold + Blue, No White Corners, WITH PADDING) ---
        console.log("Generating App Icons...");
        const appIconImage = originalImage.clone();

        // Remove white corners from source first
        appIconImage.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            if (isWhiteish(r, g, b)) {
                this.bitmap.data[idx + 3] = 0;
            } else {
                this.bitmap.data[idx + 3] = 255;
            }
        });

        // Loop for sizes
        for (const targetSize of SIZES) {
            let filename = `icon-${targetSize}.png`;

            // SPECIAL CASE: Tiny Favicons (Keep Transparent, No Padding needed usually)
            if (targetSize === 16 || targetSize === 32) {
                if (targetSize === 16) filename = 'favicon-16x16.png';
                if (targetSize === 32) filename = 'favicon-32x32.png';

                const finalPath = path.join(ICONS_DIR, filename);
                console.log(`Generating Favicon ${targetSize}x${targetSize} (LineArt) at: ${finalPath}`);
                await splashImage.clone().resize({ w: targetSize, h: targetSize }).write(finalPath);
                continue; // Done for favicon
            }

            // REGULAR APP ICONS (144+) - Add Padding
            // Create a new square canvas of targetSize, filled with Blue
            // The "Blue" should match the icon background. 
            // We can pick a pixel color or just use TARGET_BLUE approx.
            // Or better: Clone the original logic?
            // Actually, we want to scale DOWN the appIconImage and place it on a Blue background.
            // Padding factor: e.g. 0.8 scale (10% padding on each side)

            const paddedCanvas = new Jimp({ width: targetSize, height: targetSize, color: 0x0f172aff }); // Start with Hex Blue #0f172a

            // Re-apply specific blue from image if needed, but #0f172a is our Tailwind slate-950 approx match
            // or we pick top-left pixel (if not white)? 
            // Let's stick to safe hardcoded dark blue or #0f172a. 
            // Better: use the numeric color from TARGET_BLUE.
            // Jimp hex format: 0xRRGGBBAA
            // 15, 23, 42 -> 0F 17 2A -> 0x0f172aff. 

            // Scale the icon image
            const scaleFactor = 0.75; // More space as requested
            const iconSize = Math.floor(targetSize * scaleFactor);
            const offset = Math.floor((targetSize - iconSize) / 2);

            const resizedIcon = appIconImage.clone().resize({ w: iconSize, h: iconSize });

            // Composite
            paddedCanvas.composite(resizedIcon, offset, offset);

            // Make corners transparent again? 
            // The canvas is square. iOS/Android mask it themselves.
            // If we want "No White Corners" equivalent, we just return the full square with blue BG.
            // The user's white corners were from the source image. Removing them made it transparent.
            // If we put it on a blue background, the transparency becomes blue. Perfect.

            // BUT, wait. Maskable icon MUST be full bleed.
            // Regular icons (e.g. PWA) usually are full bleed squares too.
            // If we add padding, the "Face" is smaller. That is what user wants.

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating Padded Icon ${targetSize}x${targetSize} at: ${finalPath}`);
            await paddedCanvas.write(finalPath);

            if (targetSize === 512) {
                // Maskable too
                const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
                // Standard maskable has 'safe zone'. 0.75 scale is essentially ensuring safe zone.
                // So we can assume the same padded canvas is good for maskable?
                // Or we generate a separate one with slightly less padding? 
                // Safe zone is inner 80% (diameter) circle. 
                // If our critical content (face) is within 75%, it's fully safe.
                await paddedCanvas.write(maskablePath);
            }
        }

        console.log('All icons generated successfully!');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}
