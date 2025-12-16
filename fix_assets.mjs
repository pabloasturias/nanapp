
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

    for (const icon of icons) {
        const filePath = path.join(publicDir, "icons", icon.name);
        if (!fs.existsSync(filePath)) {
            console.log(`Skipping missing: ${icon.name}`);
            continue;
        }

        try {
            const image = await Jimp.read(filePath);
            if (image.width === icon.w && image.height === icon.h) {
                console.log(`OK: ${icon.name}`);
            } else {
                console.log(`Resizing ${icon.name}: ${image.width}x${image.height} -> ${icon.w}x${icon.h}`);
                image.resize({ w: icon.w, h: icon.h });
                await image.write(filePath);
            }
        } catch (err) {
            console.error(`Error processing ${icon.name}:`, err);
        }
    }

    for (const shot of screenshots) {
        const filePath = path.join(publicDir, "screenshots", shot.name);
        if (!fs.existsSync(filePath)) {
            console.log(`Skipping missing: ${shot.name}`);
            continue;
        }

        try {
            const image = await Jimp.read(filePath);
            if (image.width === shot.w && image.height === shot.h) {
                console.log(`OK: ${shot.name}`);
            } else {
                console.log(`Resizing ${shot.name}: ${image.width}x${image.height} -> ${shot.w}x${shot.h}`);
                image.resize({ w: shot.w, h: shot.h });
                await image.write(filePath);
            }
        } catch (err) {
            console.error(`Error processing ${shot.name}:`, err);
        }
    }
};

processFiles();
