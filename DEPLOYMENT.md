# デプロイメント設定

このプロジェクトは、GitHub Actionsを使用してレンタルサーバーへの自動デプロイを行います。

## 必要なGitHub Secrets

デプロイメントを有効にするために、以下のsecretsをGitHubリポジトリに設定する必要があります：

### 必須のSecrets

1. **SSH_PRIVATE_KEY**
   - レンタルサーバーにSSH接続するための秘密鍵
   - OpenSSH形式の秘密鍵（通常は `~/.ssh/id_rsa` の内容）
   - 改行文字も含めて完全な鍵をコピーしてください

2. **SSH_HOST**
   - レンタルサーバーのホスト名またはIPアドレス
   - 例: `example.com` または `192.168.1.100`

3. **SSH_USER**
   - SSH接続に使用するユーザー名
   - 例: `username` または `root`

4. **DEPLOY_PATH**
   - サーバー上のデプロイ先ディレクトリのパス
   - 例: `/var/www/html/` または `~/public_html/`

### オプションのSecrets

5. **VITE_BASE_PATH** (オプション)
   - アプリケーションのベースパス
   - デフォルト: `/` (ルートディレクトリ)
   - サブディレクトリにデプロイする場合のみ設定
   - 例: `/myapp/` (サブディレクトリにデプロイする場合)

## Secretsの設定方法

1. GitHubリポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Secrets and variables」→「Actions」をクリック
3. 「New repository secret」ボタンをクリック
4. 上記の各secretを名前と値を入力して追加

## デプロイフロー

mainブランチにpushすると、以下の処理が自動実行されます：

1. **コードのチェックアウト**: 最新のコードを取得
2. **Node.js環境のセットアップ**: Node.js 18をインストール
3. **依存関係のインストール**: `npm install` を実行
4. **ビルド**: `npm run build` を実行してdistディレクトリを生成
5. **ビルド結果の検証**: distディレクトリが正常に作成されたかチェック
6. **SSH設定**: 秘密鍵を設定してSSH接続を準備
7. **SSH接続テスト**: サーバーへの接続をテスト
8. **デプロイ**: rsyncを使用してビルド結果をサーバーにコピー

## トラブルシューティング

### SSH接続エラー
- SSH_PRIVATE_KEYが正しく設定されているか確認
- SSH_HOSTとSSH_USERが正しいか確認
- サーバー側でSSH接続が許可されているか確認

### ビルドエラー
- package.jsonの依存関係が正しいか確認
- ローカルで `npm install && npm run build` が成功するか確認

### デプロイパスエラー
- DEPLOY_PATHが存在し、書き込み権限があるか確認
- パスの末尾にスラッシュ（/）があるか確認

## セキュリティ注意事項

- SSH秘密鍵は絶対にコードにコミットしないでください
- GitHub Secretsは暗号化されて保存されます
- 定期的にSSH鍵をローテーションすることを推奨します

## 手動デプロイ

自動デプロイの代わりに手動でデプロイすることも可能です：

```bash
# 環境変数を設定
export SSH_HOST=your-server.com
export SSH_USER=username
export DEPLOY_PATH=/var/www/html/

# デプロイスクリプトを実行
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

手動デプロイには以下が必要です：
- SSH鍵がローカルマシンに設定されていること
- サーバーへのSSH接続が可能であること
- rsyncコマンドが利用可能であること