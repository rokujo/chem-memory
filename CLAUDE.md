# 化学暗記帳 (Chem Memory) - プロジェクト概要

上松ゆっくり塾の生徒向け化学暗記Webアプリ。**化学暗記帳アプリ単独で1つの Vercel プロジェクト**としてデプロイ。生徒は直接 URL でアクセスする(認証なしの無料公開)。AI / DB を使わない静的な暗記アプリ。

## ブランド方針

- **ゆっくり × 最先端**: 生徒のペースを尊重しつつ、AI/Web技術を活用
- 暗記コンテンツは「まとめ(俯瞰) → 個別暗記 → クイズ(確認)」の三層構造で設計
- スマホ表示前提(横幅制約あり)、ダーク系背景+単元別アクセントカラー
- 「無機=青系、有機=緑系、理論=オレンジ系」で視覚的に分野を区別

## 技術スタック

- Next.js + TypeScript + Tailwind CSS
- Vercel (Hobby plan)
- lucide-react (アイコン)
- localStorage (進捗保存。SRSは軽量版で `1日→3日→7日→14日→30日→60日`)
- 将来的に Supabase 連携(端末間同期)を予定

## 単元構成 (化学暗記帳 全体)

現状で実装済み・実装中・予定の単元:

| 単元名 | 種類 | ステータス | パス | アクセント色 |
|---|---|---|---|---|
| **金属イオンの沈殿反応** | 反応グラフ型 | **本実装完了 (Next.js分割 + SRS)** | `/precipitation` | 青 |
| 無機物質・イオンの色 | 表型 | 本実装完了(コンテンツ要レビュー) | `/inorganic-color` | 青 |
| 酸化還元・半反応式 | cloze型 | 本実装完了(コンテンツ要レビュー) | `/redox` | オレンジ |
| 錯イオン形成 | 表型 | 未実装(設計のみ) | `/complex-ion`(予定) | 青 |
| 炎色反応 | 表型 | 未実装(設計のみ) | `/flame`(予定) | 青 |
| 有機官能基と検出反応 | 表型 | 未実装 | 未定 | 緑 |

次に着手する単元はコンテンツレビュー状況に応じて選定。

## ディレクトリ規約 (Next.js App Router)

化学暗記帳アプリのルート URL 構造:

```
/                  # 化学暗記帳のホーム(単元一覧) — app/page.tsx
/precipitation     # 金属イオン沈殿反応 — app/precipitation/page.tsx
/redox             # 酸化還元・半反応式(予定)
/inorganic-color   # 無機イオンの色(予定)
/complex-ion       # 錯イオン形成(予定)
/flame             # 炎色反応(予定)
```

単元ごとのファイル構成(沈殿反応を例に):

```
/app/precipitation/
  ├── page.tsx                          # 単元ホーム + 内部ルーティング(三ビュー/クイズ3種)
  ├── types.ts                          # Ion, Reagent, Reaction の型定義
  ├── lib/
  │   ├── data.ts                       # IONS, REAGENTS, REACTIONS の定義 + ヘルパー
  │   ├── color-palette.ts              # COLOR_PALETTE 定数
  │   └── progress.ts                   # localStorage進捗管理 (SRS)
  └── components/
      ├── ChipSwatch.tsx                # 色チップ(無色=市松)
      ├── ReactionResult.tsx            # 反応結果の共通描画
      ├── QuizFeedback.tsx              # QuizFeedback / QuizScore
      ├── IonView.tsx
      ├── ReagentView.tsx
      ├── MatrixView.tsx
      ├── QuizIonMode.tsx
      ├── QuizReagentMode.tsx
      └── QuizColorMode.tsx
```

他単元を追加する時は `app/<unit>/` 配下に同じ粒度で配置し、`app/page.tsx` の `UNITS` 配列に追加する。

## 認証

なし。AI / DB を使わない静的な暗記アプリのため、無料で誰でも閲覧可能な状態で公開する。

## 開発時の注意事項

- 起動: ルートで `npm install && npm run dev` → `http://localhost:3000/`
- React アーティファクトでテストする場合、`localStorage` を直接呼ぶとエラーになるので、Vercel デプロイ環境かローカルNext.js環境で動作確認する
- 化学式の表示は `font-mono` で。下付き数字(₂₃₄)は Unicode で直書きしてある
- 色の表現は `COLOR_PALETTE` を経由する。教科書記述に合わせて調整済みなので、勝手に変えない
- 「無色」は特別扱い(市松模様で表示)。これは透明を視覚化する慣習的な表現
- `_archive/` 配下は tsconfig の exclude 対象。プロトタイプ等の参照用ファイル置き場
- 各単元の進捗 localStorage キーは `chem-memory:<unit>:progress:v1` 形式(unit ごと別キー、互換破壊時に v2 へ)
