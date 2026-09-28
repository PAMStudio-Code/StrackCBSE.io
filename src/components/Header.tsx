import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, Calendar, CheckCircle2, Flame, Search, Target, ChevronRight, RotateCcw, Layers, Sparkles, Trophy, Edit3, Sun, Moon, Building2, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { StudentProfile, Chapter, StudySession, QuizAttempt, VirtualPlant } from '../types';
import { calculateTotalXp, getLevelInfo } from '../utils/xpSystem';

interface HeaderProps {
  profile: StudentProfile;
  chapters: Chapter[];
  studySessions?: StudySession[];
  quizAttempts?: QuizAttempt[];
  virtualPlants?: VirtualPlant[];
  onOpenTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClearAllProgress?: () => void;
  onOpenTargetModal?: () => void;
  onOpenAuthModal?: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  isXpModalOpen?: boolean;
  setIsXpModalOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  chapters,
  studySessions = [],
  quizAttempts = [],
  virtualPlants = [],
  onOpenTab,
  searchQuery,
  setSearchQuery,
  onClearAllProgress,
  onOpenTargetModal,
  onOpenAuthModal,
  theme = 'light',
  toggleTheme,
  isXpModalOpen,
  setIsXpModalOpen
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [halfYearlyDays, setHalfYearlyDays] = useState<number>(0);
  const [preBoard1Days, setPreBoard1Days] = useState<number>(0);
  const [preBoard2Days, setPreBoard2Days] = useState<number>(0);
  const [localShowXpModal, setLocalShowXpModal] = useState<boolean>(false);
  const [showClearWarningModal, setShowClearWarningModal] = useState<boolean>(false);

  const showXpModal = isXpModalOpen !== undefined ? isXpModalOpen : localShowXpModal;
  const setShowXpModal = (val: boolean) => {
    if (setIsXpModalOpen) setIsXpModalOpen(val);
    else setLocalShowXpModal(val);
  };

  // Calculate XP & Level
  const totalXp = calculateTotalXp(chapters, studySessions, quizAttempts, virtualPlants);
  const levelInfo = getLevelInfo(totalXp);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Helper function to calculate remaining days until the next upcoming occurrence of an exam date
      const getNextExamDays = (targetMonth: number, targetDay: number) => {
        let targetDate = new Date(currentYear, targetMonth, targetDay, 9, 0, 0);
        if (now > targetDate) {
          targetDate = new Date(currentYear + 1, targetMonth, targetDay, 9, 0, 0);
        }
        const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
      };

      // Board Exam Target (Finals)
      const examDate = new Date(profile.boardExamDate || "2027-02-15").getTime();
      const diff = Math.ceil((examDate - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff > 0 ? diff : 0);

      // Half-Yearly Exam (Sept 5)
      setHalfYearlyDays(getNextExamDays(8, 5));

      // Pre-Board 1 Exam (Dec 15)
      setPreBoard1Days(getNextExamDays(11, 15));

      // Pre-Board 2 Exam (Jan 10)
      setPreBoard2Days(getNextExamDays(0, 10));
    };

    calculateDays();
    const timer = setInterval(calculateDays, 3600000);
    return () => clearInterval(timer);
  }, [profile.boardExamDate]);

  // Calculate total topics & completed topics
  const totalTopics = chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
  const completedTopics = chapters.reduce(
    (acc, ch) => acc + ch.topics.filter(t => t.completed).length,
    0
  );
  const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <header className="bg-white/90 dark:bg-[#030305]/95 backdrop-blur-md text-stone-900 dark:text-white border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-2xs">
              <img src="/favicon.svg" alt="Strack Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  CBSE CLASS 10
                </span>
                
                {/* Level Badge Button */}
                <button
                  onClick={() => setShowXpModal(true)}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer ${levelInfo.badgeBg} ${levelInfo.badgeTextColor}`}
                  title="Click to view Student Level & Rewards breakdown"
                >
                  <span>{levelInfo.icon}</span>
                  <span>Lvl {levelInfo.level}: {levelInfo.title}</span>
                </button>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white bg-black dark:bg-stone-950 px-3.5 py-1.5 rounded-xl border border-stone-800 shadow-md inline-flex items-center gap-2">
                StrackCBSE(Class10).io
              </h1>
            </div>
          </div>

          {/* Right Metrics & Exam Countdowns */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Exam Milestones Bar (Half-Yearly, Pre-Boards, Board Finals) */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/90 rounded-2xl p-1 shadow-2xs">
              
              {/* Half-Yearly Tracker */}
              <div 
                onClick={onOpenTargetModal}
                className="px-2.5 py-1 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer text-left group"
                title="Half-Yearly Exams (1st week of September)"
              >
                <div className="text-[9px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-0.5">
                  <span>Half-Yearly</span>
                </div>
                <div className="text-xs font-black text-stone-800 flex items-baseline gap-0.5">
                  <span className="text-teal-700">{halfYearlyDays}</span>
                  <span className="text-[9px] font-normal text-stone-500">days</span>
                </div>
              </div>

              <div className="h-6 w-px bg-stone-200"></div>

              {/* Pre-Board 1 Tracker */}
              <div 
                onClick={onOpenTargetModal}
                className="px-2.5 py-1 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer text-left group"
                title="Pre-Board 1 Exams (Mid December)"
              >
                <div className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">
                  Pre-Board 1
                </div>
                <div className="text-xs font-black text-stone-800 flex items-baseline gap-0.5">
                  <span className="text-purple-700">{preBoard1Days}</span>
                  <span className="text-[9px] font-normal text-stone-500">days</span>
                </div>
              </div>

              <div className="h-6 w-px bg-stone-200"></div>

              {/* Pre-Board 2 Tracker */}
              <div 
                onClick={onOpenTargetModal}
                className="px-2.5 py-1 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer text-left group"
                title="Pre-Board 2 Exams (Early January)"
              >
                <div className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">
                  Pre-Board 2
                </div>
                <div className="text-xs font-black text-stone-800 flex items-baseline gap-0.5">
                  <span className="text-indigo-700">{preBoard2Days}</span>
                  <span className="text-[9px] font-normal text-stone-500">days</span>
                </div>
              </div>

              <div className="h-6 w-px bg-stone-200"></div>

              {/* Main Board Exam Target Badge */}
              <div 
                onClick={onOpenTargetModal}
                className="bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 rounded-xl px-2.5 py-1 flex items-center gap-1.5 cursor-pointer transition-colors group"
                title="Main Board Finals Target (Click to edit date)"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-0.5">
                    <span>{profile.targetExamName || "Board Finals"}</span>
                    <Edit3 className="w-2 h-2 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs font-black text-amber-900 flex items-baseline gap-0.5">
                    <span>{daysLeft}</span>
                    <span className="text-[9px] font-bold text-amber-800">days left</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Overall Syllabus Progress Metric */}
            <div 
              onClick={() => onOpenTab('syllabus')}
              className="bg-stone-50 hover:bg-stone-100 cursor-pointer border border-stone-200/90 rounded-xl px-3.5 py-1.5 flex items-center gap-3 transition-colors group"
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-stone-200"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={88}
                    strokeDashoffset={88 - (88 * overallPercent) / 100}
                    strokeLinecap="round"
                    className="text-emerald-600 transition-all duration-700"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-stone-800">
                  {overallPercent}%
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1">
                  Syllabus Done <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-emerald-600" />
                </div>
                <div className="text-xs text-stone-700 font-medium">
                  {completedTopics} of {totalTopics} topics
                </div>
              </div>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="bg-stone-50 hover:bg-stone-100 border border-stone-200/90 rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-stone-700 transition-all shadow-2xs cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-stone-700" />
                    <span className="hidden sm:inline">Dark Mode</span>
                  </>
                )}
              </button>
            )}

            {/* PAM Studio Link */}
            <a
              id="header-pamstudio-link"
              href="https://pamstudio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-semibold transition-all shadow-2xs cursor-pointer group no-underline"
              title="More projects on: PAM Studio (pamstudio.vercel.app)"
            >
              <Globe className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline text-stone-600 dark:text-stone-400 font-medium">More projects on:</span>
              <span className="font-extrabold text-stone-900 dark:text-stone-200">PAM Studio</span>
            </a>

            {/* Clear / Reset Progress Button */}
            {onClearAllProgress && (
              <button
                onClick={() => setShowClearWarningModal(true)}
                className="bg-stone-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200/90 rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-stone-600 transition-all shadow-2xs cursor-pointer"
                title="Clear all study progress and reset syllabus"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500 hover:text-rose-600" />
                <span className="hidden sm:inline">Clear Progress</span>
              </button>
            )}

            {/* Firebase Auth In-Place Sign In / Account Status */}
            {currentUser ? (
              <div className="bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shadow-2xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500/60"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold max-w-[100px] truncate text-stone-700 dark:text-stone-200">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut(auth);
                  }}
                  className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign out of Firebase account"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : onOpenAuthModal ? (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs transition-all shadow-xs cursor-pointer group"
                title="Sign In or Sign Up without leaving page"
              >
                <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In</span>
              </button>
            ) : null}

            {/* Student Profile Settings Badge */}
            <button
              onClick={onOpenTargetModal}
              className="bg-stone-900 hover:bg-stone-800 text-white border border-stone-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all shadow-md cursor-pointer group"
              title="Click to edit profile & target exam settings"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-extrabold shrink-0">
                {profile.avatarEmoji || '🎓'}
              </div>
              <div className="text-left hidden md:block max-w-[120px] truncate">
                <div className="text-xs font-extrabold truncate text-stone-100">
                  {profile.name || 'Pushpam Kumar'}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold truncate">
                  {profile.schoolName || 'Delhi Public School'}
                </div>
              </div>
              <Edit3 className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 transition-colors" />
            </button>

          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NCERT chapters, units, topics, formulas, or sample papers..."
              className="w-full bg-stone-50 border border-stone-200/80 text-stone-800 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-1.5 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-400"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-500 hover:text-stone-800 px-2.5 py-1 bg-stone-100 rounded-lg border border-stone-200"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Level & XP Breakdown Modal */}
      {showXpModal && (
        <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-2xl flex items-center justify-center font-extrabold text-xl">
                  {levelInfo.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">Level {levelInfo.level}: {levelInfo.title}</h3>
                  <p className="text-xs text-stone-500">{totalXp} Total XP Earned</p>
                </div>
              </div>
              <button
                onClick={() => setShowXpModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Progress to Next Level</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
              <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 text-center mt-1 font-medium">
                Earn XP by completing focus timers, clearing topics, solving quizzes, and growing virtual plants!
              </p>
            </div>

            {/* Level Milestones List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Level Progression Hierarchy</div>
              <div className="space-y-1.5 text-xs">
                {[
                  { lvl: 1, title: 'CBSE Novice', xp: '0 - 249 XP', icon: '🌱' },
                  { lvl: 2, title: 'Syllabus Explorer', xp: '250 - 599 XP', icon: '🔍' },
                  { lvl: 3, title: 'Chapter Strategist', xp: '600 - 1199 XP', icon: '🎯' },
                  { lvl: 4, title: 'Revision Ace', xp: '1200 - 1999 XP', icon: '⚡' },
                  { lvl: 5, title: 'Board Master', xp: '2000+ XP', icon: '👑' },
                ].map((item) => (
                  <div
                    key={item.lvl}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      levelInfo.level === item.lvl
                        ? 'bg-purple-50 border-purple-300 text-purple-900 font-extrabold shadow-2xs'
                        : levelInfo.level > item.lvl
                        ? 'bg-stone-50 border-stone-200 text-stone-600'
                        : 'bg-white border-stone-100 text-stone-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>Level {item.lvl}: {item.title}</span>
                    </span>
                    <span className="text-[11px] font-bold">{item.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowXpModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* Warning Dialog Modal for Resetting/Clearing All Progress */}
      {showClearWarningModal && (
        <div className="fixed inset-0 z-[100] bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150">
            
            {/* Header with Red Warning Badge */}
            <div className="flex items-start gap-3.5 pb-3 border-b border-stone-100">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center font-extrabold shrink-0 border border-rose-200">
                <RotateCcw className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base text-rose-950">
                  Reset & Clear All Progress?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 font-medium">
                  This action will permanently clear your study record and reset syllabus tracking.
                </p>
              </div>
            </div>

            {/* Warning Details List */}
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-rose-900 uppercase tracking-wider text-[10px]">
                The following data will be reset:
              </div>
              <ul className="space-y-1.5 text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span>All NCERT topic checkmarks & chapter confidence levels</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span>Logged Pomodoro study timer minutes & history</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span>Quiz score history & accumulated Student XP level</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span>Virtual Garden plants & earned focus badges</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearWarningModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel, Keep Progress
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onClearAllProgress) {
                    onClearAllProgress();
                  }
                  setShowClearWarningModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Yes, Clear Everything
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
