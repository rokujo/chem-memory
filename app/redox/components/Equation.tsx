import type { HalfReaction, Term } from '../types';

export type BlankSpec = {
  side: 'reactants' | 'products';
  index: number;
  mode: 'coeff' | 'species';
};

function TermDisplay({
  term,
  highlight = false,
  blankMode,
  blankActive,
  blankLabel = '?',
}: {
  term: Term;
  highlight?: boolean;
  blankMode?: 'coeff' | 'species';
  blankActive?: boolean;
  blankLabel?: string;
}) {
  const coeffEl =
    blankActive && blankMode === 'coeff' ? (
      <span className="inline-block min-w-[1.5em] px-1.5 py-0.5 mx-0.5 rounded bg-amber-900/50 border border-amber-500/60 text-amber-200 font-bold text-center">
        {blankLabel}
      </span>
    ) : term.coeff !== 1 ? (
      <span className="font-bold">{term.coeff}</span>
    ) : null;

  const speciesEl =
    blankActive && blankMode === 'species' ? (
      <span className="inline-block min-w-[3em] px-2 py-0.5 mx-0.5 rounded bg-amber-900/50 border border-amber-500/60 text-amber-200 font-bold text-center">
        {blankLabel}
      </span>
    ) : (
      <span>{term.species}</span>
    );

  return (
    <span
      className={`font-mono inline-flex items-center whitespace-nowrap ${highlight ? 'text-amber-200' : 'text-slate-100'}`}
    >
      {coeffEl}
      {speciesEl}
    </span>
  );
}

export function Equation({
  reaction,
  blank,
}: {
  reaction: HalfReaction;
  blank?: BlankSpec;
}) {
  const renderSide = (terms: Term[], side: 'reactants' | 'products') =>
    terms.map((t, i) => {
      const isBlank = blank?.side === side && blank.index === i;
      return (
        <span key={`${side}_${i}`} className="inline-flex items-center">
          {i > 0 && <span className="mx-1.5 text-slate-500">+</span>}
          <TermDisplay
            term={t}
            blankMode={isBlank ? blank.mode : undefined}
            blankActive={isBlank}
            highlight={isBlank}
          />
        </span>
      );
    });

  return (
    <div className="flex flex-wrap items-center gap-y-1 font-mono text-base leading-relaxed">
      {renderSide(reaction.reactants, 'reactants')}
      <span className="mx-2 text-slate-400">→</span>
      {renderSide(reaction.products, 'products')}
    </div>
  );
}
