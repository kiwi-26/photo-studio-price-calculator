// Verification script for accessory products implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying accessory products implementation...\n');

// Check if accessory-products.ts exists
const accessoryProductsPath = path.join(__dirname, 'src/assets/accessory-products.ts');
if (fs.existsSync(accessoryProductsPath)) {
  console.log('✅ accessory-products.ts file exists');
  
  // Read and parse the file content
  const content = fs.readFileSync(accessoryProductsPath, 'utf8');
  
  // Check for expected products
  const expectedProducts = [
    'IDカードホルダー',
    'キーホルダー フォトホルダー',
    'クリアキーホルダー',
    'フォトマグネットシート',
    'マルチフォト缶（缶バッジ）',
    'キッズトレカ',
    'シールプリント',
    'クラッチフォト',
    'アクリルスタンドミニ',
    'クリアフォト'
  ];
  
  let foundProducts = 0;
  expectedProducts.forEach(product => {
    if (content.includes(product)) {
      console.log(`✅ Found product: ${product}`);
      foundProducts++;
    } else {
      console.log(`❌ Missing product: ${product}`);
    }
  });
  
  console.log(`\n📊 Found ${foundProducts}/${expectedProducts.length} expected products\n`);
  
  // Check ID range
  const idMatches = content.match(/"id":\s*(\d+)/g);
  if (idMatches) {
    const ids = idMatches.map(match => parseInt(match.match(/\d+/)[0]));
    const minId = Math.min(...ids);
    const maxId = Math.max(...ids);
    console.log(`📋 Product IDs range from ${minId} to ${maxId}`);
    
    if (minId >= 300 && maxId <= 399) {
      console.log('✅ Product IDs are in the expected range (300-399)');
    } else {
      console.log('⚠️  Product IDs may conflict with existing products');
    }
  }
} else {
  console.log('❌ accessory-products.ts file not found');
}

// Check if categories.ts has been updated
const categoriesPath = path.join(__dirname, 'src/assets/categories.ts');
if (fs.existsSync(categoriesPath)) {
  const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');
  
  if (categoriesContent.includes("'accessory'") && categoriesContent.includes('アクセサリー')) {
    console.log('✅ Accessory category added to categories.ts');
  } else {
    console.log('❌ Accessory category not found in categories.ts');
  }
} else {
  console.log('❌ categories.ts file not found');
}

// Check if products store has been updated
const productsStorePath = path.join(__dirname, 'src/stores/products.ts');
if (fs.existsSync(productsStorePath)) {
  const storeContent = fs.readFileSync(productsStorePath, 'utf8');
  
  if (storeContent.includes('accessoryProducts')) {
    console.log('✅ accessoryProducts imported in products store');
  } else {
    console.log('❌ accessoryProducts not imported in products store');
  }
  
  if (storeContent.includes('...accessoryProducts')) {
    console.log('✅ accessoryProducts merged in allProducts array');
  } else {
    console.log('❌ accessoryProducts not merged in allProducts array');
  }
} else {
  console.log('❌ products.ts store file not found');
}

console.log('\n🎉 Verification complete!');