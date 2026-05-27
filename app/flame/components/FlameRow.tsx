import type { Flame } from '../types';
import { COLOR_PALETTE } from '../lib/color-palette';
import { ChipSwatch } from './ChipSwatch';

export function FlameRow({ flame }: { flame: Flame }) {
  const flameColor = COLOR_PALETTE[flame.color] ?? '#888';
  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800/60 bg-slate-900/40">
      {/* 炎をイメージしたグラデーション(下から上に向かって発光) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${flameColor} -10%, transparent 70%)`,
          opacity: 0.22,
        }}
        aria-hidden
      />
      <div className="relative p-4 flex items-center gap-4">
        <div className="font-mono font-bold text-3xl text-slate-100 w-14 text-center">{flame.symbol}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-200">{flame.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <ChipSwatch name={flame.color} size={14} />
            <span className="text-sm text-slate-100 font-semibold">{flame.display_color}</span>
          </div>
        </div>
      </div>
      {flame.note && (
        <div className="relative px-4 pb-3 text-[11px] text-slate-400 italic">{flame.note}</div>
      )}
    </div>
  );
}
