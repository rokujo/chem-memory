'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Ion, Reagent } from '../types';
import { IONS, REAGENTS, REACTIONS } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizFeedback, QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswers, saveProgress } from '../lib/progress';

type ReagentQuizQuestion = {
  reagent: Reagent;
  targetColor: string;
  correctIonIds: Set<string>;
  candidateIons: Ion[];
};

function buildReagentQuestion(): ReagentQuizQuestion {
  const buckets = new Map<string, { reagent: Reagent; color: string; ions: Set<string> }>();
  for (const r of REACTIONS) {
    if (r.result !== 'precipitate' || !r.color) continue;
    const reg = REAGENTS.find(x => x.id === r.reagent_id)!;
    const key = `${reg.id}|${r.color}`;
    if (!buckets.has(key)) buckets.set(key, { reagent: reg, color: r.color, ions: new Set() });
    buckets.get(key)!.ions.add(r.ion_id);
  }
  const list = [...buckets.values()].filter(b => b.ions.size >= 1 && b.ions.size <= 6);
  const target = list[Math.floor(Math.random() * list.length)];

  const candidateIds = new Set<string>();
  for (const r of REACTIONS) {
    if (r.reagent_id !== target.reagent.id) continue;
    if (r.result === 'out_of_scope') continue;
    candidateIds.add(r.ion_id);
  }
  const candidateIons = IONS.filter(i => candidateIds.has(i.id));

  return {
    reagent: target.reagent,
    targetColor: target.color,
    correctIonIds: target.ions,
    candidateIons,
  };
}

export function QuizReagentMode() {
  const [question, setQuestion] = useState(() => buildReagentQuestion());
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
      picked.size === question.correctIonIds.size && [...picked].every(id => question.correctIonIds.has(id));
    setSubmitted(true);
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));

    // SRS更新: 候補イオン全部について「正解集合に含まれるか」と「選んだか」の整合で正誤を判定
    const updates = question.candidateIons.map(ion => {
      const inAnswer = question.correctIonIds.has(ion.id);
      const wasPicked = picked.has(ion.id);
      return {
        ionId: ion.id,
        reagentId: question.reagent.id,
        correct: inAnswer === wasPicked,
      };
    });
    saveProgress(recordAnswers(loadProgress(), updates));
  };

  const next = () => {
    setQuestion(buildReagentQuestion());
    setPicked(new Set());
    setSubmitted(false);
  };

  const isAllCorrect =
    submitted &&
    picked.size === question.correctIonIds.size &&
    [...picked].every(id => question.correctIonIds.has(id));

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50">
        <div className="text-xs text-slate-500 mb-2">
          次の試薬で{' '}
          <span className="inline-flex items-center gap-1 align-middle">
            <ChipSwatch name={question.targetColor} size={12} />
            <span className="font-bold text-slate-200">{question.targetColor}</span>
          </span>{' '}
          の沈殿を作るイオンを<span className="text-amber-300 font-bold">すべて</span>選んでください
        </div>
        <div className="text-2xl font-mono font-bold text-slate-200 text-center mt-2">{question.reagent.formula}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {question.candidateIons.map(ion => {
          const isPicked = picked.has(ion.id);
          const isCorrect = question.correctIonIds.has(ion.id);
          const reactionForIon = REACTIONS.find(
            r =>
              r.ion_id === ion.id &&
              r.reagent_id === question.reagent.id &&
              r.result === 'precipitate' &&
              r.color === question.targetColor
          );
          const product = reactionForIon?.product;

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
              key={ion.id}
              onClick={() => toggle(ion.id)}
              className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${cls}`}
            >
              <span className="font-mono font-bold text-blue-300">{ion.formula}</span>
              {submitted && isCorrect && product && (
                <span className="font-mono text-[10px] text-slate-300 mt-0.5 whitespace-nowrap">{product}</span>
              )}
              {submitted && isCorrect && !isPicked && <span className="text-[10px] text-emerald-400">選び忘れ</span>}
              {submitted && !isCorrect && isPicked && <span className="text-[10px] text-rose-400">違う</span>}
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
          答え合わせ
        </button>
      ) : (
        <div className="space-y-3">
          <QuizFeedback
            result={isAllCorrect ? 'correct' : 'wrong'}
            message={
              isAllCorrect
                ? '完璧!'
                : `正解は ${[...question.correctIonIds].map(id => IONS.find(i => i.id === id)!.formula).join('・')}`
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
