/**
 * Storage keys and automatic migration utility for Stracked.
 * Migrates existing data from legacy keys (e.g. 'strack_*', 'cbse_*') to 'stracked_*'.
 */

export const STORAGE_KEYS = {
  TASKS: 'stracked_tasks',
  SYLLABUS: 'stracked_syllabus',
  SETTINGS: 'stracked_settings',
  THEME: 'stracked_theme',
  VIRTUAL_PLANTS: 'stracked_virtual_plants',
  QUIZ_QUESTIONS: 'stracked_quiz_questions',
  QUIZ_ATTEMPTS: 'stracked_quiz_attempts',
  STUDY_SESSIONS: 'stracked_study_sessions',
  SAMPLE_PAPERS: 'stracked_sample_papers',
  // Timer keys
  TIMER_MODE: 'stracked_timer_mode',
  TIMER_DURATION: 'stracked_timer_duration',
  TIMER_IS_RUNNING: 'stracked_timer_is_running',
  TIMER_END_TIMESTAMP: 'stracked_timer_end_timestamp',
  TIMER_TIME_LEFT: 'stracked_timer_time_left',
  TIMER_MUSIC: 'stracked_custom_timer_music_v2',
} as const;

export interface StorageMigrationMapping {
  newKey: string;
  fallbackOldKeys: string[];
}

export const MIGRATION_MAPPINGS: StorageMigrationMapping[] = [
  { newKey: STORAGE_KEYS.TASKS, fallbackOldKeys: ['strack_tasks', 'cbse_todos'] },
  { newKey: STORAGE_KEYS.SYLLABUS, fallbackOldKeys: ['strack_syllabus', 'cbse_chapters'] },
  { newKey: STORAGE_KEYS.SETTINGS, fallbackOldKeys: ['strack_settings', 'cbse_student_profile', 'cbse_profile'] },
  { newKey: STORAGE_KEYS.THEME, fallbackOldKeys: ['strack_theme', 'cbse_theme'] },
  { newKey: STORAGE_KEYS.VIRTUAL_PLANTS, fallbackOldKeys: ['strack_virtual_plants', 'cbse_virtual_plants'] },
  { newKey: STORAGE_KEYS.QUIZ_QUESTIONS, fallbackOldKeys: ['strack_quiz_questions', 'cbse_quiz_questions'] },
  { newKey: STORAGE_KEYS.QUIZ_ATTEMPTS, fallbackOldKeys: ['strack_quiz_attempts', 'cbse_quiz_attempts'] },
  { newKey: STORAGE_KEYS.STUDY_SESSIONS, fallbackOldKeys: ['strack_study_sessions', 'cbse_study_sessions'] },
  { newKey: STORAGE_KEYS.SAMPLE_PAPERS, fallbackOldKeys: ['strack_sample_papers', 'cbse_sample_papers'] },
  { newKey: STORAGE_KEYS.TIMER_MODE, fallbackOldKeys: ['strack_timer_mode', 'cbse_timer_mode'] },
  { newKey: STORAGE_KEYS.TIMER_DURATION, fallbackOldKeys: ['strack_timer_duration', 'cbse_timer_duration'] },
  { newKey: STORAGE_KEYS.TIMER_IS_RUNNING, fallbackOldKeys: ['strack_timer_is_running', 'cbse_timer_is_running'] },
  { newKey: STORAGE_KEYS.TIMER_END_TIMESTAMP, fallbackOldKeys: ['strack_timer_end_timestamp', 'cbse_timer_end_timestamp'] },
  { newKey: STORAGE_KEYS.TIMER_TIME_LEFT, fallbackOldKeys: ['strack_timer_time_left', 'cbse_timer_time_left'] },
  { newKey: STORAGE_KEYS.TIMER_MUSIC, fallbackOldKeys: ['strack_custom_timer_music_v2', 'cbse_custom_timer_music_v2'] },
];

/**
 * Perform one-time synchronous migration check on app startup.
 * Automatically copies any legacy values over to the new 'stracked_*' keys
 * without resetting or overwriting any newer existing data.
 */
export function migrateLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    for (const { newKey, fallbackOldKeys } of MIGRATION_MAPPINGS) {
      const existingNewValue = localStorage.getItem(newKey);
      if (existingNewValue === null) {
        for (const oldKey of fallbackOldKeys) {
          const oldValue = localStorage.getItem(oldKey);
          if (oldValue !== null) {
            localStorage.setItem(newKey, oldValue);
            break;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Storage migration encountered a minor issue:', err);
  }
}

/**
 * Helper to safely retrieve an item with automatic fallback to legacy keys.
 * If data is found in a legacy key, it is mirrored forward to the new key immediately.
 */
export function getMigratedStorageItem(newKey: string, fallbackOldKeys: string[] = []): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    const val = localStorage.getItem(newKey);
    if (val !== null) return val;

    for (const oldKey of fallbackOldKeys) {
      const oldVal = localStorage.getItem(oldKey);
      if (oldVal !== null) {
        // Copy over so subsequent reads use newKey
        try {
          localStorage.setItem(newKey, oldVal);
        } catch (_) {}
        return oldVal;
      }
    }
  } catch (err) {
    console.warn(`Error reading key ${newKey}:`, err);
  }

  return null;
}
