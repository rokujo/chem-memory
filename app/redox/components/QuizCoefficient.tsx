'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { HalfReaction } from '../types';
import { HALF_REACTIONS } from '../lib/data';
import { Equation, type BlankSpec } from './Equation';
import { HalfReactionRow } from './HalfReactionRow';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  reaction: HalfReaction;
  blank: BlankSpec;
  options: number[];
  correct: number;
};

const COMMON_COEFFS = [2, 3, 4, 5, 6, 7, 8, 14];

function build(): Question {
  type Cand = { reaction: HalfReaction; side: 'reactants' | 'products'; index: number; coeff: number };
  const allCandidates: Cand[] = [];
  for (const r of HALF_REACTIONS) {
    r.reactants.forEach((t, i) => {
      if (t.coeff !== 1) allCandidates.push({ reaction: r, side: 'reactants', index: i, coeff: t.coeff });
    });
    r.products.forEach((t, i) => {
      if (t.coeff !== 1) allCandidates.push({ reaction: r, side: 'products', index: i, coeff: t.coeff });
    });
  }

  // 今日まだ正解してない反応に絞る。全部今日正解済みなら全候補に戻す
  const progress = loadProgress();
  const eligible = allCandidates.filter(c => isEligibleToday(getEntry(progress, c.reaction.id)));
  const candidates = eligible.length > 0 ? eligible : allCandidates;

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // ダミー: 同じ反応の他の係数を優先、足りなければ教科書頻出値
  const sameReaction = [...chosen.reaction.reactants, ...chosen.reaction.products]
    .map(t => t.coeff)
    .filter(c => c !== 1 && c !== chosen.coeff);
  const used = new Set<number>([chosen.coeff]);
  const distractors: number[] = [];
  for (const c of sameReaction) {
    if (used.has(c)) continue;
    used.add(c);
    distractors.push(c);
    if (distractors.length >= 3) break;
  }
  if (distractors.length < 3) {
    const shuffled = [...COMMON_COEFFS].sort(() => Math.random() - 0.5);
    for (const c of shuffled) {
      if (used.has(c)) continue;
      used.add(c);
      distractors.push(c);
      if (distractors.length >= 3) break;
    }
  }

  const options = [chosen.coeff, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return {
    reaction: chosen.reaction,
    blank: { side: chosen.side, index: chosen.index, mode: 'coeff' },
    options,
    correct: chosen.coeff,
  };
}

export function QuizCoefficient() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (value: number) => {
    if (picked !== null) return;
    setPicked(value);
    const isCorrect = value === question.correct;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.reaction.id, isCorrect));
  };

  const next = () => {
    setQuestion(build());
    setPicked(null);
  };

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50">
        <div className="text-xs text-slate-500 mb-3 text-center">[ ? ] に入る係数は?</div>
        <div className="text-center mb-2">
          <span className="font-mono text-sm text-orange-300">{question.reaction.reagent_label}</span>
          <span className="text-xs text-slate-500 ml-2">({question.reaction.role}・{question.reaction.condition !== '-' ? question.reaction.condition : ''})</span>
        </div>
        <div className="overflow-x-auto -mx-2 px-2 py-2">
          <Equation reaction={question.reaction} blank={question.blank} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {question.options.map((v, i) => {
          const isPicked = picked === v;
          const showCorrect = picked !== null && v === question.correct;
          const showWrong = picked !== null && isPicked && v !== question.correct;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          return (
            <button
              key={i}
              onClick={() => handlePick(v)}
              className={`p-4 rounded-xl border transition flex items-center justify-center gap-2 font-mono font-bold text-2xl ${cls}`}
            >
              <span>{v}</span>
              {showCorrect && <Check size={16} className="text-emerald-300" />}
              {showWrong && <X size={16} className="text-rose-300" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-500 mb-2">完成式</div>
            <HalfReactionRow reaction={question.reaction} />
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
