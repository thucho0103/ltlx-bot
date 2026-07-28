import React, { useState, useMemo } from 'react';
import { 
  Signpost, 
  Search, 
  AlertOctagon, 
  AlertTriangle, 
  Compass, 
  Info, 
  ZoomIn, 
  X
} from 'lucide-react';

export default function SignsView({ questions = [], onOpenImage }) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSignModal, setActiveSignModal] = useState(null);

  const signGroups = [
    { id: 'all', name: 'Tất Cả Biển Báo', icon: Signpost },
    { id: 'cam', name: 'Biển Cấm', icon: AlertOctagon, color: 'text-rose-600' },
    { id: 'nguyhiem', name: 'Biển Nguy Hiểm', icon: AlertTriangle, color: 'text-amber-600' },
    { id: 'hieulenh', name: 'Biển Hiệu Lệnh', icon: Compass, color: 'text-teal-600' },
    { id: 'chidan', name: 'Biển Chỉ Dẫn', icon: Info, color: 'text-emerald-600' }
  ];

  const allSigns = useMemo(() => {
    const bienbaoQs = questions.filter(q => q.category === 'bienbao' && q.image);

    return bienbaoQs.map(q => {
      let group = 'other';
      const text = q.question.toLowerCase();

      if (text.includes('cấm')) group = 'cam';
      else if (text.includes('nguy hiểm') || text.includes('cảnh báo')) group = 'nguyhiem';
      else if (text.includes('hiệu lệnh') || text.includes('phải thi hành')) group = 'hieulenh';
      else if (text.includes('chỉ dẫn')) group = 'chidan';

      return {
        id: q.id,
        title: q.question,
        image: q.image,
        group,
        correctAnswer: q.options[q.answer],
        options: q.options,
        answer: q.answer,
        explanation: q.explanation
      };
    });
  }, [questions]);

  const filteredSigns = useMemo(() => {
    return allSigns.filter(sign => {
      const matchesGroup = selectedGroup === 'all' || sign.group === selectedGroup;
      const sLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !sLower || 
        sign.title.toLowerCase().includes(sLower) || 
        sign.explanation.toLowerCase().includes(sLower) ||
        sign.id.toString() === sLower;

      return matchesGroup && matchesSearch;
    });
  }, [allSigns, selectedGroup, searchQuery]);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      
      {/* Header & Search */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-teal-700 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Signpost className="w-4 h-4 text-teal-600" />
              <span>Thư Viện Biển Báo Đường Bộ</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tra Cứu Biển Báo Giao Thông (185 Biển Báo)
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Hệ thống tra cứu biển báo đầy đủ hình ảnh, ý nghĩa và quy tắc giao thông sát hạch B2
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm biển báo..."
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 border-t border-slate-100">
          {signGroups.map((grp) => {
            const Icon = grp.icon;
            const isActive = selectedGroup === grp.id;
            const count = grp.id === 'all' 
              ? allSigns.length 
              : allSigns.filter(s => s.group === grp.id).length;

            return (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : grp.color || 'text-slate-500'}`} />
                <span>{grp.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Signs Cards Grid */}
      {filteredSigns.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 shadow-sm space-y-2">
          <Signpost className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">Không tìm thấy biển báo phù hợp</h3>
          <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filteredSigns.map((sign) => (
            <div
              key={sign.id}
              onClick={() => setActiveSignModal(sign)}
              className="glass-card group p-3.5 sm:p-4 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between active:scale-[0.99]"
            >
              <div className="space-y-2.5">
                <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-200 flex items-center justify-center h-36 sm:h-40 overflow-hidden">
                  <img 
                    src={sign.image} 
                    alt={sign.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" 
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500">
                    <span className="font-mono text-emerald-700">#Câu {sign.id}</span>
                    <span className="capitalize">{sign.group}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                    {sign.title}
                  </h3>
                </div>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between font-bold">
                <span className="truncate max-w-[130px] text-slate-700">
                  ✓ {sign.correctAnswer}
                </span>
                <span className="text-emerald-700 font-extrabold shrink-0 flex items-center gap-0.5">
                  Xem <ZoomIn className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {activeSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-5 sm:p-7 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp relative">
            <button
              onClick={() => setActiveSignModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-52 flex items-center justify-center">
              <img 
                src={activeSignModal.image} 
                alt={activeSignModal.title}
                className="max-h-44 object-contain" 
              />
            </div>

            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                Câu hỏi #{activeSignModal.id}
              </span>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                {activeSignModal.title}
              </h3>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-extrabold">
                ✓ Đáp án đúng: {activeSignModal.correctAnswer}
              </div>

              <div className="space-y-1 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="font-extrabold text-slate-900">💡 Giải thích tác dụng biển báo:</p>
                <p>{activeSignModal.explanation}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveSignModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
