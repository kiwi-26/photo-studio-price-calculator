import type { ProductType } from "../types";

export const imageDataProducts: ProductType[] = [
  // 商品購入したすべての写真の画像データ - ダウンロード
  {
    "id": 300,
    "categoryId": "image-data",
    "name": "商品購入したすべての写真の画像データ",
    "description": "撮影したすべての写真をデータでお渡しします。データ商品以外で税込50,000円以上購入した場合に注文可能です。",
    "photoCount": 0,
    "price": 3000,
    "variation": "ダウンロード",
    "requiresThreshold": true,
    "maxQuantity": 1
  },
  
  // 商品購入したすべての写真の画像データ - CD
  {
    "id": 301,
    "categoryId": "image-data",
    "name": "商品購入したすべての写真の画像データ",
    "description": "撮影したすべての写真をCDでお渡しします。データ商品以外で税込50,000円以上購入した場合に注文可能です。",
    "photoCount": 0,
    "price": 5000,
    "variation": "CD",
    "requiresThreshold": true,
    "maxQuantity": 1
  },
  
  // 商品購入した写真から1カットずつ購入 - ダウンロード
  {
    "id": 302,
    "categoryId": "image-data",
    "name": "商品購入した写真から1カットずつ購入",
    "description": "撮影した写真から1カットずつ選んでデータでお渡しします。データ商品以外で税込50,000円以上購入した場合は選択不可となります。",
    "photoCount": 0,
    "price": 5000,
    "variation": "ダウンロード",
    "unavailableWhenThresholdMet": true
  },
  
  // 商品購入した写真から1カットずつ購入 - CD
  {
    "id": 303,
    "categoryId": "image-data",
    "name": "商品購入した写真から1カットずつ購入",
    "description": "撮影した写真から1カットずつ選んでCDでお渡しします。データ商品以外で税込50,000円以上購入した場合は選択不可となります。",
    "photoCount": 0,
    "price": 5000,
    "variation": "CD",
    "unavailableWhenThresholdMet": true
  },
  
  // 1年後データ作成 - ダウンロード
  {
    "id": 304,
    "categoryId": "image-data",
    "name": "1年後データ作成",
    "description": "撮影から1年後にデータを作成してお渡しします。",
    "photoCount": 0,
    "price": 400,
    "variation": "ダウンロード",
    "maxQuantity": 1
  },
  
  // 1年後データ作成 - CD
  {
    "id": 305,
    "categoryId": "image-data",
    "name": "1年後データ作成",
    "description": "撮影から1年後にデータを作成してCDでお渡しします。",
    "photoCount": 0,
    "price": 600,
    "variation": "CD",
    "maxQuantity": 1
  }
];