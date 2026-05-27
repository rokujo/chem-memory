'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { IonCharge } from '../types';
import { IONS, allChargeValues, ionsWithCharge } from '../lib/data';
import { QuizFeedback, QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswers, saveProgress } from '../lib/progress';

type Question = {
  targetCharge: number;
  candidates: IonCharge[];
  correctIds: Set<string>;
};

const MAX_CANDIDATES = 9;

function build(): Question {
  // 候補対象価数: 該当元素が1以上ある価数のみ。複数選択にするため、できれば該当元素が2つ以上ある価数を優先
  const allValues = allChargeValues();
  const counts = allValues.map(v => ({ v, count: ionsWithCharge(v).length }));
  const usable = counts.filter(c => c.count >= 1);
  const target = usable[Math.floor(Math.random() * usable.length)];

  const correct = ionsWithCharge(target.v);
  const others = IONS.filter(i => !i.charges.includes(target.v));

  // 候補: 正解全部 + ダミーランダム
  const correctIds = new Set(correct.map(i => i.id));
  const distractors = others.sort(() => Math.random() - 0.5).slice(0, Math.max(0, MAX_CANDIDATES - correct.length));
  const candidates = [...correct, ...distractors].sort(() => Math.random() - 0.5);

  return { targetCharge: target.v, candidates, correctIds };
}

function valenceLabel(charge: number): string {
  return `${charge}価`;
}

export function QuizElements() {
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
    const isAllCorrect =
      picked.size === question.correctIds.size && [...picked].every(id => question.correctIds.has(id));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isAllCorrect ? 1 : 0), total: s.total + 1 }));

    // SRS: 候補全部について 整合 == 正誤
    const updates = question.candidates.map(c => {
      const inAnswer = question.correctIds.has(c.id);
      const wasPicked = picked.has(c.id);
      return { id: c.id, correct: inAnswer === wasPicked };
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
          <span className="font-bold text-amber-300">{valenceLabel(question.targetCharge)}</span> のイオンになりうる元素を
          <span className="text-amber-300 font-bold"> すべて </span>選んでください
        </div>
        <div className="inline-block px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700 font-mono text-2xl font-bold">
          {question.targetCharge > 0 ? '+' : ''}{question.targetCharge}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {question.candidates.map(c => {
          const isPicked = picked.has(c.id);
          const isCorrect = question.correctIds.has(c.id);
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
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`p-3 rounded-xl border transition flex flex-col items-center gap-0.5 ${cls}`}
            >
              <span className="font-mono font-bold text-lg text-orange-200">{c.element}</span>
              <span className="text-[10px] text-slate-400">{c.name}</span>
              {submitted && isCorrect && !isPicked && <span className="text-[10px] text-emerald-400">これも</span>}
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
          答え合わせ ({picked.size}個 選択中)
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback
            result={isAllCorrect ? 'correct' : 'wrong'}
            message={
              isAllCorrect
                ? '完璧!'
                : `正解: ${[...question.correctIds].map(id => IONS.find(i => i.id === id)!.element).join('・')}`
            }
          />
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
