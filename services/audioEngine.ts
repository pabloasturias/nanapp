import { SoundType } from '../types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private activeNodes: AudioNode[] = [];
  // Separate tracking for heartbeat layer
  private heartbeatNodes: AudioNode[] = [];
  private heartbeatInterval: number | null = null;
  private isHeartbeatLayerActive: boolean = false;

  private intervals: number[] = [];
  private isMuted: boolean = false;
  private isWarmthActive: boolean = false;
  private currentVolume: number = 0.5;
  private currentSound: SoundType | null = null;
  private fadeTime: number = 1.5;
  private longFadeTime: number = 10;

  constructor() {
    // Lazy initialization handled in init()
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();

      this.warmthFilter = this.ctx.createBiquadFilter();
      this.warmthFilter.type = 'lowpass';
      this.warmthFilter.frequency.value = this.isWarmthActive ? 600 : 20000;
      this.warmthFilter.Q.value = 0.5;

      this.masterGain.connect(this.warmthFilter);
      this.warmthFilter.connect(this.ctx.destination);

      // Initialize silent
      this.masterGain.gain.value = 0;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.error("Audio resume failed", e));
    }
  }

  public setWarmth(active: boolean) {
    this.isWarmthActive = active;
    if (this.warmthFilter && this.ctx) {
      const now = this.ctx.currentTime;
      const targetFreq = active ? 600 : 22000;
      this.warmthFilter.frequency.cancelScheduledValues(now);
      this.warmthFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.5);
    }
  }

  public setFadeTime(seconds: number) {
    this.fadeTime = Math.max(0.1, seconds);
  }

  // --- HEARTBEAT LAYER CONTROL (IMPROVED) ---
  public toggleHeartbeatLayer(active: boolean) {
    this.isHeartbeatLayerActive = active;
    if (this.currentSound) {
      if (active) {
        this.startHeartbeatLayer();
      } else {
        this.stopHeartbeatLayer();
      }
    }
  }

  private startHeartbeatLayer() {
    if (!this.ctx || !this.masterGain || this.heartbeatInterval) return;

    const triggerBeat = (time: number, isFirst: boolean) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      // Sweep frequency downwards for a "thud" sound
      osc.frequency.setValueAtTime(isFirst ? 70 : 60, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      // BOOSTED VOLUME: Was 0.3, now 0.6 to cut through noise
      gain.gain.linearRampToValueAtTime(isFirst ? 0.6 : 0.4, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150; // Opened slightly for more definition

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.3);
    };

    const scheduleBeats = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      triggerBeat(now, true);
      triggerBeat(now + 0.35, false);
    };

    scheduleBeats();
    this.heartbeatInterval = window.setInterval(scheduleBeats, 1200);
  }

  private stopHeartbeatLayer() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public stopAll(fadeOut: boolean = true, isLongFade: boolean = false) {
    if (!this.ctx || !this.masterGain) return;

    const duration = isLongFade ? this.longFadeTime : this.fadeTime;
    const stopTime = this.ctx.currentTime + (fadeOut ? duration : 0.1);

    const nodesToStop = [...this.activeNodes];
    const intervalsToClear = [...this.intervals];
    this.activeNodes = [];
    this.intervals = [];

    // Stop Heartbeat Layer
    this.stopHeartbeatLayer();

    if (fadeOut && nodesToStop.length > 0) {
      nodesToStop.forEach(node => {
        if (node instanceof GainNode) {
          try {
            node.gain.cancelScheduledValues(this.ctx!.currentTime);
            node.gain.setValueAtTime(node.gain.value, this.ctx!.currentTime);
            node.gain.exponentialRampToValueAtTime(0.001, stopTime);
          } catch (e) { }
        }
      });
    }

    setTimeout(() => {
      nodesToStop.forEach(node => {
        try {
          if (node instanceof AudioScheduledSourceNode) {
            node.stop();
          }
          node.disconnect();
        } catch (e) { }
      });
      intervalsToClear.forEach(id => clearInterval(id));
    }, fadeOut ? (duration * 1000) : 100);

    if (!fadeOut) {
      this.currentSound = null;
    }
  }

  public setVolume(val: number) {
    this.currentVolume = val;
    this.updateVolume();
  }

  private updateVolume() {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      const volume = this.isMuted ? 0 : Math.max(0.0001, Math.pow(this.currentVolume, 2.5));

      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(volume, now, 0.1);
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    this.updateVolume();
  }

  public play(sound: SoundType) {
    this.init();

    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    // Logic Fix: If we have active nodes, and it's the SAME sound, ignore.
    // BUT if activeNodes is empty (because we paused), we must play!
    if (this.currentSound === sound && this.activeNodes.length > 0) return;

    // Crossfade: Stop previous sound with fade
    if (this.currentSound && this.activeNodes.length > 0) {
      this.stopAll(true, false);
    }

    this.currentSound = sound;

    if (!this.ctx || !this.masterGain) return;

    this.updateVolume();

    if (this.isHeartbeatLayerActive) {
      this.startHeartbeatLayer();
    }

    switch (sound) {
      case SoundType.WHITE_NOISE:
        this.playWhiteNoise();
        break;
      case SoundType.RAIN:
        this.playRain();
        break;
      case SoundType.BROWN_NOISE:
        this.playBrownNoise();
        break;
      case SoundType.OCEAN:
        this.playOcean();
        break;
      case SoundType.HAIR_DRYER:
        this.playHairDryer();
        break;
      case SoundType.LULLABY:
        this.playLullaby();
        break;
      case SoundType.SHUSH:
        this.playShush();
        break;
      case SoundType.WAVES:
        this.playWaves();
        break;
      // Improved Synthesis for New Sounds
      case SoundType.TRAIN:
        this.playTrain();
        break;
      case SoundType.CAT_PURR:
        this.playCatPurr();
        break;
      case SoundType.FIREPLACE:
        this.playFireplace();
        break;
      case SoundType.FOREST:
        this.playForest();
        break;
      case SoundType.NIGHT_CRICKETS:
        this.playCrickets();
        break;
      case SoundType.STREAM:
        this.playStream();
        break;
      case SoundType.FAN:
        this.playFan();
        break;
      case SoundType.HEARTBEAT:
        this.playHeartbeatSound(); // Renamed to avoid confusion with layer
        break;
    }
  }

  // --- Buffers ---

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("No Context");
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Simple white noise
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private createPinkNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("No Context");
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168981;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private createBrownNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("No Context");
    // Longer buffer for brown noise to avoid loops
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    return buffer;
  }

  private createSourceGain(): GainNode {
    if (!this.ctx) throw new Error("No Context");
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + this.fadeTime);
    return gain;
  }

  // --- Play Methods ---

  private playWhiteNoise() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000; // Softer white noise
    const fadeGain = this.createSourceGain();
    noise.connect(filter);
    filter.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer();
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const fadeGain = this.createSourceGain();
    noise.connect(filter);
    filter.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playBrownNoise() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createBrownNoiseBuffer();
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200; // Deep rumble
    const fadeGain = this.createSourceGain();
    noise.connect(filter);
    filter.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playOcean() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer();
    noise.loop = true;

    // Wave modulation
    const modOsc = this.ctx.createOscillator();
    modOsc.type = 'sine';
    modOsc.frequency.value = 0.15; // Slow waves

    const modGain = this.ctx.createGain();
    modGain.gain.value = 0.5; // Depth of modulation

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    // Connect modulation to gain
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.5;

    modOsc.connect(modGain);
    modGain.connect(gainNode.gain);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(fadeGain);
    fadeGain.connect(this.masterGain);

    noise.start();
    modOsc.start();
    this.activeNodes.push(noise, filter, modOsc, modGain, gainNode, fadeGain);
  }

  private playHairDryer() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    // Air flow
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer();
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    // Motor whine
    const osc1 = this.ctx.createOscillator(); // 50hz hum
    osc1.type = 'sawtooth';
    osc1.frequency.value = 50;
    const osc2 = this.ctx.createOscillator(); // High whine
    osc2.type = 'triangle';
    osc2.frequency.value = 350;

    const motorGain = this.ctx.createGain();
    motorGain.gain.value = 0.1;

    noise.connect(filter);
    filter.connect(fadeGain);

    osc1.connect(motorGain);
    osc2.connect(motorGain);
    motorGain.connect(fadeGain);

    fadeGain.connect(this.masterGain);

    noise.start();
    osc1.start();
    osc2.start();
    this.activeNodes.push(noise, filter, osc1, osc2, motorGain, fadeGain);
  }

  private playShush() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer();
    noise.loop = true;

    // Formant filter for "SH" sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 3;

    // Rhythmic envelope
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3; // Breath rate

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.5;

    const shushGain = this.ctx.createGain();
    shushGain.gain.value = 0.5;

    lfo.connect(lfoGain);
    lfoGain.connect(shushGain.gain);

    noise.connect(filter);
    filter.connect(shushGain);
    shushGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, lfo, lfoGain, shushGain, fadeGain);
  }

  private playWaves() {
    // Similar to Ocean but rougher
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createBrownNoiseBuffer();
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;

    const gainMod = this.ctx.createGain();
    gainMod.gain.value = 0.8;

    const mainGain = this.ctx.createGain();
    mainGain.gain.value = 0.5;

    lfo.connect(gainMod);
    gainMod.connect(mainGain.gain);

    noise.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, lfo, gainMod, mainGain, fadeGain);
  }

  private playLullaby() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    // Simple sine wave arpeggio
    const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; // C E G C G E
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.ctx || !this.masterGain) return;
      const note = melody[noteIndex % melody.length];
      const osc = this.ctx.createOscillator();
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      osc.type = 'sine';

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(fadeGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 2);

      noteIndex++;
    };

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(playNextNote, 2000); // New note every 2s
    playNextNote();

    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  // --- NEW SOUNDS SYNTHESIS ---

  private playTrain() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    // Rhythmic chugging: White noise bursts
    const createChug = (time: number, accent: boolean) => {
      if (!this.ctx) return;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createPinkNoiseBuffer(); // Pink more distinct
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(accent ? 0.8 : 0.4, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(fadeGain);

      noise.start(time);
      noise.stop(time + 0.3);
    };

    const startChugLoop = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Simple Quarter note rhythm: Chug Chug Chug Chug
      createChug(now, true);
      createChug(now + 0.25, false);
      createChug(now + 0.5, false);
      createChug(now + 0.75, false);
    };

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(() => startChugLoop(), 1000);
    startChugLoop();

    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playCatPurr() {
    // Modulated low frequency saw or square
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 25; // Low purr freq

    const measureGain = this.ctx.createGain();
    measureGain.gain.value = 0.5;

    // Amplitude Modulation (Breathing)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.4; // Purr cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.3; // Depth

    lfo.connect(lfoGain);
    lfoGain.connect(measureGain.gain);

    // Lowpass to make it muffled
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;

    osc.connect(filter);
    filter.connect(measureGain);
    measureGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo, lfoGain, measureGain, filter, fadeGain);
  }

  private playFireplace() {
    // Crackling noise. Random bursts of high frequency noise over a low rumble.
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    // 1. Rumble (Low Brown)
    const rumble = this.ctx.createBufferSource();
    rumble.buffer = this.createBrownNoiseBuffer();
    rumble.loop = true;
    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 100;
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = 0.8;
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(fadeGain);
    rumble.start();

    // 2. Crackles - Random click generator
    // We can simulate this with Short bursts of noise
    const createCrackle = () => {
      if (!this.ctx) return;
      if (Math.random() > 0.3) return; // Don't crackle always

      const crack = this.ctx.createBufferSource();
      crack.buffer = this.createNoiseBuffer(); // White

      const cf = this.ctx.createBiquadFilter();
      cf.type = 'highpass';
      cf.frequency.value = 5000;

      const cg = this.ctx.createGain();
      cg.gain.setValueAtTime(0.5, this.ctx.currentTime);
      cg.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      crack.connect(cf);
      cf.connect(cg);
      cg.connect(fadeGain);
      crack.start();
      crack.stop(this.ctx.currentTime + 0.1);
    }

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(createCrackle, 100);

    this.intervals.push(interval);
    this.activeNodes.push(rumble, rumbleFilter, rumbleGain, fadeGain);
  }

  private playForest() {
    // Wind (filtered pink) + Random birds (sine chirps)
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    // Wind
    const wind = this.ctx.createBufferSource();
    wind.buffer = this.createPinkNoiseBuffer();
    wind.loop = true;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.3;

    // Wind modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(fadeGain);
    wind.start();
    lfo.start();

    // Birds
    const chirp = () => {
      if (!this.ctx || Math.random() > 0.4) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      const startFreq = 2000 + Math.random() * 1000;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(startFreq - 500, this.ctx.currentTime + 0.1); // Chirp down

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.02);
      g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);

      osc.connect(g);
      g.connect(fadeGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(chirp, 1500);

    this.intervals.push(interval);
    this.activeNodes.push(wind, windFilter, windGain, lfo, lfoGain, fadeGain);
  }

  private playCrickets() {
    // High pitched pulsed sine waves
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    const pulse = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 4500;

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      // Triple chirp: chir-chir-chirp
      const now = this.ctx.currentTime;

      g.gain.linearRampToValueAtTime(0.1, now + 0.05);
      g.gain.linearRampToValueAtTime(0, now + 0.1);

      g.gain.linearRampToValueAtTime(0.1, now + 0.15);
      g.gain.linearRampToValueAtTime(0, now + 0.2);

      g.gain.linearRampToValueAtTime(0.1, now + 0.25);
      g.gain.linearRampToValueAtTime(0, now + 0.3);

      osc.connect(g);
      g.connect(fadeGain);
      osc.start();
      osc.stop(now + 0.4);
    }

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(pulse, 1000 + Math.random() * 1000);
    pulse();

    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playStream() {
    // Filtered White/Pink noise, higher freq than river
    if (!this.ctx || !this.masterGain) return;
    this.playRain(); // Rain buffer is actually good for stream if we filter it higher
    // But let's customize
  }

  private playFan() {
    this.playHairDryer(); // Similar enough
  }

  private playHeartbeatSound() {
    // Reuse the heartbeat layer logic or just play it
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();

    const beat = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(g);
      g.connect(fadeGain);
      osc.start(now);
      osc.stop(now + 0.2);
    };

    const doubleBeat = () => {
      beat();
      setTimeout(beat, 250); // Lub-Dub
    }

    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(doubleBeat, 1200);
    doubleBeat();

    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }
}