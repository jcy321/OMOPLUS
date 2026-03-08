# OMOPLUS

> より良いUXとコスト効率のためのReceptionist Agent搭載OpenCodeプラグイン

[![npm version](https://img.shields.io/npm/v/omoplus?color=369eff&labelColor=black&logo=npm&style=flat-square)](https://www.npmjs.com/package/omoplus)
[![GitHub Release](https://img.shields.io/github/v/release/jcy321/OMOPLUS?color=369eff&labelColor=black&logo=github&style=flat-square)](https://github.com/jcy321/OMOPLUS/releases)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?labelColor=black&style=flat-square)](https://github.com/jcy321/OMOPLUS/blob/main/LICENSE.md)

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

---

## 1. 背景と目的

### 課題

[Oh My OpenCode (OMO)](https://github.com/code-yeongyu/oh-my-opencode) は優れたOpenCodeプラグインで、強力なマルチエージェントオーケストレーション機能を提供しています。しかし、使用中に2つの重要な課題を発見しました：

1. **高いトークン消費**: OMOはSisyphus（トップティアの推論モデル）をデフォルトエージェントとして使用しています。強力ですが、「2+2は？」のような単純なやり取りでも大きなトークンコストが発生します。

2. **急な学習曲線**: OMOはユーザーが熟練した開発者で、ニーズを正確に表現できることを前提としています。新規ユーザーは曖昧な要件で苦労し、システムを効果的に活用する方法がわからないことが多いです。

### 私たちのソリューション

OMOPLUSは**「プログラミング外注会社」**モデルを導入しました：

```
ユーザー（クライアント）
    ↓
Receptionist（受付）← デフォルトエージェント、低コストモデル
    ↓
Sisyphus（マネージャー）← 必要時のみ起動
    ↓
Prometheus（コンサルタント）← 要件分析
    ↓
エージェントチーム（開発者）← Hephaestus、explore、librarianなど
    ↓
Secretary（秘書）← 結果集約、例外処理
    ↓
Sisyphus（最終確認）
```

### 新規エージェント設計思想

#### Receptionist Agent：親しみやすいゲートキーパー

**設計思想**：OMOでは、ユーザーは即座にSisyphusの複雑なオーケストレーションシステムに投げ込まれます。これは、どのエージェントが利用可能か、リクエストをどう表現すればよいか分からない新規ユーザーにとって圧倒的です。

**Receptionistがどう助けるか**：
- **ガイド付きオンボーディング**：ユーザーは空白の状態ではなく、親しみのある挨拶を受けます：「こんにちは！私はReceptionistです。今日は何をしたいですか？」
- **複雑さ評価**：ReceptionistはタスクがSisyphusのオーケストレーションを必要とするか、直接処理できるかを評価します
- **スマートルーティング**：単純なクエリ（「READMEのタイプミスを修正」）は直接実行；複雑なタスク（「認証システムをリファクタリング」）はSisyphusにエスカレーション
- **ユーザー教育**：Receptionistは何が起きているか説明します：「これは複雑なタスクです。技術リードのSisyphusに引き継ぎます。」

**UX改善**：ユーザーはもう迷いません。明確なエントリーポイントがあり、システムの振る舞いを理解できます。

#### Secretary Agent：静かなコーディネーター

**設計思想**：OMOでは、Sisyphusはバックグラウンドタスクのステータスを確認するためにアクティブにポーリングします。これは不必要なトークン消費を生み、Sisyphusが頻繁に中間進捗を報告するため「うるさく」感じられます。

**Secretaryがどう助けるか**：
- **結果集約**：Secretaryは全てのワーカーエージェント（explore、librarian、Hephaestusなど）からの出力を収集します
- **例外検出**：失敗したタスク、タイムアウト、不整合をSisyphusを悩ませることなく特定します
- **構造化サマリー**：全てのタスクが完了した時、または介入が必要な時のみ、クリーンで整理されたレポートをSisyphusに提示します
- **ノイズ削減**：Sisyphusはもう「タスクXはまだ実行中...」というメッセージを送りません

**UX改善**：ユーザーはよりクリーンで集中したやり取りを得られます。Sisyphusは意味のある決定時のみ登場し、ステータス更新では登場しません。

#### OMOとの比較

| 側面 | OMO | OMOPLUS |
|------|-----|---------|
| **最初のやり取り** | Sisyphusに直接（威圧的になる可能性） | Receptionistがガイド（親しみやすく親切） |
| **単純なタスク** | 完全なオーケストレーションオーバーヘッド | 直接実行、最小限の儀式 |
| **バックグラウンドタスク** | Sisyphusが頻繁にポーリング | Secretaryが静かに集約 |
| **ステータス更新** | 頻繁な中間報告 | クリーンな最終サマリー |
| **学習曲線** | 急（全てのエージェントを理解する必要がある） | 緩やか（Receptionistが必要に応じて説明） |
| **エラー処理** | Sisyphusが全ての例外を処理 | Secretaryがトリアージし、重大な問題のみエスカレーション |

**主な利点**：
- 🎯 **90%のコスト削減**: 日常的なやり取りには低コストモデル、複雑な決定にはプレミアムモデル
- 🚀 **より良いUX**: 曖昧なアイデアから明確な計画へのガイド付き要件収集
- 🔄 **スマートエスカレーション**: 自動的な複雑さ検出とエージェントルーティング

---

## 2. 開発ジャーニー

### フェーズ0：基盤（2026年3月8日）

OMO v3.11.0をフォークしてアーキテクチャを理解することから開始：

- 1268のTypeScriptファイル、160k+行のコード
- ファクトリーパターンを持つ11の組み込みエージェント
- 5層の46のライフサイクルフック
- 高度な登録システムを持つ26のツール

重要な発見：OMOは `config-handler.ts` で `default_agent = "sisyphus"` を設定。これが主要な変更ターゲットでした。

### フェーズ1：新規エージェント（2026年3月8日）

OMOのファクトリーパターンに従って2つの新規エージェントを作成：

**Receptionist Agent** (`src/agents/receptionist.ts`)：
- モード：`primary`（デフォルト可能）
- 役割：最初の接点、複雑さの評価
- コスト：CHEAP（経済的なモデルを使用）

**Secretary Agent** (`src/agents/secretary.ts`)：
- モード：`subagent`（内部コーディネーター）
- 役割：結果の集約、例外の処理
- Sisyphusの頻繁なポーリングを防止

### フェーズ2：インフラ（2026年3月8日）

`secretary-queue` 機能モジュールを構築：
- `SecretaryQueueManager`：結果のキューイングと集約
- 例外検出とレポート
- 構造化されたサマリー生成

### フェーズ3：独立化（2026年3月8日）

**重要な決定**：OMOPLUSはOMOと共存するために独自の設定が必要。

すべての参照を変更：
| 元の | OMOPLUS |
|------|---------|
| `oh-my-opencode.json` | `omoplus.json` |
| `oh-my-opencode.log` | `omoplus.log` |
| `oh-my-opencode.schema.json` | `omoplus.schema.json` |

これにより、ユーザーは競合なしで両方のプラグインを独立して実行できます。

### リリースタイムライン

- **v0.0.1**（2026年3月8日）：ReceptionistとSecretaryを搭載した初期リリース
- **v0.0.2**（2026年3月8日）：独立した設定システム

---

## 3. ライセンスと帰属

### Oh My OpenCodeに基づく

OMOPLUSは[@code-yeongyu](https://github.com/code-yeongyu)による[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)に基づく二次開発です。

### ライセンス

OMOPLUSはOMOと同じライセンスを継承します：**SUL-1.0（ソース使用ライセンス1.0）**

主な条項：
- ✅ 無料で使用、変更、配布可能
- ✅ 商用利用許可
- ✅ 二次開発奨励
- ❌ 保証なし
- ❌ 元のライセンスと帰属の保持が必須

### 変更内容

1. 2つの新規エージェントを追加：`receptionist` と `secretary`
2. `secretary-queue` 機能モジュールを作成
3. デフォルトエージェントを `sisyphus` から `receptionist` に変更
4. 独立性のため設定ファイル名を変更
5. パッケージブランドをOMOPLUSに更新

すべてのコア機能（フック、ツール、MCP、他のエージェント）はOMOから継承。

---

## 4. 設定ガイド

### インストール

```bash
npm install omoplus
# または
bun add omoplus
```

### OpenCodeで有効化

`~/.config/opencode/opencode.json` に追加：

```json
{
  "plugin": ["omoplus"]
}
```

### 設定ファイル

`~/.config/opencode/omoplus.json` を作成：

```json
{
  "$schema": "https://raw.githubusercontent.com/jcy321/OMOPLUS/main/assets/omoplus.schema.json",
  
  "agents": {
    "receptionist": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "受付エージェント - ユーザーとの最初の接点"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "秘書エージェント - 結果の集約と例外処理"
    },
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3,
      "description": "メインオーケストレーター - 複雑なタスクで起動"
    }
  }
}
```

### 設定オプション

#### エージェント設定

| フィールド | 型 | 説明 |
|-----------|---|------|
| `model` | string | `provider/model` 形式のモデルID |
| `temperature` | number | サンプリング温度（0-2） |
| `description` | string | UIに表示されるエージェントの説明 |
| `variant` | string | モデルバリアント（例："high"、"medium"） |
| `prompt_append` | string | システムプロンプトに追加する命令 |

### プロジェクトレベルの設定

プロジェクトディレクトリに `.opencode/omoplus.json` を作成してプロジェクト固有の設定が可能：

```json
{
  "agents": {
    "receptionist": {
      "model": "project-specific-model"
    }
  }
}
```

### エージェントの無効化

Receptionistを無効化してSisyphusをデフォルトにする：

```json
{
  "disabled_agents": ["receptionist"]
}
```

---

## 5. 謝辞と招待

### 感謝

以下の方々に心からの感謝を申し上げます：

- **[@code-yeongyu](https://github.com/code-yeongyu)** - [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)の創作者、その優れたアーキテクチャがこの二次開発を可能にしました
- **OpenCodeチーム** - 拡張可能で強力なAIコーディングアシスタントを構築
- **オープンソースコミュニティ** - ツール、ライブラリ、インスピレーションを提供

### なぜフォークしたか

私たちがOMOをフォークしたのは、欠けていたからではなく、機会を見たからです：
1. 予算を重視するユーザーのコスト削減
2. 新規ユーザーのオンボーディング体験の改善
3. エージェントオーケストレーションの異なる設計哲学の探求

### 参加をお待ちしています

コミュニティからの貢献を歓迎します！

**貢献方法**：
- 🐛 [GitHub Issues](https://github.com/jcy321/OMOPLUS/issues) でバグを報告
- 💡 機能や改善を提案
- 🔧 プルリクエストを送信
- 📖 ドキュメントの改善
- 🌍 翻訳の協力

**開発を始める**：
```bash
git clone https://github.com/jcy321/OMOPLUS.git
cd OMOPLUS
bun install
bun run build
```

**開発コマンド**：
```bash
bun run typecheck    # 型チェック
bun run build        # プロジェクトのビルド
bun test             # テスト実行
```

### コミュニティ

- **GitHub**: [jcy321/OMOPLUS](https://github.com/jcy321/OMOPLUS)
- **npm**: [omoplus](https://www.npmjs.com/package/omoplus)

---

## ライセンス

SUL-1.0 - 詳細は [LICENSE.md](LICENSE.md) を参照

---

<p align="center">
  <strong>OMOPLUS</strong> - AI支援開発をより身近に、より経済的に。
</p>

<p align="center">
  <a href="https://github.com/code-yeongyu/oh-my-opencode">Oh My OpenCode</a> をベースに❤️を込めて構築
</p>