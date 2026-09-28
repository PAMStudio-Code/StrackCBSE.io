import React, { useState, useEffect, useRef } from 'react';
import { parseAudioUrl, ParsedAudioInfo } from '../utils/audioUrlParser';
import { 
  X, 
  ExternalLink, 
  Music, 
  Tv, 
  Radio, 
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Sliders,
  Disc,
  Volume1
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EmbeddedAudioPlayerProps {
  track: {
    id: string;
    name: string;
    url: string;
  };
  onClose: () => void;
  volume: number; // 0 to 200
  onVolumeChange: (newVol: number) => void;
}

export const EmbeddedAudioPlayer: React.FC<EmbeddedAudioPlayerProps> = ({
  track,
  onClose,
  volume,
  onVolumeChange
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const parsedInfo: ParsedAudioInfo = parseAudioUrl(track.url);

  // Send volume updates to YouTube iframe & HTML5 audio
  useEffect(() => {
    // 1. YouTube iframe setVolume (accepts 0 - 100)
    if (parsedInfo.type === 'youtube' && iframeRef.current?.contentWindow) {
      const ytVolume = Math.min(100, Math.max(0, Math.round(volume)));
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [ytVolume] }),
          '*'
        );
      } catch (e) {
        console.warn('YouTube volume postMessage error:', e);
      }
    }

    // 2. Direct HTML5 audio element (volume 0.0 to 1.0)
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1.0, Math.max(0, volume / 100));
    }

    // 3. SoundEngine Master Volume (supports up to 200% Gain)
    soundEngine.setVolume(volume / 100);
  }, [volume, parsedInfo.type]);

  // Handle Play/Pause toggling for YouTube / Direct Audio
  const togglePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (parsedInfo.type === 'youtube' && iframeRef.current?.contentWindow) {
      const command = nextState ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    } else if (audioRef.current) {
      if (nextState) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  // On initial mount / track change, trigger initial YouTube volume sync
  const handleIframeLoad = () => {
    if (parsedInfo.type === 'youtube' && iframeRef.current?.contentWindow) {
      const ytVolume = Math.min(100, Math.max(0, Math.round(volume)));
      setTimeout(() => {
        try {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setVolume', args: [ytVolume] }),
            '*'
          );
        } catch (e) {}
      }, 500);
    }
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-3.5 shadow-xl border border-stone-800 space-y-3 transition-all relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Audio Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        
        {/* Left Side: Track Info & Equalizer */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          {/* Animated Album Art / Platform Icon */}
          <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700/80 flex items-center justify-center shrink-0 relative overflow-hidden">
            {isPlaying ? (
              <Disc className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            ) : (
              <Music className="w-5 h-5 text-stone-400" />
            )}
          </div>

          <div className="truncate min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${parsedInfo.badgeBg}`}>
                {parsedInfo.badgeText}
              </span>
              <span className="font-extrabold text-xs text-stone-100 truncate">
                {track.name}
              </span>
            </div>

            {/* Audio Waveform Equalizer Visualizer */}
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-stone-400 truncate">
                {parsedInfo.platformName} • Audio Mode
              </p>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
                  <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: '450ms' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center & Right Controls: Play/Pause, Master Volume Slider, Close */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-stone-800 pt-2 sm:pt-0">
          
          {/* Play/Pause Button for YouTube / Direct Streams */}
          {(parsedInfo.type === 'youtube' || parsedInfo.type === 'direct') && (
            <button
              onClick={togglePlayPause}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1.5 text-xs"
              title={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>
          )}

          {/* Volume Control Bar */}
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 100 : 0)}
              className="text-stone-400 hover:text-emerald-400 cursor-pointer transition-colors"
              title={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume > 100 ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <Volume1 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="200"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 sm:w-28 accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              title={`Audio Volume: ${volume}% (Supports up to 200% Gain)`}
            />

            <span className="text-[11px] font-extrabold text-emerald-400 w-8 text-right font-mono">
              {volume}%
            </span>
          </div>

          {/* External App Link & Stop/Close */}
          <div className="flex items-center gap-1 border-l border-stone-800 pl-2">
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              title="Open link in original app"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Stop & Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* HIDDEN / COMPACT IFRAME & AUDIO ELEMENTS (Audio-Only Execution) */}
      {parsedInfo.type === 'youtube' && parsedInfo.embedUrl && (
        <div className="w-0 h-0 opacity-0 pointer-events-none overflow-hidden absolute">
          <iframe
            ref={iframeRef}
            src={parsedInfo.embedUrl}
            title={track.name}
            onLoad={handleIframeLoad}
            allow="autoplay; encrypted-media"
            className="w-1 h-1"
          />
        </div>
      )}

      {parsedInfo.type === 'spotify' && parsedInfo.embedUrl && (
        <div className="w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 mt-2">
          <iframe
            src={parsedInfo.embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={track.name}
            className="w-full border-0 rounded-xl"
          />
        </div>
      )}

      {parsedInfo.type === 'soundcloud' && parsedInfo.embedUrl && (
        <div className="w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 mt-2">
          <iframe
            width="100%"
            height="120"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={parsedInfo.embedUrl}
            title={track.name}
            className="w-full border-0 rounded-xl"
          />
        </div>
      )}

      {parsedInfo.type === 'apple' && parsedInfo.embedUrl && (
        <div className="w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 mt-2">
          <iframe
            allow="autoplay *; encrypted-media *;"
            frameBorder="0"
            height="150"
            style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            src={parsedInfo.embedUrl}
            title={track.name}
          />
        </div>
      )}

      {parsedInfo.type === 'direct' && parsedInfo.directUrl && (
        <audio
          ref={audioRef}
          src={parsedInfo.directUrl}
          autoPlay
          loop
          className="hidden"
        />
      )}

    </div>
  );
};
