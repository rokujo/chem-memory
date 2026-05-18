'use client';

import { useState, type ReactElement } from 'react';
import type { SubstanceCategory } from '../types';
import { CATEGORY_ORDER, SUBSTANCES, getComparePair, substancesByCategory } from '../lib/data';
import { SubstanceRow } from './SubstanceRow';
import { ComparisonRow } from './ComparisonRow';

export function CategoryView() {
  const [selected, setSelected] = useState<SubstanceCategory>('金属単体');
  const inCategory = substancesByCategory(selected);

  const rendered: ReactElement[] = [];
  const usedGroups = new Set<string>();
  for (const s of inCategory) {
    if (s.compare_group) {
      if (usedGroups.has(s.compare_group)) continue;
      const pair = getComparePair(s);
      if (pair && pair.length >= 2 && pair.every(p => p.category === selected)) {
        usedGroups.add(s.compare_group);
        rendered.push(<ComparisonRow key={`g_${s.compare_group}`} pair={pair} />);
        continue;
      }
    }
    rendered.push(<SubstanceRow key={s.id} substance={s} />);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {CATEGORY_ORDER.map(c => {
            const count = SUBSTANCES.filter(s => s.category === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selected === c ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                {c}
                <span className="ml-1 text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">{rendered}</div>
    </div>
  );
}
