import type { Complex, Ligand } from '../types';

export const LIGAND_ORDER: Ligand[] = ['NH₃', 'CN⁻', 'OH⁻'];

export const COMPLEXES: Complex[] = [
  // ===== NH₃ 配位 =====
  {
    id: 'ag_nh3',
    formula: '[Ag(NH₃)₂]⁺',
    name: 'ジアンミン銀(I)イオン',
    center: 'Ag⁺',
    ligand: 'NH₃',
    coord_number: 2,
    geometry: '直線',
    color: '無色',
    source: 'Ag⁺ + 過剰NH₃ aq',
    note: 'Ag₂O褐色沈殿が過剰NH₃に溶けて無色錯イオン',
    level: 1,
  },
  {
    id: 'cu_nh3',
    formula: '[Cu(NH₃)₄]²⁺',
    name: 'テトラアンミン銅(II)イオン',
    center: 'Cu²⁺',
    ligand: 'NH₃',
    coord_number: 4,
    geometry: '正方形',
    color: '深青色',
    source: 'Cu²⁺ + 過剰NH₃ aq',
    note: 'Cu(OH)₂青白沈殿が過剰NH₃に溶けて深青色錯イオン',
    level: 1,
  },
  {
    id: 'zn_nh3',
    formula: '[Zn(NH₃)₄]²⁺',
    name: 'テトラアンミン亜鉛(II)イオン',
    center: 'Zn²⁺',
    ligand: 'NH₃',
    coord_number: 4,
    geometry: '正四面体',
    color: '無色',
    source: 'Zn²⁺ + 過剰NH₃ aq',
    note: 'Zn(OH)₂白沈殿が過剰NH₃に溶けて無色錯イオン',
    level: 1,
  },

  // ===== CN⁻ 配位 =====
  {
    id: 'fe3_cn',
    formula: '[Fe(CN)₆]³⁻',
    name: 'ヘキサシアニド鉄(III)酸イオン',
    center: 'Fe³⁺',
    ligand: 'CN⁻',
    coord_number: 6,
    geometry: '正八面体',
    color: '黄色',
    source: 'Fe³⁺ + CN⁻',
    note: 'K₃[Fe(CN)₆] は赤血塩。Fe²⁺の検出に使う(血赤色錯体生成)',
    level: 1,
  },
  {
    id: 'fe2_cn',
    formula: '[Fe(CN)₆]⁴⁻',
    name: 'ヘキサシアニド鉄(II)酸イオン',
    center: 'Fe²⁺',
    ligand: 'CN⁻',
    coord_number: 6,
    geometry: '正八面体',
    color: '黄色',
    source: 'Fe²⁺ + CN⁻',
    note: 'K₄[Fe(CN)₆] は黄血塩。Fe³⁺の検出に使う(濃青色錯体生成)',
    level: 1,
  },

  // ===== OH⁻ 配位 (両性元素) =====
  {
    id: 'al_oh',
    formula: '[Al(OH)₄]⁻',
    name: 'テトラヒドロキシドアルミン酸イオン',
    center: 'Al³⁺',
    ligand: 'OH⁻',
    coord_number: 4,
    geometry: '正四面体',
    color: '無色',
    source: 'Al³⁺ + 過剰NaOH aq',
    note: '両性元素 Al の水酸化物 Al(OH)₃ が過剰NaOHに溶けて錯イオンに',
    level: 1,
  },
  {
    id: 'zn_oh',
    formula: '[Zn(OH)₄]²⁻',
    name: 'テトラヒドロキシド亜鉛酸イオン',
    center: 'Zn²⁺',
    ligand: 'OH⁻',
    coord_number: 4,
    geometry: '正四面体',
    color: '無色',
    source: 'Zn²⁺ + 過剰NaOH aq',
    note: '両性元素 Zn の水酸化物 Zn(OH)₂ が過剰NaOHに溶けて錯イオンに',
    level: 1,
  },
  {
    id: 'pb_oh',
    formula: '[Pb(OH)₄]²⁻',
    name: 'テトラヒドロキシド鉛(II)酸イオン',
    center: 'Pb²⁺',
    ligand: 'OH⁻',
    coord_number: 4,
    geometry: '正四面体',
    color: '無色',
    source: 'Pb²⁺ + 過剰NaOH aq',
    note: '両性元素 Pb の水酸化物 Pb(OH)₂ が過剰NaOHに溶けて錯イオンに',
    level: 1,
  },
];

export function byLigand(ligand: Ligand): Complex[] {
  return COMPLEXES.filter(c => c.ligand === ligand);
}

export function findById(id: string): Complex | undefined {
  return COMPLEXES.find(c => c.id === id);
}

// ===== 組成式の構造化ヘルパー(クイズのダミー生成用) =====

const SUBSCRIPT = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const SUPERSCRIPT = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const SUPERSCRIPT_REVERSE: Record<string, number> = {
  '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9,
};

// 中心金属の電荷(Cu²⁺ → +2, Ag⁺ → +1)を取り出す
export function centerCharge(center: string): number {
  const match = center.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/);
  if (!match) return 0;
  const numStr = match[1];
  const sign = match[2] === '⁺' ? 1 : -1;
  const num = numStr === '' ? 1 : (SUPERSCRIPT_REVERSE[numStr] ?? 1);
  return sign * num;
}

// 配位子1個あたりの電荷
function ligandCharge(ligand: Ligand): number {
  if (ligand === 'NH₃') return 0;
  return -1; // CN⁻ / OH⁻
}

// 錯イオン全体の電荷を計算
export function complexCharge(complex: Complex): number {
  return centerCharge(complex.center) + complex.coord_number * ligandCharge(complex.ligand);
}

function ligandInnerRepr(ligand: Ligand): string {
  // 組成式の中の配位子表記(電荷を除いた文字列)
  if (ligand === 'NH₃') return 'NH₃';
  if (ligand === 'CN⁻') return 'CN';
  return 'OH';
}

function formatCharge(charge: number): string {
  if (charge === 0) return '';
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  const num = abs === 1 ? '' : SUPERSCRIPT[abs];
  return num + sign;
}

// 中心金属の元素記号のみ取り出す(Cu²⁺ → Cu, Fe³⁺ → Fe)
function centerElement(center: string): string {
  return center.match(/^[A-Z][a-z]?/)?.[0] ?? center;
}

// 組成式の文字列を生成。中心+配位子+配位数+電荷を指定。
// 配位数1のときは下付き省略([Fe(CN)]^? のような表記にはしない方が自然なので
// 本実装では配位数は常に2/4/6 を想定し1の場合は使わない)。
export function formatComplexFormula(
  center: string,
  ligand: Ligand,
  coordNumber: number,
  charge: number,
): string {
  const sub = coordNumber === 1 ? '' : SUBSCRIPT[coordNumber] ?? String(coordNumber);
  return `[${centerElement(center)}(${ligandInnerRepr(ligand)})${sub}]${formatCharge(charge)}`;
}
