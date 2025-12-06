const fs = require('fs');

// Read the products.ts file
const content = fs.readFileSync('./src/assets/products.ts', 'utf8');

// Find the line with "1ポーズタイプ"
const lines = content.split('\n');
const targetLine = lines.find(line => line.includes('1ポーズタイプ'));

console.log('Target line found:', targetLine);
console.log('Character codes:', targetLine ? [...targetLine].map(c => c.charCodeAt(0)) : 'Not found');

// Find the product object for ID 13
const startIndex = content.indexOf('"id": 13,');
const endIndex = content.indexOf('},', startIndex) + 2;
const productObject = content.substring(startIndex - 4, endIndex);

console.log('Product object:');
console.log(productObject);
console.log('Length:', productObject.length);