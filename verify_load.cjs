const fs = require('fs');
const path = require('path');

const langs = ['es', 'en', 'de'];
let errors = 0;

langs.forEach(lang => {
    try {
        const p = path.join(__dirname, 'data', 'products', `${lang}.json`);
        if (!fs.existsSync(p)) {
            console.error(`Missing: ${p}`);
            errors++;
            return;
        }
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`OK: ${lang}.json has ${data.length} items`);
    } catch (e) {
        console.error(`Error loading ${lang}:`, e.message);
        errors++;
    }
});

if (errors === 0) {
    console.log("All verifications passed.");
    process.exit(0);
} else {
    process.exit(1);
}
