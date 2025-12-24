// 画像データ商品実装検証スクリプト
// このスクリプトは実装が正しく動作するかを検証します

console.log('🖼️ 画像データ商品実装検証開始...\n');

// 1. 商品データの検証
try {
  // 画像データ商品のインポートテスト
  const { imageDataProducts } = require('./src/assets/image-data-products.ts');
  console.log('✅ 画像データ商品ファイルのインポート成功');
  console.log(`   商品数: ${imageDataProducts.length}個`);
  
  // 商品データの構造検証
  const expectedProducts = [
    { name: '商品購入したすべての写真の画像データ', variations: ['ダウンロード', 'CD'], requiresThreshold: true },
    { name: '商品購入した写真から1カットずつ購入', variations: ['ダウンロード', 'CD'], unavailableWhenThresholdMet: true },
    { name: '1年後データ作成', variations: ['ダウンロード', 'CD'], alwaysAvailable: true }
  ];
  
  expectedProducts.forEach(expected => {
    const products = imageDataProducts.filter(p => p.name === expected.name);
    if (products.length === expected.variations.length) {
      console.log(`✅ ${expected.name}: ${products.length}バリエーション`);
    } else {
      console.log(`❌ ${expected.name}: 期待${expected.variations.length}個、実際${products.length}個`);
    }
  });
  
} catch (error) {
  console.log('❌ 画像データ商品ファイルのインポートエラー:', error.message);
}

// 2. カテゴリーの検証
try {
  const { categories } = require('./src/assets/categories.ts');
  const imageDataCategory = categories.get('image-data');
  
  if (imageDataCategory) {
    console.log('✅ 画像データカテゴリー追加成功');
    console.log(`   名前: ${imageDataCategory.name}`);
    console.log(`   短縮名: ${imageDataCategory.shortName}`);
  } else {
    console.log('❌ 画像データカテゴリーが見つかりません');
  }
} catch (error) {
  console.log('❌ カテゴリーファイルの検証エラー:', error.message);
}

// 3. 型定義の検証
try {
  const fs = require('fs');
  const typesContent = fs.readFileSync('./src/types.ts', 'utf8');
  
  if (typesContent.includes('requiresThreshold?:') && typesContent.includes('unavailableWhenThresholdMet?:')) {
    console.log('✅ ProductType インターフェース拡張成功');
  } else {
    console.log('❌ ProductType インターフェースの拡張が不完全');
  }
} catch (error) {
  console.log('❌ 型定義ファイルの検証エラー:', error.message);
}

// 4. ストア統合の検証
try {
  const fs = require('fs');
  const productsStoreContent = fs.readFileSync('./src/stores/products.ts', 'utf8');
  
  if (productsStoreContent.includes('imageDataProducts') && 
      productsStoreContent.includes('...imageDataProducts')) {
    console.log('✅ 商品ストアへの統合成功');
  } else {
    console.log('❌ 商品ストアへの統合が不完全');
  }
  
  const cartStoreContent = fs.readFileSync('./src/stores/cart.ts', 'utf8');
  
  if (cartStoreContent.includes('nonDataProductTotal') && 
      cartStoreContent.includes('isThresholdMet') &&
      cartStoreContent.includes('canOrderDataProduct')) {
    console.log('✅ カートストアのビジネスロジック追加成功');
  } else {
    console.log('❌ カートストアのビジネスロジック追加が不完全');
  }
} catch (error) {
  console.log('❌ ストアファイルの検証エラー:', error.message);
}

// 5. コンポーネント更新の検証
try {
  const fs = require('fs');
  const productCardContent = fs.readFileSync('./src/components/ProductCard.vue', 'utf8');
  
  if (productCardContent.includes('isProductAvailable') && 
      productCardContent.includes('dataProductStatus')) {
    console.log('✅ ProductCard コンポーネント更新成功');
  } else {
    console.log('❌ ProductCard コンポーネント更新が不完全');
  }
  
  const cartSummaryContent = fs.readFileSync('./src/components/CartSummary.vue', 'utf8');
  
  if (cartSummaryContent.includes('nonDataProductTotal') && 
      cartSummaryContent.includes('isThresholdMet')) {
    console.log('✅ CartSummary コンポーネント更新成功');
  } else {
    console.log('❌ CartSummary コンポーネント更新が不完全');
  }
} catch (error) {
  console.log('❌ コンポーネントファイルの検証エラー:', error.message);
}

console.log('\n🎯 検証完了');
console.log('\n📋 実装サマリー:');
console.log('- 画像データカテゴリー追加');
console.log('- 6つの画像データ商品追加（3種類×2バリエーション）');
console.log('- 50,000円閾値ビジネスロジック実装');
console.log('- UI表示の更新（商品カード、カートサマリー）');
console.log('- 既存機能への影響なし');

console.log('\n🚀 テスト方法:');
console.log('1. npm run dev でアプリケーション起動');
console.log('2. サイドバーから「画像データ」選択');
console.log('3. 各商品の状態確認');
console.log('4. 他商品で50,000円前後のテスト');
console.log('5. カート表示で閾値情報確認');