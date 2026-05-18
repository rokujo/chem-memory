'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Ion, Reagent, Reaction } from '../types';
import { IONS, REAGENTS, REACTIONS } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type IonQuizQuestion = {
  ion: Ion;
  reagent: Reagent;
  correctReaction: Reaction;
  options: Array<{ label: string; color?: string; product?: string; isCorrect: boolean }>;
};

function buildIonQuestion(): IonQuizQuestion {
  const allCandidates = REACTIONS.filter(r => r.result !== 'out_of_scope');
  // 今日まだ正解してないペアに絞る。全部今日正解済みなら全候補に戻す
  const progress = loadProgress();
  const eligible = allCandidates.filter(r => isEligibleToday(getEntry(progress, r.ion_id, r.reagent_id)));
  const candidates = eligible.length > 0 ? eligible : allCandidates;
  const correct = candidates[Math.floor(Math.random() * candidates.length)];
  const ion = IONS.find(i => i.id === correct.ion_id)!;
  const reagent = REAGENTS.find(r => r.id === correct.reagent_id)!;

  const buildLabel = (r: Reaction): { label: string; color?: string; product?: string } => {
    if (r.result === 'no_reaction') return { label: '沈殿しない' };
    if (r.color) {
      const suffix = r.result === 'complex' ? '溶液 (錯イオン)' : r.result === 'redissolve' ? '溶液 (再溶解)' : '沈殿';
      return { label: `${r.color}${suffix}`, color: r.color, product: r.product };
    }
    return { label: '—' };
  };

  // 画面表示部分(色名+状態)のみで一意性を判定する。
  // Why: S²⁻酸性で「黒色沈殿」が CuS/Ag₂S/PbS で重複するため、化学式まで含めると同じ見た目の選択肢が並んでしまう。
  const labelKey = (r: Reaction): string => {
    if (r.result === 'no_reaction') return '沈殿しない';
    return `${r.color ?? ''}|${r.result}`;
  };

  const correctLabelKey = labelKey(correct);
  const sameReagentResults = REACTIONS.filter(
    r => r.reagent_id === reagent.id && r.result !== 'out_of_scope' && labelKey(r) !== correctLabelKey
  );
  const usedKeys = new Set<string>([correctLabelKey]);
  const distractors: Array<{ label: string; color?: string; product?: string }> = [];
  sameReagentResults.sort(() => Math.random() - 0.5);
  for (const r of sameReagentResults) {
    const k = labelKey(r);
    if (usedKeys.has(k)) continue;
    usedKeys.add(k);
    distractors.push(buildLabel(r));
    if (distractors.length >= 3) break;
  }

  // 同試薬で足りないときは他試薬から借りる(難易度確保のため許容)
  if (distractors.length < 3) {
    const otherReagentResults = REACTIONS.filter(
      r => r.reagent_id !== reagent.id && r.result !== 'out_of_scope' && !usedKeys.has(labelKey(r))
    );
    otherReagentResults.sort(() => Math.random() - 0.5);
    for (const r of otherReagentResults) {
      const k = labelKey(r);
      if (usedKeys.has(k)) continue;
      usedKeys.add(k);
      distractors.push(buildLabel(r));
      if (distractors.length >= 3) break;
    }
  }

  const hasNoReactionDistractor = distractors.some(d => d.label === '沈殿しない');
  if (correct.result !== 'no_reaction' && !hasNoReactionDistractor && distractors.length > 0) {
    distractors[distractors.length - 1] = { label: '沈殿しない' };
  }

  const correctLabel = buildLabel(correct);
  const options = [...distractors.slice(0, 3), correctLabel]
    .sort(() => Math.random() - 0.5)
    .map(o => ({ ...o, isCorrect: o.label === correctLabel.label }));

  return { ion, reagent, correctReaction: correct, options };
}

export function QuizIonMode() {
  const [question, setQuestion] = useState(() => buildIonQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const isCorrect = question.options[i].isCorrect;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.ion.id, question.reagent.id, isCorrect));
  };

  const next = () => {
    setQuestion(buildIonQuestion());
    setPicked(null);
  };

  const { ion, reagent, correctReaction, options } = question;

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-2">次の組合せで起きる現象は?</div>
        <div className="flex items-center justify-center gap-3 text-2xl font-mono font-bold">
          <span className="text-blue-300">{ion.formula}</span>
          <span className="text-slate-500">+</span>
          <span className="text-slate-200">{reagent.formula}</span>
        </div>
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = picked !== null && opt.isCorrect;
          const showWrong = picked !== null && isPicked && !opt.isCorrect;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';

          const isNoReaction = opt.label === '沈殿しない';
          const labelMain = isNoReaction ? '沈殿しない' : opt.label.replace(/\s\s.*$/, '');
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              className={`w-full p-3 rounded-xl border transition flex items-center gap-3 text-left ${cls}`}
            >
              {opt.color ? <ChipSwatch name={opt.color} size={20} /> : <div className="w-5 h-5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{labelMain}</div>
                {picked !== null && opt.product && (
                  <div className="font-mono text-xs text-slate-400 mt-0.5">{opt.product}</div>
                )}
              </div>
              {showCorrect && <Check size={18} className="text-emerald-300 flex-shrink-0" />}
              {showWrong && <X size={18} className="text-rose-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          {correctReaction.product && (
            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-sm">
              <span className="text-slate-500">生成物: </span>
              <span className="font-mono font-bold text-slate-200">{correctReaction.product}</span>
              {correctReaction.note && (
                <div className="text-xs text-slate-500 italic mt-1">{correctReaction.note}</div>
              )}
            </div>
          )}
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
