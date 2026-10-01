import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  AlertTriangle, 
  Lightbulb, 
  FileCheck2, 
  RotateCcw, 
  Sun, 
  Moon, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Target,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { StudentProfile } from '../types';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  weakChapterCount: number;
  onClearAllProgress?: () => void;
  onOpenTargetModal?: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  profile?: StudentProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  weakChapterCount,
  onClearAllProgress,
  onOpenTargetModal,
  theme = 'light',
  toggleTheme,
  profile
}) => {
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const coreNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & daily targets' },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: CheckSquare, description: 'NCERT chapters & topics' },
    { id: 'timer', label: 'Study Timer (Pomodoro)', icon: Timer, description: 'Focus clock & virtual garden' },
  ];

  const prepNavItems = [
    { 
      id: 'quiz', 
      label: 'Quiz & Weakness', 
      icon: AlertTriangle, 
      description: 'CBSE questions & diagnostics',
      badge: weakChapterCount > 0 ? `${weakChapterCount} Weak` : undefined,
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
    },
    { id: 'formulas', label: 'Formula & Quick Notes', icon: Lightbulb, description: 'Class 10 high-yield formulas' },
    { id: 'sample_papers', label: 'Sample Papers', icon: FileCheck2, description: 'CBSE SQPs & marking schemes' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleConfirmClear = () => {
    setShowClearConfirmModal(false);
    if (onClearAllProgress) {
      onClearAllProgress();
    }
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderNavButton = (item: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    badge?: string;
    badgeColor?: string;
  }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        title={isCollapsed ? item.label : undefined}
        className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/20'
            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-white'
        } ${isCollapsed ? 'justify-center px-2' : ''}`}
      >
        <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />

        {!isCollapsed && (
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <span className="text-sm truncate">{item.label}</span>
            {item.badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-stone-200 text-stone-800'}`}>
                {item.badge}
              </span>
            )}
          </div>
        )}

        {/* Tooltip on compact collapsed mode */}
        {isCollapsed && (
          <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {item.label}
            {item.badge && <span className="ml-1.5 text-rose-400 font-bold">({item.badge})</span>}
          </div>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      
      {/* Top Header / Brand Logo */}
      <div className="p-4 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-stone-800">
            <img src="/favicon.svg" alt="Stracked Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-black tracking-tight text-stone-900 dark:text-white truncate">
                Stracked
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold tracking-wider uppercase">
                CBSE Class 10
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        
        {/* CORE SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-stone-400 dark:text-stone-500">
              Core
            </div>
          )}
          <div className="space-y-1">
            {coreNavItems.map(renderNavButton)}
          </div>
        </div>

        {/* PREPARATION & TOOLS SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-stone-400 dark:text-stone-500">
              Preparation & Tools
            </div>
          )}
          <div className="space-y-1">
            {prepNavItems.map(renderNavButton)}
          </div>
        </div>

        {/* SETTINGS & DATA SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider uppercase text-stone-400 dark:text-stone-500">
              Settings & Data
            </div>
          )}
          <div className="space-y-1">
            
            {/* Target Exam Date Settings */}
            {onOpenTargetModal && (
              <button
                onClick={() => {
                  onOpenTargetModal();
                  if (isMobileOpen) setIsMobileOpen(false);
                }}
                title={isCollapsed ? 'Target Exam Date' : undefined}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
              >
                <Target className="w-5 h-5 text-amber-500 shrink-0 group-hover:scale-105 transition-transform" />
                {!isCollapsed && <span className="text-sm truncate">Target Exam Date</span>}
                {isCollapsed && (
                  <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Target Exam Date
                  </div>
                )}
              </button>
            )}

            {/* Theme Toggle (Dark/Light mode) */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                title={isCollapsed ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400 shrink-0 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500 shrink-0 group-hover:-rotate-12 transition-transform" />
                )}
                {!isCollapsed && (
                  <span className="text-sm truncate">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
                {isCollapsed && (
                  <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </div>
                )}
              </button>
            )}

            {/* Clear Progress / Reset Data */}
            {onClearAllProgress && (
              <button
                onClick={() => setShowClearConfirmModal(true)}
                title={isCollapsed ? 'Reset Data / Clear Progress' : undefined}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
              >
                <RotateCcw className="w-5 h-5 text-rose-500 shrink-0 group-hover:-rotate-45 transition-transform" />
                {!isCollapsed && <span className="text-sm truncate">Clear Progress</span>}
                {isCollapsed && (
                  <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Clear Progress
                  </div>
                )}
              </button>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Profile Snippet (When Expanded) */}
      {!isCollapsed && profile && (
        <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/30">
          <button
            onClick={() => {
              if (onOpenTargetModal) onOpenTargetModal();
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 transition-colors text-left group cursor-pointer"
            title="Edit student profile & target exam"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm font-extrabold shrink-0">
              {profile.avatarEmoji || '🎓'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {profile.name || 'Pushpam Kumar'}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                {profile.schoolName || 'CBSE Class 10 Scholar'}
              </div>
            </div>
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky, Collapsible) */}
      <aside
        className={`hidden md:block sticky top-0 h-screen transition-all duration-300 z-30 shrink-0 bg-white/95 dark:bg-[#030305]/95 backdrop-blur-md border-r border-stone-200/80 dark:border-stone-800/80 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer container */}
          <aside className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-[#060608] shadow-2xl flex flex-col z-50 border-r border-stone-200 dark:border-stone-800 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Clear Progress Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 bg-rose-100 dark:bg-rose-950/60 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-white text-base">Reset Progress?</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to reset all completed chapters, study sessions, quizzes, and to-do items? Your progress will start fresh at 0%.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
