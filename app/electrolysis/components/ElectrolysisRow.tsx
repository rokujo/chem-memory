import { ArrowDown, ArrowUp } from 'lucide-react';
import type { Electrolysis } from '../types';

export function ElectrolysisRow({ data }: { data: Electrolysis }) {
  return (
    <div className="rounded-xl p-4 bg-slate-900/40 border border-slate-800/60 space-y-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="min-w-0">
          <div className="font-mono text-base font-bold text-orange-300">{data.electrolyte}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">電極: {data.electrode}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* 陰極(還元) */}
        <div className="rounded-lg p-2.5 bg-cyan-900/20 border border-cyan-800/40">
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-bold mb-1">
            <ArrowDown size={12} /> 陰極(還元)
          </div>
          <div className="font-mono font-bold text-base text-slate-100">{data.cathode_product}</div>
          {data.cathode_note && <div className="text-[10px] text-slate-500 italic mt-1">{data.cathode_note}</div>}
        </div>
        {/* 陽極(酸化) */}
        <div className="rounded-lg p-2.5 bg-rose-900/20 border border-rose-800/40">
          <div className="flex items-center gap-1.5 text-[10px] text-rose-300 font-bold mb-1">
            <ArrowUp size={12} /> 陽極(酸化)
          </div>
          <div className="font-mono font-bold text-base text-slate-100">{data.anode_product}</div>
          {data.anode_note && <div className="text-[10px] text-slate-500 italic mt-1">{data.anode_note}</div>}
        </div>
      </div>
      {data.note && <div className="text-[11px] text-slate-500 italic">{data.note}</div>}
    </div>
  );
}
