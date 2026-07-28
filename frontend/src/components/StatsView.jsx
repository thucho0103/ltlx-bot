import React from 'react';
import { 
  BarChart2, 
  Award, 
  BookOpen, 
  Bookmark, 
  Clock, 
  Sparkles,
  Target,
  ArrowRight
} from 'lucide-react';
import { CATEGORY_DETAILS, getBookmarks, getExamHistory } from '../services/api';

export default function StatsView({ stats, questions = [], onSelectCategory, setActiveTab }) {
  const bookmarks = getBookmarks();
  const examHistory = getExamHistory();

  const totalAnswered = stats.questionsAnswered || 0;
  const accuracy = totalAnswered > 0 ? Math.round((stats.correctAnswers / totalAnswered) * 100) : 0;
  const passRate = stats.examsAttempted > 0 ? Math.round((stats.examsPassed / stats.examsAttempted) * 100) : 0;

  const bookmarkedQs = questions.filter(q => bookmarks.includes(q.id));

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Thống Kê Tiến Độ B2</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bảng Thống Kê Học Tập Cá Nhân
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Theo dõi tổng quan tiến độ làm bài, tỉ lệ trả lời đúng và lịch sử thi thử sát hạch
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Đã Làm</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalAnswered}</p>
          <p className="text-[11px] text-slate-500">Trên 600 câu B2</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tỉ Lệ Đúng</span>
            <Target className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">{accuracy}%</p>
          <p className="text-[11px] text-slate-500">{stats.correctAnswers || 0} câu đúng</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Số Đề Đạt</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.examsPassed || 0}</p>
          <p className="text-[11px] text-slate-500">Trên {stats.examsAttempted || 0} lần thi</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tỉ Lệ Thi Đỗ</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{passRate}%</p>
          <p className="text-[11px] text-slate-500">Chỉ tiêu ≥ 32/35</p>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Tiến Độ Theo 7 Chủ Đề Lý Thuyết</span>
        </h2>

        <div className="space-y-3">
          {Object.keys(CATEGORY_DETAILS).filter(k => k !== 'all').map((catKey) => {
            const cat = CATEGORY_DETAILS[catKey];
            const catData = stats.categoryProgress?.[catKey] || { answered: 0, correct: 0 };
            const percent = Math.min(100, Math.round((catData.answered / cat.total) * 100));
            const catAccuracy = catData.answered > 0 ? Math.round((catData.correct / catData.answered) * 100) : 0;

            return (
              <div key={catKey} className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-extrabold text-slate-900">{cat.name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 font-semibold">Đã làm: <strong className="text-slate-900">{catData.answered}/{cat.total}</strong></span>
                    <span className="text-emerald-700 font-extrabold">Đúng {catAccuracy}%</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      {examHistory.length > 0 && (
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Lịch Sử Thi Thử ({examHistory.length} Lần)</span>
          </h2>

          <div className="space-y-2">
            {examHistory.slice(0, 10).map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.isPassed ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  <span className="font-extrabold text-slate-900">Đề Thi #{item.setId}</span>
                  <span className="text-slate-500 text-xs hidden sm:inline font-semibold">
                    {new Date(item.date).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-extrabold">
                  <span className="text-slate-700">{item.score}/35 câu</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                    item.isPassed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {item.isPassed ? 'ĐẠT' : 'TRƯỢT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Câu Hỏi Đã Lưu ({bookmarkedQs.length})</span>
          </h2>

          {bookmarkedQs.length > 0 && (
            <button
              onClick={() => {
                onSelectCategory('bookmarks');
                setActiveTab('practice');
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
            >
              <span>Luyện tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {bookmarkedQs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            Bạn chưa lưu câu hỏi nào. Nhấn biểu tượng Lưu khi làm bài để xem lại sau!
          </p>
        ) : (
          <div className="space-y-2">
            {bookmarkedQs.map((q) => (
              <div key={q.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold">
                <span className="font-extrabold text-slate-900 truncate max-w-xl">
                  #Câu {q.id}: {q.question}
                </span>
                <span className="text-emerald-700 font-extrabold shrink-0 ml-2">
                  {q.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
