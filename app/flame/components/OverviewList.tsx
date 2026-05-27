import { FLAMES } from '../lib/data';
import { FlameRow } from './FlameRow';

export function OverviewList() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400">
        全 {FLAMES.length} 元素の炎色。教科書頻出のアルカリ金属・アルカリ土類金属・銅。
      </div>
      <div className="space-y-2">
        {FLAMES.map(f => <FlameRow key={f.id} flame={f} />)}
      </div>
      <div className="text-[11px] text-slate-500 leading-relaxed pt-2">
        ※ 花火の色はこれらの金属塩を組み合わせて作られている(Sr=赤、Ba=緑、Cu=青緑、Na=黄 など)。
      </div>
    </div>
  );
}
