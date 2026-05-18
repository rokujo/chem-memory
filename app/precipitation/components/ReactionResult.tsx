import type { Reaction } from '../types';
import { ChipSwatch } from './ChipSwatch';

const RESULT_LABELS: Record<string, string> = {
  precipitate: '沈殿',
  complex: '溶解(錯イオン)',
  redissolve: '再溶解',
  colored_solution: '溶液',
};

export function ReactionResult({ reaction, compact = false }: { reaction: Reaction; compact?: boolean }) {
  if (reaction.result === 'no_reaction') {
    return <span className="text-xs text-slate-600">沈殿しない</span>;
  }
  if (reaction.result === 'out_of_scope') {
    return <span className="text-xs text-slate-700 italic">範囲外</span>;
  }
  const resultLabel = RESULT_LABELS[reaction.result] ?? '';
  const isSolution = reaction.result === 'complex' || reaction.result === 'redissolve';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${compact ? 'text-xs' : 'text-sm'} ${
        isSolution ? 'bg-cyan-900/30 border border-cyan-800/50' : 'bg-slate-800/60'
      }`}
    >
      {reaction.color && <ChipSwatch name={reaction.color} size={compact ? 10 : 12} />}
      <span className="text-slate-200">{reaction.color}</span>
      {reaction.product && <span className="font-mono text-slate-400 text-[11px]">{reaction.product}</span>}
      {!compact && <span className="text-[10px] text-slate-500">{resultLabel}</span>}
    </span>
  );
}
