import Link from 'next/link';

type Unit = {
  href: string;
  title: string;
  description: string;
  accent: 'blue' | 'green' | 'orange';
  status: 'ready' | 'wip' | 'planned';
};

const UNITS: Unit[] = [
  {
    href: '/precipitation',
    title: '金属イオンの沈殿反応',
    description: 'イオン10種 × 試薬10種のクロス。三ビュー + クイズ3種',
    accent: 'blue',
    status: 'ready',
  },
  {
    href: '/inorganic-color',
    title: '無機物質・イオンの色',
    description: '金属単体・酸化物・気体・イオンなど。比較ペア重視',
    accent: 'blue',
    status: 'ready',
  },
  {
    href: '/redox',
    title: '酸化還元・半反応式',
    description: '主要な酸化剤・還元剤の半反応式を係数・化学種の穴埋めで',
    accent: 'orange',
    status: 'ready',
  },
  {
    href: '/complex-ion',
    title: '錯イオン形成',
    description: 'NH₃ / CN⁻ / OH⁻ 配位の錯イオン。組成式と色の暗記',
    accent: 'blue',
    status: 'ready',
  },
  {
    href: '/flame',
    title: '炎色反応',
    description: '視覚的に印象的な対応表',
    accent: 'blue',
    status: 'planned',
  },
];

const ACCENT_BORDER: Record<Unit['accent'], string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60',
  green: 'border-emerald-500/30 hover:border-emerald-500/60',
  orange: 'border-orange-500/30 hover:border-orange-500/60',
};

const STATUS_LABEL: Record<Unit['status'], { label: string; cls: string }> = {
  ready: { label: '公開中', cls: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' },
  wip: { label: '準備中', cls: 'bg-amber-900/40 text-amber-300 border border-amber-700/40' },
  planned: { label: '近日', cls: 'bg-slate-800/60 text-slate-500 border border-slate-700/50' },
};

export default function ChemMemoryHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'serif' }}>
            化学暗記帳
          </h1>
          <p className="text-sm text-slate-400 mt-1">上松ゆっくり塾 · 単元一覧</p>
        </header>

        <div className="space-y-2">
          {UNITS.map(u => {
            const status = STATUS_LABEL[u.status];
            const inner = (
              <div className={`rounded-2xl p-4 bg-slate-800/30 border transition ${ACCENT_BORDER[u.accent]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{u.title}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{u.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
            return u.status === 'ready' ? (
              <Link key={u.href} href={u.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={u.href} className="opacity-60 cursor-not-allowed" aria-disabled>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
