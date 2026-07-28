// Frontend Pure Static Data & Storage Service (GitHub Pages Compatible)

let cachedQuestions = null;

// Load questions from static JSON file in public/data/questions.json
export async function getQuestions() {
  if (cachedQuestions) return cachedQuestions;

  try {
    const response = await fetch('./data/questions.json');
    if (response.ok) {
      cachedQuestions = await response.json();
      return cachedQuestions;
    }
  } catch (e) {
    console.error('[LTLX Static Service] Error loading questions data:', e);
  }

  return [];
}

// Category Details & Metadata
export const CATEGORY_DETAILS = {
  'all': { id: 'all', name: 'Tất Cả 600 Câu Hỏi', icon: 'book-open', total: 600, desc: 'Trọn bộ 600 câu hỏi sát hạch B2' },
  'diemliet': { id: 'diemliet', name: '60 Câu Điểm Liệt', icon: 'alert-triangle', total: 60, desc: 'Mất an toàn nghiêm trọng - Sai trượt ngay' },
  'luat': { id: 'luat', name: 'Luật Giao Thông', icon: 'scale', total: 166, desc: 'Quy tắc giao thông đường bộ cơ bản' },
  'nghiepvu': { id: 'nghiepvu', name: 'Nghiệp Vụ Vận Tải', icon: 'truck', total: 14, desc: 'Quy định vận tải hành khách & hàng hóa' },
  'daoduc': { id: 'daoduc', name: 'Văn Hóa & Đạo Đức', icon: 'heart', total: 25, desc: 'Văn hóa ứng xử của người lái xe' },
  'kthuat': { id: 'kthuat', name: 'Kỹ Thuật Lái Xe', icon: 'compass', total: 58, desc: 'Kỹ năng vận hành ô tô an toàn' },
  'cautao': { id: 'cautao', name: 'Cấu Tạo & Sửa Chữa', icon: 'tool', total: 37, desc: 'Kiến thức cấu tạo và sửa chữa cơ bản' },
  'bienbao': { id: 'bienbao', name: 'Hệ Thống Biển Báo', icon: 'signpost', total: 185, desc: 'Nhận biết biển báo cấm, cảnh báo, hiệu lệnh' },
  'sahinh': { id: 'sahinh', name: 'Giải Thế Sa Hình', icon: 'map-pin', total: 115, desc: 'Quy tắc nhường đường và sa hình ngã tư' }
};

// 18 Standard Exam Papers Generator
export function getExamSets() {
  const sets = [];
  for (let i = 1; i <= 18; i++) {
    sets.push({
      id: i,
      title: `Đề Thi Thử Số ${i}`,
      questionsCount: 35,
      timeMinutes: 22,
      passScore: 32,
      desc: `Đề thi chuẩn 35 câu sát hạch Hạng B2 (kèm 4 câu điểm liệt)`
    });
  }
  return sets;
}

// Generate Exam Paper (Seeded or Random)
export async function generateExamPaper(setId = null) {
  const allQs = await getQuestions();
  const criticalPool = allQs.filter(q => q.is_critical);
  const nonCriticalPool = allQs.filter(q => !q.is_critical);

  let selectedCritical = [];
  let selectedNonCritical = [];

  if (setId && typeof setId === 'number' && setId >= 1 && setId <= 18) {
    const seed = setId * 997;
    const seededSort = (arr, s) => {
      let currentSeed = s;
      return [...arr].sort(() => {
        let x = Math.sin(currentSeed++) * 10000;
        return (x - Math.floor(x)) - 0.5;
      });
    };

    selectedCritical = seededSort(criticalPool, seed).slice(0, 4);
    selectedNonCritical = seededSort(nonCriticalPool, seed + 100).slice(0, 31);
  } else {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    selectedCritical = shuffle(criticalPool).slice(0, 4);
    selectedNonCritical = shuffle(nonCriticalPool).slice(0, 31);
  }

  const examQuestions = [...selectedCritical, ...selectedNonCritical].sort(() => Math.random() - 0.5);

  return {
    setId: setId || 'random',
    title: setId ? `Đề Thi Số ${setId}` : 'Đề Thi Ngẫu Nhiên Hạng B2',
    timeMinutes: 22,
    totalQuestions: examQuestions.length,
    questions: examQuestions
  };
}

// Grade Exam Paper
export function evaluateExam(examQuestions, answers) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let criticalFail = false;
  const details = [];

  examQuestions.forEach((q, idx) => {
    const userAns = answers[idx];
    const isCorrect = userAns === q.answer;

    if (userAns === null || userAns === undefined) {
      unansweredCount++;
      details.push({
        question: q,
        userAnswer: null,
        correctAnswer: q.answer,
        status: 'unanswered'
      });
      if (q.is_critical) criticalFail = true;
    } else if (isCorrect) {
      correctCount++;
      details.push({
        question: q,
        userAnswer: userAns,
        correctAnswer: q.answer,
        status: 'correct'
      });
    } else {
      incorrectCount++;
      details.push({
        question: q,
        userAnswer: userAns,
        correctAnswer: q.answer,
        status: 'incorrect'
      });
      if (q.is_critical) criticalFail = true;
    }
  });

  const isPassed = correctCount >= 32 && !criticalFail;

  return {
    isPassed,
    score: correctCount,
    totalQuestions: examQuestions.length,
    requiredScore: 32,
    correctCount,
    incorrectCount,
    unansweredCount,
    criticalFail,
    failReason: criticalFail 
      ? 'Bạn đã làm sai hoặc bỏ trống câu hỏi ĐIỂM LIỆT (Tình huống gây mất an toàn giao thông nghiêm trọng).' 
      : (correctCount < 32 ? `Số câu trả lời đúng của bạn (${correctCount}) chưa đạt chỉ tiêu tối thiểu 32/35 câu.` : null),
    details
  };
}

// LocalStorage Persistence
const STATS_STORAGE_KEY = 'ltlx_b2_user_stats';
const BOOKMARKS_STORAGE_KEY = 'ltlx_b2_bookmarks';
const EXAM_HISTORY_STORAGE_KEY = 'ltlx_b2_exam_history';

export function getStoredStats() {
  try {
    const data = localStorage.getItem(STATS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return {
    questionsAnswered: 0,
    correctAnswers: 0,
    examsAttempted: 0,
    examsPassed: 0,
    categoryProgress: {}
  };
}

export function savePracticeProgress(questionId, category, isCorrect) {
  const stats = getStoredStats();
  stats.questionsAnswered += 1;
  if (isCorrect) stats.correctAnswers += 1;

  if (!stats.categoryProgress[category]) {
    stats.categoryProgress[category] = { answered: 0, correct: 0 };
  }
  stats.categoryProgress[category].answered += 1;
  if (isCorrect) stats.categoryProgress[category].correct += 1;

  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {}
  return stats;
}

export function saveExamResult(setId, result) {
  const stats = getStoredStats();
  stats.examsAttempted += 1;
  if (result.isPassed) stats.examsPassed += 1;

  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));

    const history = getExamHistory();
    history.unshift({
      setId,
      date: new Date().toISOString(),
      score: result.score,
      isPassed: result.isPassed,
      criticalFail: result.criticalFail
    });
    localStorage.setItem(EXAM_HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {}
  return stats;
}

export function getExamHistory() {
  try {
    const data = localStorage.getItem(EXAM_HISTORY_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

export function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

export function toggleBookmark(questionId) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(questionId);
  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(questionId);
  }
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {}
  return bookmarks;
}
