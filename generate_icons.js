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
        // Strategy: Keep Gold pixels Opaque. Make everything else (Blue, White) Transparent.
        // This ensures corners and background disappear in the mask.
        console.log("Generating Splash Mask...");
        const splashImage = originalImage.clone();

        splashImage.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // If it looks Gold, keep it (make sure alpha is 255).
            // If it's Blue or White, kill it.
            if (isGoldish(r, g, b)) {
                this.bitmap.data[idx + 3] = 255;
            } else {
                this.bitmap.data[idx + 3] = 0; // Transparent
            }
        });

        const splashPath = path.join(ICONS_DIR, 'icon-splash.png');
        await splashImage.resize({ w: 512, h: 512 }).write(splashPath);


        // --- PART 2: Generate App Icons (Gold + Blue, No White Corners) ---
        // Strategy: Keep Gold & Blue pixels Opaque. Make White corners Transparent.
        console.log("Generating App Icons...");
        const appIconImage = originalImage.clone();

        appIconImage.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // If Whiteish -> Transparent (Remove corners)
            if (isWhiteish(r, g, b)) {
                this.bitmap.data[idx + 3] = 0;
            } else {
                // Keep Blue/Gold/Everything else opaque
                this.bitmap.data[idx + 3] = 255;
            }
        });

        // Generate sizes
        for (const targetSize of SIZES) {
            let filename = `icon-${targetSize}.png`;
            let source = appIconImage;

            // SPECIAL CASE: Tiny Favicons (16, 32)
            // User previously asked for "solo la silueta" (silhouette only) for favicons.
            // That means "Like Splash" (Transparent BG).
            // Let's verify: "el favicone ha quedado raro, puedes quitar otra vez el fondo blanco? y dejar solo la silueta del bebe?"
            // Yes. Favicons = Splash Style (Transparent, only lines).

            if (targetSize === 16) {
                filename = 'favicon-16x16.png';
                source = splashImage; // Use the line-only version
            } else if (targetSize === 32) {
                filename = 'favicon-32x32.png';
                source = splashImage; // Use the line-only version
            }

            const finalPath = path.join(ICONS_DIR, filename);
            console.log(`Generating ${targetSize}x${targetSize} icon (${source === splashImage ? 'LineArt' : 'FullColor'}) at: ${finalPath}`);
            await source.clone().resize({ w: targetSize, h: targetSize }).write(finalPath);
        }

        // Maskable: Full Color (Blue BG is fine for maskable, OS handles crop)
        // But removing white corners is still good practice if the source had them.
        const maskablePath = path.join(ICONS_DIR, 'icon-maskable-512.png');
        await appIconImage.clone().resize({ w: 512, h: 512 }).write(maskablePath);

        console.log('All icons generated successfully!');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
