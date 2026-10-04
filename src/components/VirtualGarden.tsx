import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VirtualPlant } from '../types';
import { 
  Sprout, 
  Sparkles, 
  Flame, 
  Lock, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Trophy, 
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';

export interface VirtualGardenProps {
  virtualPlants: VirtualPlant[];
  totalFocusMins: number;
  currentTimerProgress?: number; // 0 to 100 percent
  isTimerRunning?: boolean;
  timeLeftSeconds?: number;
  durationMinutes?: number;
  activeSubjectName?: string;
  timerMode?: 'pomodoro' | 'short_break' | 'long_break';
  onDeletePlant?: (plot: TerrariumPlot) => void;
}

export type FloraTier = 'Sprout' | 'Fern' | 'Lotus' | 'Golden Flora';

export const PLANT_TEMPLATES = [
  { name: 'Focus Sprout', icon: '🌱', stage: 'sprout', xp: 40, description: 'Sprouted from your very first 25-minute Pomodoro study sprint.' },
  { name: 'Concentration Fern', icon: '🌿', stage: 'growing', xp: 40, description: 'Rooted deeply after consecutive focused study sessions.' },
  { name: 'Scholar Lotus', icon: '🪷', stage: 'blooming', xp: 50, description: 'Blooms brilliantly when syllabus chapters are mastered.' },
  { name: 'Golden Board Oak', icon: '🌻', stage: 'golden', xp: 60, description: 'A majestic golden tree representing peak Board Exam readiness!' },
];

export function getPlantForSessionIndex(index: number) {
  return PLANT_TEMPLATES[index % PLANT_TEMPLATES.length];
}

export interface TerrariumPlot {
  slotId: number; // 0, 1, 2, 3
  status: 'empty' | 'growing' | 'harvested';
  label?: string;
  progress?: number;
  tier?: FloraTier;
  floraName?: string;
  icon?: string;
  subjectName?: string;
  harvestedAt?: string;
  durationMinutes?: number;
  xpEarned?: number;
}

const STORAGE_KEYS = {
  SLOTS: 'stracked_terrarium_slots',
  HISTORY: 'stracked_flora_history',
  XP: 'stracked_terrarium_xp',
  HARVEST_COUNT: 'stracked_terrarium_harvest_count',
  STREAK: 'stracked_terrarium_streak'
};

const TIER_CONFIGS: Record<FloraTier, {
  name: string;
  icon: string;
  badgeBg: string;
  glowBg: string;
  desc: string;
}> = {
  'Sprout': {
    name: 'Focus Sprout',
    icon: '🌱',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    glowBg: 'from-emerald-500/10 to-teal-500/10',
    desc: 'Sprouted from focused revision and disciplined time blocking.'
  },
  'Fern': {
    name: 'Concentration Fern',
    icon: '🌿',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
    glowBg: 'from-teal-500/10 to-emerald-500/10',
    desc: 'Deep roots formed through uninterrupted chapter problem solving.'
  },
  'Lotus': {
    name: 'Scholar Lotus',
    icon: '🪷',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    glowBg: 'from-purple-500/10 to-pink-500/10',
    desc: 'Elegantly bloomed through master-level NCERT syllabus comprehension.'
  },
  'Golden Flora': {
    name: 'Golden Board Oak',
    icon: '🌻',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    glowBg: 'from-amber-500/15 to-yellow-500/15',
    desc: 'Supreme golden blossom representing peak CBSE Class 10 board readiness!'
  }
};

const TIERS_CYCLE: FloraTier[] = ['Sprout', 'Fern', 'Lotus', 'Golden Flora'];

// Format seconds to mm:ss
function formatSeconds(totalSecs: number): string {
  const m = Math.floor(Math.max(0, totalSecs) / 60);
  const s = Math.floor(Math.max(0, totalSecs) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const VirtualGarden: React.FC<VirtualGardenProps> = ({
  virtualPlants = [],
  totalFocusMins = 0,
  currentTimerProgress = 0,
  isTimerRunning = false,
  timeLeftSeconds,
  durationMinutes = 25,
  activeSubjectName = 'Science',
  timerMode = 'pomodoro',
  onDeletePlant
}) => {
  // 1. Terrarium Slots State (4 Slots)
  const [plots, setPlots] = useState<TerrariumPlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch (e) {}

    // Initialize initial 4 plots from past virtualPlants if available
    const initialPlots: TerrariumPlot[] = [
      { slotId: 0, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 1, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 2, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 3, status: 'empty', label: 'Awaiting Seed', progress: 0 }
    ];

    if (virtualPlants.length > 0) {
      const numToSeed = Math.min(2, virtualPlants.length);
      for (let i = 0; i < numToSeed; i++) {
        const plant = virtualPlants[i];
        const tier = TIERS_CYCLE[i % TIERS_CYCLE.length];
        initialPlots[i] = {
          slotId: i,
          status: 'harvested',
          tier: tier,
          floraName: plant.name || TIER_CONFIGS[tier].name,
          icon: plant.icon || TIER_CONFIGS[tier].icon,
          subjectName: plant.subjectName || 'CBSE Class 10',
          harvestedAt: plant.earnedAt || new Date().toISOString(),
          durationMinutes: plant.sessionMinutes || 25,
          xpEarned: 50
        };
      }
    }

    return initialPlots;
  });

  // 2. Lifetime Flora History and XP
  const [floraHistory, setFloraHistory] = useState<TerrariumPlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.XP);
      if (saved) return Number(saved);
    } catch (e) {}
    return Math.max(150, (virtualPlants.length || 3) * 50);
  });

  // 3. Total Harvested Count (persisted in localStorage)
  const [totalHarvestedCount, setTotalHarvestedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HARVEST_COUNT);
      if (saved) return Number(saved);
    } catch (e) {}
    const cur = plots.filter(p => p.status === 'harvested').length;
    return Math.max(cur, virtualPlants.length || cur);
  });

  // 4. Inspection Modal & History Drawer State
  const [inspectingPlot, setInspectingPlot] = useState<TerrariumPlot | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Save plots to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(plots));
    } catch (e) {}
  }, [plots]);

  // Save flora history, harvest count & XP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(floraHistory));
      localStorage.setItem(STORAGE_KEYS.XP, totalXp.toString());
      localStorage.setItem(STORAGE_KEYS.HARVEST_COUNT, totalHarvestedCount.toString());
    } catch (e) {}
  }, [floraHistory, totalXp, totalHarvestedCount]);

  // Track virtual plants count to automatically harvest a new plant when timer session completes
  const prevPlantsCount = useRef(virtualPlants.length);
  useEffect(() => {
    if (virtualPlants.length > prevPlantsCount.current) {
      const newlyEarned = virtualPlants[0];
      prevPlantsCount.current = virtualPlants.length;

      // Lock newly earned plant into first non-harvested slot
      setPlots(prev => {
        const nextSlots = [...prev];
        let targetIndex = nextSlots.findIndex(s => s.status !== 'harvested');
        
        // If all 4 were harvested, archive batch and place in slot 0
        if (targetIndex === -1) {
          setFloraHistory(h => [...nextSlots, ...h]);
          targetIndex = 0;
          nextSlots[1] = { slotId: 1, status: 'empty', label: 'Awaiting Seed', progress: 0 };
          nextSlots[2] = { slotId: 2, status: 'empty', label: 'Awaiting Seed', progress: 0 };
          nextSlots[3] = { slotId: 3, status: 'empty', label: 'Awaiting Seed', progress: 0 };
        }

        const tierIndex = (floraHistory.length + targetIndex) % TIERS_CYCLE.length;
        const tier = TIERS_CYCLE[tierIndex];

        nextSlots[targetIndex] = {
          slotId: targetIndex,
          status: 'harvested',
          tier: tier,
          floraName: newlyEarned.name || TIER_CONFIGS[tier].name,
          icon: newlyEarned.icon || TIER_CONFIGS[tier].icon,
          subjectName: newlyEarned.subjectName || activeSubjectName || 'CBSE Study',
          harvestedAt: new Date().toISOString(),
          durationMinutes: newlyEarned.sessionMinutes || durationMinutes || 25,
          xpEarned: 50
        };

        return nextSlots;
      });

      // Add 50 XP & Increment Harvested
      setTotalXp(prevXp => prevXp + 50);
      setTotalHarvestedCount(c => c + 1);
      setBannerNotice(`🎉 Harvest Complete! New "${newlyEarned.name || 'Flora'}" locked in terrarium (+50 Focus XP)!`);
      setTimeout(() => setBannerNotice(null), 6000);
    } else {
      prevPlantsCount.current = virtualPlants.length;
    }
  }, [virtualPlants.length, activeSubjectName, durationMinutes, floraHistory.length]);

  // Handle Deleting a Specific Session from a Garden Slot
  const handleDeleteSession = (slotId: number) => {
    const plotToDelete = plots.find(p => p.slotId === slotId);
    const floraName = plotToDelete?.floraName || 'Session';

    // 1. Reset that specific plot to default: { status: 'empty', label: 'Awaiting Seed', progress: 0 }
    // Overwrite the saved sessions key in localStorage with the updated array immediately
    const defaultPlot: TerrariumPlot = {
      slotId,
      status: 'empty',
      label: 'Awaiting Seed',
      progress: 0
    };

    setPlots(prev => {
      const updated = prev.map((p, idx) => {
        if (p.slotId === slotId || idx === slotId) {
          return defaultPlot;
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 2. Adjust Stats on Deletion:
    // Ensure the deleted session subtracts 50 XP from total Focus XP and reduces Harvested count by 1 (clamped to 0 minimum).
    // Update both metrics in localStorage immediately.
    setTotalXp(prev => {
      const nextXp = Math.max(0, prev - 50);
      try {
        localStorage.setItem(STORAGE_KEYS.XP, nextXp.toString());
      } catch (e) {}
      return nextXp;
    });

    setTotalHarvestedCount(prev => {
      const nextCount = Math.max(0, prev - 1);
      try {
        localStorage.setItem(STORAGE_KEYS.HARVEST_COUNT, nextCount.toString());
      } catch (e) {}
      return nextCount;
    });

    // Remove from floraHistory if present
    setFloraHistory(prev => {
      const updatedHistory = prev.filter(item => 
        item.slotId !== slotId || (plotToDelete?.harvestedAt && item.harvestedAt !== plotToDelete.harvestedAt)
      );
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
      } catch (e) {}
      return updatedHistory;
    });

    // Notify parent if hook passed
    if (onDeletePlant && plotToDelete) {
      onDeletePlant(plotToDelete);
    }

    setBannerNotice(`🗑️ Deleted "${floraName}" (-50 XP). Plot 0${slotId + 1} reset to "Awaiting Seed".`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Find index of currently active plot (first unharvested slot)
  const activePlotIndex = useMemo(() => {
    const idx = plots.findIndex(p => p.status !== 'harvested');
    return idx !== -1 ? idx : -1;
  }, [plots]);

  // Compute effective remaining seconds for live growth stage
  const effectiveRemainingSecs = useMemo(() => {
    if (timeLeftSeconds !== undefined) {
      return timeLeftSeconds;
    }
    const durationSecs = durationMinutes * 60;
    return Math.max(0, Math.round(durationSecs * (1 - (currentTimerProgress / 100))));
  }, [timeLeftSeconds, durationMinutes, currentTimerProgress]);

  // Visual Growth Stages (Timer-based Icon Swaps):
  // 25m - 20m: Seed in soil (🌰)
  // 20m - 10m: Sprout (🌱)
  // 10m - 0m: Budding plant (🌿)
  // 0m (Completed): Fully bloomed flora (🪷)
  const currentGrowthStage = useMemo(() => {
    const remainingMins = effectiveRemainingSecs / 60;

    if (remainingMins > 20) {
      return {
        stageId: 'seed',
        name: 'Seed in Soil',
        icon: '🌰',
        range: '25m - 20m',
        desc: 'Germinating underground in nutrient-rich soil',
        ringColor: 'text-amber-500'
      };
    }
    if (remainingMins > 10) {
      return {
        stageId: 'sprout',
        name: 'Sprout',
        icon: '🌱',
        range: '20m - 10m',
        desc: 'Fresh green shoot breaking through soil',
        ringColor: 'text-emerald-500'
      };
    }
    if (remainingMins > 0) {
      return {
        stageId: 'budding',
        name: 'Budding Plant',
        icon: '🌿',
        range: '10m - 0m',
        desc: 'Bud swelling and preparing for full bloom',
        ringColor: 'text-teal-500'
      };
    }
    return {
      stageId: 'bloomed',
      name: 'Fully Bloomed Flora',
      icon: '🪷',
      range: '0m Completed',
      desc: 'Masterwork flora ready for harvest!',
      ringColor: 'text-purple-500'
    };
  }, [effectiveRemainingSecs]);

  // Calculate day streak from dates of harvested flora
  const dayStreak = useMemo(() => {
    try {
      const dates = new Set<string>();
      plots.forEach(p => {
        if (p.harvestedAt) dates.add(p.harvestedAt.split('T')[0]);
      });
      floraHistory.forEach(h => {
        if (h.harvestedAt) dates.add(h.harvestedAt.split('T')[0]);
      });
      return Math.max(1, dates.size);
    } catch (e) {
      return 1;
    }
  }, [plots, floraHistory]);

  // Archive entire 4-plot batch and reset to clean soil
  const handleHarvestBatchAndReset = () => {
    const harvestedPlots = plots.filter(p => p.status === 'harvested');
    if (harvestedPlots.length > 0) {
      setFloraHistory(prev => [...harvestedPlots, ...prev]);
    }

    setPlots([
      { slotId: 0, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 1, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 2, status: 'empty', label: 'Awaiting Seed', progress: 0 },
      { slotId: 3, status: 'empty', label: 'Awaiting Seed', progress: 0 }
    ]);

    setTotalXp(x => x + 100);
    setBannerNotice('🏆 Full Terrarium Batch archived to Greenhouse! +100 Bonus XP earned!');
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Helper for circular progress calculations
  const progressPercent = Math.max(0, Math.min(100, currentTimerProgress));
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const isAllHarvested = plots.every(p => p.status === 'harvested');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 transition-colors">
      
      {/* 5. Top Gamified Stat Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <span className="text-xl">🪴</span>
              <span>Study Terrarium</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              4-Plot System
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
            Grow and lock rare flora in your 4-slot greenhouse through 25-minute Pomodoro focus sprints.
          </p>
        </div>

        {/* Gamified Stat Metrics */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold shadow-2xs"
            title="Total Flora Harvested in lifetime"
          >
            <span className="text-base">🪴</span>
            <span>{totalHarvestedCount} Harvested</span>
          </div>

          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 font-extrabold shadow-2xs"
            title="Consecutive daily study habit streak"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{dayStreak} Day Streak</span>
          </div>

          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 font-extrabold shadow-2xs"
            title="+50 Focus XP awarded per completed study sprint"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{totalXp} Focus XP</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">(+50/session)</span>
          </div>
        </div>
      </div>

      {/* Banner Notice Toast */}
      {bannerNotice && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-sm text-xs sm:text-sm font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-200 animate-bounce" />
            <span>{bannerNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-emerald-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. 4-Slot Terrarium Grid (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {plots.map((plot, index) => {
          const isHarvested = plot.status === 'harvested';
          const isActivePlot = !isHarvested && index === activePlotIndex;
          const isEmptyWaiting = !isHarvested && !isActivePlot;

          const tier = plot.tier || 'Sprout';
          const config = TIER_CONFIGS[tier];

          return (
            <div
              key={plot.slotId}
              onClick={() => {
                if (isHarvested) {
                  setInspectingPlot(plot);
                }
              }}
              className={`rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden group select-none min-h-[260px] ${
                isHarvested
                  ? 'bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs cursor-pointer hover:shadow-md'
                  : isActivePlot
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-500/70 dark:border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-50/40 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700/80 opacity-80'
              }`}
            >
              
              {/* Slot Header with Delete Button on Harvested Card */}
              <div className="flex items-center justify-between gap-1 w-full z-10">
                <span className="text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  Plot 0{index + 1}
                </span>

                {isHarvested && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${config.badgeBg}`}>
                      {plot.tier}
                    </span>
                    {/* Delete button (trash icon) in top-right corner */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDeleteSession(plot.slotId);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Delete this session from garden (-50 XP)"
                      aria-label="Delete this session from garden"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {isActivePlot && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>{isTimerRunning ? 'Growing' : 'Active Plot'}</span>
                  </span>
                )}

                {isEmptyWaiting && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                    {plot.label || 'Awaiting Seed'}
                  </span>
                )}
              </div>

              {/* Slot Center Graphic / Circular Progress Ring */}
              <div className="my-auto py-2 flex flex-col items-center justify-center text-center z-10">
                
                {/* 1. Harvested Plot Center Graphic */}
                {isHarvested && (
                  <div className="space-y-2">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-200">
                      <span>{plot.icon || config.icon}</span>
                      <div 
                        className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full shadow-sm"
                        title="Harvested & locked in terrarium"
                      >
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Click to inspect
                    </span>
                  </div>
                )}

                {/* 2. Active Plot: Circular Timer on Active Plot & Growth Stages */}
                {isActivePlot && (
                  <div className="space-y-1.5 w-full flex flex-col items-center">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                      
                      {/* SVG Circular Progress Ring */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r={circleRadius}
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-slate-200 dark:text-slate-700"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r={circleRadius}
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="text-emerald-500 transition-all duration-700"
                          fill="transparent"
                        />
                      </svg>

                      {/* Icon inside Ring: Growth Stage Icon Swap */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl sm:text-4xl transition-transform duration-300 ${isTimerRunning ? 'animate-bounce duration-1000' : ''}`}>
                          {currentGrowthStage.icon}
                        </span>
                      </div>
                    </div>

                    {/* Timer Countdown Time */}
                    <div className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white">
                      {isTimerRunning ? formatSeconds(effectiveRemainingSecs) : '25:00 Ready'}
                    </div>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      <span>{currentGrowthStage.name}</span>
                    </div>
                  </div>
                )}

                {/* 3. Empty Slot: "Awaiting Seed" state */}
                {isEmptyWaiting && (
                  <div className="space-y-2 opacity-75 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform bg-white/50 dark:bg-slate-800/40">
                      <span>🌱</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {plot.label || 'Awaiting Seed'}
                    </span>
                  </div>
                )}

              </div>

              {/* Slot Footer */}
              <div className="border-t border-slate-200/70 dark:border-slate-700/70 pt-2.5 space-y-1 z-10">
                {isHarvested && (
                  <>
                    <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                      <span className="truncate">{plot.floraName || config.name}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                        +50 XP
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <span className="truncate">{plot.subjectName || 'CBSE Study'}</span>
                      <span>25m Focus</span>
                    </div>
                  </>
                )}

                {isActivePlot && (
                  <>
                    <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                      <span className="truncate">{activeSubjectName}</span>
                      <span className="text-amber-500 font-extrabold text-[11px]">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">
                      {isTimerRunning ? 'Sprint in progress...' : 'Start timer to cultivate'}
                    </div>
                  </>
                )}

                {isEmptyWaiting && (
                  <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-medium">
                    {plot.label ? `${plot.label} • Ready for 25m sprint` : 'Awaiting Seed • Ready for 25m sprint'}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Terrarium Actions & Milestone Completion Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {isAllHarvested 
              ? 'All 4 plots bloomed! Archive to greenhouse to claim +100 XP and plant your next batch.'
              : `${plots.filter(p => p.status === 'harvested').length}/4 Plots Harvested. Complete 25m sprints to fill the terrarium.`
            }
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Greenhouse History Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Greenhouse ({totalHarvestedCount})</span>
            {showHistoryDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* New Terrarium Batch Reset Button */}
          <button
            type="button"
            onClick={handleHarvestBatchAndReset}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isAllHarvested
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Archive completed plots to Greenhouse and prepare 4 fresh soil plots"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAllHarvested ? 'Harvest All & Reset (+100 XP)' : 'New Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Historical Greenhouse Drawer (Expandable) */}
      {showHistoryDrawer && (
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Flora Greenhouse Archive ({totalHarvestedCount} Total Harvested)</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              +{totalHarvestedCount * 50} Lifetime Focus XP
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {/* Show Current Terrarium Flora */}
            {plots.filter(p => p.status === 'harvested').map((p, idx) => (
              <div 
                key={`cur-${idx}`}
                onClick={() => setInspectingPlot(p)}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center space-y-1 hover:border-emerald-500 cursor-pointer transition-all relative group"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDeleteSession(p.slotId);
                  }}
                  className="absolute top-1 right-1 p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                  title="Delete session (-50 XP)"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="text-2xl">{p.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.floraName}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{p.tier}</div>
              </div>
            ))}

            {/* Show Archived History Flora */}
            {floraHistory.map((h, idx) => (
              <div 
                key={`hist-${idx}`}
                onClick={() => setInspectingPlot(h)}
                className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5 text-center space-y-1 hover:border-emerald-500 cursor-pointer transition-all"
              >
                <div className="text-2xl">{h.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{h.floraName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold">{h.tier}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plant Inspection Modal */}
      {inspectingPlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              type="button"
              onClick={() => setInspectingPlot(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner">
                {inspectingPlot.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {inspectingPlot.floraName}
              </h3>
              <span className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider border ${
                inspectingPlot.tier ? TIER_CONFIGS[inspectingPlot.tier].badgeBg : ''
              }`}>
                Tier: {inspectingPlot.tier}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed font-normal">
              {inspectingPlot.tier ? TIER_CONFIGS[inspectingPlot.tier].desc : ''}
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subject Studied:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{inspectingPlot.subjectName || 'CBSE Study'}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Focus Duration:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{inspectingPlot.durationMinutes || 25} Minutes</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Harvest Date:</span>
                <strong className="text-slate-900 dark:text-white font-bold">
                  {inspectingPlot.harvestedAt 
                    ? new Date(inspectingPlot.harvestedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Today'
                  }
                </strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Focus XP Awarded:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">+50 Focus XP</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>Lock Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Locked in Terrarium
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (inspectingPlot) {
                    handleDeleteSession(inspectingPlot.slotId);
                    setInspectingPlot(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs transition-colors cursor-pointer border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete (-50 XP)</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectingPlot(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
