import { Check, X } from 'lucide-react';

export type QuizResultState = 'correct' | 'wrong' | null;

export function QuizFeedback({ result, message }: { result: QuizResultState; message?: string }) {
  if (!result) return null;
  return (
    <div
      className={`rounded-xl p-3 flex items-center gap-2 font-bold ${
        result === 'correct'
          ? 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-200'
          : 'bg-rose-900/40 border border-rose-700/50 text-rose-200'
      }`}
    >
      {result === 'correct' ? <Check size={18} /> : <X size={18} />}
      <span>{result === 'correct' ? '正解!' : '不正解'}</span>
      {message && <span className="font-normal text-sm ml-2">{message}</span>}
    </div>
  );
}

export function QuizScore({ correct, total }: { correct: number; total: number }) {
  return (
    <div className="text-xs text-slate-500 text-center">
      正答 {correct} / {total} ({total === 0 ? 0 : Math.round((correct / total) * 100)}%)
    </div>
  );
}
