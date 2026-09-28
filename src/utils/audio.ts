// Web Audio API Synthesizer for Focus Ambience, Lofi Beats, Custom Audio Streams & 30s Timer Completion Melody

export type AmbientSoundType = 'none' | 'rain' | 'lofi_beats' | 'chill_twilight' | 'cozy_cafe' | 'white_noise' | 'custom_url';

export interface CustomTrack {
  id: string;
  name: string;
  url: string;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private completionNodes: (AudioNode | number)[] = [];
  private gainNode: GainNode | null = null;
  private masterVolume: number = 0.5; // 0.0 to 2.0 (0% to 200% volume booster)
  private activeType: AmbientSoundType = 'none';
  private completionTimer: number | null = null;

  // Custom Audio Element & Web Audio Source
  private customAudioElement: HTMLAudioElement | null = null;
  private customMediaSource: MediaElementAudioSourceNode | null = null;
  private customGainNode: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Volume range 0.0 to 2.0 (200% gain boost for low volume tracks)
  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(2.0, vol));
    
    // Update ambient gain node
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.masterVolume * 0.35, this.ctx.currentTime);
    }

    // Update custom audio gain node
    if (this.customGainNode && this.ctx) {
      this.customGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    } else if (this.customAudioElement) {
      // Fallback direct HTML5 volume clamp
      this.customAudioElement.volume = Math.min(1.0, this.masterVolume);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public getActiveSound(): AmbientSoundType {
    return this.activeType;
  }

  // Play gentle completion bell
  public playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, this.ctx.currentTime + 0.1); // C6

      gain.gain.setValueAtTime(0.3 * Math.min(1.0, this.masterVolume), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Play a 30-second celebratory victory melody after timer completes
  public play30sCompletionSound(onComplete?: () => void) {
    try {
      this.stopCompletionSound();
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 30; // 30 seconds
      const masterGain = this.ctx.createGain();
      
      masterGain.gain.setValueAtTime(0.35 * Math.min(1.5, this.masterVolume), now);
      masterGain.gain.setValueAtTime(0.35 * Math.min(1.5, this.masterVolume), now + duration - 3);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(this.ctx.destination);

      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99];
      const melodySequence = [
        0, 2, 4, 5, 4, 2, 0, 4,
        2, 4, 6, 7, 6, 4, 2, 5,
        0, 3, 5, 6, 5, 3, 2, 4,
        5, 6, 7, 8, 7, 5, 4, 0
      ];

      let noteStep = 0;
      const playNextMelodyNote = () => {
        if (!this.ctx) return;
        const noteIndex = melodySequence[noteStep % melodySequence.length];
        const freq = scale[noteIndex % scale.length];
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        noteGain.gain.setValueAtTime(0.2, t);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 1.2);

        if (noteStep % 4 === 0) {
          const rootFreq = scale[noteStep % 3] / 2;
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(rootFreq, t);

          bassGain.gain.setValueAtTime(0.15, t);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);
          bassOsc.start(t);
          bassOsc.stop(t + 2.5);
        }

        noteStep++;
      };

      playNextMelodyNote();
      const melodyInterval = window.setInterval(playNextMelodyNote, 750);
      this.completionNodes.push(melodyInterval as any);

      this.completionTimer = window.setTimeout(() => {
        this.stopCompletionSound();
        if (onComplete) onComplete();
      }, duration * 1000);

    } catch (e) {
      console.warn("Completion sound error:", e);
    }
  }

  public stopCompletionSound() {
    if (this.completionTimer) {
      clearTimeout(this.completionTimer);
      this.completionTimer = null;
    }
    this.completionNodes.forEach(item => {
      if (typeof item === 'number') {
        clearInterval(item);
      } else if (item && typeof (item as any).stop === 'function') {
        try { (item as any).stop(); } catch (e) {}
      }
    });
    this.completionNodes = [];
  }

  // Play Custom Audio Stream / URL
  public playCustomAudioUrl(url: string) {
    try {
      this.stopAmbientSound();
      this.initCtx();

      this.activeType = 'custom_url';
      this.customAudioElement = new Audio(url);
      this.customAudioElement.crossOrigin = 'anonymous';
      this.customAudioElement.loop = true;

      if (this.ctx) {
        try {
          this.customMediaSource = this.ctx.createMediaElementSource(this.customAudioElement);
          this.customGainNode = this.ctx.createGain();
          this.customGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
          
          this.customMediaSource.connect(this.customGainNode);
          this.customGainNode.connect(this.ctx.destination);
        } catch (err) {
          // Fallback if crossOrigin policy blocks Web Audio routing
          this.customAudioElement.volume = Math.min(1.0, this.masterVolume);
        }
      } else {
        this.customAudioElement.volume = Math.min(1.0, this.masterVolume);
      }

      this.customAudioElement.play().catch(err => {
        console.warn("Custom audio stream play error:", err);
      });
    } catch (e) {
      console.warn("Error playing custom audio URL:", e);
    }
  }

  // Start Built-in Ambient Synthesized Sounds
  public startAmbientSound(type: AmbientSoundType = 'rain') {
    try {
      this.stopAmbientSound();
      if (type === 'none') return;

      this.initCtx();
      if (!this.ctx) return;

      this.activeType = type;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.masterVolume * 0.35, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (type === 'rain') {
        this.createRainSound();
      } else if (type === 'white_noise') {
        this.createWhiteNoiseSound();
      } else if (type === 'lofi_beats') {
        this.createLofiBeats();
      } else if (type === 'chill_twilight') {
        this.createChillTwilight();
      } else if (type === 'cozy_cafe') {
        this.createCozyCafeSound();
      }
    } catch (e) {
      console.warn("Ambient sound error:", e);
    }
  }

  private createRainSound() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const rainNoise = this.ctx.createBufferSource();
    rainNoise.buffer = buffer;
    rainNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;

    rainNoise.connect(filter);
    filter.connect(this.gainNode);
    rainNoise.start();
    this.activeNodes.push(rainNoise, filter);

    const playRainDrop = () => {
      if (!this.ctx || this.activeType !== 'rain' || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      const dropFreq = 1200 + Math.random() * 1800;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(dropFreq, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

      dropGain.gain.setValueAtTime(0.015, t);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(dropGain);
      dropGain.connect(this.gainNode);
      osc.start(t);
      osc.stop(t + 0.03);
    };

    const dropInterval = window.setInterval(playRainDrop, 180);
    this.activeNodes.push(dropInterval as any);
  }

  private createWhiteNoiseSound() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    this.activeNodes.push(noise, filter);
  }

  private createLofiBeats() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.0012;
      output[i] = isPop ? (Math.random() * 2 - 1) * 0.35 : (Math.random() * 2 - 1) * 0.01;
    }
    const crackle = this.ctx.createBufferSource();
    crackle.buffer = buffer;
    crackle.loop = true;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'lowpass';
    crackleFilter.frequency.value = 1600;

    crackle.connect(crackleFilter);
    crackleFilter.connect(this.gainNode);
    crackle.start();
    this.activeNodes.push(crackle, crackleFilter);

    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    let beatStep = 0;

    const playLofiRhythm = () => {
      if (!this.ctx || this.activeType !== 'lofi_beats' || !this.gainNode) return;

      const t = this.ctx.currentTime;
      const beatInBar = beatStep % 8;
      const barIndex = Math.floor((beatStep % 32) / 8);
      const currentChord = chordProgressions[barIndex];

      if (beatInBar === 0 || beatInBar === 5) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(120, t);
        kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

        kickGain.gain.setValueAtTime(0.35, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        kickOsc.connect(kickGain);
        kickGain.connect(this.gainNode);
        kickOsc.start(t);
        kickOsc.stop(t + 0.15);
      }

      if (beatInBar === 2 || beatInBar === 6) {
        const snBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const snData = snBuffer.getChannelData(0);
        for (let i = 0; i < snData.length; i++) snData[i] = (Math.random() * 2 - 1);

        const snNoise = this.ctx.createBufferSource();
        snNoise.buffer = snBuffer;

        const snFilter = this.ctx.createBiquadFilter();
        snFilter.type = 'highpass';
        snFilter.frequency.value = 1200;

        const snGain = this.ctx.createGain();
        snGain.gain.setValueAtTime(0.12, t);
        snGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        snNoise.connect(snFilter);
        snFilter.connect(snGain);
        snGain.connect(this.gainNode);
        snNoise.start(t);

        const rimOsc = this.ctx.createOscillator();
        const rimGain = this.ctx.createGain();
        rimOsc.type = 'triangle';
        rimOsc.frequency.setValueAtTime(220, t);
        rimOsc.frequency.exponentialRampToValueAtTime(110, t + 0.05);

        rimGain.gain.setValueAtTime(0.15, t);
        rimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        rimOsc.connect(rimGain);
        rimGain.connect(this.gainNode);
        rimOsc.start(t);
        rimOsc.stop(t + 0.05);
      }

      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      const hatFilter = this.ctx.createBiquadFilter();

      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(8000, t);

      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 7000;

      const hatVol = (beatInBar % 2 === 0) ? 0.03 : 0.015;
      hatGain.gain.setValueAtTime(hatVol, t);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      hatOsc.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.gainNode);
      hatOsc.start(t);
      hatOsc.stop(t + 0.03);

      if (beatInBar === 0 || beatInBar === 3) {
        currentChord.forEach(freq => {
          if (!this.ctx || !this.gainNode) return;
          const chordOsc = this.ctx.createOscillator();
          const chordGain = this.ctx.createGain();
          const chordFilter = this.ctx.createBiquadFilter();

          chordOsc.type = 'triangle';
          chordOsc.frequency.setValueAtTime(freq, t);

          chordFilter.type = 'lowpass';
          chordFilter.frequency.setValueAtTime(650, t);

          chordGain.gain.setValueAtTime(0.001, t);
          chordGain.gain.linearRampToValueAtTime(0.06, t + 0.08);
          chordGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

          chordOsc.connect(chordFilter);
          chordFilter.connect(chordGain);
          chordGain.connect(this.gainNode);

          chordOsc.start(t);
          chordOsc.stop(t + 1.2);
        });

        const bassFreq = currentChord[0] / 2;
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, t);

        bassGain.gain.setValueAtTime(0.1, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);
        bassOsc.start(t);
        bassOsc.stop(t + 1.1);
      }

      beatStep++;
    };

    playLofiRhythm();
    const lofiBeatInterval = window.setInterval(playLofiRhythm, 320);
    this.activeNodes.push(lofiBeatInterval as any);
  }

  private createChillTwilight() {
    if (!this.ctx || !this.gainNode) return;

    const padFreqs = [130.81, 164.81, 196.00, 246.94, 293.66, 329.63];
    const now = this.ctx.currentTime;

    padFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380 + idx * 40, now);

      gain.gain.setValueAtTime(0.095, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      osc.start();
      this.activeNodes.push(osc, gain, filter);
    });

    const chimeScale = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    const playStarChime = () => {
      if (!this.ctx || this.activeType !== 'chill_twilight' || !this.gainNode) return;
      const freq = chimeScale[Math.floor(Math.random() * chimeScale.length)];
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(t);
      osc.stop(t + 2.2);
    };

    const chimeInterval = window.setInterval(playStarChime, 1400);
    this.activeNodes.push(chimeInterval as any);
  }

  private createCozyCafeSound() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.015 * white)) / 1.015;
      lastOut = output[i];
    }

    const murmur = this.ctx.createBufferSource();
    murmur.buffer = buffer;
    murmur.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 0.8;

    murmur.connect(filter);
    filter.connect(this.gainNode);
    murmur.start();
    this.activeNodes.push(murmur, filter);

    const playCupClink = () => {
      if (!this.ctx || this.activeType !== 'cozy_cafe' || !this.gainNode) return;
      const t = this.ctx.currentTime;
      const freq = 2400 + Math.random() * 800;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(t);
      osc.stop(t + 0.18);
    };

    const clinkInterval = window.setInterval(playCupClink, 3200);
    this.activeNodes.push(clinkInterval as any);

    const guitarChords = [
      [196.00, 246.94, 293.66, 370.00], // Gmaj7
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ];
    let gIdx = 0;

    const playGuitarStrum = () => {
      if (!this.ctx || this.activeType !== 'cozy_cafe' || !this.gainNode) return;
      const t = this.ctx.currentTime;
      const chord = guitarChords[gIdx % guitarChords.length];

      chord.forEach((freq, stringIdx) => {
        if (!this.ctx || !this.gainNode) return;
        const strumDelay = stringIdx * 0.04;
        const osc = this.ctx.createOscillator();
        const gGain = this.ctx.createGain();
        const gFilter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + strumDelay);

        gFilter.type = 'lowpass';
        gFilter.frequency.setValueAtTime(1400, t + strumDelay);

        gGain.gain.setValueAtTime(0.045, t + strumDelay);
        gGain.gain.exponentialRampToValueAtTime(0.0001, t + strumDelay + 1.8);

        osc.connect(gFilter);
        gFilter.connect(gGain);
        gGain.connect(this.gainNode);

        osc.start(t + strumDelay);
        osc.stop(t + strumDelay + 1.8);
      });

      gIdx++;
    };

    playGuitarStrum();
    const guitarInterval = window.setInterval(playGuitarStrum, 4200);
    this.activeNodes.push(guitarInterval as any);
  }

  public stopAmbientSound() {
    this.activeType = 'none';

    // Stop custom HTML5 audio
    if (this.customAudioElement) {
      try {
        this.customAudioElement.pause();
        this.customAudioElement.src = '';
      } catch (e) {}
      this.customAudioElement = null;
    }
    if (this.customMediaSource) {
      try { this.customMediaSource.disconnect(); } catch (e) {}
      this.customMediaSource = null;
    }
    if (this.customGainNode) {
      try { this.customGainNode.disconnect(); } catch (e) {}
      this.customGainNode = null;
    }

    this.activeNodes.forEach(item => {
      if (typeof item === 'number') {
        clearInterval(item);
      } else if (item && typeof (item as any).stop === 'function') {
        try { (item as any).stop(); } catch (e) {}
      } else if (item && typeof (item as any).disconnect === 'function') {
        try { (item as any).disconnect(); } catch (e) {}
      }
    });
    this.activeNodes = [];
    if (this.gainNode) {
      try { this.gainNode.disconnect(); } catch (e) {}
      this.gainNode = null;
    }
  }
}

export const soundEngine = new SoundEngine();
