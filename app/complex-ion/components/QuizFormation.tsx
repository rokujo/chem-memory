'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Complex } from '../types';
import { COMPLEXES, complexCharge, formatComplexFormula } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  complex: Complex;
  options: string[];      // 組成式
  correct: string;
};

// ダミーは「同じ中心 + 同じ配位子」で配位数 or 電荷だけ違うものに揃える。
// 中心や配位子が違うと選択肢の段階で即除外されてしまい、教育的価値が低いため。
const COORD_CANDIDATES = [2, 4, 6];

function build(): Question {
  const progress = loadProgress();
  const eligible = COMPLEXES.filter(c => isEligibleToday(getEntry(progress, c.id)));
  const pool = eligible.length > 0 ? eligible : COMPLEXES;
  const complex = pool[Math.floor(Math.random() * pool.length)];

  const correctCharge = complexCharge(complex);
  const used = new Set<string>([complex.formula]);
  const distractors: string[] = [];

  // 配位数違いダミー(同じ中心・同じ配位子・同じ電荷、配位数だけ変える)
  const otherCoords = COORD_CANDIDATES
    .filter(n => n !== complex.coord_number)
    .sort(() => Math.random() - 0.5);
  for (const n of otherCoords) {
    const f = formatComplexFormula(complex.center, complex.ligand, n, correctCharge);
    if (used.has(f)) continue;
    used.add(f);
    distractors.push(f);
    if (distractors.length >= 2) break;
  }

  // 電荷違いダミー(同じ中心・同じ配位子・同じ配位数、電荷の絶対値を +1 する方向)
  const wrongCharge = correctCharge > 0 ? correctCharge + 1 : correctCharge - 1;
  const chargeDist = formatComplexFormula(
    complex.center,
    complex.ligand,
    complex.coord_number,
    wrongCharge,
  );
  if (!used.has(chargeDist)) {
    used.add(chargeDist);
    distractors.push(chargeDist);
  }

  // 念のための補充(配位数候補が足りない等のレアケース対策)
  if (distractors.length < 3) {
    for (const n of [3, 5]) {
      const f = formatComplexFormula(complex.center, complex.ligand, n, correctCharge);
      if (used.has(f)) continue;
      used.add(f);
      distractors.push(f);
      if (distractors.length >= 3) break;
    }
  }

  const options = [complex.formula, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return { complex, options, correct: complex.formula };
}

export function QuizFormation() {
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
        <div className="text-xs text-slate-500 mb-3">次の条件で生じる錯イオンは?</div>
        <div className="text-lg font-mono font-bold text-blue-300">{question.complex.source}</div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {question.options.map((f, i) => {
          const isPicked = picked === f;
          const showCorrect = picked !== null && f === question.correct;
          const showWrong = picked !== null && isPicked && f !== question.correct;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          return (
            <button
              key={i}
              onClick={() => handlePick(f)}
              className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 font-mono font-bold text-lg ${cls}`}
            >
              <span>{f}</span>
              {showCorrect && <Check size={18} className="text-emerald-300" />}
              {showWrong && <X size={18} className="text-rose-300" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">色:</span>
              <ChipSwatch name={question.complex.color} size={12} />
              <span className="text-slate-200">{question.complex.color}</span>
            </div>
            <div><span className="text-slate-500">名前: </span><span className="text-slate-200">{question.complex.name}</span></div>
            <div><span className="text-slate-500">形: </span><span className="text-slate-200">配位数{question.complex.coord_number}・{question.complex.geometry}</span></div>
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
