import React, { useState, useEffect } from 'react';
import { Subject, Chapter, StudySession, VirtualPlant } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Bell, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  BookOpen,
  Sprout,
  Trash2,
  Music,
  Zap,
  Trophy,
  Moon,
  CloudRain,
  Coffee,
  Headphones,
  Disc,
  Plus,
  Link2,
  Volume1,
  Sliders,
  Tv,
  ExternalLink,
  Radio,
  Check
} from 'lucide-react';
import { soundEngine, AmbientSoundType, CustomTrack } from '../utils/audio';
import { parseAudioUrl, ParsedAudioInfo } from '../utils/audioUrlParser';
import { EmbeddedAudioPlayer } from './EmbeddedAudioPlayer';
import confetti from 'canvas-confetti';
import { VirtualGarden, getPlantForSessionIndex } from './VirtualGarden';

interface StudyTimerProps {
  subjects: Subject[];
  chapters: Chapter[];
  studySessions: StudySession[];
  setStudySessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  virtualPlants?: VirtualPlant[];
  setVirtualPlants?: React.Dispatch<React.SetStateAction<VirtualPlant[]>>;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  subjects,
  chapters,
  studySessions,
  setStudySessions,
  virtualPlants = [],
  setVirtualPlants
}) => {
  // Persistent timer state across reloads & navigation
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'short_break' | 'long_break'>(() => {
    return (localStorage.getItem('cbse_timer_mode') as any) || 'pomodoro';
  });
  const [durationMinutes, setDurationMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('cbse_timer_duration');
    return saved ? Number(saved) : 25;
  });
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const savedRunning = localStorage.getItem('cbse_timer_is_running') === 'true';
    const savedEnd = localStorage.getItem('cbse_timer_end_timestamp');
    if (savedRunning && savedEnd) {
      return Number(savedEnd) > Date.now();
    }
    return false;
  });
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => {
    const savedRunning = localStorage.getItem('cbse_timer_is_running') === 'true';
    const savedEnd = localStorage.getItem('cbse_timer_end_timestamp');
    if (savedRunning && savedEnd) {
      const diff = Math.max(0, Math.round((Number(savedEnd) - Date.now()) / 1000));
      return diff;
    }
    const savedTime = localStorage.getItem('cbse_timer_time_left');
    return savedTime ? Number(savedTime) : 25 * 60;
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('sci-ch1');
  
  // Audio State
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState<number>(100); // 0 to 200 (200% gain booster)
  const [isCompletionPlaying, setIsCompletionPlaying] = useState<boolean>(false);
  const [completionCountdown, setCompletionCountdown] = useState<number>(30);

  // Custom Music Track State (Stored in localStorage)
  const [customTracks, setCustomTracks] = useState<CustomTrack[]>(() => {
    try {
      const saved = localStorage.getItem('cbse_custom_timer_music_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'default-yt-lofi',
        name: 'Lofi Girl 24/7 Focus Stream (YouTube)',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
      },
      {
        id: 'default-sp-lofi',
        name: 'Lofi Beats Focus Playlist (Spotify)',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
      },
      {
        id: 'default-yt-ambient',
        name: 'Deep Focus Ambient Study Music (YouTube)',
        url: 'https://www.youtube.com/watch?v=WPni755-Krg'
      },
      {
        id: 'default-sp-piano',
        name: 'Peaceful Piano Focus (Spotify)',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSp2B32A6'
      },
      {
        id: 'default-lofi-stream',
        name: 'Chill Lofi Live Radio (Direct Stream)',
        url: 'https://stream.zeno.fm/f3wvbbqmdg8uv'
      }
    ];
  });

  const [activeCustomTrackId, setActiveCustomTrackId] = useState<string | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [newTrackName, setNewTrackName] = useState<string>('');
  const [newTrackUrl, setNewTrackUrl] = useState<string>('');

  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [plantEarnedNotice, setPlantEarnedNotice] = useState<string | null>(null);

  // Save custom tracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cbse_custom_timer_music_v2', JSON.stringify(customTracks));
    } catch (e) {}
  }, [customTracks]);

  const toggleAmbientSound = (sound: AmbientSoundType) => {
    setActiveCustomTrackId(null);
    if (ambientSound === sound && sound !== 'none') {
      setAmbientSound('none');
      soundEngine.stopAmbientSound();
    } else {
      setAmbientSound(sound);
      soundEngine.startAmbientSound(sound);
    }
  };

  const playCustomTrack = (track: CustomTrack) => {
    setActiveCustomTrackId(track.id);
    setAmbientSound('custom_url');

    const parsed = parseAudioUrl(track.url);
    if (parsed.type === 'direct' && parsed.directUrl) {
      soundEngine.playCustomAudioUrl(parsed.directUrl);
    } else {
      // For YouTube, Spotify, SoundCloud, Apple, etc.
      soundEngine.stopAmbientSound();
    }
  };

  const stopActiveCustomTrack = () => {
    setActiveCustomTrackId(null);
    setAmbientSound('none');
    soundEngine.stopAmbientSound();
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackName.trim() || !newTrackUrl.trim()) return;

    const track: CustomTrack = {
      id: 'custom-' + Date.now(),
      name: newTrackName.trim(),
      url: newTrackUrl.trim()
    };

    setCustomTracks(prev => [...prev, track]);
    setNewTrackName('');
    setNewTrackUrl('');
    setShowAddCustomModal(false);

    // Auto-play newly added track
    playCustomTrack(track);
  };

  const handleDeleteCustomTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCustomTrackId === id) {
      stopActiveCustomTrack();
    }
    setCustomTracks(prev => prev.filter(t => t.id !== id));
  };

  // Optimized Volume Handler (supports up to 200% Gain Booster)
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol / 100); // 0.0 to 2.0
  };

  const stopCompletionMusic = () => {
    soundEngine.stopCompletionSound();
    setIsCompletionPlaying(false);
    setCompletionCountdown(30);
  };

  // Completion Music Countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isCompletionPlaying && completionCountdown > 0) {
      timer = setInterval(() => {
        setCompletionCountdown(prev => {
          if (prev <= 1) {
            setIsCompletionPlaying(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCompletionPlaying, completionCountdown]);

  // Sync timer state changes to localStorage
  useEffect(() => {
    localStorage.setItem('cbse_timer_mode', timerMode);
    localStorage.setItem('cbse_timer_duration', String(durationMinutes));
    localStorage.setItem('cbse_timer_is_running', String(isRunning));
    localStorage.setItem('cbse_timer_time_left', String(timeLeftSeconds));

    if (isRunning) {
      const endTs = Date.now() + timeLeftSeconds * 1000;
      localStorage.setItem('cbse_timer_end_timestamp', String(endTs));
    } else {
      localStorage.removeItem('cbse_timer_end_timestamp');
    }
  }, [timerMode, durationMinutes, isRunning]);

  // Switch timer presets
  const handleModeChange = (mode: 'pomodoro' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setTimerMode(mode);
    const mins = mode === 'pomodoro' ? 25 : mode === 'short_break' ? 5 : 15;
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    localStorage.setItem('cbse_timer_time_left', String(mins * 60));
    localStorage.removeItem('cbse_timer_end_timestamp');
  };

  // Toggle start / pause
  const handleToggleRunning = () => {
    if (!isRunning) {
      const endTs = Date.now() + timeLeftSeconds * 1000;
      localStorage.setItem('cbse_timer_end_timestamp', String(endTs));
      localStorage.setItem('cbse_timer_is_running', 'true');
      setIsRunning(true);
    } else {
      localStorage.setItem('cbse_timer_is_running', 'false');
      localStorage.removeItem('cbse_timer_end_timestamp');
      setIsRunning(false);
    }
  };

  // Timer Tick Interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        const savedEnd = localStorage.getItem('cbse_timer_end_timestamp');
        let remaining = timeLeftSeconds - 1;
        if (savedEnd) {
          remaining = Math.max(0, Math.round((Number(savedEnd) - Date.now()) / 1000));
        }

        if (remaining <= 0) {
          setIsRunning(false);
          setTimeLeftSeconds(0);
          localStorage.setItem('cbse_timer_is_running', 'false');
          localStorage.removeItem('cbse_timer_end_timestamp');
          soundEngine.playChime();
          soundEngine.stopAmbientSound();
          setAmbientSound('none');

          // Start 30s Celebration Victory Sound
          setIsCompletionPlaying(true);
          setCompletionCountdown(30);
          soundEngine.play30sCompletionSound(() => {
            setIsCompletionPlaying(false);
          });

          try {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}

          // Log study session if in pomodoro mode
          if (timerMode === 'pomodoro') {
            const chap = chapters.find(c => c.id === selectedChapterId);
            const subj = subjects.find(s => s.id === selectedSubjectId);
            const newSession: StudySession = {
              id: 'session-' + Date.now(),
              subjectId: selectedSubjectId as any,
              chapterId: selectedChapterId,
              chapterTitle: chap?.title || 'General Focus Session',
              durationMinutes: durationMinutes,
              timestamp: new Date().toISOString(),
              mode: 'pomodoro',
              notes: sessionNotes || 'Pomodoro focus session completed'
            };
            setStudySessions(prev => [newSession, ...prev]);

            // Grow a new Virtual Plant
            if (setVirtualPlants) {
              const plantTemplate = getPlantForSessionIndex(virtualPlants.length);
              const newPlant: VirtualPlant = {
                id: 'plant-' + Date.now(),
                name: plantTemplate.name,
                icon: plantTemplate.icon,
                stage: plantTemplate.stage as any,
                earnedAt: new Date().toISOString(),
                sessionMinutes: durationMinutes,
                subjectName: subj?.name || 'Class 10 Study'
              };

              setVirtualPlants(prev => [newPlant, ...prev]);
              setPlantEarnedNotice(`🎉 Focus session completed! A new "${newPlant.name}" (${newPlant.icon}) grew in your Virtual Garden!`);
              setTimeout(() => setPlantEarnedNotice(null), 8000);
            }
          }
        } else {
          setTimeLeftSeconds(remaining);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeftSeconds, timerMode, durationMinutes, selectedSubjectId, selectedChapterId, sessionNotes, virtualPlants.length]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
    soundEngine.stopAmbientSound();
    setAmbientSound('none');
    setActiveCustomTrackId(null);
  };

  const progressPercent = Math.round(((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100);
  const activeChapters = chapters.filter(c => c.subjectId === selectedSubjectId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Plant Earned Celebration Toast */}
      {plantEarnedNotice && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold border border-emerald-500">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-200 animate-bounce" />
            <span>{plantEarnedNotice}</span>
          </div>
          <button
            onClick={() => setPlantEarnedNotice(null)}
            className="text-white/80 hover:text-white text-xs px-2 py-1 bg-emerald-700 rounded-lg cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Clock Box */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-xs relative overflow-hidden">
        
        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 bg-stone-100/80 rounded-2xl border border-stone-200 gap-1">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              timerMode === 'pomodoro'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            25m Focus Study
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              timerMode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              timerMode === 'long_break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            15m Deep Break
          </button>
        </div>

        {/* Circular Clock Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="7"
              className="text-stone-100"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={691}
              strokeDashoffset={691 - (691 * progressPercent) / 100}
              strokeLinecap="round"
              className="text-emerald-600 transition-all duration-1000"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-inner mb-1 animate-pulse">
              {progressPercent >= 100
                ? '🌳'
                : progressPercent >= 75
                ? '🌸'
                : progressPercent >= 50
                ? '🪴'
                : progressPercent >= 25
                ? '🌿'
                : '🌱'}
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-stone-900">
              {formatTime(timeLeftSeconds)}
            </div>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1.5 font-bold flex items-center gap-1">
              <span>{isRunning ? '🌱 Nurturing Plant...' : 'Paused'}</span>
              <span>({progressPercent}%)</span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleToggleRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-xs flex items-center gap-2 transition-transform transform active:scale-98 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-white" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" /> Start Session
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl border border-stone-200 transition-colors cursor-pointer"
              title="Reset Clock"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* 30-Second Victory Celebration Music Banner */}
          {isCompletionPlaying && (
            <div className="w-full mt-2 p-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-2xl text-white shadow-md flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm">
                    Session Complete! Playing 30s Celebration Melody
                  </h4>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Reward music auto-stops in <strong>{completionCountdown}s</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={stopCompletionMusic}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-xl text-xs backdrop-blur-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Stop Sound
              </button>
            </div>
          )}
        </div>

        {/* OPTIMIZED TIMER MUSIC & VOLUME BOOSTER (0% - 200%) */}
        <div className="pt-5 border-t border-stone-100 space-y-4">
          
          {/* Header & Volume Booster Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/90">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-stone-900">
                Timer Music & Focus Audio Stream
              </span>
              {volume > 100 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-300">
                  🔊 Boosted Gain ({volume}%)
                </span>
              )}
            </div>

            {/* Volume Slider & Boost Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleVolumeChange(volume === 0 ? 100 : 0)}
                className="text-stone-500 hover:text-stone-800 cursor-pointer"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <input
                type="range"
                min="0"
                max="200"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-24 sm:w-36 accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                title={`Volume Level: ${volume}% (Supports up to 200% Gain Boost)`}
              />

              <span className="text-xs font-extrabold text-emerald-800 w-10 text-right">
                {volume}%
              </span>

              {/* Quick Volume Preset Buttons */}
              <div className="flex items-center gap-1 ml-1 border-l border-stone-200 pl-2">
                {[50, 100, 150, 200].map(v => (
                  <button
                    key={v}
                    onClick={() => handleVolumeChange(v)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      volume === v ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <button
              onClick={() => toggleAmbientSound('none')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'none'
                  ? 'bg-stone-800 text-white border-stone-900'
                  : 'text-stone-600 border-stone-200 hover:text-stone-900'
              }`}
            >
              <VolumeX className="w-3.5 h-3.5" /> Off
            </button>
            <button
              onClick={() => toggleAmbientSound('lofi_beats')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'lofi_beats'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'text-stone-700 border-stone-200 hover:border-emerald-400'
              }`}
            >
              <Disc className="w-3.5 h-3.5" /> Lofi Beats
            </button>
            <button
              onClick={() => toggleAmbientSound('chill_twilight')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'chill_twilight'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                  : 'text-stone-700 border-stone-200 hover:border-purple-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Twilight Pad
            </button>
            <button
              onClick={() => toggleAmbientSound('rain')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'rain'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'text-stone-700 border-stone-200 hover:border-teal-400'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" /> Rain
            </button>
            <button
              onClick={() => toggleAmbientSound('cozy_cafe')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'cozy_cafe'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'text-stone-700 border-stone-200 hover:border-amber-400'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Cozy Cafe
            </button>
            <button
              onClick={() => toggleAmbientSound('white_noise')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ambientSound === 'white_noise'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'text-stone-700 border-stone-200 hover:border-indigo-400'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" /> White Noise
            </button>
          </div>

          {/* ACTIVE EMBEDDED PLAYER IF ACTIVE CUSTOM TRACK SELECTED */}
          {activeCustomTrackId && (() => {
            const activeTrack = customTracks.find(t => t.id === activeCustomTrackId);
            if (!activeTrack) return null;
            return (
              <div className="pt-3 border-t border-stone-100">
                <EmbeddedAudioPlayer 
                  track={activeTrack} 
                  onClose={stopActiveCustomTrack} 
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                />
              </div>
            );
          })()}

          {/* CUSTOM MUSIC URL STREAMS SECTION */}
          <div className="pt-3 border-t border-stone-100 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-emerald-600" /> Saved Music Links (YouTube, Spotify, SoundCloud & Streams):
              </span>
              <button
                onClick={() => setShowAddCustomModal(true)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>

            {/* Custom URL Tracks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {customTracks.map(track => {
                const isActive = activeCustomTrackId === track.id;
                const parsed = parseAudioUrl(track.url);
                return (
                  <div
                    key={track.id}
                    onClick={() => playCustomTrack(track)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Music className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600 animate-spin' : 'text-stone-400'}`} />
                      <div className="truncate">
                        <div className="truncate font-semibold">{track.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border uppercase ${parsed.badgeBg}`}>
                            {parsed.badgeText}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Active</span>}
                      <button
                        onClick={(e) => handleDeleteCustomTrack(track.id, e)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete custom music track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL TO ADD CUSTOM MUSIC STREAM URL */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <Music className="w-5 h-5 text-emerald-600" /> Add Music URL (YouTube, Spotify, etc.)
              </h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomTrack} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-700 block font-bold mb-1">Track / Station Name:</label>
                <input
                  type="text"
                  required
                  value={newTrackName}
                  onChange={e => setNewTrackName(e.target.value)}
                  placeholder="e.g. My Favorite YouTube Lofi, Study Spotify Playlist..."
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl p-2.5 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-stone-700 block font-bold mb-1">Music URL / Link:</label>
                <input
                  type="url"
                  required
                  value={newTrackUrl}
                  onChange={e => setNewTrackUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://open.spotify.com/playlist/..."
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl p-2.5 font-medium focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
                
                {/* Live URL Type Detector Badge */}
                {newTrackUrl.trim() && (() => {
                  const detected = parseAudioUrl(newTrackUrl);
                  return (
                    <div className="mt-2 p-2 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${detected.badgeBg}`}>
                        ✓ {detected.platformName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {detected.type === 'youtube'
                          ? 'Will load embedded YouTube player'
                          : detected.type === 'spotify'
                          ? 'Will load embedded Spotify player'
                          : detected.type === 'soundcloud'
                          ? 'Will load SoundCloud player'
                          : 'Will play direct audio stream'}
                      </span>
                    </div>
                  );
                })()}

                <span className="text-[10px] text-stone-500 mt-1.5 block">
                  💡 Works with YouTube watch/shorts links, Spotify tracks/playlists/albums, SoundCloud, and MP3 audio streams.
                </span>
              </div>

              {/* Sample Preset Shortcut Buttons */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">Quick Sample Links (Click to test):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTrackName('Lofi Girl Live Stream (YouTube)');
                      setNewTrackUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Tv className="w-3 h-3 text-red-500" /> YouTube Lofi
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewTrackName('Deep Focus Spotify Playlist');
                      setNewTrackUrl('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Music className="w-3 h-3 text-emerald-500" /> Spotify Lofi
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewTrackName('Piano Focus Stream');
                      setNewTrackUrl('https://stream.zeno.fm/7c28w42pbf9uv');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Radio className="w-3 h-3 text-sky-500" /> Direct Radio Stream
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  Save & Play Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tag Subject & Chapter for Study Log */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Tag Study Session to CBSE Subject
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-stone-500 block mb-1 font-medium">Select Subject:</label>
            <select
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value);
                const firstChap = chapters.find(c => c.subjectId === e.target.value);
                if (firstChap) setSelectedChapterId(firstChap.id);
              }}
              className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-stone-500 block mb-1 font-medium">Select Chapter:</label>
            <select
              value={selectedChapterId}
              onChange={e => setSelectedChapterId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            >
              {activeChapters.map(c => (
                <option key={c.id} value={c.id}>Ch {c.chapterNum}: {c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Past Study Session Logs */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" /> Recent Logged Study Sessions ({studySessions.length})
          </h3>
          {studySessions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all logged study sessions?")) {
                  setStudySessions([]);
                }
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Delete all study logs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="space-y-2">
          {studySessions.length === 0 ? (
            <p className="text-xs text-stone-500 py-4 text-center">
              No completed sessions yet today. Start a timer to log your focus time!
            </p>
          ) : (
            studySessions.map(session => {
              const subj = subjects.find(s => s.id === session.subjectId);
              return (
                <div
                  key={session.id}
                  className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between text-xs hover:border-stone-300 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {subj && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${subj.badgeBg}`}>
                          {subj.name}
                        </span>
                      )}
                      <span className="font-bold text-stone-800">{session.chapterTitle}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 flex items-center gap-2">
                      <span>{new Date(session.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      +{session.durationMinutes} mins
                    </span>
                    <button
                      onClick={() => {
                        setStudySessions(prev => prev.filter(s => s.id !== session.id));
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete this study session log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pomodoro Virtual Garden */}
      <VirtualGarden
        virtualPlants={virtualPlants}
        totalFocusMins={studySessions.reduce((acc, s) => acc + s.durationMinutes, 0)}
        currentTimerProgress={progressPercent}
        isTimerRunning={isRunning}
      />

    </div>
  );
};
