'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Substance } from '../types';
import { SUBSTANCES, substancesByColor } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizFeedback, QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswers, saveProgress } from '../lib/progress';

const MAX_CORRECT = 3;
const NUM_DISTRACTORS = 5;

type Question = {
  targetColor: string;
  correctIds: Set<string>;
  candidates: Substance[];
};

function build(): Question {
  // 候補対象色: 該当物質が2件以上ある色のみ
  const byColor = new Map<string, Substance[]>();
  for (const s of SUBSTANCES) {
    if (!byColor.has(s.color)) byColor.set(s.color, []);
    byColor.get(s.color)!.push(s);
  }
  const eligible = [...byColor.entries()].filter(([_, ss]) => ss.length >= 2);
  const [targetColor, allCorrect] = eligible[Math.floor(Math.random() * eligible.length)];

  const correctSampled = [...allCorrect].sort(() => Math.random() - 0.5).slice(0, MAX_CORRECT);
  const correctIds = new Set(correctSampled.map(s => s.id));

  const others = SUBSTANCES.filter(s => s.color !== targetColor).sort(() => Math.random() - 0.5);
  const distractors = others.slice(0, NUM_DISTRACTORS);

  const candidates = [...correctSampled, ...distractors].sort(() => Math.random() - 0.5);
  return { targetColor, correctIds, candidates };
}

export function QuizColorSubstance() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const toggle = (id: string) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const isCorrect =
      picked.size === question.correctIds.size && [...picked].every(id => question.correctIds.has(id));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));

    // SRS: 候補全部について 整合 == 正誤
    const updates = question.candidates.map(c => {
      const inAnswer = question.correctIds.has(c.id);
      const wasPicked = picked.has(c.id);
      return { substanceId: c.id, correct: inAnswer === wasPicked };
    });
    saveProgress(recordAnswers(loadProgress(), updates));
  };

  const next = () => {
    setQuestion(build());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect =
    submitted && picked.size === question.correctIds.size && [...picked].every(id => question.correctIds.has(id));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">
          この色の物質を<span className="text-amber-300 font-bold">すべて</span>選んでください
        </div>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
          <ChipSwatch name={question.targetColor} size={28} />
          <span className="text-xl font-bold">{question.targetColor}</span>
          <span className="text-sm text-slate-500">の物質</span>
        </div>
      </div>

      <div className="space-y-2">
        {question.candidates.map(s => {
          const isPicked = picked.has(s.id);
          const isCorrect = question.correctIds.has(s.id);
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
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`w-full p-3 rounded-xl border transition flex items-center gap-3 ${cls}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono font-bold text-blue-300 w-20 flex-shrink-0">{s.formula}</span>
                <span className="text-xs text-slate-400 truncate text-left">{s.name}</span>
              </div>
              {submitted && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ChipSwatch name={s.color} size={14} />
                  <span className="text-[10px] text-slate-400">{s.color}</span>
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
