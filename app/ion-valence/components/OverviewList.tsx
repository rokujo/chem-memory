import { IONS, VALENCE_CLASS_ORDER, byValenceClass } from '../lib/data';
import { IonChargeRow } from './IonChargeRow';

export function OverviewList() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">
        全 {IONS.length} 元素を価数別に分類。
        オレンジ枠は主要価数、灰色枠は副次的に取り得る価数。
      </div>
      {VALENCE_CLASS_ORDER.map(cls => {
        const items = byValenceClass(cls);
        if (items.length === 0) return null;
        return (
          <section key={cls}>
            <h3 className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-2">
              {cls} <span className="text-slate-500 font-normal">({items.length})</span>
            </h3>
            <div className="space-y-2">
              {items.map(i => <IonChargeRow key={i.id} ion={i} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
