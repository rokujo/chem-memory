'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { IonCharge } from '../types';
import { IONS, allChargeValues } from '../lib/data';
import { QuizFeedback, QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  ion: IonCharge;
  candidates: number[];          // 4-5個の選択肢
  correct: Set<number>;          // ion.charges
};

function build(): Question {
  const progress = loadProgress();
  const eligible = IONS.filter(i => isEligibleToday(getEntry(progress, i.id)));
  const pool = eligible.length > 0 ? eligible : IONS;
  const ion = pool[Math.floor(Math.random() * pool.length)];

  const all = allChargeValues();
  // 候補: 正解 + ダミー で 4〜5個
  const correctSet = new Set(ion.charges);
  const distractors = all.filter(v => !correctSet.has(v)).sort(() => Math.random() - 0.5);
  const fillCount = Math.max(0, 5 - ion.charges.length);
  const candidates = [...ion.charges, ...distractors.slice(0, fillCount)].sort((a, b) => a - b);

  return { ion, candidates, correct: correctSet };
}

function ionSuperscript(charge: number): string {
  const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const sign = charge > 0 ? '⁺' : '⁻';
  const abs = Math.abs(charge);
  const num = abs === 1 ? '' : SUP[abs];
  return num + sign;
}

export function QuizCharges() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const toggle = (v: number) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const isAllCorrect =
      picked.size === question.correct.size && [...picked].every(v => question.correct.has(v));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isAllCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.ion.id, isAllCorrect));
  };

  const next = () => {
    setQuestion(build());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect =
    submitted && picked.size === question.correct.size && [...picked].every(v => question.correct.has(v));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-2">
          この元素が取り得るイオンの価数を <span className="text-amber-300 font-bold">すべて</span> 選んでください
        </div>
        <div className="text-4xl font-mono font-bold text-orange-300 mt-2">{question.ion.element}</div>
        <div className="text-xs text-slate-400 mt-1">{question.ion.name} · {question.ion.group}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {question.candidates.map(v => {
          const isPicked = picked.has(v);
          const isCorrect = question.correct.has(v);
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (submitted) {
            if (isCorrect && isPicked) cls = 'bg-emerald-900/50 border-emerald-600/60';
            else if (isCorrect) cls = 'bg-emerald-900/20 border-emerald-700/40';
            else if (isPicked) cls = 'bg-rose-900/50 border-rose-600/60';
            else cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';
          } else if (isPicked) {
            cls = 'bg-orange-600/40 border-orange-500/60';
          }
          return (
            <button
              key={v}
              onClick={() => toggle(v)}
              className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${cls}`}
            >
              <span className="font-mono font-bold text-lg">
                {question.ion.element}{ionSuperscript(v)}
              </span>
              <span className="text-[10px] text-slate-400">{v}価</span>
              {submitted && isCorrect && !isPicked && <span className="text-[10px] text-emerald-400">これも</span>}
              {submitted && !isCorrect && isPicked && <Check size={0} />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={picked.size === 0}
          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 transition font-bold"
        >
          答え合わせ
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback
            result={isAllCorrect ? 'correct' : 'wrong'}
            message={
              isAllCorrect
                ? '完璧!'
                : `正解: ${[...question.correct].sort((a, b) => a - b).map(v => `${v}価`).join('・')}`
            }
          />
          {question.ion.notes && (
            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs space-y-0.5">
              {[...question.correct].sort((a, b) => a - b).map(c => {
                const note = question.ion.notes?.[c];
                if (!note) return null;
                return (
                  <div key={c} className="text-slate-400">
                    <span className="font-mono text-slate-300">{question.ion.element}{ionSuperscript(c)}:</span>{' '}
                    <span className="italic">{note}</span>
                  </div>
                );
              })}
            </div>
          )}
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
