import React from 'react';
import { 
  ArrowLeft, 
  BookOpenCheck, 
  Sprout, 
  CalendarRange, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ExternalLink,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export interface AboutPageProps {
  onBackToDashboard: () => void;
  onOpenTab?: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ 
  onBackToDashboard,
  onOpenTab 
}) => {
  const features = [
    {
      icon: BookOpenCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      tag: 'Official Syllabus',
      title: 'Smart Syllabus & Weightage Breakdown',
      description: 'Track chapter-wise completion aligned with official NCERT and CBSE Class 10 marking schemes.',
      tab: 'syllabus',
      actionText: 'Explore Syllabus'
    },
    {
      icon: Sprout,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      tag: 'Gamified Focus',
      title: 'Focus Pomodoro Garden',
      description: 'Turn daily study sessions into a gamified virtual garden to build consistent study habits.',
      tab: 'timer',
      actionText: 'Open Study Timer'
    },
    {
      icon: CalendarRange,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      tag: 'High-Yield Focus',
      title: 'Daily Sprint & Revision Planner',
      description: "Prioritize high-yield topics first so pre-boards and boards don't catch you off guard.",
      tab: 'dashboard',
      actionText: 'View Sprint Planner'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      tag: 'Client-Side Only',
      title: 'Zero Distractions & 100% Private',
      description: 'Completely client-side and offline-ready. Your study progress stays in your browser with zero unnecessary logins.',
      tab: undefined,
      actionText: undefined
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Back Navigation Action */}
      <div>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 shadow-sm transition-all cursor-pointer group"
          title="Return to main dashboard"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>← Back to Dashboard</span>
        </button>
      </div>

      {/* Hero / Page Header */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50/80 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              CBSE Class 10 Board Companion
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Session 2026-2027
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            About <span className="text-emerald-600 dark:text-emerald-400">Stracked</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Built to eliminate board exam anxiety through structured syllabus tracking, exam weightage clarity, and daily focus momentum.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">5 Core</div>
              <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Class 10 Subjects</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">NCERT Aligned</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">Offline</div>
              <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Instant Local Save</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">Zero Ads</div>
              <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">100% Free Forever</div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Grid (4 Modern Cards) */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Key Capabilities
          </h2>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Designed for focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm hover:border-emerald-400/60 dark:hover:border-emerald-600/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {feat.tab && onOpenTab && (
                  <div className="pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => onOpenTab(feat.tab)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer group-hover:translate-x-0.5 duration-150"
                    >
                      <span>{feat.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Creator's Note / Mission Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 lg:p-9 shadow-sm space-y-4 relative overflow-hidden">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <Heart className="w-5 h-5 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Why Stracked Exists
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">A personal note from the creator</p>
          </div>
        </div>

        <blockquote className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-4 border-l-2 border-emerald-500/80 space-y-3">
          <p>
            Preparing for board exams shouldn't feel like guessing in the dark. Stracked was created to give every CBSE student a simple, honest, and stress-free dashboard to conquer their syllabus step-by-step. No complex setups, no clutter—just you, your goals, and daily progress.
          </p>
        </blockquote>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-200 dark:border-emerald-800">
              PK
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white">Pushpam Kumar</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-400 block">Creator & Developer • PAM Studio</span>
            </div>
          </div>

          <a
            href="https://pamstudio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            title="Explore more projects on PAM Studio"
          >
            <span>Visit PAM Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Footer / Version Info Badge */}
      <div className="pt-2 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stracked v1.0 • Designed for CBSE Class 10 Scholars</span>
        </div>
      </div>

    </div>
  );
};
