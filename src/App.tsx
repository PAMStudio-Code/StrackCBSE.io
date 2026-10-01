/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { loadStudentTrackerData, saveStudentTrackerData } from './lib/syncService';
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
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SyllabusTracker } from './components/SyllabusTracker';
import { StudyTimer } from './components/StudyTimer';
import { QuizAnalytics } from './components/QuizAnalytics';
import { FormulaSheet } from './components/FormulaSheet';
import { SamplePaperTracker } from './components/SamplePaperTracker';
import { TargetExamModal } from './components/TargetExamModal';
import { AuthModal } from './components/AuthModal';
import { STORAGE_KEYS, getMigratedStorageItem, migrateLocalStorage } from './utils/storage';

// Automatically perform migration from legacy keys ('strack_*', 'cbse_*') to 'stracked_*'
migrateLocalStorage();

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
    return (getMigratedStorageItem(STORAGE_KEYS.THEME, ['strack_theme', 'cbse_theme']) as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
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

  // Sidebar Collapsed & Mobile Drawer State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1200;
    }
    return false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.SETTINGS, ['strack_settings', 'cbse_student_profile', 'cbse_profile']);
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(profile));
    localStorage.setItem('cbse_student_profile', JSON.stringify(profile));
  }, [profile]);

  // Target exam customizer modal & XP Level modal & Auth modal
  const [isTargetModalOpen, setIsTargetModalOpen] = useState<boolean>(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Authentication & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const isInitialSyncDone = useRef(false);

  // 2. Virtual Plants & Garden Rewards
  const [virtualPlants, setVirtualPlants] = useState<VirtualPlant[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.VIRTUAL_PLANTS, ['strack_virtual_plants', 'cbse_virtual_plants']);
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
    localStorage.setItem(STORAGE_KEYS.VIRTUAL_PLANTS, JSON.stringify(virtualPlants));
    localStorage.setItem('cbse_virtual_plants', JSON.stringify(virtualPlants));
  }, [virtualPlants]);

  // 3. Chapters State (Clean 0% completion state when cleared, with missing chapters auto-merged)
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.SYLLABUS, ['strack_syllabus', 'cbse_chapters']);
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
    localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(chapters));
    localStorage.setItem('cbse_chapters', JSON.stringify(chapters));
  }, [chapters]);

  // 4. Quiz Questions & Attempts
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.QUIZ_QUESTIONS, ['strack_quiz_questions', 'cbse_quiz_questions']);
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_QUESTIONS, JSON.stringify(quizQuestions));
    localStorage.setItem('cbse_quiz_questions', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.QUIZ_ATTEMPTS, ['strack_quiz_attempts', 'cbse_quiz_attempts']);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(quizAttempts));
    localStorage.setItem('cbse_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // 5. To-Do Items State
  const [toDos, setToDos] = useState<ToDoItem[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.TASKS, ['strack_tasks', 'cbse_todos']);
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(toDos));
    localStorage.setItem('cbse_todos', JSON.stringify(toDos));
  }, [toDos]);

  // 6. Study Sessions Log
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = getMigratedStorageItem(STORAGE_KEYS.STUDY_SESSIONS, ['strack_study_sessions', 'cbse_study_sessions']);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(studySessions));
    localStorage.setItem('cbse_study_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Listen for user auth state and seamlessly sync tracker data with Firestore under users/${user.uid}/trackerData
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setSyncStatus('syncing');
        try {
          const remoteData = await loadStudentTrackerData(user.uid);
          if (remoteData) {
            // Apply remote data if present
            if (remoteData.chapters && Array.isArray(remoteData.chapters) && remoteData.chapters.length > 0) {
              setChapters(remoteData.chapters);
              localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(remoteData.chapters));
              localStorage.setItem('cbse_chapters', JSON.stringify(remoteData.chapters));
            }
            if (remoteData.toDos && Array.isArray(remoteData.toDos)) {
              setToDos(remoteData.toDos);
              localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(remoteData.toDos));
              localStorage.setItem('cbse_todos', JSON.stringify(remoteData.toDos));
            }
            if (remoteData.studySessions && Array.isArray(remoteData.studySessions)) {
              setStudySessions(remoteData.studySessions);
              localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(remoteData.studySessions));
              localStorage.setItem('cbse_study_sessions', JSON.stringify(remoteData.studySessions));
            }
            if (remoteData.quizAttempts && Array.isArray(remoteData.quizAttempts)) {
              setQuizAttempts(remoteData.quizAttempts);
              localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(remoteData.quizAttempts));
              localStorage.setItem('cbse_quiz_attempts', JSON.stringify(remoteData.quizAttempts));
            }
            if (remoteData.virtualPlants && Array.isArray(remoteData.virtualPlants)) {
              setVirtualPlants(remoteData.virtualPlants);
              localStorage.setItem(STORAGE_KEYS.VIRTUAL_PLANTS, JSON.stringify(remoteData.virtualPlants));
              localStorage.setItem('cbse_virtual_plants', JSON.stringify(remoteData.virtualPlants));
            }
            if (remoteData.quizQuestions && Array.isArray(remoteData.quizQuestions)) {
              setQuizQuestions(remoteData.quizQuestions);
              localStorage.setItem(STORAGE_KEYS.QUIZ_QUESTIONS, JSON.stringify(remoteData.quizQuestions));
              localStorage.setItem('cbse_quiz_questions', JSON.stringify(remoteData.quizQuestions));
            }
            if (remoteData.profile) {
              setProfile(prev => ({ ...prev, ...remoteData.profile }));
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...profile, ...remoteData.profile }));
              localStorage.setItem('cbse_student_profile', JSON.stringify({ ...profile, ...remoteData.profile }));
            }
            setSyncStatus('synced');
          } else {
            // First time login: seed Firestore with current local tasks and progress
            await saveStudentTrackerData(user.uid, {
              profile,
              chapters,
              toDos,
              studySessions,
              quizAttempts,
              virtualPlants,
              quizQuestions
            });
            setSyncStatus('synced');
          }
        } catch (err) {
          console.error('Failed to sync tracker data on login:', err);
          setSyncStatus('error');
        } finally {
          isInitialSyncDone.current = true;
        }
      } else {
        setSyncStatus('idle');
        isInitialSyncDone.current = true;
      }
    });

    return () => unsubscribe();
  }, []);

  // Seamlessly debounced sync to Firestore under users/${user.uid}/trackerData whenever tasks or progress change
  useEffect(() => {
    if (!currentUser || !isInitialSyncDone.current) return;

    const timer = setTimeout(async () => {
      setSyncStatus('syncing');
      const success = await saveStudentTrackerData(currentUser.uid, {
        profile,
        chapters,
        toDos,
        studySessions,
        quizAttempts,
        virtualPlants,
        quizQuestions
      });
      setSyncStatus(success ? 'synced' : 'error');
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentUser, profile, chapters, toDos, studySessions, quizAttempts, virtualPlants, quizQuestions]);

  // Function to wipe out all progress across the entire app when requested by user
  const handleClearAllProgress = () => {
    const cleanChaps = getCleanClearedChapters(INITIAL_CHAPTERS);
    
    setChapters(cleanChaps);
    setToDos([]);
    setStudySessions([]);
    setQuizAttempts([]);
    setQuizQuestions(INITIAL_QUIZ_QUESTIONS);

    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.SYLLABUS);
    localStorage.removeItem('cbse_chapters');
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem('cbse_todos');
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    localStorage.removeItem('cbse_quiz_attempts');
    localStorage.removeItem(STORAGE_KEYS.STUDY_SESSIONS);
    localStorage.removeItem('cbse_study_sessions');
    localStorage.removeItem(STORAGE_KEYS.QUIZ_QUESTIONS);
    localStorage.removeItem('cbse_quiz_questions');
    localStorage.removeItem(STORAGE_KEYS.SAMPLE_PAPERS);
    localStorage.removeItem('cbse_sample_papers');

    // Save cleaned state
    localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(cleanChaps));
    localStorage.setItem('cbse_chapters', JSON.stringify(cleanChaps));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    localStorage.setItem('cbse_todos', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify([]));
    localStorage.setItem('cbse_quiz_attempts', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify([]));
    localStorage.setItem('cbse_study_sessions', JSON.stringify([]));

    // Also sync cleared state to Firestore if user is authenticated
    if (currentUser) {
      saveStudentTrackerData(currentUser.uid, {
        profile,
        chapters: cleanChaps,
        toDos: [],
        studySessions: [],
        quizAttempts: [],
        virtualPlants: [],
        quizQuestions: INITIAL_QUIZ_QUESTIONS
      }).catch(console.error);
    }
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
    <div className={`min-h-screen flex font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-[#020204] text-white' : 'bg-stone-50/80 text-stone-900'
    }`}>
      
      {/* Modern Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        weakChapterCount={weakAreas.length}
        onClearAllProgress={handleClearAllProgress}
        onOpenTargetModal={() => setIsTargetModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        profile={profile}
      />

      {/* Main Content Area beside Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Streamlined Slim Top Header */}
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setIsMobileSidebarOpen(prev => !prev);
            } else {
              setIsSidebarCollapsed(prev => !prev);
            }
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          profile={profile}
          chapters={chapters}
          studySessions={studySessions}
          quizAttempts={quizAttempts}
          virtualPlants={virtualPlants}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          onOpenTab={handleOpenTab}
          isXpModalOpen={isXpModalOpen}
          setIsXpModalOpen={setIsXpModalOpen}
        />

        {/* Scrollable Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          
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
        <footer id="app-global-footer" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 mt-auto border-t border-stone-200 dark:border-stone-800 text-center space-y-3">
          <p className="text-xs sm:text-sm font-extrabold text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            "Your dedication today builds your victory tomorrow. Believe in yourself, stay consistent, and conquer your Class 10 Board Exams with total confidence! 🌟"
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 dark:text-stone-300">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Created with ❤️ By Pushpam Kumar</span>
            <span className="text-stone-400 dark:text-stone-600">•</span>
            <span className="text-stone-600 dark:text-stone-400 font-bold">Stracked</span>
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

      </div>

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
