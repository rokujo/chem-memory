import type { Substance } from '../types';
import { ChipSwatch } from './ChipSwatch';

export function SubstanceRow({ substance, dim = false }: { substance: Substance; dim?: boolean }) {
  return (
    <div className={`rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 flex items-center gap-3 ${dim ? 'opacity-70' : ''}`}>
      <div className="w-24 flex-shrink-0">
        <div className="font-mono text-sm font-bold text-blue-300">{substance.formula}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{substance.name}</div>
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <ChipSwatch name={substance.color} size={14} />
        <span className="text-sm text-slate-200">{substance.color}</span>
        <span className="text-[10px] text-slate-500 ml-1">{substance.state}</span>
      </div>
      {substance.note && (
        <div className="text-[11px] text-slate-500 italic max-w-[40%] text-right truncate">{substance.note}</div>
      )}
    </div>
  );
}
