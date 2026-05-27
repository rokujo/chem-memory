import { CATEGORY_ORDER, ELECTROLYSIS, byCategory } from '../lib/data';
import { ElectrolysisRow } from './ElectrolysisRow';

export function OverviewList() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">
        全 {ELECTROLYSIS.length} パターンの電気分解。電極の種類(不活性/活性)で陽極側の挙動が変わる。
      </div>
      {CATEGORY_ORDER.map(cat => {
        const items = byCategory(cat);
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <h3 className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-2">
              {cat} <span className="text-slate-500 font-normal">({items.length})</span>
            </h3>
            <div className="space-y-2">
              {items.map(e => <ElectrolysisRow key={e.id} data={e} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
