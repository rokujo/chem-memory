import type { Complex } from '../types';
import { ChipSwatch } from './ChipSwatch';

export function ComplexRow({ complex }: { complex: Complex }) {
  return (
    <div className="rounded-xl p-4 bg-slate-900/40 border border-slate-800/60 space-y-2">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="min-w-0">
          <div className="font-mono text-lg font-bold text-blue-300">{complex.formula}</div>
          <div className="text-xs text-slate-400 mt-0.5">{complex.name}</div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ChipSwatch name={complex.color} size={14} />
          <span className="text-sm text-slate-200">{complex.color}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
        <span>中心: <span className="font-mono text-slate-300">{complex.center}</span></span>
        <span>配位子: <span className="font-mono text-slate-300">{complex.ligand}</span></span>
        <span>配位数: <span className="text-slate-300">{complex.coord_number}</span></span>
        <span>形: <span className="text-slate-300">{complex.geometry}</span></span>
      </div>
      <div className="text-[11px] text-slate-500">
        <span className="text-slate-600">由来:</span> <span className="font-mono">{complex.source}</span>
      </div>
      {complex.note && <div className="text-[11px] text-slate-500 italic">{complex.note}</div>}
    </div>
  );
}
