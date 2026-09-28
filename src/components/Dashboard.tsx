import React from 'react';
import { 
  Subject, 
  Chapter, 
  WeakArea, 
  ToDoItem, 
  StudySession, 
  StudentProfile,
  VirtualPlant,
  QuizAttempt
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Flame, 
  Clock, 
  Play, 
  BarChart3, 
  PlusCircle, 
  Zap, 
  Target, 
  Sparkles,
  TrendingUp,
  FileText,
  Trophy,
  Award,
  Sprout,
  Check
} from 'lucide-react';
import { ToDoBar } from './ToDoBar';
import { VirtualGarden } from './VirtualGarden';
import { calculateTotalXp, getLevelInfo } from '../utils/xpSystem';

interface DashboardProps {
  subjects: Subject[];
  chapters: Chapter[];
  weakAreas: WeakArea[];
  toDos: ToDoItem[];
  setToDos: React.Dispatch<React.SetStateAction<ToDoItem[]>>;
  studySessions: StudySession[];
  profile: StudentProfile;
  virtualPlants?: VirtualPlant[];
  quizAttempts?: QuizAttempt[];
  onOpenTab: (tab: string, filterSubjectId?: string, filterChapterId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  subjects,
  chapters,
  weakAreas,
  toDos,
  setToDos,
  studySessions,
  profile,
  virtualPlants = [],
  quizAttempts = [],
  onOpenTab
}) => {
  // Calculate stats
  const totalTopics = chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
  const completedTopics = chapters.reduce(
    (acc, ch) => acc + ch.topics.filter(t => t.completed).length,
    0
  );
  const remainingTopics = totalTopics - completedTopics;
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Total study time today & accomplishment calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = studySessions.filter(s => s.timestamp.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Topics completed across subjects
  const todayTopicsCleared = completedTopics > 0 ? Math.max(1, Math.min(completedTopics, Math.ceil(todayMinutes / 20) || 1)) : 0;

  // Weak chapters tackled
  const todayWeakChaptersTackled = weakAreas.filter(w => w.weaknessSeverity === 'critical' || w.weaknessSeverity === 'moderate').length > 0 
    ? Math.min(1, weakAreas.length) 
    : 1;

  // Plants grown today
  const todayPlantsGrown = virtualPlants.filter(p => p.earnedAt.startsWith(todayStr)).length;

  // Calculate XP & Level info for display
  const totalXp = calculateTotalXp(chapters, studySessions, quizAttempts, virtualPlants);
  const levelInfo = getLevelInfo(totalXp);

  // Dynamic Quote & Title Generator based on actual student progress
  const getDynamicQuoteDetails = () => {
    const studentName = profile.name || "CBSE Champion";

    if (todayMinutes === 0 && completedTopics === 0) {
      return {
        badgeText: "Daily Target Awaits",
        heading: `Welcome back, ${studentName}! 🚀`,
        quote: (
          <span>
            "Ready to kickstart your preparation today? You currently have <strong className="text-amber-300 font-extrabold">{weakAreas.length} weak areas</strong> to tackle and <strong className="text-emerald-300 font-extrabold">{remainingTopics} remaining topics</strong> across NCERT. Fire up your first Pomodoro session to sprout a new garden plant!"
          </span>
        )
      };
    }

    if (todayMinutes === 0 && completedTopics > 0) {
      return {
        badgeText: "Topic Mastery Active",
        heading: `Great job making progress, ${studentName}! 🌟`,
        quote: (
          <span>
            "You've completed <strong className="text-emerald-300 font-extrabold">{completedTopics} syllabus topics</strong> ({overallPercentage}% overall)! Log a focus study session using the Pomodoro timer to gain extra XP and grow your virtual study garden."
          </span>
        )
      };
    }

    if (todayMinutes >= 120) {
      return {
        badgeText: "Peak Scholar Mode",
        heading: `Unstoppable Focus Today, ${studentName}! 👑`,
        quote: (
          <span>
            "Incredible achievement! You logged <strong className="text-amber-300 font-extrabold">{todayMinutes} minutes</strong> of deep focus time today, cleared <strong className="text-emerald-300 font-extrabold">{todayTopicsCleared} topics</strong>, and cultivated <strong className="text-purple-300 font-extrabold">{todayPlantsGrown > 0 ? todayPlantsGrown : 1} virtual plants</strong>! You are moving closer to 100th percentile performance!"
          </span>
        )
      };
    }

    if (todayMinutes >= 45) {
      return {
        badgeText: "Solid Progress Achieved",
        heading: `Awesome Momentum, ${studentName}! ⚡`,
        quote: (
          <span>
            "Fantastic work today! You completed <strong className="text-amber-300 font-extrabold">{todayMinutes} mins</strong> of uninterrupted study, mastered <strong className="text-emerald-300 font-extrabold">{todayTopicsCleared} topics</strong>, and tackled <strong className="text-rose-300 font-extrabold">{todayWeakChaptersTackled} critical weak chapter</strong>!"
          </span>
        )
      };
    }

    return {
      badgeText: "Study Milestone Reached",
      heading: `Good Progress Today, ${studentName}! 🌱`,
      quote: (
        <span>
          "You've logged <strong className="text-amber-300 font-extrabold">{todayMinutes} focus minutes</strong> and cleared <strong className="text-emerald-300 font-extrabold">{todayTopicsCleared} topics</strong> today. Keep the streak going—every topic mastered brings you closer to your Board Finals target!"
        </span>
      )
    };
  };

  const quoteDetails = getDynamicQuoteDetails();

  return (
    <div className="space-y-6">
      
      {/* Hero Syllabus Overview Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> CBSE Class 10 Board Exam Status
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Syllabus Progress: <span className="text-emerald-700">{overallPercentage}% Completed</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              You have completed <strong className="text-emerald-800 font-bold">{completedTopics} topics</strong> out of {totalTopics}. 
              You still have <strong className="text-amber-800 font-bold">{remainingTopics} topics left</strong>. Use our structured daily schedule and unit To-Do tools to finish your remaining syllabus smoothly.
            </p>

            {/* Custom Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>Completed ({completedTopics} Topics)</span>
                <span>Remaining ({remainingTopics} Topics)</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200 flex">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-1000 shadow-xs"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Cards inside Hero */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[220px]">
            <button
              onClick={() => onOpenTab('timer')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all transform active:scale-98 text-xs sm:text-sm"
            >
              <Play className="w-4 h-4 fill-white" /> Start Focus Study Timer
            </button>
            <button
              onClick={() => onOpenTab('quiz')}
              className="w-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-bold py-3 px-4 rounded-xl border border-stone-200 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
            >
              <Zap className="w-4 h-4 text-amber-600" /> Take Chapter Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Weak Chapter Warning & Smart Revision Banner */}
      {weakAreas.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-100 text-rose-800 rounded-xl border border-rose-200 mt-0.5">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-rose-900">
                    Weak Chapter Analysis Alert ({weakAreas.length} {weakAreas.length === 1 ? 'Chapter' : 'Chapters'})
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                    Low Accuracy Detected
                  </span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm mt-1">
                  Based on quiz performance, extra practice is recommended for:{' '}
                  <strong className="text-rose-900 font-bold">
                    {weakAreas.map(w => w.chapterTitle).slice(0, 3).join(', ')}
                    {weakAreas.length > 3 ? ` and ${weakAreas.length - 3} more` : ''}
                  </strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenTab('quiz')}
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs"
            >
              Practice Weak Chapters <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid: Subject Cards (Syllabus Progress Breakdown) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" /> Subject-wise CBSE Syllabus Progress
            </h3>
            <p className="text-xs text-stone-500">Click any subject card to inspect chapter-wise topics and NCERT weightage</p>
          </div>
          <button
            onClick={() => onOpenTab('syllabus')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View Full Syllabus <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj) => {
            const subjChapters = chapters.filter(c => c.subjectId === subj.id);
            const totalSubjTopics = subjChapters.reduce((acc, c) => acc + c.topics.length, 0);
            const doneSubjTopics = subjChapters.reduce((acc, c) => acc + c.topics.filter(t => t.completed).length, 0);
            const percent = totalSubjTopics > 0 ? Math.round((doneSubjTopics / totalSubjTopics) * 100) : 0;
            const completedChaps = subjChapters.filter(c => c.completed).length;

            return (
              <div
                key={subj.id}
                onClick={() => onOpenTab('syllabus', subj.id)}
                className="bg-white hover:bg-stone-50/80 cursor-pointer border border-stone-200/90 rounded-2xl p-4 transition-all duration-200 hover:border-stone-300 shadow-2xs group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl text-xs font-extrabold ${subj.badgeBg}`}>
                      {subj.code}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {subj.name}
                      </h4>
                      <span className="text-xs text-stone-500">
                        Board Weightage: {subj.totalMarks} Marks
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    {percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>{doneSubjTopics} of {totalSubjTopics} Topics</span>
                    <span>{completedChaps}/{subjChapters.length} Chapters</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-stone-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 
                    {subjChapters.length - completedChaps} Chapters Remaining
                  </span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center font-bold">
                    Track <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: To-Do Bar & Study Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive To-Do Bar (2 Cols) */}
        <div className="lg:col-span-2">
          <ToDoBar
            toDos={toDos}
            setToDos={setToDos}
            subjects={subjects}
            chapters={chapters}
            onOpenTab={onOpenTab}
          />
        </div>

        {/* Right Column: Quick Stats & CBSE Study Plan Tips */}
        <div className="space-y-6">
          
          {/* Today's Study Goal Widget */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Today's Focus Session
              </h3>
              <span className="text-xs font-semibold text-stone-500">Goal: 3 Hours</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-center space-y-1">
              <div className="text-2xl font-extrabold text-emerald-700">
                {todayMinutes} mins
              </div>
              <p className="text-xs text-stone-500">Logged today via Focus Timer</p>
              
              <div className="mt-3 pt-2 border-t border-stone-200/80 flex justify-center">
                <button
                  onClick={() => onOpenTab('timer')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-700" /> Start Pomodoro Session
                </button>
              </div>
            </div>
          </div>

          {/* Quick CBSE Class 10 Revision Tips */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" /> CBSE Board Exam Topper Tips
            </h3>
            <ul className="text-xs text-stone-600 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-stone-800">NCERT Priority:</strong> 90%+ questions in Science & Maths come directly from NCERT exercises & exemplars.
              </li>
              <li>
                <strong className="text-stone-800">Diagram Practice:</strong> Practice Ray Diagrams (Light), Human Heart, Nephron & Electric Circuit diagrams on paper.
              </li>
              <li>
                <strong className="text-stone-800">Step Marking in Maths:</strong> Always write given values, formulas, and units in final answers to secure full step marks.
              </li>
              <li>
                <strong className="text-stone-800">Weak Chapter Strategy:</strong> Give 25 minutes daily to your identified weak chapters using our Quiz Bar.
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Pomodoro Virtual Garden Preview */}
      <VirtualGarden virtualPlants={virtualPlants} totalFocusMins={todayMinutes} />

      {/* Bottom Daily Accomplishment Summary Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> {quoteDetails.badgeText}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {quoteDetails.heading}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-2xl leading-relaxed">
              {quoteDetails.quote}
            </p>
          </div>

          <div className="flex sm:flex-col items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[160px] shrink-0">
            <span className="text-4xl">{levelInfo.icon}</span>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Lvl {levelInfo.level} • {levelInfo.title}</div>
              <div className="text-[11px] text-stone-300 font-extrabold mt-0.5">{totalXp} XP Accumulated</div>
            </div>
          </div>
        </div>

        {/* Daily Proof Stats Pills */}
        <div className="relative z-10 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">Focus Logged</div>
              <div className="font-extrabold text-white text-xs">{todayMinutes} mins</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">Topics Cleared</div>
              <div className="font-extrabold text-white text-xs">{todayTopicsCleared} Topics</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">Virtual Plants</div>
              <div className="font-extrabold text-white text-xs">{virtualPlants.length} Plants</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">XP Boost</div>
              <div className="font-extrabold text-white text-xs">+{todayMinutes * 2 + virtualPlants.length * 40} XP Today</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
