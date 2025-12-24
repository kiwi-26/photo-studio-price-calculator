import type { ProductType } from "../types";

export const photoProcessingProducts: ProductType[] = [
  // マスク日焼け修整 (Mask Tan Correction)
  {
    "id": 300,
    "categoryId": "photo-processing",
    "name": "マスク日焼け修整",
    "description": "購入した全画像に対してマスク日焼けを修整します",
    "photoCount": 0,
    "price": 2980,
    "variation": "全画像",
    "maxQuantity": 1
  },
  
  // 日焼け肌修整 (Tan Skin Correction)
  {
    "id": 301,
    "categoryId": "photo-processing",
    "name": "日焼け肌修整",
    "description": "購入した全画像に対して日焼け肌を修整します",
    "photoCount": 0,
    "price": 2980,
    "variation": "全画像",
    "maxQuantity": 1
  },
  
  // 抜け歯修整 (Missing Tooth Correction)
  {
    "id": 302,
    "categoryId": "photo-processing",
    "name": "抜け歯修整",
    "description": "1カットあたりの抜け歯修整サービスです",
    "photoCount": 0,
    "price": 500,
    "variation": "1カットあたり"
  },
  
  // 美肌プリント (Beauty Print) - 1画像
  {
    "id": 303,
    "categoryId": "photo-processing",
    "name": "美肌プリント",
    "description": "美肌効果を施したプリントサービスです",
    "photoCount": 0,
    "price": 1000,
    "variation": "1画像"
  },
  
  // 美肌プリント (Beauty Print) - 全画像
  {
    "id": 304,
    "categoryId": "photo-processing",
    "name": "美肌プリント",
    "description": "美肌効果を施したプリントサービスです",
    "photoCount": 0,
    "price": 2000,
    "variation": "全画像"
  },
  
  // プレミアム美肌プリント シニア撮影向け (Premium Beauty Print for Senior Photography) - 1画像
  {
    "id": 305,
    "categoryId": "photo-processing",
    "name": "プレミアム美肌プリント シニア撮影向け",
    "description": "シニア撮影に特化したプレミアム美肌効果を施したプリントサービスです",
    "photoCount": 0,
    "price": 3000,
    "variation": "1画像"
  },
  
  // プレミアム美肌プリント シニア撮影向け (Premium Beauty Print for Senior Photography) - 2画像以上
  {
    "id": 306,
    "categoryId": "photo-processing",
    "name": "プレミアム美肌プリント シニア撮影向け",
    "description": "シニア撮影に特化したプレミアム美肌効果を施したプリントサービスです",
    "photoCount": 0,
    "price": 6000,
    "variation": "2画像以上"
  },
  
  // 撥水コーティング (Water-Repellent Coating)
  {
    "id": 307,
    "categoryId": "photo-processing",
    "name": "撥水コーティング",
    "description": "ハーフキャビネ/キャビネ/八切/六切/四切/半切/全紙サイズのプリントに撥水コーティングを施します",
    "photoCount": 0,
    "price": 500,
    "variation": "対象サイズプリント"
  },
  
  // パウチ加工 (Pouch Processing)
  {
    "id": 308,
    "categoryId": "photo-processing",
    "name": "パウチ加工",
    "description": "ハーフキャビネサイズのプリントにパウチ加工を施します",
    "photoCount": 0,
    "price": 500,
    "variation": "ハーフキャビネサイズ"
  }
];