import type { Substance, SubstanceCategory } from '../types';

export const CATEGORY_ORDER: SubstanceCategory[] = [
  '金属単体',
  '酸化物',
  '硫化物',
  '水酸化物',
  'ハロゲン',
  '気体',
  'イオン(水溶液)',
  'その他',
];

export const SUBSTANCES: Substance[] = [
  // 金属単体
  { id: 'cu_metal', formula: 'Cu', name: '銅',           color: '赤色',   state: '固体', category: '金属単体', note: '赤色光沢の金属', level: 1 },
  { id: 'au_metal', formula: 'Au', name: '金',           color: '黄色',   state: '固体', category: '金属単体', level: 1 },
  { id: 'fe_metal', formula: 'Fe', name: '鉄',           color: '銀白色', state: '固体', category: '金属単体', level: 1 },
  { id: 'ag_metal', formula: 'Ag', name: '銀',           color: '銀白色', state: '固体', category: '金属単体', level: 1 },
  { id: 'hg_metal', formula: 'Hg', name: '水銀',         color: '銀白色', state: '液体', category: '金属単体', note: '常温で液体', level: 1 },
  { id: 'zn_metal', formula: 'Zn', name: '亜鉛',         color: '銀白色', state: '固体', category: '金属単体', level: 1 },
  { id: 'na_metal', formula: 'Na', name: 'ナトリウム',   color: '銀白色', state: '固体', category: '金属単体', note: '柔らかい', level: 1 },
  { id: 'al_metal', formula: 'Al', name: 'アルミニウム', color: '銀白色', state: '固体', category: '金属単体', level: 1 },

  // 酸化物
  { id: 'cuo',   formula: 'CuO',    name: '酸化銅(II)',     color: '黒色',   state: '固体', category: '酸化物', compare_group: 'cu_oxides', compare_note: 'Cu²⁺ の +2 酸化物', level: 1 },
  { id: 'cu2o',  formula: 'Cu₂O',   name: '酸化銅(I)',      color: '赤色',   state: '固体', category: '酸化物', compare_group: 'cu_oxides', compare_note: 'Cu⁺ の +1 酸化物', level: 1 },
  { id: 'fe2o3', formula: 'Fe₂O₃',  name: '酸化鉄(III)',    color: '赤褐色', state: '固体', category: '酸化物', note: '赤鉄鉱',     level: 1 },
  { id: 'fe3o4', formula: 'Fe₃O₄',  name: '四酸化三鉄',     color: '黒色',   state: '固体', category: '酸化物', note: '磁鉄鉱',     level: 1 },
  { id: 'mno2',  formula: 'MnO₂',   name: '酸化マンガン(IV)', color: '黒色', state: '固体', category: '酸化物', note: '酸化剤',     level: 1 },
  { id: 'ag2o',  formula: 'Ag₂O',   name: '酸化銀',         color: '褐色',   state: '固体', category: '酸化物', level: 1 },
  { id: 'zno',   formula: 'ZnO',    name: '酸化亜鉛',       color: '白色',   state: '固体', category: '酸化物', level: 1 },
  { id: 'al2o3', formula: 'Al₂O₃',  name: '酸化アルミニウム', color: '白色',  state: '固体', category: '酸化物', level: 1 },

  // 硫化物
  { id: 'cus',  formula: 'CuS',  name: '硫化銅(II)',     color: '黒色', state: '固体', category: '硫化物', level: 1 },
  { id: 'ag2s', formula: 'Ag₂S', name: '硫化銀',         color: '黒色', state: '固体', category: '硫化物', level: 1 },
  { id: 'pbs',  formula: 'PbS',  name: '硫化鉛(II)',     color: '黒色', state: '固体', category: '硫化物', level: 1 },
  { id: 'fes',  formula: 'FeS',  name: '硫化鉄(II)',     color: '黒色', state: '固体', category: '硫化物', level: 1 },
  { id: 'zns',  formula: 'ZnS',  name: '硫化亜鉛',       color: '白色', state: '固体', category: '硫化物', level: 1 },
  { id: 'cds',  formula: 'CdS',  name: '硫化カドミウム', color: '黄色', state: '固体', category: '硫化物', level: 2 },
  { id: 'hgs',  formula: 'HgS',  name: '硫化水銀(II)',   color: '赤色', state: '固体', category: '硫化物', note: '朱(辰砂)', level: 2 },

  // 水酸化物 (沈殿反応単元と重複するが、物質単独の色として再掲)
  { id: 'cu_oh2',  formula: 'Cu(OH)₂', name: '水酸化銅(II)',     color: '青白色', state: '固体', category: '水酸化物', level: 1 },
  { id: 'fe_oh2',  formula: 'Fe(OH)₂', name: '水酸化鉄(II)',     color: '緑白色', state: '固体', category: '水酸化物', level: 1 },
  { id: 'fe_oh3',  formula: 'Fe(OH)₃', name: '水酸化鉄(III)',    color: '赤褐色', state: '固体', category: '水酸化物', level: 1 },
  { id: 'zn_oh2',  formula: 'Zn(OH)₂', name: '水酸化亜鉛',       color: '白色',   state: '固体', category: '水酸化物', level: 1 },
  { id: 'al_oh3',  formula: 'Al(OH)₃', name: '水酸化アルミニウム', color: '白色',  state: '固体', category: '水酸化物', level: 1 },

  // ハロゲン単体
  { id: 'f2', formula: 'F₂', name: 'フッ素', color: '淡黄色', state: '気体', category: 'ハロゲン', note: '刺激臭・極めて反応性高い', level: 1 },
  { id: 'cl2', formula: 'Cl₂', name: '塩素', color: '黄緑色', state: '気体', category: 'ハロゲン', note: '刺激臭', level: 1 },
  { id: 'br2', formula: 'Br₂', name: '臭素', color: '赤褐色', state: '液体', category: 'ハロゲン', note: '常温で液体・刺激臭', level: 1 },
  { id: 'i2',  formula: 'I₂',  name: 'ヨウ素', color: '紫色', state: '固体', category: 'ハロゲン', note: '固体は紫黒色・昇華して紫色蒸気', level: 1 },

  // 気体
  { id: 'no',   formula: 'NO',   name: '一酸化窒素', color: '無色',   state: '気体', category: '気体',
    compare_group: 'nox', compare_note: '空気中で酸化されてNO₂になる', level: 1 },
  { id: 'no2',  formula: 'NO₂',  name: '二酸化窒素', color: '赤褐色', state: '気体', category: '気体',
    compare_group: 'nox', compare_note: '刺激臭・有色', level: 1 },
  { id: 'o3',   formula: 'O₃',   name: 'オゾン',     color: '淡青色', state: '気体', category: '気体', note: '特異臭', level: 1 },
  { id: 'h2s',  formula: 'H₂S',  name: '硫化水素',   color: '無色',   state: '気体', category: '気体', note: '腐卵臭',   level: 1 },
  { id: 'nh3',  formula: 'NH₃',  name: 'アンモニア', color: '無色',   state: '気体', category: '気体', note: '刺激臭',   level: 1 },
  { id: 'so2',  formula: 'SO₂',  name: '二酸化硫黄', color: '無色',   state: '気体', category: '気体', note: '刺激臭',   level: 1 },

  // イオン (水溶液)
  { id: 'cu2_ion',  formula: 'Cu²⁺',     name: '銅(II)イオン',         color: '青色',   state: '水溶液', category: 'イオン(水溶液)', level: 1 },
  { id: 'fe2_ion',  formula: 'Fe²⁺',     name: '鉄(II)イオン',         color: '淡緑色', state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'fe_ions', compare_note: '酸化状態 +2', level: 1 },
  { id: 'fe3_ion',  formula: 'Fe³⁺',     name: '鉄(III)イオン',        color: '黄褐色', state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'fe_ions', compare_note: '酸化状態 +3', level: 1 },
  { id: 'mn2_ion',  formula: 'Mn²⁺',     name: 'マンガン(II)イオン',   color: '淡桃色', state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'mn_states', compare_note: '酸化状態 +2', level: 1 },
  { id: 'mno4_ion', formula: 'MnO₄⁻',    name: '過マンガン酸イオン',   color: '赤紫色', state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'mn_states', compare_note: '酸化状態 +7・強い酸化剤', level: 1 },
  { id: 'cr2o7',    formula: 'Cr₂O₇²⁻',  name: '二クロム酸イオン',     color: '橙色',   state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'cr_states', compare_note: '酸性条件で安定', level: 1 },
  { id: 'cro4',     formula: 'CrO₄²⁻',   name: 'クロム酸イオン',       color: '黄色',   state: '水溶液', category: 'イオン(水溶液)',
    compare_group: 'cr_states', compare_note: '塩基性条件で安定', level: 1 },
  { id: 'co2_ion',  formula: 'Co²⁺',     name: 'コバルト(II)イオン',   color: '桃色',   state: '水溶液', category: 'イオン(水溶液)', level: 2 },
  { id: 'ni2_ion',  formula: 'Ni²⁺',     name: 'ニッケル(II)イオン',   color: '緑色',   state: '水溶液', category: 'イオン(水溶液)', level: 2 },
];

export function getComparePair(substance: Substance): Substance[] | null {
  if (!substance.compare_group) return null;
  const pair = SUBSTANCES.filter(s => s.compare_group === substance.compare_group);
  if (pair.length < 2) return null;
  return pair;
}

export function substancesByCategory(category: SubstanceCategory): Substance[] {
  return SUBSTANCES.filter(s => s.category === category);
}

export function substancesByColor(color: string): Substance[] {
  return SUBSTANCES.filter(s => s.color === color);
}

export function getColors(): string[] {
  const set = new Set<string>();
  for (const s of SUBSTANCES) set.add(s.color);
  return [...set];
}
