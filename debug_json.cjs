const fs = require('fs');
const path = 'c:\\Users\\Pablo\\Desktop\\nanapp\\products.json';

try {
    const content = fs.readFileSync(path, 'utf8');
    console.log('Total length:', content.length);

    if (content.length > 2574) {
        console.log('Char at 2574:', JSON.stringify(content[2574]));
        console.log('Context around 2574:', content.substring(2550, 2600));
    } else {
        console.log('File is shorter than 2574 chars');
    }

    JSON.parse(content);
    console.log('JSON is VALID');
} catch (e) {
    console.error('JSON is INVALID:', e.message);

    // Try to find the position from the error message if possible
    const match = e.message.match(/position (\d+)/);
    if (match) {
        const pos = parseInt(match[1]);
        console.log('Error reported at pos:', pos);
        console.log('Context at error:', content.substring(pos - 20, pos + 20));
    }
}
