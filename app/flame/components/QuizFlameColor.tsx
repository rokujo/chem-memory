'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Flame } from '../types';
import { FLAMES } from '../lib/data';
import { COLOR_PALETTE } from '../lib/color-palette';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  flame: Flame;
  options: string[];      // display_color の文字列
  correct: string;
};

function build(): Question {
  const progress = loadProgress();
  const eligible = FLAMES.filter(f => isEligibleToday(getEntry(progress, f.id)));
  const pool = eligible.length > 0 ? eligible : FLAMES;
  const flame = pool[Math.floor(Math.random() * pool.length)];

  // ダミー: 他元素の display_color(同色を除く)からランダム3つ
  const others = FLAMES
    .filter(f => f.id !== flame.id && f.display_color !== flame.display_color)
    .map(f => f.display_color);
  const distractors = [...new Set(others)].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [flame.display_color, ...distractors].sort(() => Math.random() - 0.5);

  return { flame, options, correct: flame.display_color };
}

// display_color から色チップ用の color キーを引く
function chipFor(displayColor: string): string {
  const flame = FLAMES.find(f => f.display_color === displayColor);
  return flame?.color ?? displayColor;
}

export function QuizFlameColor() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (value: string) => {
    if (picked !== null) return;
    setPicked(value);
    const isCorrect = value === question.correct;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.flame.id, isCorrect));
  };

  const next = () => {
    setQuestion(build());
    setPicked(null);
  };

  const flameColor = COLOR_PALETTE[question.flame.color] ?? '#888';

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/40">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${flameColor} -10%, transparent 70%)`,
            opacity: picked !== null ? 0.22 : 0,
            transition: 'opacity 0.4s',
          }}
          aria-hidden
        />
        <div className="relative p-5 text-center">
          <div className="text-xs text-slate-500 mb-2">この元素の炎色反応は?</div>
          <div className="text-5xl font-mono font-bold text-slate-100">{question.flame.symbol}</div>
          <div className="text-xs text-slate-400 mt-2">{question.flame.name}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {question.options.map((c, i) => {
          const isPicked = picked === c;
          const showCorrect = picked !== null && c === question.correct;
          const showWrong = picked !== null && isPicked && c !== question.correct;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          return (
            <button
              key={i}
              onClick={() => handlePick(c)}
              className={`p-4 rounded-xl border transition flex items-center gap-3 text-left ${cls}`}
            >
              <ChipSwatch name={chipFor(c)} size={20} />
              <span className="font-semibold flex-1">{c}</span>
              {showCorrect && <Check size={18} className="text-emerald-300 flex-shrink-0" />}
              {showWrong && <X size={18} className="text-rose-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          {question.flame.note && (
            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
              {question.flame.note}
            </div>
          )}
          <button
            onClick={next}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 transition font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}
