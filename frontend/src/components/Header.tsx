import React from 'react';
import { Dna, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between z-20">
      {/* Small PrionLM logo at top-left */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 group transition text-left"
        title="PrionLM - Home"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20 group-hover:ring-sky-400/40 transition">
          <Dna className="h-4 w-4" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          Prion<span className="text-sky-400">LM</span>
        </span>
      </button>

      {/* Clear / Ask Another Question button */}
      {showReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition"
          title="Clear and ask a new question"
        >
          <RotateCcw className="h-3.5 w-3.5 text-sky-400" />
          <span>Ask another question</span>
        </button>
      )}
    </header>
  );
};
