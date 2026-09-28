/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Subject, 
  Chapter, 
  QuizQuestion, 
  QuizAttempt, 
  WeakArea, 
  ToDoItem, 
  StudySession, 
  StudentProfile, 
  FormulaCard,
  VirtualPlant
} from './types';
import { 
  SUBJECTS, 
  INITIAL_CHAPTERS, 
  DEFAULT_STUDENT_PROFILE 
} from './data/cbseSyllabusData';
import { INITIAL_QUIZ_QUESTIONS } from './data/cbseQuizData';
import { INITIAL_FORMULA_CARDS } from './data/cbseFormulasData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SyllabusTracker } from './components/SyllabusTracker';
import { StudyTimer } from './components/StudyTimer';
import { QuizAnalytics } from './components/QuizAnalytics';
import { FormulaSheet } from './components/FormulaSheet';
import { SamplePaperTracker } from './components/SamplePaperTracker';
import { TargetExamModal } from './components/TargetExamModal';
import { AuthModal } from './components/AuthModal';

// Helper to generate a completely fresh 0% progress syllabus
function getCleanClearedChapters(chaps: Chapter[]): Chapter[] {
  return chaps.map(ch => ({
    ...ch,
    completed: false,
    confidence: 'medium' as const,
    lastStudiedDate: undefined,
    notes: '',
    topics: ch.topics.map(t => ({
      ...t,
      completed: false
    }))
  }));
}

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('cbse_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('cbse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Scroll hide / reveal state for Navigation & Header
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollUpDistance = 0;
    let scrollDownDistance = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Always keep header visible when near top of page (within 120px)
      if (currentScrollY <= 120) {
        setIsNavVisible(true);
        scrollUpDistance = 0;
        scrollDownDistance = 0;
      } else if (delta > 0) {
        // Scrolling down
        scrollUpDistance = 0;
        scrollDownDistance += delta;
        // Hide when scrolling down past 50px threshold
        if (scrollDownDistance > 50) {
          setIsNavVisible(false);
        }
      } else if (delta < 0) {
        // Scrolling up
        scrollDownDistance = 0;
        scrollUpDistance += Math.abs(delta);
        // Require strong, deliberate scroll up by at least 200px before revealing menu bar
        if (scrollUpDistance > 200) {
          setIsNavVisible(true);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('cbse_student_profile') || localStorage.getItem('cbse_profile');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('cbse_student_profile', JSON.stringify(profile));
  }, [profile]);

  // Target exam customizer modal & XP Level modal & Auth modal
  const [isTargetModalOpen, setIsTargetModalOpen] = useState<boolean>(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // 2. Virtual Plants & Garden Rewards
  const [virtualPlants, setVirtualPlants] = useState<VirtualPlant[]>(() => {
    const saved = localStorage.getItem('cbse_virtual_plants');
    if (saved) return JSON.parse(saved);
    // Starter plant badge
    return [
      {
        id: 'starter-plant',
        name: 'Focus Sprout',
        icon: '🌱',
        stage: 'sprout',
        earnedAt: new Date().toISOString(),
        sessionMinutes: 25,
        subjectName: 'CBSE Class 10'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('cbse_virtual_plants', JSON.stringify(virtualPlants));
  }, [virtualPlants]);

  // 3. Chapters State (Clean 0% completion state when cleared, with missing chapters auto-merged)
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('cbse_chapters');
    if (saved) {
      try {
        const parsed: Chapter[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(c => c.id));
        const missingChapters = getCleanClearedChapters(
          INITIAL_CHAPTERS.filter(c => !existingIds.has(c.id))
        );
        if (missingChapters.length > 0) {
          return [...parsed, ...missingChapters];
        }
        return parsed;
      } catch (e) {
        return getCleanClearedChapters(INITIAL_CHAPTERS);
      }
    }
    // Default to clean 0% progress
    return getCleanClearedChapters(INITIAL_CHAPTERS);
  });

  // Save chapters changes to localStorage
  useEffect(() => {
    localStorage.setItem('cbse_chapters', JSON.stringify(chapters));
  }, [chapters]);

  // 4. Quiz Questions & Attempts
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('cbse_quiz_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem('cbse_quiz_questions', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('cbse_quiz_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cbse_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // 5. To-Do Items State
  const [toDos, setToDos] = useState<ToDoItem[]>(() => {
    const saved = localStorage.getItem('cbse_todos');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cbse_todos', JSON.stringify(toDos));
  }, [toDos]);

  // 6. Study Sessions Log
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('cbse_study_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cbse_study_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Function to wipe out all progress across the entire app when requested by user
  const handleClearAllProgress = () => {
    const cleanChaps = getCleanClearedChapters(INITIAL_CHAPTERS);
    
    setChapters(cleanChaps);
    setToDos([]);
    setStudySessions([]);
    setQuizAttempts([]);
    setQuizQuestions(INITIAL_QUIZ_QUESTIONS);

    // Clear local storage
    localStorage.removeItem('cbse_chapters');
    localStorage.removeItem('cbse_todos');
    localStorage.removeItem('cbse_quiz_attempts');
    localStorage.removeItem('cbse_study_sessions');
    localStorage.removeItem('cbse_quiz_questions');
    localStorage.removeItem('cbse_sample_papers');

    // Save cleaned state
    localStorage.setItem('cbse_chapters', JSON.stringify(cleanChaps));
    localStorage.setItem('cbse_todos', JSON.stringify([]));
    localStorage.setItem('cbse_quiz_attempts', JSON.stringify([]));
    localStorage.setItem('cbse_study_sessions', JSON.stringify([]));
  };

  // 6. Navigation & Search State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 7. WEAK AREA COMPUTATION ENGINE
  // Dynamically computes weak chapters based on quiz attempts AND user confidence = 'low'
  const weakAreas = useMemo<WeakArea[]>(() => {
    const result: WeakArea[] = [];

    // Group attempts by chapter
    const attemptsByChapter: Record<string, QuizAttempt[]> = {};
    quizAttempts.forEach(att => {
      if (!attemptsByChapter[att.chapterId]) attemptsByChapter[att.chapterId] = [];
      attemptsByChapter[att.chapterId].push(att);
    });

    // Inspect all chapters
    chapters.forEach(ch => {
      const attempts = attemptsByChapter[ch.id] || [];
      let totalAcc = 0;
      attempts.forEach(a => { totalAcc += a.accuracy; });
      const avgAcc = attempts.length > 0 ? Math.round(totalAcc / attempts.length) : null;

      const isLowConfidence = ch.confidence === 'low';
      const isLowQuizAcc = avgAcc !== null && avgAcc < 60;

      if (isLowConfidence || isLowQuizAcc) {
        let severity: 'critical' | 'moderate' | 'mild' = 'moderate';
        if (isLowConfidence && isLowQuizAcc) severity = 'critical';
        else if (isLowConfidence) severity = 'moderate';
        else severity = 'mild';

        result.push({
          chapterId: ch.id,
          chapterTitle: `Ch ${ch.chapterNum}: ${ch.title}`,
          subjectId: ch.subjectId,
          accuracy: avgAcc !== null ? avgAcc : (isLowConfidence ? 45 : 55),
          totalAttempts: attempts.length,
          weaknessSeverity: severity,
          recommendedActions: [
            `Read NCERT Chapter ${ch.chapterNum} carefully`,
            `Solve NCERT Intext & Exercise Questions`,
            `Take 3-question AI Quiz to test concepts`
          ]
        });
      }
    });

    return result;
  }, [chapters, quizAttempts]);

  const handleOpenTab = (tab: string, filterSubj?: string) => {
    if (filterSubj) {
      setSelectedSubjectFilter(filterSubj);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-white pb-12 transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-[#020204] text-white' : 'bg-stone-50/80 text-stone-900'
    }`}>
      
      {/* Sticky Header & Menu Bar (slides up on scroll down, reveals on scroll up) */}
      <div className={`sticky top-0 z-40 transition-transform duration-300 ease-in-out ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Header */}
        <Header
          profile={profile}
          chapters={chapters}
          studySessions={studySessions}
          quizAttempts={quizAttempts}
          virtualPlants={virtualPlants}
          onOpenTab={handleOpenTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClearAllProgress={handleClearAllProgress}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          isXpModalOpen={isXpModalOpen}
          setIsXpModalOpen={setIsXpModalOpen}
        />

        {/* Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          weakChapterCount={weakAreas.length}
          chapters={chapters}
          studySessions={studySessions}
          quizAttempts={quizAttempts}
          virtualPlants={virtualPlants}
          onOpenXpModal={() => setIsXpModalOpen(true)}
        />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            subjects={SUBJECTS}
            chapters={chapters}
            weakAreas={weakAreas}
            toDos={toDos}
            setToDos={setToDos}
            studySessions={studySessions}
            profile={profile}
            virtualPlants={virtualPlants}
            quizAttempts={quizAttempts}
            onOpenTab={handleOpenTab}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusTracker
            subjects={SUBJECTS}
            chapters={chapters}
            setChapters={setChapters}
            setToDos={setToDos}
            selectedSubjectFilter={selectedSubjectFilter}
            searchQuery={searchQuery}
          />
        )}

        <div className={activeTab === 'timer' ? 'block' : 'hidden'}>
          <StudyTimer
            subjects={SUBJECTS}
            chapters={chapters}
            studySessions={studySessions}
            setStudySessions={setStudySessions}
            virtualPlants={virtualPlants}
            setVirtualPlants={setVirtualPlants}
          />
        </div>

        {activeTab === 'quiz' && (
          <QuizAnalytics
            subjects={SUBJECTS}
            chapters={chapters}
            quizQuestions={quizQuestions}
            setQuizQuestions={setQuizQuestions}
            quizAttempts={quizAttempts}
            setQuizAttempts={setQuizAttempts}
            weakAreas={weakAreas}
            onOpenTab={handleOpenTab}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaSheet
            subjects={SUBJECTS}
            formulaCards={INITIAL_FORMULA_CARDS}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'sample_papers' && (
          <SamplePaperTracker
            subjects={SUBJECTS}
          />
        )}

      </main>

      {/* Global App Footer */}
      <footer id="app-global-footer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 mt-8 border-t border-stone-200 dark:border-stone-800 text-center space-y-3">
        <p className="text-xs sm:text-sm font-extrabold text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          "Your dedication today builds your victory tomorrow. Believe in yourself, stay consistent, and conquer your Class 10 Board Exams with total confidence! 🌟"
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 dark:text-stone-300">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Created with ❤️ By Pushpam Kumar</span>
          <span className="text-stone-400 dark:text-stone-600">•</span>
          <span className="text-stone-600 dark:text-stone-400">StrackCBSE(Class10).io</span>
          <span className="text-stone-400 dark:text-stone-600">•</span>
          <span className="text-stone-600 dark:text-stone-400 font-medium">more projects on :-</span>
          <a
            id="footer-pamstudio-link"
            href="https://pamstudio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-900 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-100 font-extrabold transition-colors no-underline"
            title="Visit PAM Studio (pamstudio.vercel.app)"
          >
            PAM Studio
          </a>
        </div>
      </footer>

      {/* Target Exam Date Customizer Modal */}
      <TargetExamModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* In-Place Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
