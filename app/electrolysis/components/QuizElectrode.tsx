'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Check, X, RefreshCw } from 'lucide-react';
import type { Electrolysis } from '../types';
import { ELECTROLYSIS } from '../lib/data';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

// 教科書頻出の生成物プール(ダミー候補確保用)
const COMMON_PRODUCTS = [
  'H₂', 'O₂', 'Cl₂', 'Cu', 'Ag', 'Na',
  'Cu(電極溶解)', 'Ag(電極溶解)',
  'NaOH', 'Br₂', 'I₂', 'Zn',
];

export type Side = 'cathode' | 'anode';

function buildQuestion(side: Side) {
  const progress = loadProgress();
  const eligible = ELECTROLYSIS.filter(e => isEligibleToday(getEntry(progress, e.id)));
  const pool = eligible.length > 0 ? eligible : ELECTROLYSIS;
  const data = pool[Math.floor(Math.random() * pool.length)];
  const correct = side === 'cathode' ? data.cathode_product : data.anode_product;

  // ダミー: 他のレコードの同じ側の生成物を優先 + 教科書頻出プールで補充
  const usedAnswers = new Set<string>([correct]);
  const sameSideOthers = ELECTROLYSIS
    .filter(e => e.id !== data.id)
    .map(e => (side === 'cathode' ? e.cathode_product : e.anode_product))
    .filter(p => !usedAnswers.has(p));
  const distractors: string[] = [];
  const shuffledOthers = [...new Set(sameSideOthers)].sort(() => Math.random() - 0.5);
  for (const p of shuffledOthers) {
    if (usedAnswers.has(p)) continue;
    usedAnswers.add(p);
    distractors.push(p);
    if (distractors.length >= 3) break;
  }
  if (distractors.length < 3) {
    const fill = COMMON_PRODUCTS.filter(p => !usedAnswers.has(p)).sort(() => Math.random() - 0.5);
    for (const p of fill) {
      if (usedAnswers.has(p)) continue;
      usedAnswers.add(p);
      distractors.push(p);
      if (distractors.length >= 3) break;
    }
  }

  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { data, options, correct };
}

export function QuizElectrode({ side }: { side: Side }) {
  const [question, setQuestion] = useState(() => buildQuestion(side));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (value: string) => {
    if (picked !== null) return;
    setPicked(value);
    const isCorrect = value === question.correct;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.data.id, isCorrect));
  };

  const next = () => {
    setQuestion(buildQuestion(side));
    setPicked(null);
  };

  const sideLabel = side === 'cathode' ? '陰極(還元)' : '陽極(酸化)';
  const sideIcon = side === 'cathode'
    ? <ArrowDown size={16} className="text-cyan-300" />
    : <ArrowUp size={16} className="text-rose-300" />;
  const sideTone = side === 'cathode'
    ? 'bg-cyan-900/30 border-cyan-700/40 text-cyan-200'
    : 'bg-rose-900/30 border-rose-700/40 text-rose-200';

  const otherProduct = side === 'cathode' ? question.data.anode_product : question.data.cathode_product;
  const otherSideLabel = side === 'cathode' ? '陽極' : '陰極';

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50">
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold mb-3 ${sideTone}`}>
          {sideIcon} {sideLabel}
        </div>
        <div className="text-center">
          <div className="font-mono text-xl font-bold text-orange-300">{question.data.electrolyte}</div>
          <div className="text-xs text-slate-400 mt-1">電極: {question.data.electrode}</div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-3">
          {sideLabel} で生じるのは?
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {question.options.map((p, i) => {
          const isPicked = picked === p;
          const showCorrect = picked !== null && p === question.correct;
          const showWrong = picked !== null && isPicked && p !== question.correct;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          return (
            <button
              key={i}
              onClick={() => handlePick(p)}
              className={`p-4 rounded-xl border transition flex items-center justify-center gap-2 font-mono font-bold text-lg ${cls}`}
            >
              <span>{p}</span>
              {showCorrect && <Check size={18} className="text-emerald-300" />}
              {showWrong && <X size={18} className="text-rose-300" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div>
              <span className="text-slate-500">{otherSideLabel} (参考): </span>
              <span className="font-mono text-slate-200">{otherProduct}</span>
            </div>
            {question.data.note && <div className="text-slate-500 italic mt-1">{question.data.note}</div>}
          </div>
          <button
            onClick={next}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 transition font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}
