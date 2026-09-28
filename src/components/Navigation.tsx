import React from 'react';
import { LayoutDashboard, CheckSquare, Timer, AlertTriangle, Lightbulb, FileCheck2, Zap } from 'lucide-react';
import { Chapter, StudySession, QuizAttempt, VirtualPlant } from '../types';
import { calculateTotalXp, getLevelInfo } from '../utils/xpSystem';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  weakChapterCount: number;
  chapters?: Chapter[];
  studySessions?: StudySession[];
  quizAttempts?: QuizAttempt[];
  virtualPlants?: VirtualPlant[];
  totalXp?: number;
  onOpenXpModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  weakChapterCount,
  chapters = [],
  studySessions = [],
  quizAttempts = [],
  virtualPlants = [],
  totalXp: propTotalXp,
  onOpenXpModal
}) => {
  const xp = propTotalXp !== undefined 
    ? propTotalXp 
    : calculateTotalXp(chapters, studySessions, quizAttempts, virtualPlants);
  
  const levelInfo = getLevelInfo(xp);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: CheckSquare },
    { id: 'timer', label: 'Study Timer', icon: Timer },
    { 
      id: 'quiz', 
      label: 'Quiz & Weakness Analysis', 
      icon: AlertTriangle,
      badge: weakChapterCount > 0 ? `${weakChapterCount} Weak` : undefined,
      badgeColor: 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/50'
    },
    { id: 'formulas', label: 'Formula & Quick Notes', icon: Lightbulb },
    { id: 'sample_papers', label: 'Sample Papers', icon: FileCheck2 },
  ];

  return (
    <nav className="bg-white/95 dark:bg-[#030305]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto no-scrollbar space-x-1 sm:space-x-1.5 py-1 flex-1 mr-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50 shadow-xs dark:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-stone-900/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* XP Bar in Navigation Menu */}
          <div className="flex-shrink-0 flex items-center pl-1">
            <button 
              type="button"
              onClick={onOpenXpModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-emerald-500/10 dark:from-amber-950/80 dark:to-emerald-950/80 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-black shadow-2xs hover:scale-105 hover:border-amber-400 transition-all cursor-pointer active:scale-95"
              title={`${xp.toLocaleString()} Total XP Points · Level ${levelInfo.level}: ${levelInfo.title} (Click to view level breakdown)`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="tracking-tight text-amber-950 dark:text-amber-200">{xp.toLocaleString()} XP</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 font-extrabold ml-0.5 border border-amber-300 dark:border-amber-700">
                <span>{levelInfo.icon}</span>
                <span>Lvl {levelInfo.level}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

