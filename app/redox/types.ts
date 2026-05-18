export type Term = {
  coeff: number;       // 1 のときは表示で省略
  species: string;     // 'MnO₄⁻', 'H⁺', 'H₂O', 'e⁻' など
};

export type Role = '酸化剤' | '還元剤';

export type Condition = '酸性' | '塩基性' | '中性' | '-';

export type HalfReaction = {
  id: string;
  name: string;            // '過マンガン酸イオン (酸性)'
  reagent_label: string;   // 'KMnO₄' のような原物質ラベル(表示用)
  role: Role;
  condition: Condition;
  reactants: Term[];
  products: Term[];
  note?: string;
  level: 1 | 2 | 3;
};
