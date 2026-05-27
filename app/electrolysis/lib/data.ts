import type { Electrolysis, ElectrolysisCategory } from '../types';

export const CATEGORY_ORDER: ElectrolysisCategory[] = [
  '水溶液(不活性電極)',
  '水溶液(活性電極)',
  '融解塩',
];

export const ELECTROLYSIS: Electrolysis[] = [
  // ===== 水溶液 + 不活性電極 =====
  {
    id: 'nacl_aq_c',
    electrolyte: 'NaCl 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'H₂',
    anode_product: 'Cl₂',
    cathode_note: 'NaOH も同時に生成(Na⁺ は還元されないため)',
    category: '水溶液(不活性電極)',
    note: 'イオン交換膜法で工業的に NaOH・Cl₂・H₂ を製造',
    level: 1,
  },
  {
    id: 'hcl_aq_c',
    electrolyte: 'HCl 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'H₂',
    anode_product: 'Cl₂',
    category: '水溶液(不活性電極)',
    level: 1,
  },
  {
    id: 'cucl2_aq_c',
    electrolyte: 'CuCl₂ 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'Cu',
    anode_product: 'Cl₂',
    category: '水溶液(不活性電極)',
    level: 1,
  },
  {
    id: 'cuso4_aq_c',
    electrolyte: 'CuSO₄ 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'Cu',
    anode_product: 'O₂',
    anode_note: 'SO₄²⁻ は酸化されにくいので水が酸化される',
    category: '水溶液(不活性電極)',
    level: 1,
  },
  {
    id: 'agno3_aq_c',
    electrolyte: 'AgNO₃ 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'Ag',
    anode_product: 'O₂',
    anode_note: 'NO₃⁻ は酸化されにくいので水が酸化される',
    category: '水溶液(不活性電極)',
    level: 1,
  },
  {
    id: 'h2so4_aq_c',
    electrolyte: '希 H₂SO₄',
    electrode: 'C (不活性)',
    cathode_product: 'H₂',
    anode_product: 'O₂',
    category: '水溶液(不活性電極)',
    note: '実質的に水の電気分解。H₂ : O₂ = 2 : 1',
    level: 1,
  },
  {
    id: 'naoh_aq_c',
    electrolyte: 'NaOH 水溶液',
    electrode: 'C (不活性)',
    cathode_product: 'H₂',
    anode_product: 'O₂',
    category: '水溶液(不活性電極)',
    note: 'こちらも実質的に水の電気分解',
    level: 1,
  },

  // ===== 水溶液 + 活性電極 =====
  {
    id: 'cuso4_aq_cu',
    electrolyte: 'CuSO₄ 水溶液',
    electrode: 'Cu (活性)',
    cathode_product: 'Cu',
    anode_product: 'Cu(電極溶解)',
    anode_note: '陽極の Cu が酸化されて Cu²⁺ となり溶け出す',
    category: '水溶液(活性電極)',
    note: '銅の電解精錬。粗銅(陽極) → 純銅(陰極)。不純物は陽極泥に',
    level: 1,
  },
  {
    id: 'agno3_aq_ag',
    electrolyte: 'AgNO₃ 水溶液',
    electrode: 'Ag (活性)',
    cathode_product: 'Ag',
    anode_product: 'Ag(電極溶解)',
    anode_note: '陽極の Ag が酸化されて Ag⁺ となり溶け出す',
    category: '水溶液(活性電極)',
    note: '銀めっきの原理',
    level: 1,
  },

  // ===== 融解塩 =====
  {
    id: 'nacl_molten',
    electrolyte: '融解 NaCl',
    electrode: 'C (不活性)',
    cathode_product: 'Na',
    anode_product: 'Cl₂',
    category: '融解塩',
    note: '融解塩電解。アルカリ金属は水溶液では析出しないため、融解した塩を電気分解する',
    level: 1,
  },
];

export function byCategory(category: ElectrolysisCategory): Electrolysis[] {
  return ELECTROLYSIS.filter(e => e.category === category);
}

export function findById(id: string): Electrolysis | undefined {
  return ELECTROLYSIS.find(e => e.id === id);
}
