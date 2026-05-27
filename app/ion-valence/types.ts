export type IonGroup =
  | 'アルカリ金属'
  | 'アルカリ土類金属'
  | '遷移元素'
  | '典型元素'
  | 'その他';

export type ValenceClass = '1価' | '2価' | '3価' | '多価';

export type IonCharge = {
  id: string;
  element: string;             // 'Cu' / 'Fe'
  name: string;                // '銅'
  charges: number[];           // [1, 2] / [2] / [2, 4, 7]
  primary: number;             // 主要な価数
  group: IonGroup;
  notes?: Partial<Record<number, string>>;  // 価数ごとの注釈
  level: 1 | 2 | 3;
};
