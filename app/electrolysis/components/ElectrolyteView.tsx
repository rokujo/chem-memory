'use client';

import { useState } from 'react';
import type { ElectrolysisCategory } from '../types';
import { CATEGORY_ORDER, ELECTROLYSIS, byCategory } from '../lib/data';
import { ElectrolysisRow } from './ElectrolysisRow';

export function ElectrolyteView() {
  const [selected, setSelected] = useState<ElectrolysisCategory>('水溶液(不活性電極)');
  const items = byCategory(selected);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {CATEGORY_ORDER.map(c => {
            const count = ELECTROLYSIS.filter(e => e.category === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selected === c ? 'bg-orange-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                {c}
                <span className="ml-1 text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        {items.map(e => <ElectrolysisRow key={e.id} data={e} />)}
      </div>
    </div>
  );
}
