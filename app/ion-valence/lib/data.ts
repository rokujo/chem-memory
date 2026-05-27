import type { IonCharge, ValenceClass } from '../types';

export const VALENCE_CLASS_ORDER: ValenceClass[] = ['1価', '2価', '3価', '多価'];

export const IONS: IonCharge[] = [
  // ===== 1価のみ =====
  { id: 'na', element: 'Na', name: 'ナトリウム',     charges: [1], primary: 1, group: 'アルカリ金属', level: 1 },
  { id: 'k',  element: 'K',  name: 'カリウム',       charges: [1], primary: 1, group: 'アルカリ金属', level: 1 },
  { id: 'li', element: 'Li', name: 'リチウム',       charges: [1], primary: 1, group: 'アルカリ金属', level: 1 },
  { id: 'ag', element: 'Ag', name: '銀',             charges: [1], primary: 1, group: '遷移元素',     level: 1 },

  // ===== 2価のみ =====
  { id: 'ca', element: 'Ca', name: 'カルシウム',     charges: [2], primary: 2, group: 'アルカリ土類金属', level: 1 },
  { id: 'mg', element: 'Mg', name: 'マグネシウム',   charges: [2], primary: 2, group: 'アルカリ土類金属', level: 1 },
  { id: 'ba', element: 'Ba', name: 'バリウム',       charges: [2], primary: 2, group: 'アルカリ土類金属', level: 1 },
  { id: 'sr', element: 'Sr', name: 'ストロンチウム', charges: [2], primary: 2, group: 'アルカリ土類金属', level: 1 },
  { id: 'zn', element: 'Zn', name: '亜鉛',           charges: [2], primary: 2, group: '典型元素',     level: 1 },
  { id: 'ni', element: 'Ni', name: 'ニッケル',       charges: [2], primary: 2, group: '遷移元素',     level: 1 },
  { id: 'hg', element: 'Hg', name: '水銀',           charges: [2], primary: 2, group: '遷移元素',     level: 2 },

  // ===== 3価のみ =====
  { id: 'al', element: 'Al', name: 'アルミニウム',   charges: [3], primary: 3, group: '典型元素',     level: 1 },

  // ===== 多価 =====
  {
    id: 'cu', element: 'Cu', name: '銅',
    charges: [1, 2], primary: 2, group: '遷移元素',
    notes: { 1: 'Cu₂O などの+1価(マイナー)', 2: '水溶液中の主要形(青色)' },
    level: 1,
  },
  {
    id: 'fe', element: 'Fe', name: '鉄',
    charges: [2, 3], primary: 3, group: '遷移元素',
    notes: { 2: 'Fe²⁺ 淡緑色 (酸化されやすい)', 3: 'Fe³⁺ 黄褐色 (より安定)' },
    level: 1,
  },
  {
    id: 'sn', element: 'Sn', name: 'スズ',
    charges: [2, 4], primary: 2, group: '典型元素',
    notes: { 2: 'Sn²⁺ は還元剤として働く', 4: 'Sn⁴⁺ は SnO₂ など' },
    level: 1,
  },
  {
    id: 'pb', element: 'Pb', name: '鉛',
    charges: [2, 4], primary: 2, group: '典型元素',
    notes: { 2: '水溶液中の主要形', 4: 'PbO₂ (鉛蓄電池の正極)' },
    level: 1,
  },
  {
    id: 'cr', element: 'Cr', name: 'クロム',
    charges: [3, 6], primary: 3, group: '遷移元素',
    notes: { 3: 'Cr³⁺ 緑色 (一般的)', 6: 'CrO₄²⁻ / Cr₂O₇²⁻ (強い酸化剤)' },
    level: 1,
  },
  {
    id: 'mn', element: 'Mn', name: 'マンガン',
    charges: [2, 4, 7], primary: 2, group: '遷移元素',
    notes: { 2: 'Mn²⁺ 淡桃色', 4: 'MnO₂ (酸化剤)', 7: 'MnO₄⁻ 赤紫色 (強い酸化剤)' },
    level: 1,
  },
];

export function valenceClass(ion: IonCharge): ValenceClass {
  if (ion.charges.length > 1) return '多価';
  if (ion.charges[0] === 1) return '1価';
  if (ion.charges[0] === 2) return '2価';
  if (ion.charges[0] === 3) return '3価';
  return '多価';
}

export function byValenceClass(cls: ValenceClass): IonCharge[] {
  return IONS.filter(i => valenceClass(i) === cls);
}

// 全ての価数値を集めた集合 (クイズの選択肢生成用)
export function allChargeValues(): number[] {
  const set = new Set<number>();
  for (const i of IONS) for (const c of i.charges) set.add(c);
  return [...set].sort((a, b) => a - b);
}

// charges が指定された数(charge)を含む元素を返す
export function ionsWithCharge(charge: number): IonCharge[] {
  return IONS.filter(i => i.charges.includes(charge));
}
