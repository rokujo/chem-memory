'use client';

import { useState } from 'react';
import type { Role } from '../types';
import { HALF_REACTIONS, byRole } from '../lib/data';
import { HalfReactionRow } from './HalfReactionRow';

export function RoleView() {
  const [selected, setSelected] = useState<Role>('酸化剤');
  const items = byRole(selected);
  const counts: Record<Role, number> = {
    '酸化剤': byRole('酸化剤').length,
    '還元剤': byRole('還元剤').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['酸化剤', '還元剤'] as Role[]).map(r => {
          const active = selected === r;
          const tone = r === '酸化剤'
            ? (active ? 'bg-rose-600 text-white' : 'bg-rose-900/30 text-rose-300 hover:bg-rose-900/50')
            : (active ? 'bg-cyan-600 text-white' : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-900/50');
          return (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition ${tone}`}
            >
              {r} <span className="text-xs opacity-70 ml-1">{counts[r]}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-500">
        {selected === '酸化剤'
          ? '電子を受け取る側。半反応式の左辺に e⁻ がある'
          : '電子を放出する側。半反応式の右辺に e⁻ がある'}
        {HALF_REACTIONS.some(r => r.reagent_label === 'H₂O₂') &&
          ' (H₂O₂ は相手次第で両方の役割を持つ)'}
      </div>

      <div className="space-y-2">
        {items.map(r => <HalfReactionRow key={r.id} reaction={r} />)}
      </div>
    </div>
  );
}
