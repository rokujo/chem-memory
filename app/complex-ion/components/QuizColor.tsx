'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Complex } from '../types';
import { COMPLEXES } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  complex: Complex;
  options: string[];
  correct: string;
};

// 教科書頻出色プール(ダミー作成用)。データに存在する色 + 紛らわしい色
const COLOR_POOL = ['無色', '深青色', '青色', '青白色', '黄色', '黄褐色', '緑色', '赤褐色', '紫色', '桃色'];

function build(): Question {
  const progress = loadProgress();
  const eligible = COMPLEXES.filter(c => isEligibleToday(getEntry(progress, c.id)));
  const pool = eligible.length > 0 ? eligible : COMPLEXES;
  const complex = pool[Math.floor(Math.random() * pool.length)];

  // ダミー: 教科書頻出色から、正解と一致しないものを3つ
  const used = new Set<string>([complex.color]);
  const candidates = COLOR_POOL.filter(c => !used.has(c)).sort(() => Math.random() - 0.5);
  const distractors = candidates.slice(0, 3);
  const options = [complex.color, ...distractors].sort(() => Math.random() - 0.5);

  return { complex, options, correct: complex.color };
}

export function QuizColor() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (value: string) => {
    if (picked !== null) return;
    setPicked(value);
    const isCorrect = value === question.correct;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.complex.id, isCorrect));
  };

  const next = () => {
    setQuestion(build());
    setPicked(null);
  };

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">次の錯イオンの色は?</div>
        <div className="text-2xl font-mono font-bold text-blue-300">{question.complex.formula}</div>
        <div className="text-xs text-slate-400 mt-2">{question.complex.name}</div>
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
              <ChipSwatch name={c} size={24} />
              <span className="font-semibold flex-1">{c}</span>
              {showCorrect && <Check size={18} className="text-emerald-300 flex-shrink-0" />}
              {showWrong && <X size={18} className="text-rose-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div><span className="text-slate-500">名前: </span><span className="text-slate-200">{question.complex.name}</span></div>
            <div><span className="text-slate-500">由来: </span><span className="font-mono text-slate-200">{question.complex.source}</span></div>
            {question.complex.note && <div className="text-slate-500 italic mt-1">{question.complex.note}</div>}
          </div>
          <button
            onClick={next}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}
