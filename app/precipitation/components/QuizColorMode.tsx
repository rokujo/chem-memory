'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Ion, Reagent } from '../types';
import { IONS, REAGENTS, REACTIONS } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizFeedback, QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswers, saveProgress } from '../lib/progress';

type Pair = { ion: Ion; reagent: Reagent; color: string; product?: string };

type ColorQuizQuestion = {
  targetColor: string;
  correctPairs: Set<string>;
  candidatePairs: Pair[];
};

const MAX_CORRECT_PAIRS = 3;
const NUM_DISTRACTORS = 5;

function buildColorQuestion(): ColorQuizQuestion {
  const pairsByColor = new Map<string, Pair[]>();
  for (const r of REACTIONS) {
    if (r.result !== 'precipitate' || !r.color) continue;
    const ion = IONS.find(i => i.id === r.ion_id)!;
    const reagent = REAGENTS.find(x => x.id === r.reagent_id)!;
    if (!pairsByColor.has(r.color)) pairsByColor.set(r.color, []);
    pairsByColor.get(r.color)!.push({ ion, reagent, color: r.color, product: r.product });
  }
  const eligibleColors = [...pairsByColor.entries()].filter(([_, ps]) => ps.length >= 2);
  const [targetColor, allCorrectPairs] = eligibleColors[Math.floor(Math.random() * eligibleColors.length)];

  const correctPairsArr = [...allCorrectPairs].sort(() => Math.random() - 0.5).slice(0, MAX_CORRECT_PAIRS);
  const correctPairs = new Set(correctPairsArr.map(p => `${p.ion.id}|${p.reagent.id}`));

  const otherPairs: Pair[] = [];
  for (const [color, ps] of pairsByColor.entries()) {
    if (color === targetColor) continue;
    otherPairs.push(...ps);
  }
  otherPairs.sort(() => Math.random() - 0.5);
  const distractors = otherPairs.slice(0, NUM_DISTRACTORS);

  const candidatePairs = [...correctPairsArr, ...distractors].sort(() => Math.random() - 0.5);

  return { targetColor, correctPairs, candidatePairs };
}

export function QuizColorMode() {
  const [question, setQuestion] = useState(() => buildColorQuestion());
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const toggle = (key: string) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const isCorrect =
      picked.size === question.correctPairs.size && [...picked].every(k => question.correctPairs.has(k));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));

    // SRS更新: 候補ペア全部について整合で正誤を判定
    const updates = question.candidatePairs.map(pair => {
      const key = `${pair.ion.id}|${pair.reagent.id}`;
      const inAnswer = question.correctPairs.has(key);
      const wasPicked = picked.has(key);
      return {
        ionId: pair.ion.id,
        reagentId: pair.reagent.id,
        correct: inAnswer === wasPicked,
      };
    });
    saveProgress(recordAnswers(loadProgress(), updates));
  };

  const next = () => {
    setQuestion(buildColorQuestion());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect =
    submitted && picked.size === question.correctPairs.size && [...picked].every(k => question.correctPairs.has(k));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">
          この色の沈殿を作る組合せを<span className="text-amber-300 font-bold">すべて</span>選んでください
        </div>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
          <ChipSwatch name={question.targetColor} size={28} />
          <span className="text-xl font-bold">{question.targetColor}</span>
          <span className="text-sm text-slate-500">の沈殿</span>
        </div>
      </div>

      <div className="space-y-2">
        {question.candidatePairs.map(pair => {
          const key = `${pair.ion.id}|${pair.reagent.id}`;
          const isPicked = picked.has(key);
          const isCorrect = question.correctPairs.has(key);
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (submitted) {
            if (isCorrect && isPicked) cls = 'bg-emerald-900/50 border-emerald-600/60';
            else if (isCorrect) cls = 'bg-emerald-900/20 border-emerald-700/40';
            else if (isPicked) cls = 'bg-rose-900/50 border-rose-600/60';
            else cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          } else if (isPicked) {
            cls = 'bg-blue-600/40 border-blue-500/60';
          }
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`w-full p-3 rounded-xl border transition flex items-center gap-3 ${cls}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono font-bold text-blue-300 w-14 flex-shrink-0">{pair.ion.formula}</span>
                <span className="text-slate-500 flex-shrink-0">+</span>
                <span className="font-mono text-sm text-slate-300 flex-1 truncate text-left">{pair.reagent.formula}</span>
              </div>
              {submitted && pair.product && (
                <div className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-900/40 flex-shrink-0">
                  {pair.product}
                </div>
              )}
              {submitted && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ChipSwatch name={pair.color} size={14} />
                  {isCorrect && isPicked && <Check size={16} className="text-emerald-300" />}
                  {isCorrect && !isPicked && <span className="text-[10px] text-emerald-400 font-bold">これも</span>}
                  {!isCorrect && isPicked && <X size={16} className="text-rose-300" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={picked.size === 0}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition font-bold"
        >
          答え合わせ ({picked.size}個 選択中)
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback result={isAllCorrect ? 'correct' : 'wrong'} />
          <button
            onClick={next}
            className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 次の問題
          </button>
        </div>
      )}
    </div>
  );
}
