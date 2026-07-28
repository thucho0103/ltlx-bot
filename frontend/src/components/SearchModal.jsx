import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, questions = [], onSelectQuestion }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim() ? questions.filter(q => {
    const qLower = query.toLowerCase().trim();
    return q.question.toLowerCase().includes(qLower) || 
           q.explanation.toLowerCase().includes(qLower) ||
           q.id.toString() === qLower;
  }).slice(0, 15) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
        
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo từ khóa hoặc số câu (VD: 300, điểm liệt)..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-extrabold hover:text-slate-900">
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {!query.trim() ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold">Tra cứu từ khóa trong 600 câu hỏi sát hạch B2</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-semibold">
              Không tìm thấy câu hỏi phù hợp với "{query}"
            </div>
          ) : (
            results.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  onSelectQuestion(q);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="font-mono text-emerald-700">#Câu {q.id}</span>
                    <span className="text-slate-500 capitalize">• {q.category}</span>
                    {q.is_critical && (
                      <span className="text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Điểm liệt
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {q.question}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
