const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'products.json');
const outputDir = path.join(__dirname, 'data', 'products');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read input file
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Handle both structure types just in case: { default: { es: ... } } or { es: ... }
const productsByLang = data.default || data;

// Iterate and write files
for (const [lang, products] of Object.entries(productsByLang)) {
    const outputFile = path.join(outputDir, `${lang}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 4));
    console.log(`Created ${outputFile} with ${products.length} items`);
}
