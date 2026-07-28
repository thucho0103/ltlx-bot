import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  RotateCcw, 
  Award, 
  Grid, 
  Flag,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateExamPaper, evaluateExam, saveExamResult } from '../services/api';

export default function ExamView({ 
  setId = null, 
  onOpenImage, 
  onBackToDashboard,
  onStatsUpdate
}) {
  const [examState, setExamState] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(22 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  useEffect(() => {
    async function initExam() {
      const paper = await generateExamPaper(setId);
      setExamState(paper);
      setUserAnswers(Array(paper.questions.length).fill(null));
      setFlaggedQuestions(new Set());
      setTimeLeftSeconds(paper.timeMinutes * 60);
      setIsSubmitted(false);
      setExamResult(null);
      setCurrentIndex(0);
    }
    initExam();
  }, [setId]);

  useEffect(() => {
    if (isSubmitted || !examState) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, examState]);

  if (!examState) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm space-y-3">
        <Sparkles className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
        <p className="text-slate-700 font-extrabold text-base">Đang khởi tạo bài thi B2...</p>
      </div>
    );
  }

  const currentQ = examState.questions[currentIndex];

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    const updated = [...userAnswers];
    updated[currentIndex] = optIndex;
    setUserAnswers(updated);
  };

  const handleToggleFlag = () => {
    const updated = new Set(flaggedQuestions);
    if (updated.has(currentIndex)) {
      updated.delete(currentIndex);
    } else {
      updated.add(currentIndex);
    }
    setFlaggedQuestions(updated);
  };

  const handleSubmitExam = (isTimeout = false) => {
    setShowSubmitConfirm(false);
    const result = evaluateExam(examState.questions, userAnswers);
    setExamResult(result);
    setIsSubmitted(true);

    const updatedStats = saveExamResult(examState.setId, result);
    if (onStatsUpdate) onStatsUpdate(updatedStats);

    if (result.isPassed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds <= 3 * 60;
  const unansweredCount = userAnswers.filter(a => a === null).length;

  return (
    <div className="space-y-5 pb-16 max-w-5xl mx-auto">

      {/* Top Header Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm">
            {examState.title}
          </span>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            35 câu • 22 phút • Đạt ≥ 32 câu
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-extrabold font-mono transition-colors ${
              isLowTime 
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-600' : 'text-emerald-600'}`} />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          )}

          <button
            onClick={() => setShowQuestionGrid(!showQuestionGrid)}
            className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold border border-slate-200"
          >
            <Grid className="w-4 h-4 text-emerald-600" />
            <span>({currentIndex + 1}/35)</span>
          </button>

          {!isSubmitted && (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp Bài</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Layout */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Question Box */}
          <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-200">
                  Câu {currentIndex + 1} / 35
                </span>

                {currentQ.is_critical && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ĐIỂM LIỆT
                  </span>
                )}
              </div>

              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                  flaggedQuestions.has(currentIndex)
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentIndex) ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{flaggedQuestions.has(currentIndex) ? 'Đã đánh dấu' : 'Xem lại'}</span>
              </button>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-relaxed">
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
                    className="w-full h-auto max-h-[320px] object-contain mx-auto" 
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                      <ZoomIn className="w-4 h-4" /> Xem Phóng To
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Choices */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 touch-target ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-extrabold shadow-sm' 
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-snug pt-1 font-semibold">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold disabled:opacity-40 hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu Trước</span>
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(examState.questions.length - 1, prev + 1))}
                disabled={currentIndex === examState.questions.length - 1}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 disabled:opacity-40 hover:bg-emerald-700 transition-all"
              >
                <span>Câu Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* 35 Question Matrix */}
          <div className={`lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 ${
            showQuestionGrid ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-slate-900 text-sm">Danh Sách 35 Câu Hỏi</span>
              <span className="text-xs font-extrabold text-emerald-700">
                Đã làm {userAnswers.filter(a => a !== null).length}/35
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
              {examState.questions.map((q, idx) => {
                const isAnswered = userAnswers[idx] !== null;
                const isCurrent = currentIndex === idx;
                const isFlagged = flaggedQuestions.has(idx);

                let btnStyle = 'bg-slate-50 text-slate-600 border-slate-200';
                if (isAnswered) btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold';
                if (isFlagged) btnStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold';
                if (isCurrent) btnStyle += ' ring-2 ring-emerald-600 ring-offset-1';

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-bold flex flex-col items-center justify-center relative transition-all ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {q.is_critical && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500" title="Câu điểm liệt" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300" />
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-50 border border-slate-200" />
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                <span>Đã đánh dấu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Điểm liệt</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Exam Results Screen */
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
          
          <div className={`p-6 sm:p-8 rounded-3xl text-center border space-y-4 ${
            examResult.isPassed 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white shadow-sm border border-slate-200">
              {examResult.isPassed ? (
                <Award className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600" />
              )}
            </div>

            <h2 className={`text-2xl sm:text-4xl font-extrabold ${
              examResult.isPassed ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {examResult.isPassed ? 'KẾT QUẢ: THI ĐẠT (PASSED)' : 'KẾT QUẢ: THI TRƯỢT (FAILED)'}
            </h2>

            <p className="text-slate-700 text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed">
              {examResult.failReason || 'Chúc mừng bạn đã hoàn thành xuất sắc bài thi thử sát hạch GPLX Hạng B2!'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[11px] text-slate-500 font-semibold">Số Câu Đúng</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{examResult.correctCount}/35</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[11px] text-slate-500 font-semibold">Số Câu Sai</p>
                <p className="text-xl font-extrabold text-rose-700 mt-0.5">{examResult.incorrectCount}</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[11px] text-slate-500 font-semibold">Bỏ Trống</p>
                <p className="text-xl font-extrabold text-amber-700 mt-0.5">{examResult.unansweredCount}</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-[11px] text-slate-500 font-semibold">Câu Điểm Liệt</p>
                <p className={`text-xl font-extrabold mt-0.5 ${examResult.criticalFail ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {examResult.criticalFail ? 'SAI' : 'ĐÚNG'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setExamState(null);
                  setIsSubmitted(false);
                  setTimeout(() => {
                    generateExamPaper(setId).then(paper => {
                      setExamState(paper);
                      setUserAnswers(Array(paper.questions.length).fill(null));
                      setTimeLeftSeconds(22 * 60);
                    });
                  }, 100);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thi Lại Đề Này</span>
              </button>

              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                <span>Về Trang Chủ</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Chi Tiết Bài Làm ({examResult.details.length} Câu)
            </h3>

            <div className="space-y-3">
              {examResult.details.map((item, idx) => {
                const q = item.question;
                const isCorrect = item.status === 'correct';

                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2.5 ${
                      isCorrect 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {idx + 1}
                        </span>

                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {q.question}
                        </span>
                      </div>

                      {q.is_critical && (
                        <span className="shrink-0 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          Điểm Liệt
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className={`p-2.5 rounded-xl border ${
                        isCorrect 
                          ? 'bg-emerald-100/50 border-emerald-200 text-emerald-900' 
                          : 'bg-rose-100/50 border-rose-200 text-rose-900'
                      }`}>
                        <span className="font-bold block mb-0.5">Bạn chọn:</span>
                        {item.userAnswer !== null ? q.options[item.userAnswer] : 'Chưa trả lời'}
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-100/50 border border-emerald-200 text-emerald-900">
                        <span className="font-bold block mb-0.5">Đáp án đúng:</span>
                        {q.options[q.answer]}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      💡 <span className="font-bold text-emerald-700">Giải thích:</span> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">Xác Nhận Nộp Bài Thi</h3>
              {unansweredCount > 0 ? (
                <p className="text-xs text-amber-800 font-semibold">
                  ⚠️ Bạn còn <span className="font-extrabold text-rose-700">{unansweredCount} câu chưa trả lời</span>. Bạn có chắc chắn nộp bài không?
                </p>
              ) : (
                <p className="text-xs text-slate-600 font-medium">
                  Bạn đã hoàn thành 35 câu hỏi. Nhấn nộp bài để xem kết quả!
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200 transition-colors"
              >
                Làm Tiếp
              </button>

              <button
                onClick={() => handleSubmitExam(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                Nộp Bài Ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
