const fs = require('fs');
const path = 'c:\\Users\\Pablo\\Desktop\\nanapp\\products.json';

try {
    const content = fs.readFileSync(path, 'utf8');
    console.log('Total length:', content.length);
    console.log('Char at 2574:', JSON.stringify(content[2574]));
    console.log('Context around 2574:', content.substring(2550, 2600));

    JSON.parse(content);
    console.log('JSON is VALID');
} catch (e) {
    console.error('JSON is INVALID:', e.message);
}
