export type SubstanceState = '固体' | '液体' | '気体' | '水溶液';

export type SubstanceCategory =
  | '金属単体'
  | '酸化物'
  | '硫化物'
  | '水酸化物'
  | 'ハロゲン'
  | '気体'
  | 'イオン(水溶液)'
  | 'その他';

export type Substance = {
  id: string;
  formula: string;
  name: string;
  color: string;
  state: SubstanceState;
  category: SubstanceCategory;
  note?: string;
  compare_group?: string;
  compare_note?: string;
  level: 1 | 2 | 3;
};
