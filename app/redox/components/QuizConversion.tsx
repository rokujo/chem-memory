'use client';

import { useState } from 'react';
import { ArrowRight, Check, X, RefreshCw } from 'lucide-react';
import type { HalfReaction, Term } from '../types';
import { HALF_REACTIONS } from '../lib/data';
import { QUIZ_DISTRACTOR_POOL } from '../lib/quiz-pool';
import { HalfReactionRow } from './HalfReactionRow';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  reaction: HalfReaction;
  product: Term;
  options: string[];
  correct: string;
};

const SKIP_SPECIES = new Set(['H₂O', 'H⁺', 'e⁻', 'OH⁻']);

// 化学種から「主要元素」(H,Oを除く元素記号)の集合を取り出す。
// H/O のみの化学式 (H₂O₂, O₂, O₃ 等) は O を主要元素として返す。
function mainElements(species: string): Set<string> {
  const matches = species.match(/[A-Z][a-z]?/g) ?? [];
  const filtered = matches.filter(e => e !== 'H' && e !== 'O');
  if (filtered.length === 0 && matches.includes('O')) return new Set(['O']);
  return new Set(filtered);
}

function pickDistractors(reaction: HalfReaction, correctSpecies: string): string[] {
  // 除外集合: 正解 + 左辺の全項(主役物質)
  const excluded = new Set<string>([correctSpecies]);
  for (const t of reaction.reactants) excluded.add(t.species);

  // 同元素プール
  const elems = mainElements(correctSpecies);
  const sameElement = new Set<string>();
  for (const e of elems) {
    const list = QUIZ_DISTRACTOR_POOL[e];
    if (!list) continue;
    for (const s of list) {
      if (!excluded.has(s)) sameElement.add(s);
    }
  }

  const distractors: string[] = [];
  const shuffled = [...sameElement].sort(() => Math.random() - 0.5);
  for (const s of shuffled) {
    distractors.push(s);
    if (distractors.length >= 3) break;
  }

  // 同元素プールで3つに満たないとき、まず同役割の他反応の主生成物から補充
  if (distractors.length < 3) {
    const sameRoleProducts = new Set<string>();
    for (const r of HALF_REACTIONS) {
      if (r.role !== reaction.role) continue;
      const main = r.products.find(t => !SKIP_SPECIES.has(t.species));
      if (main) sameRoleProducts.add(main.species);
    }
    for (const s of excluded) sameRoleProducts.delete(s);
    for (const s of distractors) sameRoleProducts.delete(s);
    const fill = [...sameRoleProducts].sort(() => Math.random() - 0.5);
    for (const s of fill) {
      distractors.push(s);
      if (distractors.length >= 3) break;
    }
  }

  // それでも足りなければ全プールから
  if (distractors.length < 3) {
    const all = new Set<string>();
    for (const list of Object.values(QUIZ_DISTRACTOR_POOL)) {
      for (const s of list) all.add(s);
    }
    for (const s of excluded) all.delete(s);
    for (const s of distractors) all.delete(s);
    const fill = [...all].sort(() => Math.random() - 0.5);
    for (const s of fill) {
      distractors.push(s);
      if (distractors.length >= 3) break;
    }
  }

  return distractors;
}

function build(): Question {
  // 候補: 各反応の主生成物(右辺で H₂O/H⁺/e⁻/OH⁻ を除いた最初の項)
  type Cand = { reaction: HalfReaction; product: Term };
  const allCandidates: Cand[] = [];
  for (const r of HALF_REACTIONS) {
    const main = r.products.find(t => !SKIP_SPECIES.has(t.species));
    if (main) allCandidates.push({ reaction: r, product: main });
  }

  // 今日まだ正解してない問題に絞る。全部今日正解済みなら全候補に戻す
  const progress = loadProgress();
  const eligible = allCandidates.filter(c => isEligibleToday(getEntry(progress, c.reaction.id)));
  const candidates = eligible.length > 0 ? eligible : allCandidates;

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  const distractors = pickDistractors(chosen.reaction, chosen.product.species);
  const options = [chosen.product.species, ...distractors].sort(() => Math.random() - 0.5);

  return { reaction: chosen.reaction, product: chosen.product, correct: chosen.product.species, options };
}

export function QuizConversion() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (value: string) => {
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

  const conditionLabel =
    question.reaction.condition !== '-' ? `(${question.reaction.condition}条件)` : '';

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-2 leading-relaxed">
          <span className="font-bold text-slate-100">{question.reaction.name}</span> を{' '}
          <span className="font-bold text-orange-300">{question.reaction.role}</span>
          {conditionLabel && <span className="text-slate-400"> {conditionLabel}</span>}
          {' '}として使うとき、何に変わる?
        </div>
        <div className="flex items-center justify-center gap-3 mt-3 text-lg font-bold flex-wrap">
          <span className="text-orange-300">{question.reaction.name}</span>
          <ArrowRight size={20} className="text-slate-500" />
          <span className="inline-block min-w-[3em] px-3 py-1 rounded bg-amber-900/50 border border-amber-500/60 text-amber-200 font-mono">
            ?
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
              className={`p-4 rounded-xl border transition flex items-center justify-center gap-2 font-mono font-bold text-xl ${cls}`}
            >
              <span>{v}</span>
              {showCorrect && <Check size={18} className="text-emerald-300" />}
              {showWrong && <X size={18} className="text-rose-300" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-500 mb-2">完成式(係数を含む)</div>
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
