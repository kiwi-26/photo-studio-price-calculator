// Detailed verification script for accessory products implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Detailed Accessory Products Verification\n');

// Original request specifications
const originalSpecs = [
  { name: 'IDカードホルダー', variations: [{ variation: '1カット', price: 4980, photoCount: 1 }] },
  { name: 'キーホルダー フォトホルダー', variations: [{ variation: '2カット', price: 3480, photoCount: 2 }] },
  { 
    name: 'クリアキーホルダー', 
    variations: [
      { variation: '丸型/角形 1カット', price: 1280, photoCount: 1 },
      { variation: '丸型/角形 2カット', price: 2480, photoCount: 2 },
      { variation: 'キャラクター 1カット', price: 2480, photoCount: 1, special: 'スーパーマリオ クロマキー撮影専用' }
    ]
  },
  { 
    name: 'フォトマグネットシート', 
    variations: [
      { variation: '1カット', price: 1980, photoCount: 1 },
      { variation: '2カット', price: 2480, photoCount: 2 }
    ]
  },
  { name: 'マルチフォト缶（缶バッジ）', variations: [{ variation: '1カット', price: 1280, photoCount: 1 }] },
  { 
    name: 'キッズトレカ', 
    variations: [
      { variation: 'オーロラ/アクア 1枚 1カット', price: 1500, photoCount: 1 },
      { variation: 'オーロラ/アクア 3枚セット 3カット', price: 4000, photoCount: 3 },
      { variation: 'キャラクター 1枚 1カット', price: 2000, photoCount: 1 },
      { variation: 'キャラクター 3枚セット 3カット', price: 4500, photoCount: 3 }
    ]
  },
  { name: 'シールプリント', variations: [{ variation: '1カット', price: 1280, photoCount: 1 }] },
  { name: 'クラッチフォト', variations: [{ variation: '2カット', price: 4800, photoCount: 2 }] },
  { name: 'アクリルスタンドミニ', variations: [{ variation: '1カット', price: 3980, photoCount: 1 }] },
  { 
    name: 'クリアフォト', 
    variations: [
      { variation: 'ストーリー 1カット', price: 4200, photoCount: 1 },
      { variation: 'フィルム 2カット', price: 4500, photoCount: 2 }
    ]
  }
];

function verifyImplementation() {
  const accessoryProductsPath = path.join(__dirname, 'src/assets/accessory-products.ts');
  
  if (!fs.existsSync(accessoryProductsPath)) {
    console.log('❌ accessory-products.ts file not found');
    return false;
  }

  const content = fs.readFileSync(accessoryProductsPath, 'utf8');
  
  // Parse the TypeScript file to extract product data
  const productMatches = content.match(/{\s*"id":\s*\d+,[\s\S]*?}/g);
  
  if (!productMatches) {
    console.log('❌ No products found in accessory-products.ts');
    return false;
  }

  const implementedProducts = [];
  productMatches.forEach(match => {
    try {
      // Clean up the match to make it valid JSON
      const cleanMatch = match
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":');
      
      const product = JSON.parse(cleanMatch);
      implementedProducts.push(product);
    } catch (e) {
      console.log('⚠️  Could not parse product:', match.substring(0, 50) + '...');
    }
  });

  console.log(`📊 Found ${implementedProducts.length} implemented products\n`);

  let allCorrect = true;
  let totalExpectedProducts = 0;

  // Count total expected products
  originalSpecs.forEach(spec => {
    totalExpectedProducts += spec.variations.length;
  });

  console.log(`📋 Expected ${totalExpectedProducts} products total\n`);

  // Verify each product specification
  originalSpecs.forEach(spec => {
    console.log(`🔍 Checking: ${spec.name}`);
    
    const matchingProducts = implementedProducts.filter(p => p.name === spec.name);
    
    if (matchingProducts.length !== spec.variations.length) {
      console.log(`❌ Expected ${spec.variations.length} variations, found ${matchingProducts.length}`);
      allCorrect = false;
      return;
    }

    spec.variations.forEach(expectedVar => {
      const matchingProduct = matchingProducts.find(p => 
        p.variation === expectedVar.variation ||
        (p.variation && p.variation.includes(expectedVar.variation.split(' ')[0]))
      );

      if (!matchingProduct) {
        console.log(`❌ Missing variation: ${expectedVar.variation}`);
        allCorrect = false;
        return;
      }

      // Check price
      if (matchingProduct.price !== expectedVar.price) {
        console.log(`❌ Price mismatch for ${expectedVar.variation}: expected ¥${expectedVar.price}, got ¥${matchingProduct.price}`);
        allCorrect = false;
      }

      // Check photo count
      if (matchingProduct.photoCount !== expectedVar.photoCount) {
        console.log(`❌ Photo count mismatch for ${expectedVar.variation}: expected ${expectedVar.photoCount}, got ${matchingProduct.photoCount}`);
        allCorrect = false;
      }

      // Check special descriptions
      if (expectedVar.special && !matchingProduct.description.includes('スーパーマリオ')) {
        console.log(`❌ Missing special description for ${expectedVar.variation}`);
        allCorrect = false;
      }

      // Check category
      if (matchingProduct.categoryId !== 'accessory') {
        console.log(`❌ Wrong category for ${matchingProduct.name}: expected 'accessory', got '${matchingProduct.categoryId}'`);
        allCorrect = false;
      }

      if (allCorrect) {
        console.log(`✅ ${expectedVar.variation} - ¥${expectedVar.price} (${expectedVar.photoCount} cuts)`);
      }
    });
    
    console.log('');
  });

  // Check ID range
  const ids = implementedProducts.map(p => p.id).sort((a, b) => a - b);
  const minId = Math.min(...ids);
  const maxId = Math.max(...ids);
  
  console.log(`📋 Product ID range: ${minId} - ${maxId}`);
  
  if (minId >= 300 && maxId <= 399) {
    console.log('✅ Product IDs are in safe range (300-399)');
  } else {
    console.log('⚠️  Product IDs may conflict with existing products');
    allCorrect = false;
  }

  // Check for duplicate IDs
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    console.log('❌ Duplicate IDs found');
    allCorrect = false;
  } else {
    console.log('✅ All product IDs are unique');
  }

  return allCorrect;
}

function verifyCategoryIntegration() {
  console.log('\n🔍 Verifying Category Integration\n');
  
  const categoriesPath = path.join(__dirname, 'src/assets/categories.ts');
  
  if (!fs.existsSync(categoriesPath)) {
    console.log('❌ categories.ts file not found');
    return false;
  }

  const content = fs.readFileSync(categoriesPath, 'utf8');
  
  const hasAccessoryCategory = content.includes("'accessory'") && content.includes('アクセサリー');
  const hasSparklesIcon = content.includes('SparklesIcon');
  
  if (hasAccessoryCategory) {
    console.log('✅ Accessory category found in categories.ts');
  } else {
    console.log('❌ Accessory category not found in categories.ts');
    return false;
  }

  if (hasSparklesIcon) {
    console.log('✅ SparklesIcon imported and used');
  } else {
    console.log('⚠️  SparklesIcon may not be properly configured');
  }

  return hasAccessoryCategory;
}

function verifyStoreIntegration() {
  console.log('\n🔍 Verifying Store Integration\n');
  
  const storePath = path.join(__dirname, 'src/stores/products.ts');
  
  if (!fs.existsSync(storePath)) {
    console.log('❌ products.ts store file not found');
    return false;
  }

  const content = fs.readFileSync(storePath, 'utf8');
  
  const hasImport = content.includes('accessoryProducts') && content.includes('from \'../assets/accessory-products\'');
  const hasMerge = content.includes('...accessoryProducts');
  
  if (hasImport) {
    console.log('✅ accessoryProducts imported in store');
  } else {
    console.log('❌ accessoryProducts not properly imported');
    return false;
  }

  if (hasMerge) {
    console.log('✅ accessoryProducts merged in allProducts array');
  } else {
    console.log('❌ accessoryProducts not merged in allProducts array');
    return false;
  }

  return hasImport && hasMerge;
}

// Run all verifications
console.log('🚀 Starting Comprehensive Verification\n');

const productVerification = verifyImplementation();
const categoryVerification = verifyCategoryIntegration();
const storeVerification = verifyStoreIntegration();

console.log('\n📊 VERIFICATION SUMMARY');
console.log('========================');
console.log(`Product Data: ${productVerification ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Category Integration: ${categoryVerification ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Store Integration: ${storeVerification ? '✅ PASS' : '❌ FAIL'}`);

const overallSuccess = productVerification && categoryVerification && storeVerification;
console.log(`\nOverall Status: ${overallSuccess ? '🎉 SUCCESS' : '❌ NEEDS ATTENTION'}`);

if (overallSuccess) {
  console.log('\n✨ All accessory products have been successfully implemented!');
  console.log('The implementation follows the same pattern as calendar products and should integrate seamlessly.');
} else {
  console.log('\n⚠️  Some issues were found. Please review the details above and make necessary corrections.');
}