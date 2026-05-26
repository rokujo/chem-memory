import { COMPLEXES, LIGAND_ORDER, byLigand } from '../lib/data';
import { ComplexRow } from './ComplexRow';

export function OverviewList() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">全 {COMPLEXES.length} 種類の錯イオンを配位子別に俯瞰。</div>
      {LIGAND_ORDER.map(ligand => {
        const items = byLigand(ligand);
        if (items.length === 0) return null;
        return (
          <section key={ligand}>
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 font-mono">
              {ligand} <span className="text-slate-500 font-normal font-sans">({items.length})</span>
            </h3>
            <div className="space-y-2">
              {items.map(c => <ComplexRow key={c.id} complex={c} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
