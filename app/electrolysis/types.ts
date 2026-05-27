export type ElectrodeType = 'C (不活性)' | 'Cu (活性)' | 'Ag (活性)';

export type ElectrolysisCategory =
  | '水溶液(不活性電極)'
  | '水溶液(活性電極)'
  | '融解塩';

export type Electrolysis = {
  id: string;
  electrolyte: string;            // 'NaCl 水溶液'
  electrode: ElectrodeType;
  cathode_product: string;        // '陰極で生じるもの' (H₂, Cu, Ag, Na など)
  anode_product: string;          // '陽極で生じるもの' (Cl₂, O₂, Cu(電極溶解) など)
  cathode_note?: string;
  anode_note?: string;
  category: ElectrolysisCategory;
  note?: string;
  level: 1 | 2 | 3;
};
