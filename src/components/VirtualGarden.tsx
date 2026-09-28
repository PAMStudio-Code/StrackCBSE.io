import React, { useState } from 'react';
import { VirtualPlant } from '../types';
import { Sparkles, Trophy, Flame, TreePine, Award, Info, X, Sprout, Heart, ShieldCheck, Zap } from 'lucide-react';

interface VirtualGardenProps {
  virtualPlants: VirtualPlant[];
  totalFocusMins: number;
  currentTimerProgress?: number; // 0 to 100 percent
  isTimerRunning?: boolean;
}

export const PLANT_TEMPLATES = [
  { name: 'Focus Sprout', icon: '🌱', stage: 'sprout', xp: 40, description: 'Sprouted from your very first 25-minute Pomodoro study sprint.', bgGrad: 'from-emerald-50 to-emerald-100/60', border: 'border-emerald-200', tagBg: 'bg-emerald-100 text-emerald-800' },
  { name: 'Concentration Fern', icon: '🌿', stage: 'growing', xp: 40, description: 'Rooted deeply after consecutive focused study sessions.', bgGrad: 'from-teal-50 to-teal-100/60', border: 'border-teal-200', tagBg: 'bg-teal-100 text-teal-800' },
  { name: 'Mindfulness Bonsai', icon: '🪴', stage: 'blooming', xp: 40, description: 'Carefully shaped by calm, undistracted revision hours.', bgGrad: 'from-emerald-50 via-teal-50 to-purple-50', border: 'border-purple-200', tagBg: 'bg-purple-100 text-purple-800' },
  { name: 'Scholar Sakura', icon: '🌸', stage: 'blooming', xp: 50, description: 'Blooms brilliantly when syllabus chapters are mastered.', bgGrad: 'from-pink-50 to-rose-100/60', border: 'border-pink-200', tagBg: 'bg-pink-100 text-pink-800' },
  { name: 'Golden Board Oak', icon: '🌳', stage: 'golden', xp: 60, description: 'A majestic golden tree representing peak Board Exam readiness!', bgGrad: 'from-amber-50 via-yellow-50 to-amber-100', border: 'border-amber-300', tagBg: 'bg-amber-100 text-amber-900' },
  { name: '100 Percentile Lotus', icon: '🪷', stage: 'golden', xp: 75, description: 'Extremely rare lotus unlocked by persistent high-yield revision.', bgGrad: 'from-amber-100 via-rose-50 to-purple-100', border: 'border-amber-400', tagBg: 'bg-gradient-to-r from-amber-500 to-purple-600 text-white' },
];

export function getPlantForSessionIndex(index: number) {
  const template = PLANT_TEMPLATES[index % PLANT_TEMPLATES.length];
  return template;
}

export const VirtualGarden: React.FC<VirtualGardenProps> = ({
  virtualPlants,
  totalFocusMins,
  currentTimerProgress = 0,
  isTimerRunning = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sprout' | 'growing' | 'blooming' | 'golden'>('all');
  const [selectedPlant, setSelectedPlant] = useState<VirtualPlant | null>(null);

  const filteredPlants = virtualPlants.filter(p => {
    if (activeFilter === 'all') return true;
    return p.stage === activeFilter;
  });

  const nextPlantToEarn = PLANT_TEMPLATES[(virtualPlants.length) % PLANT_TEMPLATES.length];

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
            🪴
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <span>Pomodoro Virtual Garden</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Gamified Rewards
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Complete 25m focus study sprints to nurture living plants & earn XP multipliers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/90 rounded-2xl p-1.5 self-start sm:self-auto text-xs">
          <div className="px-3 py-1 bg-white rounded-xl font-extrabold text-stone-800 shadow-2xs border border-stone-100 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{virtualPlants.length} Plants</span>
          </div>
          <div className="px-3 py-1 bg-white rounded-xl font-extrabold text-stone-800 shadow-2xs border border-stone-100 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>+{virtualPlants.length * 40} Garden XP</span>
          </div>
        </div>
      </div>

      {/* Live Timer Germination Progress Banner (if timer active) */}
      {isTimerRunning && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-4 shadow-sm space-y-2 border border-emerald-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2 text-emerald-300">
              <span className="animate-pulse">🌱</span> Live Seed Germination Progress:
              <strong className="text-white">{nextPlantToEarn.name} ({nextPlantToEarn.icon})</strong>
            </span>
            <span className="text-amber-300 font-extrabold">{currentTimerProgress}% Grown</span>
          </div>

          <div className="h-3 w-full bg-stone-800/90 rounded-full overflow-hidden p-0.5 border border-emerald-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(5, currentTimerProgress)}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-300 font-medium flex items-center justify-between">
            <span>Keep your timer running! Completing this session will sprout your next plant into your garden.</span>
            <span className="text-amber-300 font-bold shrink-0">+30 XP Bonus</span>
          </p>
        </div>
      )}

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All Plants (${virtualPlants.length})`, icon: '🌿' },
          { id: 'sprout', label: 'Sprouts', icon: '🌱' },
          { id: 'growing', label: 'Growing', icon: '🌿' },
          { id: 'blooming', label: 'Blooming', icon: '🌸' },
          { id: 'golden', label: 'Golden Oaks', icon: '🌳' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100/80 hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Garden Grid Display */}
      {filteredPlants.length === 0 ? (
        <div className="bg-stone-50 border border-dashed border-stone-200/90 rounded-2xl p-8 text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mx-auto text-emerald-800">
            🌱
          </div>
          <h4 className="font-extrabold text-stone-800 text-sm">No Plants in this Stage Yet</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto font-medium">
            Complete a 25-minute Pomodoro study session in the Study Timer to sprout new plants!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredPlants.map((plant, idx) => {
            const template = PLANT_TEMPLATES.find(t => t.name === plant.name) || PLANT_TEMPLATES[idx % PLANT_TEMPLATES.length];

            return (
              <div
                key={plant.id || idx}
                onClick={() => setSelectedPlant(plant)}
                className={`bg-gradient-to-b ${template.bgGrad} border ${template.border} hover:shadow-md rounded-2xl p-3.5 text-center space-y-2 transition-all group relative overflow-hidden cursor-pointer transform hover:-translate-y-1`}
              >
                {/* Glow ring badge */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/80 shadow-2xs border border-white flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-200 my-1 relative">
                  <span>{plant.icon}</span>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black text-stone-900 line-clamp-1">
                    {plant.name}
                  </div>
                  <div className="text-[10px] text-stone-500 font-bold line-clamp-1 mt-0.5">
                    {plant.subjectName || 'CBSE Class 10'}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${template.tagBg}`}>
                    {plant.stage}
                  </span>
                </div>

                <div className="text-[9px] text-stone-400 font-medium border-t border-stone-200/50 pt-1.5 flex items-center justify-between">
                  <span>+{plant.sessionMinutes || 25}m focus</span>
                  <span className="text-emerald-700 font-bold">+40 XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Milestone Reward Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-purple-500/10 border border-stone-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
            {nextPlantToEarn.icon}
          </div>
          <div>
            <span className="font-extrabold text-stone-900 block">
              Next Garden Unlock: {nextPlantToEarn.name}
            </span>
            <span className="text-stone-500 font-medium">
              Complete your next 25-minute Pomodoro timer session to grow this plant & earn +30 XP bonus!
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs self-start sm:self-auto shrink-0 shadow-2xs">
          +{nextPlantToEarn.xp} XP
        </span>
      </div>

      {/* Plant Inspection Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner">
                {selectedPlant.icon}
              </div>
              <h3 className="text-lg font-black text-stone-900">{selectedPlant.name}</h3>
              <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full uppercase tracking-wider">
                Stage: {selectedPlant.stage}
              </span>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Earned From:</span>
                <strong className="text-stone-900">{selectedPlant.subjectName || 'CBSE Study'}</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Focus Duration:</span>
                <strong className="text-emerald-700">{selectedPlant.sessionMinutes || 25} Minutes</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Date Grown:</span>
                <strong className="text-stone-900">
                  {new Date(selectedPlant.earnedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Student XP Gained:</span>
                <strong className="text-purple-700 font-extrabold">+40 XP</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlant(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-extrabold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
