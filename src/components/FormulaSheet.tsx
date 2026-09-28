import React, { useState } from 'react';
import { Subject, FormulaCard } from '../types';
import { Lightbulb, Search, BookOpen, Star, Sparkles, Copy, Check } from 'lucide-react';

interface FormulaSheetProps {
  subjects: Subject[];
  formulaCards: FormulaCard[];
  searchQuery?: string;
}

export const FormulaSheet: React.FC<FormulaSheetProps> = ({
  subjects,
  formulaCards,
  searchQuery = ''
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  let filtered = formulaCards;
  if (selectedSubjectId !== 'all') {
    filtered = filtered.filter(f => f.subjectId === selectedSubjectId);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.content.toLowerCase().includes(q) ||
      f.explanation.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </span>
          <h2 className="text-xl font-extrabold text-stone-900">
            CBSE Class 10 Formulas & Quick Revision Sheet
          </h2>
        </div>
        <p className="text-stone-600 text-xs sm:text-sm">
          Search and review key chemical equations, physics numerical formulas, math identities, history timelines, and grammar concepts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedSubjectId === 'all'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/90'
          }`}
        >
          All Subjects
        </button>

        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectId(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedSubjectId === s.id
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/90'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs font-medium">
            No formulas found matching your filter or query.
          </div>
        ) : (
          filtered.map(card => {
            const subj = subjects.find(s => s.id === card.subjectId);
            const isCopied = copiedId === card.id;

            return (
              <div
                key={card.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4.5 space-y-3 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {subj && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subj.badgeBg}`}>
                        {subj.name} - {card.chapterTitle}
                      </span>
                    )}

                    {card.isImportant && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" /> High Weightage
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-base">
                    {card.title}
                  </h3>

                  {/* Formula Code Box */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-emerald-800 font-bold leading-relaxed break-words flex items-start justify-between gap-2">
                    <span>{card.content}</span>
                    <button
                      onClick={() => handleCopy(card.id, card.content)}
                      className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                      title="Copy formula"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {card.explanation}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
