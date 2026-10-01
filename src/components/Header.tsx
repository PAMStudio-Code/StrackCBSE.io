import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Edit3, 
  Menu, 
  PanelLeft,
  X,
  Sparkles,
  Trophy,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { StudentProfile, Chapter, StudySession, QuizAttempt, VirtualPlant } from '../types';
import { calculateTotalXp, getLevelInfo } from '../utils/xpSystem';

export interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  profile: StudentProfile;
  chapters: Chapter[];
  studySessions?: StudySession[];
  quizAttempts?: QuizAttempt[];
  virtualPlants?: VirtualPlant[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenTargetModal?: () => void;
  onOpenTab?: (tab: string) => void;
  isXpModalOpen?: boolean;
  setIsXpModalOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  profile,
  chapters,
  studySessions = [],
  quizAttempts = [],
  virtualPlants = [],
  searchQuery,
  setSearchQuery,
  onOpenTargetModal,
  onOpenTab,
  isXpModalOpen,
  setIsXpModalOpen
}) => {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [halfYearlyDays, setHalfYearlyDays] = useState<number>(0);
  const [preBoard1Days, setPreBoard1Days] = useState<number>(0);
  const [preBoard2Days, setPreBoard2Days] = useState<number>(0);
  const [localShowXpModal, setLocalShowXpModal] = useState<boolean>(false);

  const showXpModal = isXpModalOpen !== undefined ? isXpModalOpen : localShowXpModal;
  const setShowXpModal = (val: boolean) => {
    if (setIsXpModalOpen) setIsXpModalOpen(val);
    else setLocalShowXpModal(val);
  };

  // Calculate XP & Level
  const totalXp = calculateTotalXp(chapters, studySessions, quizAttempts, virtualPlants);
  const levelInfo = getLevelInfo(totalXp);

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

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#030305]/95 backdrop-blur-md text-stone-900 dark:text-white border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Sidebar Collapse Toggle Button + Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800 transition-colors cursor-pointer shrink-0"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label="Toggle navigation sidebar"
              >
                <Menu className="w-5 h-5 sm:hidden" />
                <PanelLeft className="w-5 h-5 hidden sm:block" />
              </button>
            )}

            {/* Global Search Bar */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NCERT chapters, topics, formulas..."
                className="w-full bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 text-stone-900 dark:text-stone-100 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:bg-white dark:focus:bg-stone-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Exam Countdown Badges + XP Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Exam Milestones Bar (Pre-Boards & Board Finals) */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-1 shadow-2xs">
              
              {/* Pre-Board 1 Tracker (Hidden on smallest mobile) */}
              <div 
                onClick={onOpenTargetModal}
                className="hidden lg:block px-2.5 py-1 hover:bg-stone-200/60 dark:hover:bg-stone-800/80 rounded-xl transition-colors cursor-pointer text-left"
                title="Pre-Board 1 Exam (Dec 15) — Click to view dates"
              >
                <div className="text-[9px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                  Pre-Board 1
                </div>
                <div className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-baseline gap-0.5">
                  <span className="text-purple-600 dark:text-purple-400">{preBoard1Days}</span>
                  <span className="text-[9px] font-normal text-stone-500 dark:text-stone-400">d</span>
                </div>
              </div>

              <div className="hidden lg:block h-5 w-px bg-stone-200 dark:bg-stone-800"></div>

              {/* Pre-Board 2 Tracker (Hidden on narrow phone screens) */}
              <div 
                onClick={onOpenTargetModal}
                className="hidden sm:block px-2.5 py-1 hover:bg-stone-200/60 dark:hover:bg-stone-800/80 rounded-xl transition-colors cursor-pointer text-left"
                title="Pre-Board 2 Exam (Jan 10) — Click to view dates"
              >
                <div className="text-[9px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                  Pre-Board 2
                </div>
                <div className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-baseline gap-0.5">
                  <span className="text-indigo-600 dark:text-indigo-400">{preBoard2Days}</span>
                  <span className="text-[9px] font-normal text-stone-500 dark:text-stone-400">d</span>
                </div>
              </div>

              <div className="hidden sm:block h-5 w-px bg-stone-200 dark:bg-stone-800"></div>

              {/* Main Board Exam Target Badge */}
              <div 
                onClick={onOpenTargetModal}
                className="bg-amber-100/90 dark:bg-amber-950/50 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 rounded-xl px-2.5 py-1 flex items-center gap-1.5 cursor-pointer transition-colors group"
                title="Main Board Exam Target (Click to edit date)"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase font-extrabold text-amber-900 dark:text-amber-300 tracking-wider flex items-center gap-0.5">
                    <span className="truncate max-w-[80px] sm:max-w-none">{profile.targetExamName || "Board Finals"}</span>
                    <Edit3 className="w-2 h-2 text-amber-700 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-baseline gap-0.5">
                    <span>{daysLeft}</span>
                    <span className="text-[9px] font-bold text-amber-800 dark:text-amber-400">days</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Student XP Pill */}
            <button
              onClick={() => setShowXpModal(true)}
              className={`text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-2xs shrink-0 ${levelInfo.badgeBg} ${levelInfo.badgeTextColor}`}
              title="Click to view Student Level & Rewards breakdown"
            >
              <span>{levelInfo.icon}</span>
              <span className="hidden sm:inline">Lvl {levelInfo.level}:</span>
              <span className="truncate max-w-[90px] sm:max-w-none">{levelInfo.title}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Level & XP Breakdown Modal */}
      {showXpModal && (
        <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-2xl flex items-center justify-center font-extrabold text-xl">
                  {levelInfo.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-base">Level {levelInfo.level}: {levelInfo.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{totalXp} Total XP Earned</p>
                </div>
              </div>
              <button
                onClick={() => setShowXpModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60">
              <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-200">
                <span>Progress to Next Level</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
              <div className="h-3 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 text-right">
                {levelInfo.maxXpForLevel > totalXp 
                  ? `${levelInfo.maxXpForLevel - totalXp} XP needed for Level ${levelInfo.level + 1}`
                  : 'Max level achieved!'}
              </p>
            </div>

            {/* XP Breakdown Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">How You Earn XP:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>+25 XP</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Per Completed Topic</div>
                </div>

                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>+100 XP</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Per Chapter Mastered</div>
                </div>

                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>+2 XP / min</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Pomodoro Focus Time</div>
                </div>

                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                    <span>+10-20 XP</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Per Quiz Question</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowXpModal(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back to Study
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
