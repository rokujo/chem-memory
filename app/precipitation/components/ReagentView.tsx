'use client';

import { useState } from 'react';
import { IONS, REAGENTS, REACTIONS } from '../lib/data';
import { ReactionResult } from './ReactionResult';

export function ReagentView() {
  const [selectedReagent, setSelectedReagent] = useState<string>('nh3_few');
  const reagent = REAGENTS.find(r => r.id === selectedReagent)!;
  const reactionsByIon = IONS.map(ion => {
    const r = REACTIONS.find(x => x.ion_id === ion.id && x.reagent_id === reagent.id);
    return { ion, reaction: r };
  });
  const precipitating = reactionsByIon.filter(
    x => x.reaction && (x.reaction.result === 'precipitate' || x.reaction.result === 'complex' || x.reaction.result === 'redissolve')
  );
  const noReaction = reactionsByIon.filter(x => x.reaction && x.reaction.result === 'no_reaction');
  const outOfScope = reactionsByIon.filter(x => x.reaction && x.reaction.result === 'out_of_scope');

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {REAGENTS.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReagent(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition ${
                selectedReagent === r.id ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {r.short_label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/50">
        <div className="text-2xl font-mono font-bold text-blue-300">{reagent.formula}</div>
        <div className="text-sm text-slate-400 mt-1">{reagent.category}</div>
      </div>
      {precipitating.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-rose-300 mb-2 uppercase tracking-wide">沈殿・反応するイオン</h3>
          <div className="space-y-2">
            {precipitating.map(({ ion, reaction }) => (
              <div key={ion.id} className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
                <div className="w-20 flex-shrink-0">
                  <div className="font-mono text-sm font-bold text-blue-300">{ion.formula}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <ReactionResult reaction={reaction!} />
                  {reaction!.note && <div className="text-[11px] text-slate-500 italic mt-1">{reaction!.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {noReaction.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">反応しないイオン</h3>
          <div className="flex flex-wrap gap-1.5">
            {noReaction.map(({ ion }) => (
              <span key={ion.id} className="px-2 py-1 rounded bg-slate-800/40 border border-slate-800/60 font-mono text-xs text-slate-400">
                {ion.formula}
              </span>
            ))}
          </div>
        </div>
      )}
      {outOfScope.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">高校範囲外</h3>
          <div className="flex flex-wrap gap-1.5">
            {outOfScope.map(({ ion }) => (
              <span key={ion.id} className="px-2 py-1 rounded bg-slate-900/40 border border-slate-900 font-mono text-xs text-slate-600">
                {ion.formula}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
