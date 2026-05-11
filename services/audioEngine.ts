import { SoundType } from '../types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private activeNodes: AudioNode[] = [];
  private heartbeatInterval: number | null = null;
  private isHeartbeatLayerActive: boolean = false;
  private intervals: number[] = [];
  private isMuted: boolean = false;
  private isWarmthActive: boolean = false;
  private currentVolume: number = 0.5;
  private currentSound: SoundType | null = null;
  private fadeTime: number = 1.5;

  constructor() {}

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
      const targetFreq = active ? 600 : 20000;
      this.warmthFilter.frequency.cancelScheduledValues(now);
      this.warmthFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 1.0);
    }
  }

  public setFadeTime(seconds: number) {
    this.fadeTime = Math.max(0.1, seconds);
  }

  public toggleHeartbeatLayer(active: boolean) {
    this.isHeartbeatLayerActive = active;
    if (active) {
      if (!this.heartbeatInterval) {
        this.heartbeatInterval = window.setInterval(() => {
          if (this.ctx && this.masterGain && this.currentSound) {
            const now = this.ctx.currentTime;
            const beat = (t: number, strong: boolean) => {
              const osc = this.ctx!.createOscillator();
              osc.frequency.setValueAtTime(60, t);
              osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
              const g = this.ctx!.createGain();
              g.gain.setValueAtTime(0, t);
              g.gain.linearRampToValueAtTime(strong ? 0.3 : 0.15, t + 0.02);
              g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
              osc.connect(g); g.connect(this.masterGain!);
              osc.start(t); osc.stop(t + 0.2);
            };
            beat(now, true); beat(now + 0.3, false);
          }
        }, 1200);
      }
    } else {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    }
  }

  public stopAll(fadeOut = true, longFade = false) {
    const duration = longFade ? 10 : this.fadeTime;
    const now = this.ctx?.currentTime || 0;

    if (fadeOut && this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    }

    const nodesToClear = [...this.activeNodes];
    const intervalsToClear = [...this.intervals];
    this.activeNodes = [];
    this.intervals = [];

    if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
    }

    setTimeout(() => {
      nodesToClear.forEach(node => {
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
    if (this.currentSound === sound && this.activeNodes.length > 0) return;
    if (this.currentSound && this.activeNodes.length > 0) {
      this.stopAll(true, false);
    }

    this.currentSound = sound;
    if (!this.ctx || !this.masterGain) return;
    this.updateVolume();

    switch (sound) {
      case SoundType.WHITE_NOISE: this.playWhiteNoise(); break;
      case SoundType.RAIN: this.playRain(); break;
      case SoundType.BROWN_NOISE: this.playBrownNoise(); break;
      case SoundType.OCEAN: this.playOcean(); break;
      case SoundType.HAIR_DRYER: this.playAppliance('hair_dryer'); break;
      case SoundType.FAN: this.playAppliance('fan'); break;
      case SoundType.SHUSH: this.playShush(); break;
      case SoundType.WAVES: this.playPinkNoise(); break;
      case SoundType.TRAIN: this.playTrain(); break;
      case SoundType.CAT_PURR: this.playCatPurr(); break;
      case SoundType.FIREPLACE: this.playFireplace(); break;
      case SoundType.FOREST: this.playForest(); break;
      case SoundType.NIGHT_CRICKETS: this.playCrickets(); break;
      case SoundType.STREAM: this.playStream(); break;
      case SoundType.LULLABY: this.playLullaby(); break;
      case SoundType.HEARTBEAT: this.playHeartbeatSound(); break;
    }
  }

  // --- Buffer Generators ---

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    if (!this.ctx) throw new Error("No Context");
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 8; // 8 seconds to minimize repeat artifacts
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    } else if (type === 'pink') {
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
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
    } else {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    return buffer;
  }

  private createSourceGain(): GainNode {
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, this.ctx!.currentTime + this.fadeTime);
    return gain;
  }

  // --- Sound Implementations ---

  private playWhiteNoise() {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink'); // Pink is more pleasant than white
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    const fadeGain = this.createSourceGain();
    noise.connect(filter); filter.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playPinkNoise() {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');
    noise.loop = true;
    const fadeGain = this.createSourceGain();
    noise.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    this.activeNodes.push(noise, fadeGain);
  }

  private playBrownNoise() {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('brown');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    const fadeGain = this.createSourceGain();
    noise.connect(filter); filter.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playRain() {
    const fadeGain = this.createSourceGain();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1000;
    noise.connect(filter); filter.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);

    const interval = window.setInterval(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.frequency.setValueAtTime(800 + Math.random() * 1000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(g); g.connect(fadeGain);
        osc.start(); osc.stop(this.ctx.currentTime + 0.1);
    }, 200);
    this.intervals.push(interval);
  }

  private playOcean() {
    const fadeGain = this.createSourceGain();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 800;
    const lfo = this.ctx!.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.value = 400;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
    noise.connect(filter); filter.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start(); lfo.start();
    this.activeNodes.push(noise, filter, lfo, lfoGain, fadeGain);
  }

  private playAppliance(type: 'hair_dryer' | 'fan') {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('brown');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = type === 'hair_dryer' ? 300 : 150;
    filter.Q.value = 0.5;
    const osc = this.ctx!.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = type === 'hair_dryer' ? 120 : 60;
    const oscGain = this.ctx!.createGain();
    oscGain.gain.value = 0.2;
    const fadeGain = this.createSourceGain();
    noise.connect(filter); filter.connect(fadeGain);
    osc.connect(oscGain); oscGain.connect(fadeGain);
    fadeGain.connect(this.masterGain!);
    noise.start(); osc.start();
    this.activeNodes.push(noise, filter, osc, oscGain, fadeGain);
  }

  private playShush() {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 2;
    const env = this.ctx!.createGain();
    const fadeGain = this.createSourceGain();
    noise.connect(filter); filter.connect(env); env.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    const interval = window.setInterval(() => {
        const t = this.ctx!.currentTime;
        env.gain.cancelScheduledValues(t);
        env.gain.setTargetAtTime(0.8, t, 0.1);
        env.gain.setTargetAtTime(0, t + 0.8, 0.4);
    }, 2500);
    this.intervals.push(interval);
    this.activeNodes.push(noise, filter, env, fadeGain);
  }

  private playCatPurr() {
    const fadeGain = this.createSourceGain();
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('brown');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 100;
    const am = this.ctx!.createOscillator();
    am.frequency.value = 25;
    const amGain = this.ctx!.createGain();
    amGain.gain.value = 0.5;
    const mainGain = this.ctx!.createGain();
    am.connect(amGain); amGain.connect(mainGain.gain);
    noise.connect(filter); filter.connect(mainGain); mainGain.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start(); am.start();
    this.activeNodes.push(noise, filter, am, amGain, mainGain, fadeGain);
  }

  private playFireplace() {
    const fadeGain = this.createSourceGain();
    const rumble = this.ctx!.createBufferSource();
    rumble.buffer = this.createNoiseBuffer('brown');
    rumble.loop = true;
    const rFilter = this.ctx!.createBiquadFilter();
    rFilter.type = 'lowpass'; rFilter.frequency.value = 80;
    rumble.connect(rFilter); rFilter.connect(fadeGain);
    rumble.start();
    const interval = window.setInterval(() => {
        if (Math.random() > 0.3) return;
        const osc = this.ctx!.createOscillator();
        osc.frequency.setValueAtTime(2000 + Math.random() * 3000, this.ctx!.currentTime);
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, this.ctx!.currentTime);
        g.gain.linearRampToValueAtTime(0.1, this.ctx!.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.02);
        osc.connect(g); g.connect(fadeGain);
        osc.start(); osc.stop(this.ctx!.currentTime + 0.05);
    }, 150);
    fadeGain.connect(this.masterGain!);
    this.intervals.push(interval);
    this.activeNodes.push(rumble, rFilter, fadeGain);
  }

  private playForest() {
    this.playPinkNoise();
    const fadeGain = this.createSourceGain();
    fadeGain.connect(this.masterGain!);
    const bird = () => {
        const t = this.ctx!.currentTime;
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3000 + Math.random() * 2000, t);
        osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(g); g.connect(fadeGain);
        osc.start(t); osc.stop(t + 0.15);
    };
    const interval = window.setInterval(() => { if(Math.random() > 0.7) bird(); }, 2000);
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playCrickets() {
    const fadeGain = this.createSourceGain();
    fadeGain.connect(this.masterGain!);
    const chirp = () => {
        const t = this.ctx!.currentTime;
        for (let i = 0; i < 3; i++) {
            const start = t + i * 0.05;
            const osc = this.ctx!.createOscillator();
            osc.frequency.value = 4500;
            const g = this.ctx!.createGain();
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.05, start + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.04);
            osc.connect(g); g.connect(fadeGain);
            osc.start(start); osc.stop(start + 0.05);
        }
    };
    const interval = window.setInterval(() => { if(Math.random() > 0.5) chirp(); }, 1500);
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playStream() {
    const noise = this.ctx!.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');
    noise.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1500;
    const fadeGain = this.createSourceGain();
    noise.connect(filter); filter.connect(fadeGain); fadeGain.connect(this.masterGain!);
    noise.start();
    this.activeNodes.push(noise, filter, fadeGain);
  }

  private playTrain() {
    const fadeGain = this.createSourceGain();
    fadeGain.connect(this.masterGain!);
    const chug = (t: number, accent: boolean) => {
        const noise = this.ctx!.createBufferSource();
        noise.buffer = this.createNoiseBuffer('brown');
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 200;
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(accent ? 0.4 : 0.2, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        noise.connect(filter); filter.connect(g); g.connect(fadeGain);
        noise.start(t); noise.stop(t + 0.3);
    };
    const interval = window.setInterval(() => {
        const now = this.ctx!.currentTime;
        chug(now, true); chug(now + 0.5, false);
    }, 1000);
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playLullaby() {
    const fadeGain = this.createSourceGain();
    fadeGain.connect(this.masterGain!);
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    let idx = 0;
    const playNote = () => {
        const t = this.ctx!.currentTime;
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = notes[idx % notes.length];
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        osc.connect(g); g.connect(fadeGain);
        osc.start(t); osc.stop(t + 2);
        idx++;
    };
    const interval = window.setInterval(playNote, 2000);
    playNote();
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }

  private playHeartbeatSound() {
    const fadeGain = this.createSourceGain();
    fadeGain.connect(this.masterGain!);
    const beat = (t: number, strong: boolean) => {
        const osc = this.ctx!.createOscillator();
        osc.frequency.setValueAtTime(60, t);
        osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(strong ? 0.6 : 0.3, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g); g.connect(fadeGain);
        osc.start(t); osc.stop(t + 0.2);
    };
    const interval = window.setInterval(() => {
        const now = this.ctx!.currentTime;
        beat(now, true); beat(now + 0.3, false);
    }, 1200);
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }
}