'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, Home as HomeIcon, Layers, Grid3x3, Hash, Atom } from 'lucide-react';
import { IONS } from './lib/data';
import { loadProgress, summarize, type ProgressSummary } from './lib/progress';
import { ValenceView } from './components/ValenceView';
import { OverviewList } from './components/OverviewList';
import { QuizCharges } from './components/QuizCharges';
import { QuizElements } from './components/QuizElements';

type Screen =
  | { kind: 'home' }
  | { kind: 'view_valence' }
  | { kind: 'view_overview' }
  | { kind: 'quiz_charges' }
  | { kind: 'quiz_elements' };

export default function IonValencePage() {
  const [screen, setScreen] = useState<Screen>({ kind: 'home' });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header screen={screen} onHome={() => setScreen({ kind: 'home' })} />
        <div className="mt-6">
          {screen.kind === 'home' && <Home setScreen={setScreen} />}
          {screen.kind === 'view_valence' && <ValenceView />}
          {screen.kind === 'view_overview' && <OverviewList />}
          {screen.kind === 'quiz_charges' && <QuizCharges />}
          {screen.kind === 'quiz_elements' && <QuizElements />}
        </div>
      </div>
    </div>
  );
}

function Header({ screen, onHome }: { screen: Screen; onHome: () => void }) {
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        {screen.kind !== 'home' && (
          <button
            onClick={onHome}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition flex-shrink-0"
            aria-label="単元ホームに戻る"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-wide truncate" style={{ fontFamily: 'serif' }}>
            金属イオンの価数
          </h1>
          <p className="text-xs text-slate-400">上松ゆっくり塾 · 化学暗記帳</p>
        </div>
      </div>
      <Link
        href="/"
        className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition text-xs text-slate-300"
        aria-label="化学暗記帳トップへ"
      >
        <HomeIcon size={14} />
        <span className="hidden sm:inline">化学暗記帳</span>
      </Link>
    </header>
  );
}

function Home({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    setSummary(summarize(loadProgress()));
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5 border border-orange-500/20"
        style={{ background: 'linear-gradient(135deg, #f9731622 0%, transparent 60%)' }}
      >
        <h2 className="text-lg font-bold">主要金属イオンの価数</h2>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
          {IONS.length} 元素の取り得る価数。Fe(2/3), Cu(1/2), Sn(2/4), Pb(2/4), Cr(3/6), Mn(2/4/7) など
          多価金属の覚え方を中心に。
        </p>
      </div>

      {summary && summary.total > 0 && <ProgressStrip summary={summary} />}

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">学ぶ</h3>
        <div className="space-y-2">
          <CardItem
            icon={<Layers size={20} />}
            title="価数別ビュー"
            description="1価/2価/3価/多価 のタブで分類"
            onClick={() => setScreen({ kind: 'view_valence' })}
          />
          <CardItem
            icon={<Grid3x3 size={20} />}
            title="俯瞰一覧"
            description="価数別の見出し付きで全元素を見る"
            onClick={() => setScreen({ kind: 'view_overview' })}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">解く(クイズ・複数選択)</h3>
        <div className="space-y-2">
          <CardItem
            icon={<Hash size={20} />}
            title="元素→価数クイズ"
            description="Fe は何価のイオンになる? を複数選択"
            onClick={() => setScreen({ kind: 'quiz_charges' })}
          />
          <CardItem
            icon={<Atom size={20} />}
            title="価数→元素クイズ"
            description="2価のイオンになるのは? を複数選択"
            onClick={() => setScreen({ kind: 'quiz_elements' })}
          />
        </div>
      </section>
    </div>
  );
}

function ProgressStrip({ summary }: { summary: ProgressSummary }) {
  const masteredPct = Math.round((summary.masteredCount / summary.total) * 100);
  return (
    <div className="rounded-2xl p-4 bg-slate-800/30 border border-slate-700/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">学習状況</span>
        <span className="text-xs text-slate-500">正答率 {summary.accuracyPct}%</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-900/60">
        {summary.masteredCount > 0 && (
          <div className="bg-emerald-500" style={{ width: `${(summary.masteredCount / summary.total) * 100}%` }} />
        )}
        {summary.learningCount > 0 && (
          <div className="bg-orange-500" style={{ width: `${(summary.learningCount / summary.total) * 100}%` }} />
        )}
        {summary.dueCount > 0 && (
          <div className="bg-amber-500" style={{ width: `${(summary.dueCount / summary.total) * 100}%` }} />
        )}
        {summary.newCount > 0 && (
          <div className="bg-slate-600" style={{ width: `${(summary.newCount / summary.total) * 100}%` }} />
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-400">
        <ProgressLegend color="bg-emerald-500" label="習得" count={summary.masteredCount} />
        <ProgressLegend color="bg-orange-500" label="学習中" count={summary.learningCount} />
        <ProgressLegend color="bg-amber-500" label="復習" count={summary.dueCount} />
        <ProgressLegend color="bg-slate-600" label="未学習" count={summary.newCount} />
        <span className="ml-auto text-slate-500">習得 {masteredPct}% / 全{summary.total}</span>
      </div>
    </div>
  );
}

function ProgressLegend({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span>{label} {count}</span>
    </span>
  );
}

function CardItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-300 group-hover:bg-orange-500/20 transition">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}
