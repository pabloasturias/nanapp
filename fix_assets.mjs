
import { Jimp } from "jimp";
import path from "path";
import fs from "fs";

const icons = [
    { name: "icon-144.png", w: 144, h: 144 },
    { name: "icon-192.png", w: 192, h: 192 },
    { name: "icon-384.png", w: 384, h: 384 },
    { name: "icon-512.png", w: 512, h: 512 },
    { name: "icon-maskable-512.png", w: 512, h: 512 },
];

const screenshots = [
    { name: "screenshot-wide.png", w: 1280, h: 720 },
    { name: "screenshot-portrait.png", w: 720, h: 1280 },
];

const processFiles = async () => {
    const publicDir = path.resolve("public");
    const masterPath = path.resolve("master_icon.png");

    if (!fs.existsSync(masterPath)) {
        console.error("master_icon.png not found!");
        return;
    }

    const masterImage = await Jimp.read(masterPath);

    for (const icon of icons) {
        const filePath = path.join(publicDir, "icons", icon.name);
        try {
            console.log(`Generating ${icon.name} (${icon.w}x${icon.h})...`);
            // Clone master to avoid modifying it for next iteration
            const image = masterImage.clone();
            image.resize({ w: icon.w, h: icon.h });
            await image.write(filePath);
        } catch (err) {
            console.error(`Error processing ${icon.name}:`, err);
        }
    }
};

processFiles();
