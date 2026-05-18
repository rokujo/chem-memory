import { HALF_REACTIONS, byRole } from '../lib/data';
import { HalfReactionRow } from './HalfReactionRow';

export function OverviewList() {
  const oxidizers = byRole('酸化剤');
  const reducers = byRole('還元剤');

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">全 {HALF_REACTIONS.length} 本の半反応式。酸化剤と還元剤を分けて表示。</div>

      <section>
        <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">
          酸化剤 <span className="text-slate-500 font-normal">({oxidizers.length})</span>
        </h3>
        <div className="space-y-2">
          {oxidizers.map(r => <HalfReactionRow key={r.id} reaction={r} />)}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
          還元剤 <span className="text-slate-500 font-normal">({reducers.length})</span>
        </h3>
        <div className="space-y-2">
          {reducers.map(r => <HalfReactionRow key={r.id} reaction={r} />)}
        </div>
      </section>
    </div>
  );
}
