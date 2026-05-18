# Claude Code への依頼文テンプレート

以下を Claude Code への初回プロンプトとして使ってください。コピペで動くようになっています。

---

```
化学暗記帳(上松ゆっくり塾の生徒向けWebアプリ)の「金属イオン沈殿反応」単元を Next.js で本実装したいです。

プロトタイプとして単一ファイルの React コンポーネントが完成しています(`chem-memory-prototype-v8.tsx`)。これをポータルサイトの `/students/chem-memory/precipitation/` 配下に分割配置してください。

## 必読ドキュメント

実装前に以下のドキュメントを読んでください。設計判断の経緯と意図が書かれています:

1. `CLAUDE.md` - プロジェクト全体概要(ポータル構成、ブランド方針、技術スタック)
2. `SPEC.md` - 沈殿反応単元の設計仕様書(三ビュー構造、データ設計、クイズ設計の理由)

特に SPEC.md の「データ構造の設計判断」と「クイズ設計」セクションは、勝手に変えると教育的意図が損なわれるので注意してください。

## 実装範囲(今回のタスク)

`chem-memory-prototype-v8.tsx` のロジック・UIを、SPEC.md のディレクトリ規約に従って分割実装してください:

```
/app/students/chem-memory/precipitation/
  ├── page.tsx
  ├── components/
  │   ├── IonView.tsx
  │   ├── ReagentView.tsx
  │   ├── MatrixView.tsx
  │   ├── QuizIonMode.tsx
  │   ├── QuizReagentMode.tsx
  │   └── QuizColorMode.tsx
  ├── lib/
  │   ├── data.ts
  │   ├── color-palette.ts
  │   └── progress.ts
  └── types.ts
```

## 機能要件

- プロトタイプの全機能(三ビュー + クイズ3種類)を維持
- 既存ポータルの Basic 認証配下で動く(追加の認証は不要)
- localStorage で進捗保存(プロトタイプには未実装、SPEC.md の「残タスク」3番)
- スマホ表示前提(Tailwind の sm/md/lg ブレークポイント考慮)

## 制約

- 化学式表示は font-mono、下付き数字は Unicode (₂₃₄...) で
- COLOR_PALETTE の色定義は教科書記述に合わせて調整済み、勝手に変えない
- 「無色」は市松模様で表示する特別扱い(プロトタイプ参照)

## 確認してほしいこと

実装に着手する前に、以下を確認してから始めてください:

1. プロトタイプを一通り読んで、不明点があれば質問
2. 分割案について、何かより良い構成があるか提案
3. 進捗の localStorage スキーマをどう設計するか提案(SRS含む)

確認が終わったら、私のGOで実装開始してください。
```

---

## 引き継ぎの際の補足

Claude Code は対話的に動くので、上記のプロンプトを投げた後、何度かやり取りすることになります。前田氏側で意識すべきポイント:

### Claude Code が困りやすい論点

- **既存のCSS規約**: ポータル全体のTailwind設定(theme.config)があれば、それも見せた方がいい
- **middleware の挙動**: Basic認証のmiddleware.ts が `/students/chem-memory/precipitation/` も対象にしているか確認
- **データの場所**: `data.ts` を直書きにするか、後で JSON ファイル化して `import` するか(将来Supabaseに移すなら JSON が便利)

### 想定される質問への準備

Claude Code は以下を質問してくる可能性があります:

- 「他の単元(v2のinorganic-color, redox)もこのタイミングで本実装しますか?」
- 「ホーム画面 `/students/chem-memory/` は別タスクですか?」
- 「テストファイル(jest等)も書きますか?」

答えは「沈殿反応だけ先行で、他は後で」「ホームは仮実装でOK」「テストは現状不要、まず動かす」あたりが想定回答です。

### ファイル渡し方

Claude Code には以下を渡してください:

1. `CLAUDE.md` (このディレクトリ)
2. `SPEC.md` (このディレクトリ)
3. `chem-memory-prototype-v8.tsx` (プロトタイプ本体、別途出力済み)

可能なら、Next.jsプロジェクトのリポジトリに直接これらを置いてから Claude Code を起動するのが最もスムーズです:

```
your-portal-repo/
├── docs/
│   ├── chem-memory/
│   │   ├── CLAUDE.md          # プロジェクト全体
│   │   ├── SPEC.md            # 沈殿反応単元の仕様
│   │   └── prototype-v8.tsx   # プロトタイプ
└── ...
```

または、リポジトリのルートに `CLAUDE.md` を置いておくと Claude Code が自動的に読み込みます(これはClaudeCodeの慣習)。

## 引き継ぎ後の前田氏のロール

Claude Code が実装している間、前田氏は以下に集中できます:

- **コンテンツレビュー**: 資料集を見ながら Fe²⁺ の沈殿色などの確認
- **錯イオン・炎色反応単元のデータ準備**: 次の単元のJSONデータ作成
- **生徒テスト**: 実装が動くようになったら、塾生に試してもらってフィードバック収集

Claude (Anthropic Web) との対話で「設計を詰める作業」が終わったので、これからは「実装を進める」「コンテンツを充実させる」「使ってもらう」のフェーズに入ります。
