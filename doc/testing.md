# CodeVision テストドキュメント

## 目次
1. [テストの概要](#テストの概要)
2. [テストの実行方法](#テストの実行方法)
3. [テストカバレッジ](#テストカバレッジ)
4. [テストケース一覧](#テストケース一覧)
5. [テスト結果の解釈](#テスト結果の解釈)
6. [トラブルシューティング](#トラブルシューティング)

## テストの概要

CodeVisionは以下の3つの主要コンポーネントに対するユニットテストを実装しています：

1. **コード解析エンジン**
   - 関数定義の検出
   - 呼び出し関係の解析
   - エラー処理

2. **グラフ生成エンジン**
   - バタフライグラフの生成
   - ノード配置
   - エッジ処理

3. **表示システム**
   - WebView管理
   - インタラクション処理
   - テーマ適用

## テストの実行方法

### 基本的な実行方法

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルのみ実行
npm test -- --grep "DisplaySystem"

# 特定のテストケースのみ実行
npm test -- --grep "should handle empty graph"
```

### テストカバレッジの確認

```bash
# カバレッジレポートの生成
npm run test:coverage
```

### ウォッチモードでの実行

```bash
# ファイル変更を監視してテストを実行
npm run test:watch
```

## テストカバレッジ

現在のテストカバレッジ目標：
- ブランチ: 80%
- 行: 80%
- 関数: 80%
- ステートメント: 80%

カバレッジレポートは以下の場所で確認できます：
- テキストレポート: コンソール出力
- HTMLレポート: `coverage/index.html`

## テストケース一覧

### コード解析エンジン (`codeAnalysisEngine.test.ts`)

#### 関数定義の検出
- `should detect function definitions`
  - 目的: 関数定義が正しく検出されることを確認
  - 入力: サンプルコード
  - 期待結果: 関数定義のリスト

#### 呼び出し関係の解析
- `should detect function calls`
  - 目的: 関数呼び出しが正しく検出されることを確認
  - 入力: サンプルコード
  - 期待結果: 呼び出し関係のリスト

#### エラー処理
- `should handle symbol provider error`
  - 目的: シンボルプロバイダーのエラーを適切に処理
  - 入力: エラーを発生させる条件
  - 期待結果: 適切なエラーメッセージ

### グラフ生成エンジン (`graphGenerator.test.ts`)

#### バタフライグラフ生成
- `should generate butterfly graph`
  - 目的: バタフライグラフが正しく生成されることを確認
  - 入力: ノードとエッジのリスト
  - 期待結果: 正しく配置されたグラフ

#### 特殊ケース
- `should handle single node graph`
  - 目的: 単一ノードのグラフを正しく処理
- `should handle disconnected nodes`
  - 目的: 非接続ノードを正しく処理
- `should handle circular dependencies`
  - 目的: 循環参照を正しく処理
- `should handle deep graph structure`
  - 目的: 深い構造のグラフを正しく処理

### 表示システム (`displaySystem.test.ts`)

#### WebView管理
- `should create webview panel`
  - 目的: WebViewパネルが正しく作成されることを確認
- `should handle panel disposal`
  - 目的: パネルが適切に破棄されることを確認

#### インタラクション
- `should handle zoom`
  - 目的: ズーム機能が正しく動作することを確認
- `should handle pan`
  - 目的: パン機能が正しく動作することを確認
- `should handle node click`
  - 目的: ノードクリックが正しく処理されることを確認

#### テーマ
- `should apply theme`
  - 目的: テーマが正しく適用されることを確認

### 言語サポート (`languageSupport.test.ts`)

#### C/C++言語サポート
- `should detect function definition`
  - 目的: C/C++の関数定義が正しく検出されることを確認
  - 入力: C/C++のサンプルコード
  - 期待結果: 関数名、パラメータ情報の取得
- `should detect function calls`
  - 目的: C/C++の関数呼び出しが正しく検出されることを確認
  - 入力: 関数呼び出しを含むC/C++コード
  - 期待結果: 呼び出し関数のリスト
- `should handle class methods`
  - 目的: クラスメソッドが正しく処理されることを確認
  - 入力: クラス定義を含むC/C++コード
  - 期待結果: メソッド情報の取得

#### C#言語サポート
- `should detect function definition`
  - 目的: C#のメソッド定義が正しく検出されることを確認
  - 入力: C#のサンプルコード
  - 期待結果: メソッド名、パラメータ情報の取得
- `should detect function calls`
  - 目的: C#のメソッド呼び出しが正しく検出されることを確認
  - 入力: メソッド呼び出しを含むC#コード
  - 期待結果: 呼び出しメソッドのリスト
- `should handle async methods`
  - 目的: 非同期メソッドが正しく処理されることを確認
  - 入力: async/awaitを含むC#コード
  - 期待結果: 非同期メソッド情報の取得

#### Python言語サポート
- `should detect function definition`
  - 目的: Python関数定義が正しく検出されることを確認
  - 入力: Pythonのサンプルコード
  - 期待結果: 関数名、パラメータ情報の取得
- `should detect function calls`
  - 目的: Python関数呼び出しが正しく検出されることを確認
  - 入力: 関数呼び出しを含むPythonコード
  - 期待結果: 呼び出し関数のリスト
- `should handle class methods`
  - 目的: クラスメソッドが正しく処理されることを確認
  - 入力: クラス定義を含むPythonコード
  - 期待結果: メソッド情報の取得
- `should handle async functions`
  - 目的: 非同期関数が正しく処理されることを確認
  - 入力: async/awaitを含むPythonコード
  - 期待結果: 非同期関数情報の取得

#### エッジケース
- `should handle nested functions`
  - 目的: ネストされた関数定義が正しく処理されることを確認
  - 入力: 内部関数を含むコード
  - 期待結果: 外部関数と内部関数の関係の取得
- `should handle function overloading`
  - 目的: 関数のオーバーロードが正しく処理されることを確認
  - 入力: オーバーロードされた関数定義
  - 期待結果: オーバーロードされた関数の情報取得
- `should handle lambda functions`
  - 目的: ラムダ関数が正しく処理されることを確認
  - 入力: ラムダ関数を含むコード
  - 期待結果: ラムダ関数の情報取得

### 言語サポートのテスト実行方法

```bash
# 言語サポートのテストのみ実行
npm test -- --grep "Language Support"

# 特定の言語のテストのみ実行
npm test -- --grep "C/C++ Language Support"
npm test -- --grep "C# Language Support"
npm test -- --grep "Python Language Support"

# エッジケースのテストのみ実行
npm test -- --grep "Edge Cases"
```

## テスト結果の解釈

### 成功条件
- すべてのテストケースが成功
- カバレッジ目標を達成
- エラーや警告がない

### 失敗時の確認ポイント
1. テストケースの前提条件
2. モックオブジェクトの設定
3. 非同期処理の完了
4. タイミングの問題

## トラブルシューティング

### よくある問題と解決方法

1. **テストが失敗する場合**
   - モックオブジェクトが正しく設定されているか確認
   - 非同期処理が完了しているか確認
   - テストの前提条件が満たされているか確認

2. **カバレッジが低い場合**
   - 未テストのコードパスを特定
   - エッジケースのテストケースを追加
   - テストヘルパー関数の活用

3. **テストの実行が遅い場合**
   - 不要なテストケースの削除
   - テストデータの最適化
   - 並列実行の検討

### デバッグ方法

1. **特定のテストケースのデバッグ**
```bash
npm test -- --grep "テストケース名" --inspect-brk
```

2. **VS Codeでのデバッグ**
- デバッグビューを開く
- "Extension Tests" 構成を選択
- デバッグを開始

3. **ログの確認**
- テスト実行時のログを確認
- エラーメッセージの詳細を確認
- スタックトレースの分析

### 言語サポートのトラブルシューティング

1. **LSPサーバーの問題**
   - 各言語のLSPサーバーが正しくインストールされているか確認
   - LSPサーバーの設定が正しいか確認
   - LSPサーバーのログを確認

2. **パース失敗**
   - 言語固有の構文が正しいか確認
   - コードのフォーマットが正しいか確認
   - 必要なインポート文が含まれているか確認

3. **非同期処理の問題**
   - LSPリクエストの完了を待っているか確認
   - タイムアウト設定が適切か確認
   - 非同期処理のエラーハンドリングを確認 