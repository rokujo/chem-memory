import type { HalfReaction } from '../types';
import { Equation } from './Equation';

export function HalfReactionRow({ reaction }: { reaction: HalfReaction }) {
  const roleColor =
    reaction.role === '酸化剤'
      ? 'text-rose-300 bg-rose-900/30 border-rose-700/40'
      : 'text-cyan-300 bg-cyan-900/30 border-cyan-700/40';
  return (
    <div className="rounded-xl p-4 bg-slate-900/40 border border-slate-800/60 space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-orange-300">{reaction.reagent_label}</span>
          <span className="text-xs text-slate-400">{reaction.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${roleColor}`}>{reaction.role}</span>
          {reaction.condition !== '-' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400">
              {reaction.condition}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto -mx-1 px-1">
        <Equation reaction={reaction} />
      </div>
      {reaction.note && <div className="text-[11px] text-slate-500 italic">{reaction.note}</div>}
    </div>
  );
}
