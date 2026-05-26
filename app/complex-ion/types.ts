export type Ligand = 'NH₃' | 'CN⁻' | 'OH⁻';

export type Geometry = '直線' | '正四面体' | '正方形' | '正八面体';

export type Complex = {
  id: string;
  formula: string;          // [Cu(NH₃)₄]²⁺
  name: string;             // テトラアンミン銅(II)イオン
  center: string;           // Cu²⁺
  ligand: Ligand;
  coord_number: 2 | 4 | 6;
  geometry: Geometry;
  color: string;
  source: string;           // 由来: 「Cu²⁺ + NH₃ aq(過剰)」など
  note?: string;
  level: 1 | 2 | 3;
};
