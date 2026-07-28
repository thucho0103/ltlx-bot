import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PracticeView from './components/PracticeView';
import ExamView from './components/ExamView';
import SignsView from './components/SignsView';
import StatsView from './components/StatsView';
import SearchModal from './components/SearchModal';
import ImageModal from './components/ImageModal';
import { getQuestions, getStoredStats, getBookmarks } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeExamSetId, setActiveExamSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(getStoredStats());
  const [bookmarksCount, setBookmarksCount] = useState(getBookmarks().length);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getQuestions();
      setQuestions(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const updateStatsAndBookmarks = (newStats) => {
    if (newStats) setStats(newStats);
    setBookmarksCount(getBookmarks().length);
  };

  const handleStartExam = (setId = null) => {
    setActiveExamSetId(setId);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catKey) => {
    setSelectedCategory(catKey);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenImage = (url, title) => {
    setModalImage({ url, title });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        stats={stats}
        bookmarksCount={bookmarksCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 pb-20">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            <p className="text-slate-600 font-extrabold text-xs sm:text-sm">Đang tải dữ liệu 600 câu hỏi B2...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                onStartExam={handleStartExam}
                onSelectCategory={handleSelectCategory}
                setActiveTab={setActiveTab}
                stats={stats}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeView 
                questions={questions}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  setBookmarksCount(getBookmarks().length);
                }}
                onOpenImage={handleOpenImage}
                onStatsUpdate={updateStatsAndBookmarks}
              />
            )}

            {activeTab === 'exam' && (
              <ExamView 
                setId={activeExamSetId}
                onOpenImage={handleOpenImage}
                onBackToDashboard={() => setActiveTab('dashboard')}
                onStatsUpdate={updateStatsAndBookmarks}
              />
            )}

            {activeTab === 'signs' && (
              <SignsView 
                questions={questions}
                onOpenImage={handleOpenImage}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView 
                stats={stats}
                questions={questions}
                onSelectCategory={handleSelectCategory}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}

      </main>

      {/* Global Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        onSelectQuestion={(q) => {
          setSelectedCategory(q.category);
          setActiveTab('practice');
        }}
      />

      {/* Global Image Modal */}
      {modalImage && (
        <ImageModal 
          imageUrl={modalImage.url}
          title={modalImage.title}
          onClose={() => setModalImage(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1 font-medium">
          <p className="font-extrabold text-slate-700">
            Ứng Dụng Học Lý Thuyết Lái Xe Hạng B2 (Trọn Bộ 600 Câu Hỏi GTVT 2026)
          </p>
          <p className="text-[11px] text-slate-400">
            Dữ liệu câu hỏi & hình ảnh thuộc bản quyền của Cục Đường Bộ Việt Nam. Thiết kế tối ưu cho GitHub Pages.
          </p>
        </div>
      </footer>

    </div>
  );
}
