'use client';

import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { Substance } from '../types';
import { SUBSTANCES, getComparePair } from '../lib/data';
import { ChipSwatch } from './ChipSwatch';
import { QuizScore } from './QuizFeedback';
import { loadProgress, recordAnswer, saveProgress, isEligibleToday, getEntry } from '../lib/progress';

type Question = {
  substance: Substance;
  options: Array<{ color: string; isCorrect: boolean }>;
};

function build(): Question {
  // 今日まだ正解してない物質に絞る。全部今日正解済みなら全候補に戻す
  const progress = loadProgress();
  const eligible = SUBSTANCES.filter(s => isEligibleToday(getEntry(progress, s.id)));
  const pool = eligible.length > 0 ? eligible : SUBSTANCES;
  const substance = pool[Math.floor(Math.random() * pool.length)];
  const correctColor = substance.color;

  const usedColors = new Set<string>([correctColor]);
  const distractors: string[] = [];

  // 1. 比較ペア相手の色を優先採用 (混同しやすい色を選択肢に出す = 教育効果)
  const pair = getComparePair(substance);
  if (pair) {
    for (const p of pair) {
      if (p.id === substance.id) continue;
      if (usedColors.has(p.color)) continue;
      usedColors.add(p.color);
      distractors.push(p.color);
      if (distractors.length >= 3) break;
    }
  }

  // 2. 同カテゴリの他の色を優先 (近い文脈の色を出す)
  if (distractors.length < 3) {
    const sameCat = SUBSTANCES
      .filter(s => s.category === substance.category && !usedColors.has(s.color))
      .sort(() => Math.random() - 0.5);
    for (const s of sameCat) {
      if (usedColors.has(s.color)) continue;
      usedColors.add(s.color);
      distractors.push(s.color);
      if (distractors.length >= 3) break;
    }
  }

  // 3. それでも足りなければ全体から
  if (distractors.length < 3) {
    const others = SUBSTANCES
      .filter(s => !usedColors.has(s.color))
      .sort(() => Math.random() - 0.5);
    for (const s of others) {
      if (usedColors.has(s.color)) continue;
      usedColors.add(s.color);
      distractors.push(s.color);
      if (distractors.length >= 3) break;
    }
  }

  const options = [{ color: correctColor, isCorrect: true }, ...distractors.slice(0, 3).map(c => ({ color: c, isCorrect: false }))]
    .sort(() => Math.random() - 0.5);

  return { substance, options };
}

export function QuizSubstanceColor() {
  const [question, setQuestion] = useState(() => build());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const isCorrect = question.options[i].isCorrect;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    saveProgress(recordAnswer(loadProgress(), question.substance.id, isCorrect));
  };

  const next = () => {
    setQuestion(build());
    setPicked(null);
  };

  const { substance, options } = question;

  return (
    <div className="space-y-4">
      <QuizScore correct={score.correct} total={score.total} />

      <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/50 text-center">
        <div className="text-xs text-slate-500 mb-3">次の物質の色は?</div>
        <div className="text-3xl font-mono font-bold text-blue-300">{substance.formula}</div>
        <div className="text-xs text-slate-400 mt-2">{substance.name} · {substance.state} · {substance.category}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = picked !== null && opt.isCorrect;
          const showWrong = picked !== null && isPicked && !opt.isCorrect;
          let cls = 'bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60';
          if (showCorrect) cls = 'bg-emerald-900/50 border-emerald-600/60';
          else if (showWrong) cls = 'bg-rose-900/50 border-rose-600/60';
          else if (picked !== null) cls = 'bg-slate-800/30 border-slate-800/60 opacity-50';

          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              className={`p-4 rounded-xl border transition flex items-center gap-3 text-left ${cls}`}
            >
              <ChipSwatch name={opt.color} size={24} />
              <span className="font-semibold flex-1">{opt.color}</span>
              {showCorrect && <Check size={18} className="text-emerald-300 flex-shrink-0" />}
              {showWrong && <X size={18} className="text-rose-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          {substance.note && (
            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
              {substance.note}
            </div>
          )}
          {substance.compare_note && (
            <div className="rounded-xl p-3 bg-amber-900/20 border border-amber-700/30 text-xs text-amber-200">
              {substance.compare_note}
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
