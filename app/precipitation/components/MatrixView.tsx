import { IONS, REAGENTS, REACTIONS } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';

export function MatrixView() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400">試薬(縦軸) × 金属イオン(横軸)。横にスクロールできます。</div>
      <div className="overflow-x-auto -mx-4 px-4 rounded-xl">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-900 text-slate-300 px-2 py-1.5 text-left font-semibold border-b border-slate-700">
                試薬
              </th>
              {IONS.map(ion => (
                <th key={ion.id} className="bg-slate-900 px-2 py-1.5 font-mono text-slate-300 border-b border-slate-700 whitespace-nowrap">
                  <div>{ion.formula}</div>
                  <div className="text-[9px] font-sans font-normal text-slate-500 mt-0.5 flex items-center gap-1 justify-center">
                    <ChipSwatch name={ion.aqueous_color} size={8} />
                    <span>{ion.aqueous_color}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REAGENTS.map((reagent, ri) => (
              <tr key={reagent.id} className={ri % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/50'}>
                <td
                  className={`sticky left-0 z-10 px-2 py-1.5 font-mono font-semibold text-slate-200 whitespace-nowrap border-r border-slate-800 ${
                    ri % 2 === 0 ? 'bg-slate-900/95' : 'bg-slate-900'
                  }`}
                >
                  {reagent.short_label}
                </td>
                {IONS.map(ion => {
                  const r = REACTIONS.find(x => x.ion_id === ion.id && x.reagent_id === reagent.id);
                  return (
                    <td key={ion.id} className="px-2 py-1.5 text-center border-r border-slate-800/40 align-middle">
                      {!r ? (
                        <span className="text-slate-700">·</span>
                      ) : r.result === 'no_reaction' ? (
                        <span className="text-slate-600">×</span>
                      ) : r.result === 'out_of_scope' ? (
                        <span className="text-slate-700">/</span>
                      ) : r.color ? (
                        <div className="flex items-center gap-1 justify-center">
                          <ChipSwatch name={r.color} size={10} />
                          <span className="text-[10px] text-slate-300 whitespace-nowrap">{r.color.replace('色', '')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-slate-500 mt-3 space-y-1">
        <div>× : 反応しない / 沈殿しない</div>
        <div className="text-slate-600">/ : 高校範囲外</div>
      </div>
    </div>
  );
}
