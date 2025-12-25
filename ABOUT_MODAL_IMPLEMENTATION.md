# 「このサイトについて」モーダル実装レポート

## 実装概要

「このサイトについて」リンクと対応するモーダルを商品一覧リストの下に追加しました。

## 実装内容

### 1. 新規作成ファイル

#### `src/components/AboutSiteModal.vue`
- 「このサイトについて」モーダルコンポーネント
- 既存のモーダルコンポーネント（ProductDetailModal.vue）と同じパターンで実装
- 以下の内容を含む：
  - サービス概要の説明
  - 商品情報に関するdisclosure（2025年12月時点）
  - GitHubリンク（設定可能）

### 2. 修正ファイル

#### `src/App.vue`
- AboutSiteModalコンポーネントのインポートと追加
- 「このサイトについて」リンクをProductsListの下に追加
- モーダルの状態管理（aboutModalState）を追加
- モーダルの開閉メソッド（openAboutModal, closeAboutModal）を追加

## 機能詳細

### モーダル内容

1. **サービス概要**
   - VTuber向けイラスト・Live2Dモデル制作サービスの説明
   - 料金計算ツールとしての機能説明

2. **商品情報について**
   - 情報更新日：2025年12月時点
   - 料金変更の可能性に関する注意事項
   - 参考価格であることの明記

3. **ソースコード**
   - GitHubリンク（設定可能）
   - GitHubアイコン付きボタン

### UI/UX特徴

- 既存のモーダルと統一されたデザイン
- ダークモード対応
- レスポンシブデザイン
- アクセシビリティ対応（aria属性、キーボードナビゲーション）
- 背景クリックまたは×ボタンで閉じる

## 設定方法

### GitHubリンクの設定

`src/components/AboutSiteModal.vue`の`openGitHubLink`メソッド内のURLを実際のリポジトリURLに変更してください：

```javascript
const openGitHubLink = () => {
  // 実際のGitHubリポジトリURLに変更
  const githubUrl = 'https://github.com/your-username/your-repository';
  window.open(githubUrl, '_blank', 'noopener,noreferrer');
};
```

### サービス説明のカスタマイズ

必要に応じて、`AboutSiteModal.vue`内のサービス説明文を実際のサービス内容に合わせて修正してください。

## テスト

`test-about-modal.html`ファイルでモーダルの動作を単体でテストできます。

## 使用技術

- Vue 3 Composition API
- TypeScript
- Tailwind CSS
- Heroicons（×アイコン）

## 今後の拡張可能性

- モーダル内容の外部設定ファイル化
- 多言語対応
- アニメーション効果の追加
- お問い合わせフォームへのリンク追加

## 注意事項

- GitHubリンクは現在プレースホルダーURLになっているため、実際のリポジトリURLに変更が必要
- 商品情報の更新日（2025年12月）は適宜更新してください
- サービス説明は実際のサービス内容に合わせて調整してください