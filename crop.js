import { Jimp } from 'jimp';

async function crop() {
    try {
        const imgPath = 'c:\\Users\\Pablo\\Desktop\\nanapp\\public\\app_logo.png';
        const image = await Jimp.read(imgPath);
        
        // Logo is vertically between 21% and 57% -> center is at roughly 39%
        // Height is 1024, center is 400
        // Horizontal center is 512
        // We crop a square of 500x500
        const size = 500;
        const x = 512 - (size / 2);
        const y = 400 - (size / 2);
        
        image.crop({ x, y, w: size, h: size });
        
        await image.write('c:\\Users\\Pablo\\Desktop\\nanapp\\public\\app_logo.png');
        console.log("Image perfectly cropped to just the logo!");
    } catch (e) {
        console.error("Error", e);
    }
}

crop();
