export type SubjectId = 'science' | 'maths' | 'sst' | 'english' | 'hindi' | 'cs';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  completed: boolean;
  ncertRef?: string;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  unitName: string;
  chapterNum: number;
  title: string;
  weightageMarks: number;
  completed: boolean;
  confidence: ConfidenceLevel;
  topics: Topic[];
  notes?: string;
  keyFormulae?: string[];
  lastStudiedDate?: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  code: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  iconName: string;
  totalMarks: number;
  unitsCount: number;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  type: 'mcq' | 'assertion_reason';
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  ncertRef?: string;
}

export interface QuizAttempt {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  score: number;
  totalQuestions: number;
  accuracy: number; // percentage 0-100
  timestamp: string;
  timeSpentSeconds: number;
}

export interface WeakArea {
  chapterId: string;
  chapterTitle: string;
  subjectId: SubjectId;
  accuracy: number;
  totalAttempts: number;
  weaknessSeverity: 'critical' | 'moderate' | 'mild';
  recommendedActions: string[];
}

export interface StudySession {
  id: string;
  subjectId: SubjectId;
  chapterId?: string;
  chapterTitle?: string;
  durationMinutes: number;
  timestamp: string;
  mode: 'pomodoro' | 'deep_work' | 'quick_review';
  notes?: string;
}

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskCategory = 'syllabus' | 'revision' | 'quiz' | 'sample_paper' | 'homework';

export interface ToDoItem {
  id: string;
  title: string;
  subjectId: SubjectId;
  unitName?: string;
  chapterId?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string;
  completed: boolean;
  estimatedMinutes?: number;
  createdAt: string;
}

export interface FormulaCard {
  id: string;
  subjectId: SubjectId;
  unitName: string;
  chapterTitle: string;
  title: string;
  content: string; // formula / equation / definition
  explanation: string;
  isImportant: boolean;
}

export interface SamplePaper {
  id: string;
  subjectId: SubjectId;
  title: string; // e.g. "CBSE Official Sample Paper 2025-26"
  year: string;
  totalMarks: number;
  marksObtained?: number;
  timeTakenMinutes?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  dateCompleted?: string;
  pdfUrl?: string;
}

export interface VirtualPlant {
  id: string;
  name: string;
  icon: string;
  stage: 'sprout' | 'growing' | 'blooming' | 'golden';
  earnedAt: string;
  sessionMinutes: number;
  subjectName?: string;
}

export interface StudentProfile {
  name: string;
  schoolName: string;
  targetBoardYear: string;
  targetExamName?: string; // e.g. "Board Finals 2027", "Pre-Board 1", "Pre-Board 2"
  boardExamDate: string; // e.g. "2027-02-15"
  dailyStudyGoalMinutes: number;
  email?: string;
  avatarUrl?: string;
  avatarEmoji?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  schoolName: string;
  targetBoardYear: string;
  targetExamName?: string;
  boardExamDate: string;
  dailyStudyGoalMinutes: number;
  avatarEmoji?: string;
  createdAt: string;
}
