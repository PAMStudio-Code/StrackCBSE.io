import { Chapter, StudySession, QuizAttempt, VirtualPlant } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  minXpForLevel: number;
  maxXpForLevel: number;
  progressPercent: number;
  badgeBg: string;
  badgeTextColor: string;
  icon: string;
}

export const LEVEL_CONFIGS = [
  { level: 1, title: 'CBSE Novice', minXp: 0, maxXp: 250, badgeBg: 'bg-stone-100 border-stone-300', badgeTextColor: 'text-stone-700', icon: '🌱' },
  { level: 2, title: 'Syllabus Explorer', minXp: 250, maxXp: 600, badgeBg: 'bg-blue-50 border-blue-200', badgeTextColor: 'text-blue-800', icon: '🔍' },
  { level: 3, title: 'Chapter Strategist', minXp: 600, maxXp: 1200, badgeBg: 'bg-purple-50 border-purple-200', badgeTextColor: 'text-purple-800', icon: '🎯' },
  { level: 4, title: 'Revision Ace', minXp: 1200, maxXp: 2000, badgeBg: 'bg-amber-50 border-amber-200', badgeTextColor: 'text-amber-800', icon: '⚡' },
  { level: 5, title: 'Board Master', minXp: 2000, maxXp: 3500, badgeBg: 'bg-emerald-50 border-emerald-300', badgeTextColor: 'text-emerald-800', icon: '👑' },
];

export function calculateTotalXp(
  chapters: Chapter[],
  studySessions: StudySession[],
  quizAttempts: QuizAttempt[],
  virtualPlants: VirtualPlant[] = []
): number {
  let xp = 0;

  // 1. Focus Study Session Minutes (2 XP per min)
  const totalStudyMinutes = studySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  xp += totalStudyMinutes * 2;

  // 2. Bonus for completed Pomodoro sessions (30 XP per session)
  const pomodoroCount = studySessions.filter(s => s.mode === 'pomodoro').length;
  xp += pomodoroCount * 30;

  // 3. Completed Topics (15 XP each)
  const completedTopicsCount = chapters.reduce(
    (acc, ch) => acc + ch.topics.filter(t => t.completed).length,
    0
  );
  xp += completedTopicsCount * 15;

  // 4. Completed Chapters (50 XP each)
  const completedChaptersCount = chapters.filter(c => c.completed).length;
  xp += completedChaptersCount * 50;

  // 5. Quiz Attempts (20 XP + score * 5)
  quizAttempts.forEach(qa => {
    xp += 20 + qa.score * 5;
  });

  // 6. Virtual Garden Plants (40 XP each)
  xp += virtualPlants.length * 40;

  return xp;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let currentConfig = LEVEL_CONFIGS[0];

  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_CONFIGS[i].minXp) {
      currentConfig = LEVEL_CONFIGS[i];
      break;
    }
  }

  const min = currentConfig.minXp;
  const max = currentConfig.maxXp;
  const levelXpGained = Math.max(0, totalXp - min);
  const levelXpRequired = max - min;
  
  let progressPercent = Math.min(100, Math.round((levelXpGained / levelXpRequired) * 100));
  if (currentConfig.level === 5 && totalXp >= 2000) {
    progressPercent = Math.min(100, Math.round(((totalXp - 2000) / 1500) * 100));
  }

  return {
    level: currentConfig.level,
    title: currentConfig.title,
    currentXp: totalXp,
    minXpForLevel: min,
    maxXpForLevel: max,
    progressPercent,
    badgeBg: currentConfig.badgeBg,
    badgeTextColor: currentConfig.badgeTextColor,
    icon: currentConfig.icon
  };
}
