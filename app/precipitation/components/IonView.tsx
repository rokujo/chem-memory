'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Reagent, Reaction } from '../types';
import { IONS, REAGENTS, getReactions, getSequenceFor } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { ReactionResult } from './ReactionResult';

export function IonView() {
  const [selectedIon, setSelectedIon] = useState<string>('cu');
  const ion = IONS.find(i => i.id === selectedIon)!;
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <div className="flex gap-2 min-w-max">
          {IONS.map(i => (
            <button
              key={i.id}
              onClick={() => setSelectedIon(i.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold whitespace-nowrap transition ${
                selectedIon === i.id ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {i.formula}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="text-3xl font-mono font-bold text-blue-300">{ion.formula}</div>
            <div className="text-sm text-slate-400 mt-1">{ion.name} · {ion.group}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">水溶液:</span>
            <ChipSwatch name={ion.aqueous_color} size={16} />
            <span className="text-slate-200">{ion.aqueous_color}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {REAGENTS.map(reagent => {
          const sequence = getSequenceFor(ion.id, reagent.id);
          if (sequence && sequence.length > 1) {
            const isFirst = sequence[0].reagent_id === reagent.id;
            if (!isFirst) return null;
            return <SequenceReactionRow key={reagent.id} reagent={reagent} sequence={sequence} />;
          }
          const reactions = getReactions(ion.id, reagent.id);
          if (reactions.length === 0) return null;
          return <SingleReactionRow key={reagent.id} reagent={reagent} reaction={reactions[0]} />;
        })}
      </div>
    </div>
  );
}

function SingleReactionRow({ reagent, reaction }: { reagent: Reagent; reaction: Reaction }) {
  return (
    <div className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
      <div className="w-24 flex-shrink-0">
        <div className="font-mono text-sm font-semibold text-slate-200">{reagent.short_label}</div>
      </div>
      <div className="flex-1 min-w-0">
        <ReactionResult reaction={reaction} />
      </div>
    </div>
  );
}

function SequenceReactionRow({ reagent, sequence }: { reagent: Reagent; sequence: Reaction[] }) {
  const baseLabel = reagent.short_label.replace(/\s*(少量|過剰|酸性|塩基性)$/, '');
  return (
    <div className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-24 flex-shrink-0">
          <div className="font-mono text-sm font-semibold text-slate-200">{baseLabel}</div>
          <div className="text-xs text-slate-500">少量 → 過剰</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap pl-1">
        {sequence.map((r, i) => {
          const reg = REAGENTS.find(x => x.id === r.reagent_id)!;
          return (
            <React.Fragment key={i}>
              <div className="inline-flex flex-col items-start">
                <div className="text-[10px] text-slate-500 mb-0.5">{reg.condition ?? ''}</div>
                <ReactionResult reaction={r} compact />
              </div>
              {i < sequence.length - 1 && <ArrowRight size={14} className="text-slate-500 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

