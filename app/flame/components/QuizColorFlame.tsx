'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Flame } from '../types';
import { FLAMES } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  flame: Flame;
  options: Flame[];
  correct: string;        // 正解の symbol
};

function build(): Question {
  const progress = loadProgress();
  const eligible = FLAMES.filter(f => isEligibleToday(getEntry(progress, f.id)));
  const pool = eligible.length > 0 ? eligible : FLAMES;
  const flame = pool[Math.floor(Math.random() * pool.length)];

  // ダミー: 他元素から3つ
  const distractors = FLAMES
    .filter(f => f.id !== flame.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [flame, ...distractors].sort(() => Math.random() - 0.5);

  return { flame, options, correct: flame.symbol };
}

export function QuizColorFlame() {
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

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">この炎色反応をするのは?</div>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
          <ChipSwatch name={question.flame.color} size={28} />
          <span className="text-xl font-bold">{question.flame.display_color}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {question.options.map((f, i) => {
          const isPicked = picked === f.symbol;
          const showCorrect = picked !== null && f.symbol === question.correct;
          const showWrong = picked !== null && isPicked && f.symbol !== question.correct;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          return (
            <button
              key={i}
              onClick={() => handlePick(f.symbol)}
              className={`p-4 rounded-xl border transition flex items-center gap-3 text-left ${cls}`}
            >
              <span className="font-mono font-bold text-2xl text-slate-100 w-10">{f.symbol}</span>
              <span className="text-sm text-slate-300 flex-1">{f.name}</span>
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
