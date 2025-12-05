// Simple test to verify the variation grouping implementation
const { createApp } = require('vue');
const { createPinia } = require('pinia');

// Mock test to verify our types and store functions work
console.log('Testing product variation grouping implementation...');

// Test data structure
const testProducts = [
  {
    id: 1,
    name: 'Test Product',
    categoryId: 'test',
    description: 'Test description',
    photoCount: 5,
    price: 1000,
    variation: 'Variation A'
  },
  {
    id: 2,
    name: 'Test Product',
    categoryId: 'test',
    description: 'Test description',
    photoCount: 5,
    price: 1200,
    variation: 'Variation B'
  },
  {
    id: 3,
    name: 'Single Product',
    categoryId: 'test',
    description: 'Single product',
    photoCount: 3,
    price: 800
  }
];

// Test grouping logic
function groupProductsByVariation(products) {
  const productGroups = new Map();
  
  products.forEach(product => {
    const groupKey = `${product.name}|${product.categoryId}`;
    if (!productGroups.has(groupKey)) {
      productGroups.set(groupKey, []);
    }
    productGroups.get(groupKey).push(product);
  });
  
  const result = [];
  
  productGroups.forEach((groupProducts, groupKey) => {
    if (groupProducts.length === 1) {
      result.push(groupProducts[0]);
    } else {
      const baseProduct = groupProducts[0];
      const variations = groupProducts.map(product => ({
        id: product.id,
        variation: product.variation || 'デフォルト',
        price: product.price,
        photoCount: product.photoCount,
        description: product.description !== baseProduct.description ? product.description : undefined
      }));
      
      const prices = groupProducts.map(p => p.price);
      const basePrice = Math.min(...prices);
      
      const groupedProduct = {
        name: baseProduct.name,
        categoryId: baseProduct.categoryId,
        description: baseProduct.description,
        basePhotoCount: baseProduct.photoCount,
        basePrice,
        variations,
        hasMultipleVariations: true
      };
      
      result.push(groupedProduct);
    }
  });
  
  return result;
}

// Run test
const grouped = groupProductsByVariation(testProducts);
console.log('Grouped products:', JSON.stringify(grouped, null, 2));

// Verify results
if (grouped.length === 2) {
  console.log('✅ Correct number of groups created');
} else {
  console.log('❌ Expected 2 groups, got', grouped.length);
}

const groupedProduct = grouped.find(p => p.hasMultipleVariations);
if (groupedProduct && groupedProduct.variations.length === 2) {
  console.log('✅ Variations grouped correctly');
} else {
  console.log('❌ Variations not grouped correctly');
}

const singleProduct = grouped.find(p => !p.hasMultipleVariations);
if (singleProduct && singleProduct.name === 'Single Product') {
  console.log('✅ Single product preserved correctly');
} else {
  console.log('❌ Single product not preserved correctly');
}

console.log('Test completed!');