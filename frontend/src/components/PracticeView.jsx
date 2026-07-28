import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Bookmark, 
  ExternalLink,
  ZoomIn,
  HelpCircle
} from 'lucide-react';
import { CATEGORY_DETAILS, savePracticeProgress, toggleBookmark, getBookmarks } from '../services/api';

const PDF_SOURCE_URL = 'https://cdn.thuvienphapluat.vn/uploads/OnThiGiayPhepLaiXe/On-thi-gplx-hang-b2-2023.pdf';

export default function PracticeView({ 
  questions = [], 
  selectedCategory = 'all', 
  onCategoryChange,
  onOpenImage,
  onStatsUpdate
}) {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  useEffect(() => {
    let result = [];
    if (selectedCategory === 'all') {
      result = questions;
    } else if (selectedCategory === 'diemliet') {
      result = questions.filter(q => q.is_critical);
    } else if (selectedCategory === 'bookmarks') {
      const bSet = new Set(bookmarks);
      result = questions.filter(q => bSet.has(q.id));
    } else {
      result = questions.filter(q => q.category === selectedCategory);
    }

    setFilteredQuestions(result);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [selectedCategory, questions, bookmarks]);

  const currentQ = filteredQuestions[currentIndex];
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.answer;
    const updatedStats = savePracticeProgress(currentQ.id, currentQ.category, isCorrect);
    if (onStatsUpdate) onStatsUpdate(updatedStats);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleRandom = () => {
    if (filteredQuestions.length > 1) {
      let rand = Math.floor(Math.random() * filteredQuestions.length);
      if (rand === currentIndex) rand = (rand + 1) % filteredQuestions.length;
      setCurrentIndex(rand);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleBookmarkToggle = () => {
    if (!currentQ) return;
    const updated = toggleBookmark(currentQ.id);
    setBookmarks(updated);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (!isAnswered && currentQ && currentQ.options) {
        if (e.key === '1' && currentQ.options[0]) handleSelectOption(0);
        if (e.key === '2' && currentQ.options[1]) handleSelectOption(1);
        if (e.key === '3' && currentQ.options[2]) handleSelectOption(2);
        if (e.key === '4' && currentQ.options[3]) handleSelectOption(3);
      }

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnswered, currentQ, filteredQuestions]);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Scrollable Category Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {Object.keys(CATEGORY_DETAILS).map((catKey) => {
          const cat = CATEGORY_DETAILS[catKey];
          const isActive = selectedCategory === catKey;
          const isCritical = catKey === 'diemliet';

          return (
            <button
              key={catKey}
              onClick={() => onCategoryChange(catKey)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                isActive 
                  ? (isCritical ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20')
                  : (isCritical ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.total}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => onCategoryChange('bookmarks')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            selectedCategory === 'bookmarks'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
          <span>Đã Lưu ({bookmarks.length})</span>
        </button>
      </div>

      {/* Main Question Card Area */}
      {!currentQ ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 space-y-3 shadow-sm">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900">Không Tìm Thấy Câu Hỏi</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            {selectedCategory === 'bookmarks' 
              ? 'Bạn chưa lưu câu hỏi nào. Nhấn biểu tượng Đã lưu khi ôn tập để xem lại bất cứ lúc nào!'
              : 'Không có câu hỏi nào trong danh mục này.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 space-y-6 shadow-sm">
          
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-emerald-800 font-extrabold text-xs sm:text-sm border border-slate-200">
                Câu {currentIndex + 1} / {filteredQuestions.length}
              </span>

              <span className="text-xs font-semibold text-slate-400">
                (#{currentQ.id})
              </span>

              {currentQ.is_critical && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ĐIỂM LIỆT
                </span>
              )}
            </div>

            <button
              onClick={handleBookmarkToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Đã lưu' : 'Lưu câu này'}</span>
            </button>
          </div>

          {/* Question Title */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-relaxed tracking-tight">
              {currentQ.question}
            </h2>

            {currentQ.image && (
              <div 
                onClick={() => onOpenImage(currentQ.image, currentQ.question)}
                className="relative group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 max-w-xl mx-auto cursor-pointer p-2"
              >
                <img 
                  src={currentQ.image} 
                  alt={`Minh họa câu ${currentQ.id}`}
                  className="w-full h-auto max-h-[340px] object-contain mx-auto" 
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                    <ZoomIn className="w-4 h-4" /> Xem Phóng To
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Choices Grid - Touch Optimized */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === idx;
              const isCorrectOption = idx === currentQ.answer;

              let buttonStyle = 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-800';
              let badgeStyle = 'bg-slate-200 text-slate-700 font-extrabold';

              if (isAnswered) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold shadow-sm';
                  badgeStyle = 'bg-emerald-600 text-white font-extrabold';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                  badgeStyle = 'bg-rose-600 text-white font-extrabold';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 touch-target ${buttonStyle} ${
                    !isAnswered ? 'active:scale-[0.99]' : ''
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5 ${badgeStyle}`}>
                    {optionLetter}
                  </span>

                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm sm:text-base leading-snug font-semibold">
                      {option}
                    </p>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 pt-1">
                      {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 animate-fadeIn ${
              selectedAnswer === currentQ.answer 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
                  {selectedAnswer === currentQ.answer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700">CHÍNH XÁC!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="text-rose-700">CHƯA CHÍNH XÁC!</span>
                    </>
                  )}
                </div>

                <a
                  href={PDF_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-700"
                >
                  <span>File PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-extrabold uppercase tracking-wider text-slate-700">
                  💡 Giải thích chi tiết:
                </p>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold disabled:opacity-40 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            <button
              onClick={handleRandom}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-xs font-extrabold hover:bg-teal-100 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Ngẫu Nhiên</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredQuestions.length - 1}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 disabled:opacity-40 hover:bg-emerald-700 transition-all"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
