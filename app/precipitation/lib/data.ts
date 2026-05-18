import type { Ion, Reagent, Reaction } from '../types';

export const IONS: Ion[] = [
  { id: 'ag',  formula: 'Ag⁺',   name: '銀イオン',         aqueous_color: '無色',   group: '典型元素',     level: 1 },
  { id: 'pb',  formula: 'Pb²⁺',  name: '鉛(II)イオン',     aqueous_color: '無色',   group: '典型元素',     level: 1 },
  { id: 'cu',  formula: 'Cu²⁺',  name: '銅(II)イオン',     aqueous_color: '青色',   group: '遷移元素',     level: 1 },
  { id: 'fe2', formula: 'Fe²⁺',  name: '鉄(II)イオン',     aqueous_color: '淡緑色', group: '遷移元素',     level: 1 },
  { id: 'fe3', formula: 'Fe³⁺',  name: '鉄(III)イオン',    aqueous_color: '黄褐色', group: '遷移元素',     level: 1 },
  { id: 'al',  formula: 'Al³⁺',  name: 'アルミニウムイオン', aqueous_color: '無色',  group: '典型元素',     level: 1 },
  { id: 'zn',  formula: 'Zn²⁺',  name: '亜鉛イオン',       aqueous_color: '無色',   group: '典型元素',     level: 1 },
  { id: 'ca',  formula: 'Ca²⁺',  name: 'カルシウムイオン', aqueous_color: '無色',   group: 'アルカリ土類', level: 1 },
  { id: 'ba',  formula: 'Ba²⁺',  name: 'バリウムイオン',   aqueous_color: '無色',   group: 'アルカリ土類', level: 1 },
  { id: 'na',  formula: 'Na⁺',   name: 'ナトリウムイオン', aqueous_color: '無色',   group: 'アルカリ',     level: 1 },
  { id: 'k',   formula: 'K⁺',    name: 'カリウムイオン',   aqueous_color: '無色',   group: 'アルカリ',     level: 1 },
];

export const REAGENTS: Reagent[] = [
  { id: 'cl',       formula: 'Cl⁻',                short_label: 'Cl⁻',           category: '塩化物',     level: 1 },
  { id: 's_acid',   formula: 'S²⁻ (酸性)',         short_label: 'S²⁻ 酸性',      condition: '酸性',     category: '硫化物',     level: 1 },
  { id: 's_base',   formula: 'S²⁻ (塩基性)',       short_label: 'S²⁻ 塩基性',    condition: '塩基性',   category: '硫化物',     level: 1 },
  { id: 'nh3_few',  formula: 'NH₃aq (少量)',       short_label: 'NH₃ 少量',      condition: '少量',     category: '水酸化物',   level: 1 },
  { id: 'nh3_ex',   formula: 'NH₃aq (過剰)',       short_label: 'NH₃ 過剰',      condition: '過剰',     category: '水酸化物',   level: 1 },
  { id: 'naoh_few', formula: 'NaOHaq (少量)',      short_label: 'NaOH 少量',     condition: '少量',     category: '水酸化物',   level: 1 },
  { id: 'naoh_ex',  formula: 'NaOHaq (過剰)',      short_label: 'NaOH 過剰',     condition: '過剰',     category: '水酸化物',   level: 1 },
  { id: 'co3',      formula: 'CO₃²⁻',              short_label: 'CO₃²⁻',         category: '炭酸塩',     level: 1 },
  { id: 'so4',      formula: 'SO₄²⁻',              short_label: 'SO₄²⁻',         category: '硫酸塩',     level: 1 },
  { id: 'cro4',     formula: 'CrO₄²⁻',             short_label: 'CrO₄²⁻',        category: 'クロム酸塩', level: 1 },
];

export const REACTIONS: Reaction[] = [
  // Cl⁻
  { ion_id: 'ag',  reagent_id: 'cl', result: 'precipitate', color: '白色', product: 'AgCl' },
  { ion_id: 'pb',  reagent_id: 'cl', result: 'precipitate', color: '白色', product: 'PbCl₂', note: '熱水に溶ける' },
  { ion_id: 'cu',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'fe2', reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'fe3', reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'al',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'zn',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'ca',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'ba',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'na',  reagent_id: 'cl', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 'cl', result: 'no_reaction' },

  // S²⁻ 酸性
  { ion_id: 'ag',  reagent_id: 's_acid', result: 'precipitate', color: '黒色', product: 'Ag₂S' },
  { ion_id: 'pb',  reagent_id: 's_acid', result: 'precipitate', color: '黒色', product: 'PbS' },
  { ion_id: 'cu',  reagent_id: 's_acid', result: 'precipitate', color: '黒色', product: 'CuS' },
  { ion_id: 'fe2', reagent_id: 's_acid', result: 'no_reaction', note: '酸性ではFeSは沈殿しない' },
  { ion_id: 'fe3', reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'al',  reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'zn',  reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'ca',  reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'ba',  reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'na',  reagent_id: 's_acid', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 's_acid', result: 'no_reaction' },

  // S²⁻ 塩基性
  { ion_id: 'ag',  reagent_id: 's_base', result: 'precipitate', color: '黒色', product: 'Ag₂S' },
  { ion_id: 'pb',  reagent_id: 's_base', result: 'precipitate', color: '黒色', product: 'PbS' },
  { ion_id: 'cu',  reagent_id: 's_base', result: 'precipitate', color: '黒色', product: 'CuS' },
  { ion_id: 'fe2', reagent_id: 's_base', result: 'precipitate', color: '黒色', product: 'FeS' },
  { ion_id: 'fe3', reagent_id: 's_base', result: 'precipitate', color: '黒色', product: 'FeS', note: 'Fe³⁺は還元されてFe²⁺となりFeSが沈殿(※)' },
  { ion_id: 'al',  reagent_id: 's_base', result: 'precipitate', color: '白色', product: 'Al(OH)₃', note: 'S²⁻が加水分解しOH⁻を出すため水酸化物が沈殿' },
  { ion_id: 'zn',  reagent_id: 's_base', result: 'precipitate', color: '白色', product: 'ZnS' },
  { ion_id: 'ca',  reagent_id: 's_base', result: 'no_reaction' },
  { ion_id: 'ba',  reagent_id: 's_base', result: 'no_reaction' },
  { ion_id: 'na',  reagent_id: 's_base', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 's_base', result: 'no_reaction' },

  // NH₃ 少量 → 過剰
  { ion_id: 'ag', reagent_id: 'nh3_few', result: 'precipitate', color: '褐色', product: 'Ag₂O', sequence_group: 'ag_nh3', sequence_order: 1 },
  { ion_id: 'ag', reagent_id: 'nh3_ex',  result: 'complex', color: '無色', product: '[Ag(NH₃)₂]⁺', note: '錯イオン形成で溶解', sequence_group: 'ag_nh3', sequence_order: 2 },
  { ion_id: 'pb', reagent_id: 'nh3_few', result: 'precipitate', color: '白色', product: 'Pb(OH)₂' },
  { ion_id: 'pb', reagent_id: 'nh3_ex',  result: 'precipitate', color: '白色', product: 'Pb(OH)₂', note: '過剰NH₃に溶けない' },
  { ion_id: 'cu', reagent_id: 'nh3_few', result: 'precipitate', color: '青白色', product: 'Cu(OH)₂', sequence_group: 'cu_nh3', sequence_order: 1 },
  { ion_id: 'cu', reagent_id: 'nh3_ex',  result: 'complex', color: '深青色', product: '[Cu(NH₃)₄]²⁺', note: '錯イオン形成で深青色溶液', sequence_group: 'cu_nh3', sequence_order: 2 },
  { ion_id: 'fe2', reagent_id: 'nh3_few', result: 'precipitate', color: '緑白色', product: 'Fe(OH)₂' },
  { ion_id: 'fe2', reagent_id: 'nh3_ex',  result: 'precipitate', color: '緑白色', product: 'Fe(OH)₂' },
  { ion_id: 'fe3', reagent_id: 'nh3_few', result: 'precipitate', color: '赤褐色', product: 'Fe(OH)₃' },
  { ion_id: 'fe3', reagent_id: 'nh3_ex',  result: 'precipitate', color: '赤褐色', product: 'Fe(OH)₃' },
  { ion_id: 'al', reagent_id: 'nh3_few', result: 'precipitate', color: '白色', product: 'Al(OH)₃' },
  { ion_id: 'al', reagent_id: 'nh3_ex',  result: 'precipitate', color: '白色', product: 'Al(OH)₃', note: '過剰NH₃には溶けない(NaOHには溶ける)' },
  { ion_id: 'zn', reagent_id: 'nh3_few', result: 'precipitate', color: '白色', product: 'Zn(OH)₂', sequence_group: 'zn_nh3', sequence_order: 1 },
  { ion_id: 'zn', reagent_id: 'nh3_ex',  result: 'complex', color: '無色', product: '[Zn(NH₃)₄]²⁺', note: '錯イオン形成で溶解', sequence_group: 'zn_nh3', sequence_order: 2 },
  { ion_id: 'ca', reagent_id: 'nh3_few', result: 'no_reaction' },
  { ion_id: 'ca', reagent_id: 'nh3_ex',  result: 'no_reaction' },
  { ion_id: 'ba', reagent_id: 'nh3_few', result: 'no_reaction' },
  { ion_id: 'ba', reagent_id: 'nh3_ex',  result: 'no_reaction' },
  { ion_id: 'na', reagent_id: 'nh3_few', result: 'no_reaction' },
  { ion_id: 'na', reagent_id: 'nh3_ex',  result: 'no_reaction' },
  { ion_id: 'k',  reagent_id: 'nh3_few', result: 'no_reaction' },
  { ion_id: 'k',  reagent_id: 'nh3_ex',  result: 'no_reaction' },

  // NaOH 少量 → 過剰
  { ion_id: 'ag', reagent_id: 'naoh_few', result: 'precipitate', color: '褐色', product: 'Ag₂O' },
  { ion_id: 'ag', reagent_id: 'naoh_ex',  result: 'precipitate', color: '褐色', product: 'Ag₂O' },
  { ion_id: 'pb', reagent_id: 'naoh_few', result: 'precipitate', color: '白色', product: 'Pb(OH)₂', sequence_group: 'pb_naoh', sequence_order: 1 },
  { ion_id: 'pb', reagent_id: 'naoh_ex',  result: 'redissolve', color: '無色', product: '[Pb(OH)₄]²⁻', note: '両性水酸化物が溶解', sequence_group: 'pb_naoh', sequence_order: 2 },
  { ion_id: 'cu', reagent_id: 'naoh_few', result: 'precipitate', color: '青白色', product: 'Cu(OH)₂' },
  { ion_id: 'cu', reagent_id: 'naoh_ex',  result: 'precipitate', color: '青白色', product: 'Cu(OH)₂' },
  { ion_id: 'fe2', reagent_id: 'naoh_few', result: 'precipitate', color: '緑白色', product: 'Fe(OH)₂' },
  { ion_id: 'fe2', reagent_id: 'naoh_ex',  result: 'precipitate', color: '緑白色', product: 'Fe(OH)₂' },
  { ion_id: 'fe3', reagent_id: 'naoh_few', result: 'precipitate', color: '赤褐色', product: 'Fe(OH)₃' },
  { ion_id: 'fe3', reagent_id: 'naoh_ex',  result: 'precipitate', color: '赤褐色', product: 'Fe(OH)₃' },
  { ion_id: 'al', reagent_id: 'naoh_few', result: 'precipitate', color: '白色', product: 'Al(OH)₃', sequence_group: 'al_naoh', sequence_order: 1 },
  { ion_id: 'al', reagent_id: 'naoh_ex',  result: 'redissolve', color: '無色', product: '[Al(OH)₄]⁻', note: '両性水酸化物が溶解', sequence_group: 'al_naoh', sequence_order: 2 },
  { ion_id: 'zn', reagent_id: 'naoh_few', result: 'precipitate', color: '白色', product: 'Zn(OH)₂', sequence_group: 'zn_naoh', sequence_order: 1 },
  { ion_id: 'zn', reagent_id: 'naoh_ex',  result: 'redissolve', color: '無色', product: '[Zn(OH)₄]²⁻', note: '両性水酸化物が溶解', sequence_group: 'zn_naoh', sequence_order: 2 },
  { ion_id: 'ca', reagent_id: 'naoh_few', result: 'precipitate', color: '白色', product: 'Ca(OH)₂', note: '濃い時のみ' },
  { ion_id: 'ca', reagent_id: 'naoh_ex',  result: 'precipitate', color: '白色', product: 'Ca(OH)₂', note: '濃い時のみ' },
  { ion_id: 'ba', reagent_id: 'naoh_few', result: 'no_reaction' },
  { ion_id: 'ba', reagent_id: 'naoh_ex',  result: 'no_reaction' },
  { ion_id: 'na', reagent_id: 'naoh_few', result: 'no_reaction' },
  { ion_id: 'na', reagent_id: 'naoh_ex',  result: 'no_reaction' },
  { ion_id: 'k',  reagent_id: 'naoh_few', result: 'no_reaction' },
  { ion_id: 'k',  reagent_id: 'naoh_ex',  result: 'no_reaction' },

  // CO₃²⁻
  { ion_id: 'ag',  reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'pb',  reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'cu',  reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'fe2', reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'fe3', reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'al',  reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'zn',  reagent_id: 'co3', result: 'out_of_scope' },
  { ion_id: 'ca',  reagent_id: 'co3', result: 'precipitate', color: '白色', product: 'CaCO₃' },
  { ion_id: 'ba',  reagent_id: 'co3', result: 'precipitate', color: '白色', product: 'BaCO₃' },
  { ion_id: 'na',  reagent_id: 'co3', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 'co3', result: 'no_reaction' },

  // SO₄²⁻
  { ion_id: 'ag',  reagent_id: 'so4', result: 'out_of_scope' },
  { ion_id: 'pb',  reagent_id: 'so4', result: 'precipitate', color: '白色', product: 'PbSO₄' },
  { ion_id: 'cu',  reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'fe2', reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'fe3', reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'al',  reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'zn',  reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'ca',  reagent_id: 'so4', result: 'precipitate', color: '白色', product: 'CaSO₄' },
  { ion_id: 'ba',  reagent_id: 'so4', result: 'precipitate', color: '白色', product: 'BaSO₄' },
  { ion_id: 'na',  reagent_id: 'so4', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 'so4', result: 'no_reaction' },

  // CrO₄²⁻
  { ion_id: 'ag',  reagent_id: 'cro4', result: 'precipitate', color: '赤褐色', product: 'Ag₂CrO₄' },
  { ion_id: 'pb',  reagent_id: 'cro4', result: 'precipitate', color: '黄色',   product: 'PbCrO₄' },
  { ion_id: 'cu',  reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'fe2', reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'fe3', reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'al',  reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'zn',  reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'ca',  reagent_id: 'cro4', result: 'out_of_scope' },
  { ion_id: 'ba',  reagent_id: 'cro4', result: 'precipitate', color: '黄色',   product: 'BaCrO₄' },
  { ion_id: 'na',  reagent_id: 'cro4', result: 'no_reaction' },
  { ion_id: 'k',   reagent_id: 'cro4', result: 'no_reaction' },
];

export function getReactions(ionId: string, reagentId: string): Reaction[] {
  return REACTIONS.filter(r => r.ion_id === ionId && r.reagent_id === reagentId);
}

export function getSequenceFor(ionId: string, reagentId: string): Reaction[] | null {
  const r = REACTIONS.find(x => x.ion_id === ionId && x.reagent_id === reagentId);
  if (!r || !r.sequence_group) return null;
  return REACTIONS
    .filter(x => x.sequence_group === r.sequence_group)
    .sort((a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0));
}

export function reactionKey(ionId: string, reagentId: string): string {
  return `${ionId}__${reagentId}`;
}
