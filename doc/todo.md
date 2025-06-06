# Butterfly Graph Extension 実装TODOリスト

## 1. 基本機能の完成

### 1.1 ユーザーインターフェース
- [x] 右クリックメニューからのグラフ表示機能の実装
- [x] コマンドパレットからのグラフ表示機能の改善
- [ ] ステータスバーへのクイックアクセス機能の追加

### 1.2 言語サポート
- [x] LSP/Call Hierarchy APIとの完全な連携実装
  - [x] C/C++言語の完全サポート
  - [x] C#言語の完全サポート
  - [x] Python言語の完全サポート
- [x] 各言語のテストケース作成

### 1.3 コード解析
- [x] 関数定義の正確な検出
- [x] 呼び出し関係の正確な解析
- [ ] 解析結果のキャッシュ機能実装

## 2. グラフ表示の改善

### 2.1 レイアウト
- [x] バタフライレイアウトの最適化
- [x] ノードの自動配置アルゴリズムの改善
- [ ] 大規模グラフの表示最適化

### 2.2 インタラクション
- [x] ズーム機能の実装
- [x] パン機能の実装
- [x] ノードのダブルクリックによるソースコードジャンプ
- [x] ノードのドラッグ＆ドロップ機能

### 2.3 視覚化
- [x] ノードのスタイルカスタマイズ
- [x] エッジのスタイルカスタマイズ
- [x] テーマ設定の実装
- [x] アニメーション効果の追加
- [ ] ノードの位置調整
    全体像が見れる縮尺だとテキストが見えづらい

## 3. 設定機能

### 3.1 基本設定
- [x] 呼び出し元の階層数設定
- [x] 呼び出し先の階層数設定
- [x] 1階層あたりの表示関数数上限設定
- [x] テーマ設定

### 3.2 詳細設定
- [ ] 解析オプションの設定
- [ ] 表示オプションの設定
- [ ] パフォーマンス設定

## 4. 第二優先度機能

### 4.1 関数情報
- [ ] 関数ノードのツールチップ表示
- [ ] パラメータ情報の表示
- [ ] 戻り値型の表示
- [ ] 関数の説明文表示

### 4.2 グラフの保存と共有
- [ ] SVG形式でのエクスポート
- [ ] PNG形式でのエクスポート
- [ ] グラフデータのJSONエクスポート
- [ ] インポート機能

### 4.3 メモ・アノテーション
- [ ] ノードへのメモ追加機能
- [ ] メモの保存と読み込み
- [ ] チーム内でのメモ共有機能

## 5. テストと品質管理

### 5.1 ユニットテスト
- [x] コード解析エンジンのテスト
- [x] グラフ生成エンジンのテスト
- [x] 表示システムのテスト
- [ ] テストカバレッジの向上
- [ ] テストケースの整理と最適化
- [x] テストドキュメントの整備

### 5.2 統合テスト
- [ ] エンドツーエンドテスト
- [ ] 言語ごとのテストケース
- [ ] パフォーマンステスト

### 5.3 品質管理
- [x] エラーハンドリングの改善
- [x] ログ機能の実装
- [ ] パフォーマンスモニタリング

## 6. ドキュメント

### 6.1 ユーザードキュメント
- [x] インストールガイド
- [x] 使用方法の説明
- [x] 設定項目の説明
- [ ] トラブルシューティングガイド

### 6.2 開発者ドキュメント
- [x] アーキテクチャ説明
- [ ] APIドキュメント
- [x] コントリビューションガイド

## 7. 将来の拡張

### 7.1 追加言語サポート
- [ ] C#
- [ ] Java
- [ ] JavaScript/TypeScript
- [ ] Go
- [ ] Rust

### 7.2 高度な機能
- [ ] コードの複雑度メトリクス表示
- [ ] クラス階層の可視化
- [ ] モジュール依存関係の可視化
