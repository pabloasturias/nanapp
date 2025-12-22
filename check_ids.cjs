
const fs = require('fs');
const path = require('path');

const files = ['es.json', 'en.json', 'de.json'];
const dir = path.join(__dirname, 'data/products');

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`${file} not found`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    try {
        const products = JSON.parse(content);
        const ids = products.map(p => p.id);

        console.log(`\n--- ${file} (${products.length} items) ---`);

        // Count duplicates
        const counts = {};
        ids.forEach(id => counts[id] = (counts[id] || 0) + 1);

        const dups = Object.entries(counts).filter(([id, count]) => count > 1);
        if (dups.length > 0) {
            console.log('Duplicate IDs:');
            dups.forEach(([id, count]) => {
                console.log(`  ID ${id}: ${count} times`);
                // Find names for this ID
                const items = products.filter(p => p.id == id);
                items.forEach(p => console.log(`    - ${p.name}`));
            });
        } else {
            console.log('No duplicate IDs found.');
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }
});
