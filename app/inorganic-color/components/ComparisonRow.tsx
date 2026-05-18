import { ArrowLeftRight } from 'lucide-react';
import type { Substance } from '../types';
import { ChipSwatch } from './ChipSwatch';

export function ComparisonRow({ pair }: { pair: Substance[] }) {
  return (
    <div className="rounded-xl p-3 bg-amber-900/10 border border-amber-700/30">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeftRight size={14} className="text-amber-300" />
        <span className="text-[11px] text-amber-300 font-semibold">比較ペア</span>
      </div>
      <div className="space-y-1.5">
        {pair.map(s => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="w-20 flex-shrink-0">
              <div className="font-mono text-sm font-bold text-blue-300">{s.formula}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.name}</div>
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <ChipSwatch name={s.color} size={14} />
              <span className="text-sm text-slate-200">{s.color}</span>
              <span className="text-[10px] text-slate-500 ml-1">{s.state}</span>
            </div>
            {s.compare_note && (
              <div className="text-[10px] text-amber-200/70 italic max-w-[35%] text-right truncate">{s.compare_note}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
