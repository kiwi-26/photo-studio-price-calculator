# ソート順変更時のカテゴリ別表示制御実装

## 要件
ソート順を商品掲載順以外にした場合は、商品の表示をカテゴリごとに分けず、ソートの項目順にフラットに表示する。

## 実装概要

### 変更されたファイル

#### 1. `src/components/ProductsList.vue`
**変更内容:**
- `selectedSortOrder` プロップを追加
- `shouldGroupByCategory` computed property を追加
- テンプレートに条件付きレンダリングロジックを実装

**主要な変更点:**
```typescript
// 新しいプロップ
const props = defineProps<{
  products: ProductType[];
  selectedCategory?: string;
  selectedSortOrder?: string;  // 追加
}>();

// カテゴリ別表示の判定ロジック
const shouldGroupByCategory = computed(() => {
  // ソート順が'id'（商品掲載順）または未指定の時のみカテゴリ別表示
  return !props.selectedSortOrder || props.selectedSortOrder === 'id';
});
```

**テンプレートの変更:**
```vue
<!-- カテゴリ別表示（ソート順が'id'の時） -->
<div v-if="shouldGroupByCategory && groupedProducts.length > 0">
  <!-- 既存のカテゴリ別表示ロジック -->
</div>

<!-- フラット表示（ソート順が'id'以外の時） -->
<div v-else-if="!shouldGroupByCategory && products.length > 0">
  <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <ProductCard 
      v-for="product in products" 
      :key="product.id" 
      :product="product"
      @add-to-cart="$emit('add-to-cart', $event)"
      @show-detail="handleShowDetail"
    />
  </div>
</div>
```

#### 2. `src/App.vue`
**変更内容:**
- ProductsList コンポーネントに `selectedSortOrder` プロップを追加

```vue
<ProductsList 
  :products="productsStore.filteredProducts"
  :selected-category="productsStore.selectedCategory"
  :selected-sort-order="productsStore.selectedSortOrder"  <!-- 追加 -->
  @add-to-cart="cartStore.addToCart"
  @update:selected-category="productsStore.setSelectedCategory"
  @show-detail="handleShowDetail"
/>
```

## 動作仕様

### ソート順による表示の切り替え

| ソート順 | ID | 表示名 | 表示方式 |
|---------|----|---------|---------| 
| 商品掲載順 | `id` | 商品掲載順 | カテゴリ別グループ表示 |
| 価格順 | `price` | 価格順 | フラット表示 |
| ポーズ数順 | `poses` | ポーズ数順 | フラット表示 |

### 表示モードの詳細

#### カテゴリ別表示モード（ソート順: 商品掲載順）
- 商品をカテゴリごとにグループ化
- 各カテゴリにヘッダーを表示
- カテゴリ内で商品ID順にソート
- カテゴリ名の日本語順でカテゴリを並び替え

#### フラット表示モード（ソート順: 価格順・ポーズ数順）
- カテゴリヘッダーを表示しない
- 全商品を選択されたソート順で一列に表示
- 商品カードのレイアウトは同じグリッドシステムを使用

## 既存機能への影響

### 保持される機能
- 商品カードの表示とインタラクション
- カート追加機能
- 商品詳細モーダル
- フィルター機能（ポーズ数、価格、キャラクターデザイン料）
- レスポンシブデザイン

### 変更される機能
- 商品の表示レイアウト（カテゴリ別 ↔ フラット）
- カテゴリヘッダーの表示/非表示

## テスト項目

1. **デフォルト状態**: 商品掲載順でカテゴリ別表示
2. **価格順切り替え**: フラット表示への切り替え
3. **ポーズ数順切り替え**: フラット表示への切り替え
4. **商品掲載順復帰**: カテゴリ別表示への復帰
5. **商品操作一貫性**: 両モードでの機能動作確認

## 技術的詳細

### 条件判定ロジック
```typescript
const shouldGroupByCategory = computed(() => {
  return !props.selectedSortOrder || props.selectedSortOrder === 'id';
});
```

この実装により：
- `selectedSortOrder` が未定義の場合（初期状態）→ カテゴリ別表示
- `selectedSortOrder` が `'id'` の場合 → カテゴリ別表示  
- `selectedSortOrder` が `'price'` または `'poses'` の場合 → フラット表示

### データフロー
1. ユーザーがフィルターモーダルでソート順を変更
2. `ProductFilterModal` が `apply-filters` イベントを発火
3. `App.vue` が `productsStore.setSelectedSortOrder()` を呼び出し
4. ストアの `selectedSortOrder` が更新
5. `ProductsList` の `shouldGroupByCategory` が再計算
6. テンプレートが条件に応じて再レンダリング

## 互換性

- 既存のAPIとの互換性を保持
- 既存のコンポーネントインターフェースを拡張（破壊的変更なし）
- 既存のスタイリングとレスポンシブデザインを維持