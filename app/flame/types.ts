export type Flame = {
  id: string;
  symbol: string;         // Li, Na, K, Ca, Sr, Ba, Cu
  name: string;           // リチウム
  color: string;          // 色パレットのキー(視覚チップ用)
  display_color: string;  // 教科書記述の色名(例: 「橙赤色」)
  note?: string;
  level: 1 | 2 | 3;
};
