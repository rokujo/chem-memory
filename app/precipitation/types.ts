export type Ion = {
  id: string;
  formula: string;
  name: string;
  aqueous_color: string;
  group: '典型元素' | '遷移元素' | 'アルカリ' | 'アルカリ土類';
  level: 1 | 2 | 3;
};

export type Reagent = {
  id: string;
  formula: string;
  short_label: string;
  condition?: string;
  category: '塩化物' | '硫化物' | '水酸化物' | '炭酸塩' | '硫酸塩' | 'クロム酸塩';
  level: 1 | 2 | 3;
};

export type ReactionResult =
  | 'precipitate'
  | 'complex'
  | 'no_reaction'
  | 'redissolve'
  | 'colored_solution'
  | 'out_of_scope';

export type Reaction = {
  ion_id: string;
  reagent_id: string;
  result: ReactionResult;
  color?: string;
  product?: string;
  note?: string;
  sequence_group?: string;
  sequence_order?: number;
};
