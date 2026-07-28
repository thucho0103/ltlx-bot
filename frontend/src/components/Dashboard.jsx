import React, { useState } from 'react';
import { 
  Play, 
  AlertTriangle, 
  Signpost, 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
  Truck,
  Heart,
  Compass,
  Wrench,
  MapPin
} from 'lucide-react';
import { getExamSets, CATEGORY_DETAILS } from '../services/api';

export default function Dashboard({ 
  onStartExam, 
  onSelectCategory, 
  setActiveTab, 
  stats,
  examHistory = []
}) {
  const examSets = getExamSets();
  const [expandedTip, setExpandedTip] = useState(null);

  const totalAnswered = stats.questionsAnswered || 0;
  const overallProgressPercent = Math.min(100, Math.round((totalAnswered / 600) * 100));
  const accuracy = totalAnswered > 0 ? Math.round((stats.correctAnswers / totalAnswered) * 100) : 0;

  const categoryIcons = {
    'luat': Scale,
    'nghiepvu': Truck,
    'daoduc': Heart,
    'kthuat': Compass,
    'cautao': Wrench,
    'bienbao': Signpost,
    'sahinh': MapPin
  };

  const tipsList = [
    {
      id: 1,
      title: 'Mẹo Chọn Đáp Án Nhanh Có Từ Khóa Tuyệt Đối',
      content: 'Gặp các câu hỏi có từ khóa trong đáp án như: "Bị nghiêm cấm", "Không được phép", "Không được mang vác", "Tuyệt đối không" -> Chọn NGAY đáp án đó làm đáp án đúng.'
    },
    {
      id: 2,
      title: 'Quy Tắc Nhường Đường Tại Ngã Tư (Sa Hình)',
      content: '1. Nhất lộ (Xe đã vào ngã tư) -> 2. Ưu tiên (Chữa cháy > Quân sự/Công an > Cấp cứu) -> 3. Đường ưu tiên (Xe trên đường chính) -> 4. Phải trống (Bên phải không vướng) -> 5. Rẽ phải > Đi thẳng > Rẽ trái.'
    },
    {
      id: 3,
      title: 'Quy Định Vòng Xuyến',
      content: '• Có vòng xuyến: Nhường đường cho xe đi từ bên TRÁI.\n• Không có vòng xuyến: Nhường đường cho xe đi từ bên PHẢI.'
    },
    {
      id: 4,
      title: 'Quy Định Nồng Độ Cồn & Chất Ma Túy',
      content: '• Nghiêm cấm tuyệt đối người điều khiển xe ô tô, mô tô lưu thông trên đường mà trong máu hoặc hơi thở có nồng độ cồn (Nghị định 100/NĐ-CP).'
    },
    {
      id: 5,
      title: 'Niên Hạn Sử Dụng Xe Ô Tô',
      content: '• Ô tô chở người trên 9 chỗ ngồi: 20 năm.\n• Ô tô tải / chở hàng: 25 năm.\n• Ô tô con (dưới 9 chỗ không kinh doanh): Không có niên hạn.'
    }
  ];

  const getExamStatus = (setId) => {
    const records = examHistory.filter(h => h.setId === setId);
    if (records.length === 0) return { label: 'Chưa làm', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    const passed = records.some(r => r.isPassed);
    if (passed) return { label: 'Đã Đạt', color: 'bg-emerald-100 text-emerald-700 border-emerald-300 font-bold' };
    return { label: 'Chưa Đạt', color: 'bg-rose-100 text-rose-700 border-rose-300 font-bold' };
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Bright Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-10 shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Bộ 600 Câu Hỏi Sát Hạch B2 Chuẩn 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ôn Thi Lý Thuyết Lái Xe <span className="underline decoration-emerald-300 decoration-4">Hạng B2</span>
            </h1>

            <p className="text-emerald-50 text-xs sm:text-base leading-relaxed max-w-xl">
              Hệ thống ôn luyện thông minh trọn bộ 600 câu hỏi sát hạch, 60 câu điểm liệt khẩn cấp, bộ 18 đề thi chuẩn Cục Đường Bộ & tra cứu 185 biển báo trực quan.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartExam(null)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm shadow-lg hover:bg-emerald-50 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-emerald-800" />
                <span>Thi Thử B2 Ngay</span>
              </button>

              <button
                onClick={() => {
                  onSelectCategory('diemliet');
                  setActiveTab('practice');
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500/20 border border-amber-300/40 text-white font-extrabold text-sm hover:bg-amber-500/30 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>60 Câu Điểm Liệt</span>
              </button>

              <button
                onClick={() => setActiveTab('signs')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-black/15 border border-white/20 text-white font-extrabold text-sm hover:bg-black/25 transition-all"
              >
                <Signpost className="w-4 h-4" />
                <span>Biển Báo</span>
              </button>
            </div>
          </div>

          {/* Right Progress Card */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-2xl p-6 text-slate-900 border border-emerald-100 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className="font-extrabold text-slate-900 text-sm">Tiến Độ Học Tập</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {totalAnswered} / 600 Câu
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Hoàn thành bài học</span>
                <span className="text-emerald-700 font-extrabold">{overallProgressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="text-[11px] text-slate-500 font-semibold">Tỉ Lệ Đúng</p>
                <p className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5">{accuracy}%</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="text-[11px] text-slate-500 font-semibold">Đề Đã Thi</p>
                <p className="text-base sm:text-lg font-extrabold text-teal-700 mt-0.5">{stats.examsAttempted || 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="text-[11px] text-slate-500 font-semibold">Đề Đạt</p>
                <p className="text-base sm:text-lg font-extrabold text-amber-600 mt-0.5">{stats.examsPassed || 0}</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 1: Bộ 18 Đề Thi Thử Sát Hạch B2 Standard */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Thi Thử Chuẩn Cục Đường Bộ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Bộ 18 Đề Thi Sát Hạch Hạng B2
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Mỗi đề 35 câu làm trong 22 phút • Đạt từ 32/35 câu & không sai câu điểm liệt
            </p>
          </div>

          <button
            onClick={() => onStartExam(null)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>Thi đề ngẫu nhiên</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile-First Exam Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {examSets.map((exam) => {
            const status = getExamStatus(exam.id);
            return (
              <div
                key={exam.id}
                onClick={() => onStartExam(exam.id)}
                className="glass-card group p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                      {exam.title}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {exam.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      35 câu
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      22 phút
                    </span>
                  </div>

                  <span className="font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Làm đề <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 7 Chủ Đề Lý Thuyết B2 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-teal-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Phân Loại Theo Chủ Đề</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            7 Chủ Đề Lý Thuyết Trọng Tâm
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Luyện tập từng chủ đề để nắm vững kiến thức trước khi bắt đầu thi thử
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.keys(CATEGORY_DETAILS).filter(key => key !== 'all').map((catKey) => {
            const cat = CATEGORY_DETAILS[catKey];
            const Icon = categoryIcons[catKey] || BookOpen;
            const isCriticalCat = catKey === 'diemliet';

            const catStats = stats.categoryProgress?.[catKey] || { answered: 0, correct: 0 };
            const catProgress = Math.min(100, Math.round((catStats.answered / cat.total) * 100));

            return (
              <div
                key={catKey}
                onClick={() => {
                  onSelectCategory(catKey);
                  setActiveTab('practice');
                }}
                className={`glass-card p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:border-emerald-500 active:scale-[0.99] ${
                  isCriticalCat 
                    ? 'border-amber-300 bg-amber-50/50 hover:border-amber-500' 
                    : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isCriticalCat ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                        {cat.name}
                      </h3>
                      <span className="text-xs font-bold text-slate-500 shrink-0 ml-1">
                        {cat.total} câu
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {cat.desc}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3.5 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Đã làm: {catStats.answered}/{cat.total}</span>
                        <span className="text-slate-700">{catProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isCriticalCat ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${catProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Mẹo Ghi Nhớ Nhanh */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700 border border-teal-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Mẹo Thi Lý Thuyết Nhanh & Chính Xác
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Từ khóa và quy tắc nhường đường quan trọng trong bài thi sát hạch B2
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {tipsList.map((tip) => {
            const isExpanded = expandedTip === tip.id;
            return (
              <div 
                key={tip.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] flex items-center justify-center font-extrabold shrink-0">
                      {tip.id}
                    </span>
                    {tip.title}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 whitespace-pre-line bg-white">
                    {tip.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
