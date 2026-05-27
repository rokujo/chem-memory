import type { IonCharge } from '../types';

function chargeBadge(charge: number, primary: boolean): string {
  const tone = primary
    ? 'bg-orange-900/40 border-orange-600/60 text-orange-200'
    : 'bg-slate-800/60 border-slate-700/60 text-slate-300';
  return `text-xs px-2 py-0.5 rounded-full border font-mono font-bold ${tone}`;
}

function ionSuperscript(charge: number): string {
  const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const sign = charge > 0 ? '⁺' : '⁻';
  const abs = Math.abs(charge);
  const num = abs === 1 ? '' : SUP[abs];
  return num + sign;
}

export function IonChargeRow({ ion }: { ion: IonCharge }) {
  return (
    <div className="rounded-xl p-4 bg-slate-900/40 border border-slate-800/60 space-y-2">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-2xl font-bold text-orange-300">{ion.element}</span>
          <span className="text-sm text-slate-300">{ion.name}</span>
        </div>
        <span className="text-[10px] text-slate-500">{ion.group}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ion.charges.map(c => (
          <span key={c} className={chargeBadge(c, c === ion.primary)}>
            {ion.element}{ionSuperscript(c)}
          </span>
        ))}
      </div>
      {ion.notes && (
        <div className="space-y-0.5 pt-1">
          {ion.charges.map(c => {
            const note = ion.notes?.[c];
            if (!note) return null;
            return (
              <div key={c} className="text-[11px] text-slate-500">
                <span className="font-mono text-slate-400">{ion.element}{ionSuperscript(c)}:</span>{' '}
                <span className="italic">{note}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
