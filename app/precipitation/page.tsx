'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, Home as HomeIcon, User, FlaskConical, Grid3x3, Brain, Target, Palette } from 'lucide-react';
import { IONS, REAGENTS } from './lib/data';
import { loadProgress, summarize, type ProgressSummary } from './lib/progress';
import { IonView } from './components/IonView';
import { ReagentView } from './components/ReagentView';
import { MatrixView } from './components/MatrixView';
import { QuizIonMode } from './components/QuizIonMode';
import { QuizReagentMode } from './components/QuizReagentMode';
import { QuizColorMode } from './components/QuizColorMode';

type Screen =
  | { kind: 'home' }
  | { kind: 'view_ion' }
  | { kind: 'view_reagent' }
  | { kind: 'view_matrix' }
  | { kind: 'quiz_ion' }
  | { kind: 'quiz_reagent' }
  | { kind: 'quiz_color' };

export default function PrecipitationPage() {
  const [screen, setScreen] = useState<Screen>({ kind: 'home' });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header screen={screen} onHome={() => setScreen({ kind: 'home' })} />
        <div className="mt-6">
          {screen.kind === 'home' && <Home setScreen={setScreen} />}
          {screen.kind === 'view_ion' && <IonView />}
          {screen.kind === 'view_reagent' && <ReagentView />}
          {screen.kind === 'view_matrix' && <MatrixView />}
          {screen.kind === 'quiz_ion' && <QuizIonMode />}
          {screen.kind === 'quiz_reagent' && <QuizReagentMode />}
          {screen.kind === 'quiz_color' && <QuizColorMode />}
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
            金属イオン沈殿反応
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
        className="rounded-2xl p-5 border border-blue-500/20"
        style={{ background: 'linear-gradient(135deg, #3b82f622 0%, transparent 60%)' }}
      >
        <h2 className="text-lg font-bold">金属イオンの沈殿反応</h2>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
          {IONS.length} 種類の金属イオンと {REAGENTS.length} 種類の試薬。まず見て覚え、次にクイズで定着。
        </p>
      </div>

      {summary && summary.total > 0 && <ProgressStrip summary={summary} />}

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">学ぶ</h3>
        <div className="space-y-2">
          <CardItem
            icon={<User size={20} />}
            title="イオン中心ビュー"
            description="一つのイオンの全反応を縦に並べて見る"
            onClick={() => setScreen({ kind: 'view_ion' })}
          />
          <CardItem
            icon={<FlaskConical size={20} />}
            title="試薬中心ビュー"
            description="一つの試薬で沈殿するイオンを一覧"
            onClick={() => setScreen({ kind: 'view_reagent' })}
          />
          <CardItem
            icon={<Grid3x3 size={20} />}
            title="俯瞰マトリックス"
            description="資料集と同じ全体表(横スクロール)"
            onClick={() => setScreen({ kind: 'view_matrix' })}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">解く(クイズ)</h3>
        <div className="space-y-2">
          <CardItem
            icon={<Brain size={20} />}
            accent="orange"
            title="イオン中心クイズ"
            description="Cu²⁺ + NH₃少量 → ? を当てる"
            onClick={() => setScreen({ kind: 'quiz_ion' })}
          />
          <CardItem
            icon={<Target size={20} />}
            accent="orange"
            title="試薬中心クイズ"
            description="S²⁻塩基性で黒沈殿するイオンを全部選ぶ(複数)"
            onClick={() => setScreen({ kind: 'quiz_reagent' })}
          />
          <CardItem
            icon={<Palette size={20} />}
            accent="orange"
            title="色クイズ"
            description="この色の沈殿はどの組合せ?(複数)"
            onClick={() => setScreen({ kind: 'quiz_color' })}
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
          <div className="bg-blue-500" style={{ width: `${(summary.learningCount / summary.total) * 100}%` }} />
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
        <ProgressLegend color="bg-blue-500" label="学習中" count={summary.learningCount} />
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
  accent = 'blue',
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent?: 'blue' | 'orange';
}) {
  const accentClass =
    accent === 'orange'
      ? 'bg-orange-500/10 text-orange-300 group-hover:bg-orange-500/20'
      : 'bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20';
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition group"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg transition ${accentClass}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}
