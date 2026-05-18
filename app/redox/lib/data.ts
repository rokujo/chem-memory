import type { HalfReaction } from '../types';

// 半反応式の規約:
//   左辺(reactants) / 右辺(products) は教科書の標準的な記述順に並べる。
//   e⁻ は反応の方向に合わせる: 酸化剤は左辺、還元剤は右辺。
//   coeff: 1 のときも 1 として保持(表示で省略)。

export const HALF_REACTIONS: HalfReaction[] = [
  // ============ 酸化剤 ============
  {
    id: 'mno4_acid',
    name: '過マンガン酸イオン',
    reagent_label: 'KMnO₄',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'MnO₄⁻' },
      { coeff: 8, species: 'H⁺' },
      { coeff: 5, species: 'e⁻' },
    ],
    products: [
      { coeff: 1, species: 'Mn²⁺' },
      { coeff: 4, species: 'H₂O' },
    ],
    note: '赤紫色 → ほぼ無色(淡桃色)',
    level: 1,
  },
  {
    id: 'cr2o7_acid',
    name: '二クロム酸イオン',
    reagent_label: 'K₂Cr₂O₇',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'Cr₂O₇²⁻' },
      { coeff: 14, species: 'H⁺' },
      { coeff: 6, species: 'e⁻' },
    ],
    products: [
      { coeff: 2, species: 'Cr³⁺' },
      { coeff: 7, species: 'H₂O' },
    ],
    note: '橙色 → 緑色',
    level: 1,
  },
  {
    id: 'h2o2_ox',
    name: '過酸化水素',
    reagent_label: 'H₂O₂',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'H₂O₂' },
      { coeff: 2, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    products: [
      { coeff: 2, species: 'H₂O' },
    ],
    note: '相手が還元剤のとき(例: KMnO₄に対しては還元剤)',
    level: 1,
  },
  {
    id: 'hno3_dilute',
    name: '希硝酸',
    reagent_label: 'HNO₃ (希)',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'HNO₃' },
      { coeff: 3, species: 'H⁺' },
      { coeff: 3, species: 'e⁻' },
    ],
    products: [
      { coeff: 1, species: 'NO' },
      { coeff: 2, species: 'H₂O' },
    ],
    note: '生成気体: 無色のNO',
    level: 1,
  },
  {
    id: 'hno3_conc',
    name: '濃硝酸',
    reagent_label: 'HNO₃ (濃)',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'HNO₃' },
      { coeff: 1, species: 'H⁺' },
      { coeff: 1, species: 'e⁻' },
    ],
    products: [
      { coeff: 1, species: 'NO₂' },
      { coeff: 1, species: 'H₂O' },
    ],
    note: '生成気体: 赤褐色のNO₂',
    level: 1,
  },
  {
    id: 'h2so4_hot_conc',
    name: '熱濃硫酸',
    reagent_label: 'H₂SO₄ (熱濃)',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'H₂SO₄' },
      { coeff: 2, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    products: [
      { coeff: 1, species: 'SO₂' },
      { coeff: 2, species: 'H₂O' },
    ],
    note: '生成気体: 刺激臭のSO₂',
    level: 1,
  },
  {
    id: 'cl2_ox',
    name: '塩素',
    reagent_label: 'Cl₂',
    role: '酸化剤',
    condition: '-',
    reactants: [
      { coeff: 1, species: 'Cl₂' },
      { coeff: 2, species: 'e⁻' },
    ],
    products: [
      { coeff: 2, species: 'Cl⁻' },
    ],
    note: 'ハロゲン単体は強い酸化剤(F₂ > Cl₂ > Br₂ > I₂)',
    level: 1,
  },
  {
    id: 'o2_ox',
    name: '酸素',
    reagent_label: 'O₂',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'O₂' },
      { coeff: 4, species: 'H⁺' },
      { coeff: 4, species: 'e⁻' },
    ],
    products: [
      { coeff: 2, species: 'H₂O' },
    ],
    level: 2,
  },
  {
    id: 'so2_ox',
    name: '二酸化硫黄',
    reagent_label: 'SO₂',
    role: '酸化剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'SO₂' },
      { coeff: 4, species: 'H⁺' },
      { coeff: 4, species: 'e⁻' },
    ],
    products: [
      { coeff: 1, species: 'S' },
      { coeff: 2, species: 'H₂O' },
    ],
    note: 'H₂S など還元力の強い相手に対しては酸化剤として働く(SO₂ + 2H₂S → 3S + 2H₂O)',
    level: 1,
  },

  // ============ 還元剤 ============
  {
    id: 'h2s_red',
    name: '硫化水素',
    reagent_label: 'H₂S',
    role: '還元剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'H₂S' },
    ],
    products: [
      { coeff: 1, species: 'S' },
      { coeff: 2, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    note: 'Sが単体として析出(白濁)',
    level: 1,
  },
  {
    id: 'so2_red',
    name: '二酸化硫黄',
    reagent_label: 'SO₂',
    role: '還元剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'SO₂' },
      { coeff: 2, species: 'H₂O' },
    ],
    products: [
      { coeff: 1, species: 'SO₄²⁻' },
      { coeff: 4, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    note: '相手が酸化剤のとき。H₂Sに対しては逆に酸化剤として働く',
    level: 1,
  },
  {
    id: 'oxalic_red',
    name: 'シュウ酸',
    reagent_label: '(COOH)₂',
    role: '還元剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: '(COOH)₂' },
    ],
    products: [
      { coeff: 2, species: 'CO₂' },
      { coeff: 2, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    note: 'KMnO₄の標準液濃度決定の指示薬として使う',
    level: 1,
  },
  {
    id: 'i_red',
    name: 'ヨウ化物イオン',
    reagent_label: 'I⁻',
    role: '還元剤',
    condition: '-',
    reactants: [
      { coeff: 2, species: 'I⁻' },
    ],
    products: [
      { coeff: 1, species: 'I₂' },
      { coeff: 2, species: 'e⁻' },
    ],
    note: 'ヨウ素デンプン反応で青紫色',
    level: 1,
  },
  {
    id: 'fe2_red',
    name: '鉄(II)イオン',
    reagent_label: 'Fe²⁺',
    role: '還元剤',
    condition: '-',
    reactants: [
      { coeff: 1, species: 'Fe²⁺' },
    ],
    products: [
      { coeff: 1, species: 'Fe³⁺' },
      { coeff: 1, species: 'e⁻' },
    ],
    note: '淡緑色 → 黄褐色',
    level: 1,
  },
  {
    id: 'sn2_red',
    name: 'スズ(II)イオン',
    reagent_label: 'Sn²⁺',
    role: '還元剤',
    condition: '-',
    reactants: [
      { coeff: 1, species: 'Sn²⁺' },
    ],
    products: [
      { coeff: 1, species: 'Sn⁴⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    level: 2,
  },
  {
    id: 'h2o2_red',
    name: '過酸化水素',
    reagent_label: 'H₂O₂',
    role: '還元剤',
    condition: '酸性',
    reactants: [
      { coeff: 1, species: 'H₂O₂' },
    ],
    products: [
      { coeff: 1, species: 'O₂' },
      { coeff: 2, species: 'H⁺' },
      { coeff: 2, species: 'e⁻' },
    ],
    note: '相手がKMnO₄など強い酸化剤のとき',
    level: 1,
  },
];

export function byRole(role: '酸化剤' | '還元剤'): HalfReaction[] {
  return HALF_REACTIONS.filter(r => r.role === role);
}

export function findById(id: string): HalfReaction | undefined {
  return HALF_REACTIONS.find(r => r.id === id);
}

// e⁻ を除いたすべての項(穴埋め対象)
export function quizableTerms(reaction: HalfReaction): Array<{ side: 'reactants' | 'products'; index: number }> {
  const out: Array<{ side: 'reactants' | 'products'; index: number }> = [];
  reaction.reactants.forEach((_, i) => out.push({ side: 'reactants', index: i }));
  reaction.products.forEach((_, i) => out.push({ side: 'products', index: i }));
  return out;
}
