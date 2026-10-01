import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { Calendar, Target, Clock, X, Check, Award, Sparkles } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/storage';

interface TargetExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const TargetExamModal: React.FC<TargetExamModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile
}) => {
  if (!isOpen) return null;

  const [examName, setExamName] = useState(profile.targetExamName || 'CBSE Board Finals');
  const [examDate, setExamDate] = useState(profile.boardExamDate || '2027-02-15');
  const [dailyGoalMins, setDailyGoalMins] = useState(profile.dailyStudyGoalMinutes || 180);
  const [studentName, setStudentName] = useState(profile.name || 'CBSE Scholar');

  const presetOptions = [
    { name: 'Half-Yearly Exam', date: '2026-09-05', icon: '📚' },
    { name: 'Pre-Board 1 Exam', date: '2026-12-15', icon: '📝' },
    { name: 'Pre-Board 2 Exam', date: '2027-01-10', icon: '🎯' },
    { name: 'CBSE Board Finals 2027', date: '2027-02-15', icon: '🎓' },
  ];

  const handleApplyPreset = (name: string, date: string) => {
    setExamName(name);
    setExamDate(date);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      name: studentName,
      targetExamName: examName,
      boardExamDate: examDate,
      dailyStudyGoalMinutes: Number(dailyGoalMins) || 180
    };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    localStorage.setItem('cbse_student_profile', JSON.stringify(updated));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-extrabold">
              <Calendar className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">Countdown Target Date</h3>
              <p className="text-xs text-stone-500">Customize your exam date & study goals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Quick Exam Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presetOptions.map((preset) => {
              const isSelected = examName === preset.name && examDate === preset.date;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset.name, preset.date)}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                      : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="text-lg">{preset.icon}</span>
                  <div className="mt-1">
                    <div className="text-[11px] font-bold leading-tight">{preset.name}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{preset.date}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Form Inputs */}
        <form onSubmit={handleSave} className="space-y-3.5 pt-1">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Target Exam Title
            </label>
            <input
              type="text"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. Pre-Board 1, Board Finals 2027"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Exam Date
            </label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Daily Goal (Mins)
              </label>
              <input
                type="number"
                min={30}
                max={600}
                step={15}
                value={dailyGoalMins}
                onChange={(e) => setDailyGoalMins(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Save Target Date
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
