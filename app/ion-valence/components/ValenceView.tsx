'use client';

import { useState } from 'react';
import type { ValenceClass } from '../types';
import { IONS, VALENCE_CLASS_ORDER, byValenceClass } from '../lib/data';
import { IonChargeRow } from './IonChargeRow';

export function ValenceView() {
  const [selected, setSelected] = useState<ValenceClass>('1価');
  const items = byValenceClass(selected);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {VALENCE_CLASS_ORDER.map(c => {
          const count = IONS.filter(i => byValenceClass(c).map(x => x.id).includes(i.id)).length;
          if (count === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
                selected === c ? 'bg-orange-600 text-white' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {c} <span className="text-[10px] opacity-70 ml-1">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {items.map(i => <IonChargeRow key={i.id} ion={i} />)}
      </div>
    </div>
  );
}
