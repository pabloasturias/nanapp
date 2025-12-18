const fs = require('fs');
const path = 'c:\\Users\\Pablo\\Desktop\\nanapp\\products.json';
const AFFILIATE_TAG = '100bcb-21';

try {
    const content = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(content);
    let changedCount = 0;

    ['es', 'en'].forEach(lang => {
        data[lang].forEach(item => {
            if (item.affiliateLink && (item.affiliateLink.includes('/dp/') || item.affiliateLink.includes('/gp/'))) {
                const oldLink = item.affiliateLink;
                const searchTerm = encodeURIComponent(item.name.replace(/ /g, '+'));
                // Decode first to avoid double encoding if keywords were already encoded, 
                // but simple name usage is safer. Let's use name.
                // Better strategy: Use the name, replace spaces with +, encodeURIComponent.
                // Actually, amazon search url is ?k=Word+Word

                const searchLink = `https://www.amazon.es/s?k=${item.name.split(' ').join('+')}&tag=${AFFILIATE_TAG}`;

                item.affiliateLink = searchLink;
                console.log(`Converted [${item.id}] ${item.name}:`);
                console.log(`  FROM: ${oldLink}`);
                console.log(`  TO:   ${searchLink}`);
                changedCount++;
            }
        });
    });

    if (changedCount > 0) {
        fs.writeFileSync(path, JSON.stringify(data, null, 4)); // Re-format with 4 spaces indent
        console.log(`\nSuccessfully converted ${changedCount} links.`);
    } else {
        console.log('\nNo direct links found to convert.');
    }

} catch (e) {
    console.error('Error:', e.message);
}
