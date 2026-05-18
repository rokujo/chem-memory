import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, User, FlaskConical, Grid3x3, ArrowRight, Brain, Target, Palette, Check, X, RefreshCw } from 'lucide-react';

// =============================================================
// 色パレット
// =============================================================

const COLOR_PALETTE: Record<string, string> = {
  '無色':    'transparent',
  '白色':    '#fafafa',
  '青白色':  '#a6c8e8',
  '青色':    '#1d4ed8',
  '深青色':  '#1e3a8a',
  '淡緑色':  '#86efac',
  '緑色':    '#16a34a',
  '緑白色':  '#bbf7d0',
  '暗緑色':  '#14532d',
  '灰緑色':  '#4d7c5f',
  '黄緑色':  '#84cc16',
  '淡黄色':  '#fef08a',
  '黄色':    '#eab308',
  '黄褐色':  '#a16207',
  '橙色':    '#ea580c',
  '橙赤色':  '#dc2626',
  '赤色':    '#dc2626',
  '赤褐色':  '#7c2d12',
  '赤紫色':  '#9333ea',
  '紫色':    '#7e22ce',
  '淡桃色':  '#fbcfe8',
  '桃色':    '#ec4899',
  '褐色':    '#451a03',
  '黒色':    '#0f172a',
  '銀白色':  '#d4d4d8',
};

function ChipSwatch({ name, size = 14 }: { name: string; size?: number }) {
  if (name === '無色') {
    const px = size;
    return (
      <span
        className="inline-block rounded-full border border-slate-500"
        style={{
          width: px, height: px,
          backgroundImage:
            'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
          backgroundSize: `${Math.max(px / 2, 4)}px ${Math.max(px / 2, 4)}px`,
          backgroundPosition: `0 0, 0 ${Math.max(px / 4, 2)}px, ${Math.max(px / 4, 2)}px -${Math.max(px / 4, 2)}px, -${Math.max(px / 4, 2)}px 0`,
          backgroundColor: '#1e293b',
        }}
      />
    );
  }
  const isLight = name === '白色' || name === '淡黄色' || name === '緑白色' || name === '青白色';
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: size, height: size,
        backgroundColor: COLOR_PALETTE[name] ?? '#888',
        border: isLight ? '1px solid #64748b' : '1px solid rgba(148, 163, 184, 0.4)',
      }}
    />
  );
}

// =============================================================
// データ: 金属イオン沈殿反応 (v3と同じ)
// =============================================================

type Ion = {
  id: string;
  formula: string;
  name: string;
  aqueous_color: string;
  group: '典型元素' | '遷移元素' | 'アルカリ' | 'アルカリ土類';
  level: 1 | 2 | 3;
};

type Reagent = {
  id: string;
  formula: string;
  short_label: string;
  condition?: string;
  category: '塩化物' | '硫化物' | '水酸化物' | '炭酸塩' | '硫酸塩' | 'クロム酸塩';
  level: 1 | 2 | 3;
};

type Reaction = {
  ion_id: string;
  reagent_id: string;
  result: 'precipitate' | 'complex' | 'no_reaction' | 'redissolve' | 'colored_solution' | 'out_of_scope';
  color?: string;
  product?: string;
  note?: string;
  sequence_group?: string;
  sequence_order?: number;
};

const IONS: Ion[] = [
  { id: 'ag',  formula: 'Ag⁺',   name: '銀イオン',         aqueous_color: '無色',   group: '典型元素',   level: 1 },
  { id: 'pb',  formula: 'Pb²⁺',  name: '鉛(II)イオン',     aqueous_color: '無色',   group: '典型元素',   level: 1 },
  { id: 'cu',  formula: 'Cu²⁺',  name: '銅(II)イオン',     aqueous_color: '青色',   group: '遷移元素',   level: 1 },
  { id: 'fe2', formula: 'Fe²⁺',  name: '鉄(II)イオン',     aqueous_color: '淡緑色', group: '遷移元素',   level: 1 },
  { id: 'fe3', formula: 'Fe³⁺',  name: '鉄(III)イオン',    aqueous_color: '黄褐色', group: '遷移元素',   level: 1 },
  { id: 'al',  formula: 'Al³⁺',  name: 'アルミニウムイオン', aqueous_color: '無色',  group: '典型元素',   level: 1 },
  { id: 'zn',  formula: 'Zn²⁺',  name: '亜鉛イオン',       aqueous_color: '無色',   group: '典型元素',   level: 1 },
  { id: 'ca',  formula: 'Ca²⁺',  name: 'カルシウムイオン', aqueous_color: '無色',   group: 'アルカリ土類', level: 1 },
  { id: 'ba',  formula: 'Ba²⁺',  name: 'バリウムイオン',   aqueous_color: '無色',   group: 'アルカリ土類', level: 1 },
  { id: 'na',  formula: 'Na⁺',   name: 'ナトリウムイオン', aqueous_color: '無色',   group: 'アルカリ',   level: 1 },
  { id: 'k',   formula: 'K⁺',    name: 'カリウムイオン',   aqueous_color: '無色',   group: 'アルカリ',   level: 1 },
];

const REAGENTS: Reagent[] = [
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

const REACTIONS: Reaction[] = [
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

function getReactions(ionId: string, reagentId: string): Reaction[] {
  return REACTIONS.filter(r => r.ion_id === ionId && r.reagent_id === reagentId);
}
function getSequenceFor(ionId: string, reagentId: string): Reaction[] | null {
  const r = REACTIONS.find(x => x.ion_id === ionId && x.reagent_id === reagentId);
  if (!r || !r.sequence_group) return null;
  return REACTIONS
    .filter(x => x.sequence_group === r.sequence_group)
    .sort((a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0));
}

// =============================================================
// メインアプリ
// =============================================================

type Screen =
  | { kind: 'home' }
  | { kind: 'view_ion' }
  | { kind: 'view_reagent' }
  | { kind: 'view_matrix' }
  | { kind: 'quiz_ion' }
  | { kind: 'quiz_reagent' }
  | { kind: 'quiz_color' };

export default function ChemMemoryApp() {
  const [screen, setScreen] = useState<Screen>({ kind: 'home' });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header screen={screen} setScreen={setScreen} />
        <div className="mt-6">
          {screen.kind === 'home'         && <Home setScreen={setScreen} />}
          {screen.kind === 'view_ion'     && <IonView />}
          {screen.kind === 'view_reagent' && <ReagentView />}
          {screen.kind === 'view_matrix'  && <MatrixView />}
          {screen.kind === 'quiz_ion'     && <QuizIonMode />}
          {screen.kind === 'quiz_reagent' && <QuizReagentMode />}
          {screen.kind === 'quiz_color'   && <QuizColorMode />}
        </div>
      </div>
    </div>
  );
}

function Header({ screen, setScreen }: any) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {screen.kind !== 'home' && (
          <button onClick={() => setScreen({ kind: 'home' })} className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition" aria-label="戻る">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: 'serif' }}>金属イオン沈殿反応</h1>
          <p className="text-xs text-slate-400">上松ゆっくり塾 · 化学暗記帳</p>
        </div>
      </div>
    </header>
  );
}

// =============================================================
// ホーム: 学習ビューとクイズの両方を提供
// =============================================================

function Home({ setScreen }: any) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 border border-blue-500/20" style={{ background: `linear-gradient(135deg, #3b82f622 0%, transparent 60%)` }}>
        <h2 className="text-lg font-bold">金属イオンの沈殿反応</h2>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
          {IONS.length} 種類の金属イオンと {REAGENTS.length} 種類の試薬。まず見て覚え、次にクイズで定着。
        </p>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">学ぶ</h3>
        <div className="space-y-2">
          <CardItem icon={<User size={20} />}        title="イオン中心ビュー"    description="一つのイオンの全反応を縦に並べて見る" onClick={() => setScreen({ kind: 'view_ion' })} />
          <CardItem icon={<FlaskConical size={20} />} title="試薬中心ビュー"      description="一つの試薬で沈殿するイオンを一覧" onClick={() => setScreen({ kind: 'view_reagent' })} />
          <CardItem icon={<Grid3x3 size={20} />}     title="俯瞰マトリックス"    description="資料集と同じ全体表(横スクロール)" onClick={() => setScreen({ kind: 'view_matrix' })} />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">解く(クイズ)</h3>
        <div className="space-y-2">
          <CardItem icon={<Brain size={20} />}  accent="orange" title="イオン中心クイズ" description="Cu²⁺ + NH₃少量 → ? を当てる" onClick={() => setScreen({ kind: 'quiz_ion' })} />
          <CardItem icon={<Target size={20} />} accent="orange" title="試薬中心クイズ" description="S²⁻塩基性で黒沈殿するイオンを全部選ぶ(複数)" onClick={() => setScreen({ kind: 'quiz_reagent' })} />
          <CardItem icon={<Palette size={20} />} accent="orange" title="色クイズ"       description="この色の沈殿はどの組合せ?(複数)" onClick={() => setScreen({ kind: 'quiz_color' })} />
        </div>
      </section>
    </div>
  );
}

function CardItem({ icon, title, description, onClick, accent = 'blue' }: any) {
  const accentClass = accent === 'orange'
    ? 'bg-orange-500/10 text-orange-300 group-hover:bg-orange-500/20'
    : 'bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20';
  return (
    <button onClick={onClick} className="w-full text-left rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition group">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg transition ${accentClass}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}

// =============================================================
// 学習ビュー (v3と同じなので簡潔に再掲)
// =============================================================

function IonView() {
  const [selectedIon, setSelectedIon] = useState<string>('cu');
  const ion = IONS.find(i => i.id === selectedIon)!;
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {IONS.map(i => (
            <button key={i.id} onClick={() => setSelectedIon(i.id)} className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold whitespace-nowrap transition ${selectedIon === i.id ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'}`}>
              {i.formula}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="text-3xl font-mono font-bold text-blue-300">{ion.formula}</div>
            <div className="text-sm text-slate-400 mt-1">{ion.name} · {ion.group}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">水溶液:</span>
            <ChipSwatch name={ion.aqueous_color} size={16} />
            <span className="text-slate-200">{ion.aqueous_color}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {REAGENTS.map(reagent => {
          const sequence = getSequenceFor(ion.id, reagent.id);
          if (sequence && sequence.length > 1) {
            const isFirst = sequence[0].reagent_id === reagent.id;
            if (!isFirst) return null;
            return <SequenceReactionRow key={reagent.id} reagent={reagent} sequence={sequence} />;
          }
          const reactions = getReactions(ion.id, reagent.id);
          if (reactions.length === 0) return null;
          return <SingleReactionRow key={reagent.id} reagent={reagent} reaction={reactions[0]} />;
        })}
      </div>
    </div>
  );
}

function SingleReactionRow({ reagent, reaction }: { reagent: Reagent; reaction: Reaction }) {
  return (
    <div className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
      <div className="w-24 flex-shrink-0">
        <div className="font-mono text-sm font-semibold text-slate-200">{reagent.short_label}</div>
      </div>
      <div className="flex-1 min-w-0"><ReactionResult reaction={reaction} /></div>
    </div>
  );
}

function SequenceReactionRow({ reagent, sequence }: { reagent: Reagent; sequence: Reaction[] }) {
  const baseLabel = reagent.short_label.replace(/\s*(少量|過剰|酸性|塩基性)$/, '');
  return (
    <div className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-24 flex-shrink-0">
          <div className="font-mono text-sm font-semibold text-slate-200">{baseLabel}</div>
          <div className="text-xs text-slate-500">少量 → 過剰</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap pl-1">
        {sequence.map((r, i) => {
          const reg = REAGENTS.find(x => x.id === r.reagent_id)!;
          return (
            <React.Fragment key={i}>
              <div className="inline-flex flex-col items-start">
                <div className="text-[10px] text-slate-500 mb-0.5">{reg.condition ?? ''}</div>
                <ReactionResult reaction={r} compact />
              </div>
              {i < sequence.length - 1 && <ArrowRight size={14} className="text-slate-500 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ReactionResult({ reaction, compact = false }: { reaction: Reaction; compact?: boolean }) {
  if (reaction.result === 'no_reaction')   return <span className="text-xs text-slate-600">沈殿しない</span>;
  if (reaction.result === 'out_of_scope')  return <span className="text-xs text-slate-700 italic">範囲外</span>;
  const labelByResult: Record<string, string> = { precipitate: '沈殿', complex: '溶解(錯イオン)', redissolve: '再溶解', colored_solution: '溶液' };
  const resultLabel = labelByResult[reaction.result] ?? '';
  const isSolution = reaction.result === 'complex' || reaction.result === 'redissolve';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${compact ? 'text-xs' : 'text-sm'} ${isSolution ? 'bg-cyan-900/30 border border-cyan-800/50' : 'bg-slate-800/60'}`}>
      {reaction.color && <ChipSwatch name={reaction.color} size={compact ? 10 : 12} />}
      <span className="text-slate-200">{reaction.color}</span>
      {reaction.product && <span className="font-mono text-slate-400 text-[11px]">{reaction.product}</span>}
      {!compact && <span className="text-[10px] text-slate-500">{resultLabel}</span>}
    </span>
  );
}

function ReagentView() {
  const [selectedReagent, setSelectedReagent] = useState<string>('nh3_few');
  const reagent = REAGENTS.find(r => r.id === selectedReagent)!;
  const reactionsByIon = IONS.map(ion => {
    const r = REACTIONS.find(x => x.ion_id === ion.id && x.reagent_id === reagent.id);
    return { ion, reaction: r };
  });
  const precipitating = reactionsByIon.filter(x => x.reaction && (x.reaction.result === 'precipitate' || x.reaction.result === 'complex' || x.reaction.result === 'redissolve'));
  const noReaction    = reactionsByIon.filter(x => x.reaction && x.reaction.result === 'no_reaction');
  const outOfScope    = reactionsByIon.filter(x => x.reaction && x.reaction.result === 'out_of_scope');
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {REAGENTS.map(r => (
            <button key={r.id} onClick={() => setSelectedReagent(r.id)} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition ${selectedReagent === r.id ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'}`}>
              {r.short_label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/50">
        <div className="text-2xl font-mono font-bold text-blue-300">{reagent.formula}</div>
        <div className="text-sm text-slate-400 mt-1">{reagent.category}</div>
      </div>
      {precipitating.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-rose-300 mb-2 uppercase tracking-wide">沈殿・反応するイオン</h3>
          <div className="space-y-2">
            {precipitating.map(({ ion, reaction }) => (
              <div key={ion.id} className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
                <div className="w-20 flex-shrink-0"><div className="font-mono text-sm font-bold text-blue-300">{ion.formula}</div></div>
                <div className="flex-1 min-w-0">
                  <ReactionResult reaction={reaction!} />
                  {reaction!.note && <div className="text-[11px] text-slate-500 italic mt-1">{reaction!.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {noReaction.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">反応しないイオン</h3>
          <div className="flex flex-wrap gap-1.5">
            {noReaction.map(({ ion }) => (<span key={ion.id} className="px-2 py-1 rounded bg-slate-800/40 border border-slate-800/60 font-mono text-xs text-slate-400">{ion.formula}</span>))}
          </div>
        </div>
      )}
      {outOfScope.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">高校範囲外</h3>
          <div className="flex flex-wrap gap-1.5">
            {outOfScope.map(({ ion }) => (<span key={ion.id} className="px-2 py-1 rounded bg-slate-900/40 border border-slate-900 font-mono text-xs text-slate-600">{ion.formula}</span>))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatrixView() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400">試薬(縦軸) × 金属イオン(横軸)。横にスクロールできます。</div>
      <div className="overflow-x-auto -mx-4 px-4 rounded-xl">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-900 text-slate-300 px-2 py-1.5 text-left font-semibold border-b border-slate-700">試薬</th>
              {IONS.map(ion => (
                <th key={ion.id} className="bg-slate-900 px-2 py-1.5 font-mono text-slate-300 border-b border-slate-700 whitespace-nowrap">
                  <div>{ion.formula}</div>
                  <div className="text-[9px] font-sans font-normal text-slate-500 mt-0.5 flex items-center gap-1 justify-center">
                    <ChipSwatch name={ion.aqueous_color} size={8} />
                    <span>{ion.aqueous_color}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REAGENTS.map((reagent, ri) => (
              <tr key={reagent.id} className={ri % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/50'}>
                <td className={`sticky left-0 z-10 px-2 py-1.5 font-mono font-semibold text-slate-200 whitespace-nowrap border-r border-slate-800 ${ri % 2 === 0 ? 'bg-slate-900/95' : 'bg-slate-900'}`}>{reagent.short_label}</td>
                {IONS.map(ion => {
                  const r = REACTIONS.find(x => x.ion_id === ion.id && x.reagent_id === reagent.id);
                  return (
                    <td key={ion.id} className="px-2 py-1.5 text-center border-r border-slate-800/40 align-middle">
                      {!r ? <span className="text-slate-700">·</span> :
                       r.result === 'no_reaction' ? <span className="text-slate-600">×</span> :
                       r.result === 'out_of_scope' ? <span className="text-slate-700">/</span> :
                       r.color ? (
                        <div className="flex items-center gap-1 justify-center">
                          <ChipSwatch name={r.color} size={10} />
                          <span className="text-[10px] text-slate-300 whitespace-nowrap">{r.color.replace('色', '')}</span>
                        </div>
                       ) : <span className="text-slate-500">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-slate-500 mt-3 space-y-1">
        <div>× : 反応しない / 沈殿しない</div>
        <div className="text-slate-600">/ : 高校範囲外</div>
      </div>
    </div>
  );
}

// =============================================================
// クイズ共通: 結果表示
// =============================================================

type QuizResult = 'correct' | 'wrong' | null;

function QuizFeedback({ result, message }: { result: QuizResult; message?: string }) {
  if (!result) return null;
  return (
    <div className={`rounded-xl p-3 flex items-center gap-2 font-bold ${result === 'correct' ? 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-200' : 'bg-rose-900/40 border border-rose-700/50 text-rose-200'}`}>
      {result === 'correct' ? <Check size={18} /> : <X size={18} />}
      <span>{result === 'correct' ? '正解!' : '不正解'}</span>
      {message && <span className="font-normal text-sm ml-2">{message}</span>}
    </div>
  );
}

function QuizScore({ correct, total }: { correct: number; total: number }) {
  return (
    <div className="text-xs text-slate-500 text-center">
      正答 {correct} / {total} ({total === 0 ? 0 : Math.round(correct / total * 100)}%)
    </div>
  );
}

// =============================================================
// クイズ1: イオン中心 (Cu²⁺ + NH₃少量 → ?)
// =============================================================
//
// 設計:
//   - 出題: ランダムにイオン×試薬を選ぶ。段階反応は「少量」だけ出題(過剰は次の問題で別途出題)
//   - 選択肢: 4択 (正解 + 似た色のダミー3つ、または「沈殿しない」)
//   - 正解判定: result + color の組合せ
//

type IonQuizQuestion = {
  ion: Ion;
  reagent: Reagent;
  correctReaction: Reaction;
  options: Array<{ label: string; color?: string; product?: string; isCorrect: boolean }>;
};

function buildIonQuestion(): IonQuizQuestion {
  // out_of_scope を除く reactions からランダム選択
  const candidates = REACTIONS.filter(r => r.result !== 'out_of_scope');
  const correct = candidates[Math.floor(Math.random() * candidates.length)];
  const ion = IONS.find(i => i.id === correct.ion_id)!;
  const reagent = REAGENTS.find(r => r.id === correct.reagent_id)!;

  // 選択肢ラベルの作成
  // - 沈殿/錯イオン/再溶解: 色 + 状態 (例: 「青白色 沈殿」)
  // - 沈殿しない: シンプルな「沈殿しない」
  // ラベル(画面表示)は色と状態のみで構成される。化学式は別フィールド product で保持し、解答後にのみ表示する。
  const buildLabel = (r: Reaction): { label: string; color?: string; product?: string } => {
    if (r.result === 'no_reaction') return { label: '沈殿しない' };
    if (r.color) {
      const suffix = r.result === 'complex' ? '溶液 (錯イオン)' : r.result === 'redissolve' ? '溶液 (再溶解)' : '沈殿';
      return { label: `${r.color}${suffix}`, color: r.color, product: r.product };
    }
    return { label: '—' };
  };

  // 表示ラベル用のキー(画面に出る部分のみ)。これで一意性を判定する。
  // 色も状態も同じなら、化学式が違っても「同じ選択肢」とみなして重複させない。
  const labelKey = (r: Reaction): string => {
    if (r.result === 'no_reaction') return '沈殿しない';
    return `${r.color ?? ''}|${r.result}`;
  };

  // ダミーを作る: 同じ試薬の他の結果から優先的に3つ
  const correctLabelKey = labelKey(correct);
  const sameReagentResults = REACTIONS.filter(r =>
    r.reagent_id === reagent.id &&
    r.result !== 'out_of_scope' &&
    labelKey(r) !== correctLabelKey
  );
  const usedKeys = new Set<string>([correctLabelKey]);
  const distractors: Array<{ label: string; color?: string; product?: string }> = [];
  sameReagentResults.sort(() => Math.random() - 0.5);
  for (const r of sameReagentResults) {
    const k = labelKey(r);
    if (usedKeys.has(k)) continue;
    usedKeys.add(k);
    distractors.push(buildLabel(r));
    if (distractors.length >= 3) break;
  }

  // ダミーが3個に満たない場合、他の試薬の結果からも候補を借りる
  // (例: S²⁻酸性で黒沈殿が出題されると、同じ試薬では「沈殿しない」しか他の結果がない)
  if (distractors.length < 3) {
    const otherReagentResults = REACTIONS.filter(r =>
      r.reagent_id !== reagent.id &&
      r.result !== 'out_of_scope' &&
      !usedKeys.has(labelKey(r))
    );
    otherReagentResults.sort(() => Math.random() - 0.5);
    for (const r of otherReagentResults) {
      const k = labelKey(r);
      if (usedKeys.has(k)) continue;
      usedKeys.add(k);
      distractors.push(buildLabel(r));
      if (distractors.length >= 3) break;
    }
  }

  // 「沈殿しない」を必ず含める(まだない場合)
  const hasNoReactionDistractor = distractors.some(d => d.label === '沈殿しない');
  if (correct.result !== 'no_reaction' && !hasNoReactionDistractor && distractors.length > 0) {
    distractors[distractors.length - 1] = { label: '沈殿しない' };
  }

  const correctLabel = buildLabel(correct);
  const options = [...distractors.slice(0, 3), correctLabel]
    .sort(() => Math.random() - 0.5)
    .map(o => ({ ...o, isCorrect: o.label === correctLabel.label }));

  return { ion, reagent, correctReaction: correct, options };
}

function QuizIonMode() {
  const [question, setQuestion] = useState(() => buildIonQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setScore(s => ({ correct: s.correct + (question.options[i].isCorrect ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => { setQuestion(buildIonQuestion()); setPicked(null); };

  const { ion, reagent, correctReaction, options } = question;
  const result: QuizResult = picked === null ? null : options[picked].isCorrect ? 'correct' : 'wrong';

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      {/* 問題文 */}
      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-2">次の組合せで起きる現象は?</div>
        <div className="flex items-center justify-center gap-3 text-2xl font-mono font-bold">
          <span className="text-blue-300">{ion.formula}</span>
          <span className="text-slate-500">+</span>
          <span className="text-slate-200">{reagent.formula}</span>
        </div>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = picked !== null && opt.isCorrect;
          const showWrong   = picked !== null && isPicked && !opt.isCorrect;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect)      cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong)   cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';

          // ラベルから色名+状態と化学式部分を分離して表示
          const isNoReaction = opt.label === '沈殿しない';
          // label は "青白色沈殿  Cu(OH)₂" のような形式。スペース2個で分割する
          const labelMain = isNoReaction ? '沈殿しない' : opt.label.replace(/\s\s.*$/, '');
          return (
            <button key={i} onClick={() => handlePick(i)} className={`w-full p-3 rounded-xl border transition flex items-center gap-3 text-left ${cls}`}>
              {opt.color ? <ChipSwatch name={opt.color} size={20} /> : <div className="w-5 h-5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{labelMain}</div>
                {picked !== null && opt.product && (
                  <div className="font-mono text-xs text-slate-400 mt-0.5">{opt.product}</div>
                )}
              </div>
              {showCorrect && <Check size={18} className="text-emerald-300 flex-shrink-0" />}
              {showWrong && <X size={18} className="text-rose-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* 解説 + 次へ */}
      {picked !== null && (
        <div className="space-y-3">
          {correctReaction.product && (
            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-sm">
              <span className="text-slate-500">生成物: </span>
              <span className="font-mono font-bold text-slate-200">{correctReaction.product}</span>
              {correctReaction.note && <div className="text-xs text-slate-500 italic mt-1">{correctReaction.note}</div>}
            </div>
          )}
          <button onClick={next} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-bold flex items-center justify-center gap-2">
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================
// クイズ2: 試薬中心 (S²⁻塩基性で黒沈殿するイオンを全部選ぶ)
// =============================================================
//
// 設計:
//   - 出題: ランダムに「試薬 + 色」の組合せを選ぶ
//   - 解答: 該当するイオンを複数選択
//   - 正解判定: 選んだイオンの集合 == 正解イオン集合 (完全一致)
//   - 提出ボタンを押した時に判定
//

type ReagentQuizQuestion = {
  reagent: Reagent;
  targetColor: string;
  correctIonIds: Set<string>;
  candidateIons: Ion[];
};

function buildReagentQuestion(): ReagentQuizQuestion {
  // (試薬, 色) → イオンID集合の対応を作る
  const buckets = new Map<string, { reagent: Reagent; color: string; ions: Set<string> }>();
  for (const r of REACTIONS) {
    if (r.result !== 'precipitate' || !r.color) continue;
    const reg = REAGENTS.find(x => x.id === r.reagent_id)!;
    const key = `${reg.id}|${r.color}`;
    if (!buckets.has(key)) buckets.set(key, { reagent: reg, color: r.color, ions: new Set() });
    buckets.get(key)!.ions.add(r.ion_id);
  }
  // バケットからランダム選択(イオン数が1〜5のものだけ。あまり一意すぎず、多すぎず)
  const list = [...buckets.values()].filter(b => b.ions.size >= 1 && b.ions.size <= 6);
  const target = list[Math.floor(Math.random() * list.length)];

  // 候補イオン: その試薬で何らかの反応(沈殿/反応なし含む)を持つイオン全て
  const candidateIds = new Set<string>();
  for (const r of REACTIONS) {
    if (r.reagent_id !== target.reagent.id) continue;
    if (r.result === 'out_of_scope') continue;
    candidateIds.add(r.ion_id);
  }
  const candidateIons = IONS.filter(i => candidateIds.has(i.id));

  return {
    reagent: target.reagent,
    targetColor: target.color,
    correctIonIds: target.ions,
    candidateIons,
  };
}

function QuizReagentMode() {
  const [question, setQuestion] = useState(() => buildReagentQuestion());
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const toggle = (id: string) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const isCorrect = picked.size === question.correctIonIds.size && [...picked].every(id => question.correctIonIds.has(id));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setQuestion(buildReagentQuestion());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect = submitted && picked.size === question.correctIonIds.size && [...picked].every(id => question.correctIonIds.has(id));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50">
        <div className="text-xs text-slate-500 mb-2">次の試薬で <span className="inline-flex items-center gap-1 align-middle"><ChipSwatch name={question.targetColor} size={12} /><span className="font-bold text-slate-200">{question.targetColor}</span></span> の沈殿を作るイオンを<span className="text-amber-300 font-bold">すべて</span>選んでください</div>
        <div className="text-2xl font-mono font-bold text-slate-200 text-center mt-2">{question.reagent.formula}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {question.candidateIons.map(ion => {
          const isPicked = picked.has(ion.id);
          const isCorrect = question.correctIonIds.has(ion.id);
          // 答え合わせ時、この (ion, reagent) の反応から生成物を取得
          const reactionForIon = REACTIONS.find(r =>
            r.ion_id === ion.id &&
            r.reagent_id === question.reagent.id &&
            r.result === 'precipitate' &&
            r.color === question.targetColor
          );
          const product = reactionForIon?.product;

          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (submitted) {
            if (isCorrect && isPicked)  cls = 'bg-emerald-900/50 border-emerald-600/60';
            else if (isCorrect)         cls = 'bg-emerald-900/20 border-emerald-700/40';
            else if (isPicked)          cls = 'bg-rose-900/50 border-rose-600/60';
            else                        cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          } else if (isPicked) {
            cls = 'bg-blue-600/40 border-blue-500/60';
          }
          return (
            <button key={ion.id} onClick={() => toggle(ion.id)} className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${cls}`}>
              <span className="font-mono font-bold text-blue-300">{ion.formula}</span>
              {submitted && isCorrect && product && (
                <span className="font-mono text-[10px] text-slate-300 mt-0.5 whitespace-nowrap">{product}</span>
              )}
              {submitted && isCorrect && !isPicked && <span className="text-[10px] text-emerald-400">選び忘れ</span>}
              {submitted && !isCorrect && isPicked && <span className="text-[10px] text-rose-400">違う</span>}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button onClick={submit} disabled={picked.size === 0} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition font-bold">
          答え合わせ
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback result={isAllCorrect ? 'correct' : 'wrong'} message={isAllCorrect ? '完璧!' : `正解は ${[...question.correctIonIds].map(id => IONS.find(i => i.id === id)!.formula).join('・')}`} />
          <button onClick={next} className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition font-bold flex items-center justify-center gap-2">
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================
// クイズ3: 色クイズ (この色の沈殿を作る組合せを全部選ぶ)
// =============================================================
//
// 設計 (v5: 案A 選択肢を減らす):
//   - 出題: ランダムに「色」を選ぶ
//   - 解答: その色の沈殿を作る (イオン, 試薬) ペアをすべて選ぶ
//   - 候補: 正解2〜3個 + ダミー4〜5個 = 計6〜8個
//   - 正解ペアが3個を超える色は、3個までランダムサンプルして出題
//   - 正解判定: 完全一致
//

type ColorQuizQuestion = {
  targetColor: string;
  correctPairs: Set<string>;   // "ion_id|reagent_id" の集合
  candidatePairs: Array<{ ion: Ion; reagent: Reagent; color: string; product?: string }>;
};

// 出題に使う最大正解ペア数とダミー数
const MAX_CORRECT_PAIRS = 3;
const NUM_DISTRACTORS = 5;

function buildColorQuestion(): ColorQuizQuestion {
  // 沈殿色ごとに (イオン, 試薬) のペアを集める
  type Pair = { ion: Ion; reagent: Reagent; color: string; product?: string };
  const pairsByColor = new Map<string, Pair[]>();
  for (const r of REACTIONS) {
    if (r.result !== 'precipitate' || !r.color) continue;
    const ion = IONS.find(i => i.id === r.ion_id)!;
    const reagent = REAGENTS.find(x => x.id === r.reagent_id)!;
    if (!pairsByColor.has(r.color)) pairsByColor.set(r.color, []);
    pairsByColor.get(r.color)!.push({ ion, reagent, color: r.color, product: r.product });
  }
  // ペア数2個以上の色を出題対象に(1個だと「選択肢に紛れて隠す」が成立しない)
  // 上限は外す: 正解が多い色(白色など)も、サンプリングで3個に絞って出題できる
  const eligibleColors = [...pairsByColor.entries()].filter(([_, ps]) => ps.length >= 2);
  const [targetColor, allCorrectPairs] = eligibleColors[Math.floor(Math.random() * eligibleColors.length)];

  // 正解ペアが多すぎる場合は MAX_CORRECT_PAIRS 個までランダムサンプル
  const correctPairsArr = [...allCorrectPairs].sort(() => Math.random() - 0.5).slice(0, MAX_CORRECT_PAIRS);
  const correctPairs = new Set(correctPairsArr.map(p => `${p.ion.id}|${p.reagent.id}`));

  // ダミー: 他色のペアから NUM_DISTRACTORS 個ランダム抽出
  const otherPairs: Pair[] = [];
  for (const [color, ps] of pairsByColor.entries()) {
    if (color === targetColor) continue;
    otherPairs.push(...ps);
  }
  otherPairs.sort(() => Math.random() - 0.5);
  const distractors = otherPairs.slice(0, NUM_DISTRACTORS);

  const candidatePairs = [...correctPairsArr, ...distractors].sort(() => Math.random() - 0.5);

  return { targetColor, correctPairs, candidatePairs };
}

function QuizColorMode() {
  const [question, setQuestion] = useState(() => buildColorQuestion());
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const toggle = (key: string) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const isCorrect = picked.size === question.correctPairs.size && [...picked].every(k => question.correctPairs.has(k));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setQuestion(buildColorQuestion());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect = submitted && picked.size === question.correctPairs.size && [...picked].every(k => question.correctPairs.has(k));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">この色の沈殿を作る組合せを<span className="text-amber-300 font-bold">すべて</span>選んでください</div>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
          <ChipSwatch name={question.targetColor} size={28} />
          <span className="text-xl font-bold">{question.targetColor}</span>
          <span className="text-sm text-slate-500">の沈殿</span>
        </div>
      </div>

      <div className="space-y-2">
        {question.candidatePairs.map(pair => {
          const key = `${pair.ion.id}|${pair.reagent.id}`;
          const isPicked = picked.has(key);
          const isCorrect = question.correctPairs.has(key);
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (submitted) {
            if (isCorrect && isPicked)  cls = 'bg-emerald-900/50 border-emerald-600/60';
            else if (isCorrect)         cls = 'bg-emerald-900/20 border-emerald-700/40';
            else if (isPicked)          cls = 'bg-rose-900/50 border-rose-600/60';
            else                        cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          } else if (isPicked) {
            cls = 'bg-blue-600/40 border-blue-500/60';
          }
          return (
            <button key={key} onClick={() => toggle(key)} className={`w-full p-3 rounded-xl border transition flex items-center gap-3 ${cls}`}>
              {/* 左: イオン + 試薬 */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono font-bold text-blue-300 w-14 flex-shrink-0">{pair.ion.formula}</span>
                <span className="text-slate-500 flex-shrink-0">+</span>
                <span className="font-mono text-sm text-slate-300 flex-1 truncate text-left">{pair.reagent.formula}</span>
              </div>
              {/* 中央: 化学式 (生成物) - 答え合わせ後のみ表示 */}
              {submitted && pair.product && (
                <div className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-900/40 flex-shrink-0">
                  {pair.product}
                </div>
              )}
              {/* 右: 答え合わせ後の色表示と判定アイコン */}
              {submitted && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ChipSwatch name={pair.color} size={14} />
                  {isCorrect && isPicked    && <Check size={16} className="text-emerald-300" />}
                  {isCorrect && !isPicked   && <span className="text-[10px] text-emerald-400 font-bold">これも</span>}
                  {!isCorrect && isPicked   && <X size={16} className="text-rose-300" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button onClick={submit} disabled={picked.size === 0} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition font-bold">
          答え合わせ ({picked.size}個 選択中)
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback result={isAllCorrect ? 'correct' : 'wrong'} />
          <button onClick={next} className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition font-bold flex items-center justify-center gap-2">
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}
