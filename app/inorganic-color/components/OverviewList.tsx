import type { ReactElement } from 'react';
import { CATEGORY_ORDER, SUBSTANCES, getComparePair, substancesByCategory } from '../lib/data';
import { SubstanceRow } from './SubstanceRow';
import { ComparisonRow } from './ComparisonRow';

export function OverviewList() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">全 {SUBSTANCES.length} 種を分野別に俯瞰。比較ペアは黄枠で強調。</div>
      {CATEGORY_ORDER.map(cat => {
        const items = substancesByCategory(cat);
        if (items.length === 0) return null;

        const rendered: ReactElement[] = [];
        const usedGroups = new Set<string>();
        for (const s of items) {
          if (s.compare_group) {
            if (usedGroups.has(s.compare_group)) continue;
            const pair = getComparePair(s);
            if (pair && pair.length >= 2 && pair.every(p => p.category === cat)) {
              usedGroups.add(s.compare_group);
              rendered.push(<ComparisonRow key={`g_${s.compare_group}`} pair={pair} />);
              continue;
            }
          }
          rendered.push(<SubstanceRow key={s.id} substance={s} />);
        }

        return (
          <section key={cat}>
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">{cat} <span className="text-slate-500 font-normal">({items.length})</span></h3>
            <div className="space-y-2">{rendered}</div>
          </section>
        );
      })}
    </div>
  );
}
