'use client';

import { useState } from 'react';
import type { Ligand } from '../types';
import { LIGAND_ORDER, COMPLEXES, byLigand } from '../lib/data';
import { ComplexRow } from './ComplexRow';

const LIGAND_DESCRIPTION: Record<Ligand, string> = {
  'NH₃': 'アンミン錯体: 過剰NH₃水溶液で形成。Ag⁺, Cu²⁺, Zn²⁺ が代表',
  'CN⁻': 'シアニド錯体: 鉄イオンとの錯体は赤血塩/黄血塩として鉄イオン検出に使う',
  'OH⁻': 'ヒドロキシド錯体: 両性元素(Al, Zn, Pb)の水酸化物が過剰NaOHに溶けて形成',
};

export function LigandView() {
  const [selected, setSelected] = useState<Ligand>('NH₃');
  const items = byLigand(selected);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {LIGAND_ORDER.map(l => {
          const count = COMPLEXES.filter(c => c.ligand === l).length;
          if (count === 0) return null;
          const active = selected === l;
          return (
            <button
              key={l}
              onClick={() => setSelected(l)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition font-mono ${
                active ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {l} <span className="text-[10px] opacity-70 ml-1 font-sans">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-400 leading-relaxed">{LIGAND_DESCRIPTION[selected]}</div>

      <div className="space-y-2">
        {items.map(c => <ComplexRow key={c.id} complex={c} />)}
      </div>
    </div>
  );
}
