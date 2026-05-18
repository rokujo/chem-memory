'use client';

import { useMemo, useState } from 'react';
import { SUBSTANCES, getColors, substancesByColor } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { SubstanceRow } from './SubstanceRow';

export function ColorView() {
  const colors = useMemo(() => {
    const list = getColors();
    return list.sort((a, b) => substancesByColor(b).length - substancesByColor(a).length);
  }, []);
  const [selected, setSelected] = useState<string>(colors[0] ?? '無色');
  const items = substancesByColor(selected);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {colors.map(c => {
            const count = SUBSTANCES.filter(s => s.color === c).length;
            return (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selected === c ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <ChipSwatch name={c} size={12} />
                <span>{c}</span>
                <span className="text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/50 flex items-center gap-3">
        <ChipSwatch name={selected} size={28} />
        <div>
          <div className="text-lg font-bold">{selected}</div>
          <div className="text-xs text-slate-400">この色の物質 {items.length} 種</div>
        </div>
      </div>
      <div className="space-y-2">
        {items.map(s => (
          <SubstanceRow key={s.id} substance={s} />
        ))}
      </div>
    </div>
  );
}
