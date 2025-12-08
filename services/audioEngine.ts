import { SoundType } from '../types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null; 
  private activeNodes: AudioNode[] = [];
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

  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private hiddenAudio: HTMLAudioElement | null = null;

  constructor() {
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
      
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.warmthFilter.connect(this.mediaStreamDest);
      
      this.hiddenAudio = document.createElement('audio');
      this.hiddenAudio.srcObject = this.mediaStreamDest.stream;
      this.hiddenAudio.loop = true;
      this.hiddenAudio.muted = false;
      this.hiddenAudio.volume = 0;
      this.hiddenAudio.play().catch(() => {});
      
      this.masterGain.gain.value = 0;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.error("Audio resume failed", e));
    }
  }

  public resumeContext() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.hiddenAudio?.paused) {
      this.hiddenAudio.play().catch(() => {});
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
             } catch(e) {}
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
        } catch (e) {}
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
      case SoundType.WAVES: // Replaced BREATHING
        this.playWaves();
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
      const white = Math.random() * 2 - 1;
      output[i] = (white + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)) / 3;
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
    const bufferSize = this.ctx.sampleRate * 4;
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
    filter.frequency.value = 3000; 
    filter.Q.value = 0.1;
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
    filter.frequency.value = 2500; 
    const gain = this.ctx.createGain();
    gain.gain.value = 1.0; 
    const fadeGain = this.createSourceGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, gain, fadeGain);
  }

  private playBrownNoise() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createBrownNoiseBuffer(); 
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const gain = this.ctx.createGain();
    gain.gain.value = 1.8; 
    const fadeGain = this.createSourceGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, gain, fadeGain);
  }

  private playHairDryer() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const airNoise = this.ctx.createBufferSource();
    airNoise.buffer = this.createPinkNoiseBuffer();
    airNoise.loop = true;
    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.value = 800; 
    airFilter.Q.value = 0.5; 
    const airGain = this.ctx.createGain();
    airGain.gain.value = 1.2; 
    airNoise.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(fadeGain);
    const motorFreq = 380; 
    const motor1 = this.ctx.createOscillator();
    motor1.type = 'sawtooth'; 
    motor1.frequency.value = motorFreq;
    const motor2 = this.ctx.createOscillator();
    motor2.type = 'sawtooth';
    motor2.frequency.value = motorFreq + 6; 
    const motorFilter = this.ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.value = 2000; 
    const motorGain = this.ctx.createGain();
    motorGain.gain.value = 0.08; 
    motor1.connect(motorFilter);
    motor2.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(fadeGain);
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.value = 55; 
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = 0.3;
    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    airNoise.start();
    motor1.start();
    motor2.start();
    rumbleOsc.start();
    this.activeNodes.push(airNoise, airFilter, airGain, motor1, motor2, motorFilter, motorGain, rumbleOsc, rumbleGain, fadeGain);
  }

  private playOcean() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(); 
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;
    const waveOsc = this.ctx.createOscillator();
    waveOsc.type = 'sine';
    waveOsc.frequency.value = 0.12; 
    const waveGain = this.ctx.createGain();
    const oscGain = this.ctx.createGain();
    oscGain.gain.value = 0.4; 
    waveOsc.connect(oscGain);
    oscGain.connect(waveGain.gain);
    waveGain.gain.value = 0.2; 
    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    waveOsc.start();
    this.activeNodes.push(noise, filter, waveOsc, waveGain, oscGain, fadeGain);
  }

  private playShush() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer();
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1;
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.25; 
    const shushGain = this.ctx.createGain();
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.8; 
    shushGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(shushGain.gain);
    noise.connect(filter);
    filter.connect(shushGain);
    shushGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, shushGain, lfo, lfoGain, fadeGain);
  }

  private playWaves() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = this.createBrownNoiseBuffer();
    brownNoise.loop = true;
    const brownFilter = this.ctx.createBiquadFilter();
    brownFilter.type = 'lowpass';
    brownFilter.frequency.value = 300;
    const brownGain = this.ctx.createGain();
    brownGain.gain.value = 0.6;
    brownNoise.connect(brownFilter);
    brownFilter.connect(brownGain);
    brownGain.connect(fadeGain);
    const pinkNoise = this.ctx.createBufferSource();
    pinkNoise.buffer = this.createPinkNoiseBuffer();
    pinkNoise.loop = true;
    const pinkFilter = this.ctx.createBiquadFilter();
    pinkFilter.type = 'lowpass';
    pinkFilter.frequency.value = 100; 
    const pinkGain = this.ctx.createGain();
    pinkGain.gain.value = 0; 
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; 
    const filterModGain = this.ctx.createGain();
    filterModGain.gain.value = 600; 
    lfo.connect(filterModGain);
    filterModGain.connect(pinkFilter.frequency);
    const volModGain = this.ctx.createGain();
    volModGain.gain.value = 1.0;
    lfo.connect(volModGain);
    volModGain.connect(pinkGain.gain);
    pinkNoise.connect(pinkFilter);
    pinkFilter.connect(pinkGain);
    pinkGain.connect(fadeGain);
    fadeGain.connect(this.masterGain);
    brownNoise.start();
    pinkNoise.start();
    lfo.start();
    this.activeNodes.push(brownNoise, brownFilter, brownGain, pinkNoise, pinkFilter, pinkGain, lfo, filterModGain, volModGain, fadeGain);
  }

  private playLullaby() {
    if (!this.ctx || !this.masterGain) return;
    const fadeGain = this.createSourceGain();
    const melody = [
      { f: 261.63, d: 2 }, { f: 329.63, d: 2 }, { f: 392.00, d: 2 }, 
      { f: 329.63, d: 1 }, { f: 392.00, d: 1 }, { f: 440.00, d: 4 }, 
      { f: 392.00, d: 2 }, { f: 329.63, d: 2 }, { f: 293.66, d: 2 }, { f: 261.63, d: 4 } 
    ];
    let noteIndex = 0;
    let nextNoteTime = this.ctx.currentTime;
    const playNote = () => {
        if (!this.ctx || !this.masterGain) return;
        if (this.ctx.currentTime < nextNoteTime - 0.1) return;
        const note = melody[noteIndex % melody.length];
        const time = nextNoteTime;
        const duration = note.d * 0.6; 
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, time);
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(note.f * 2, time);
        const env = this.ctx.createGain();
        env.gain.setValueAtTime(0, time);
        env.gain.linearRampToValueAtTime(0.2, time + 0.05); 
        env.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.5); 
        const env2 = this.ctx.createGain();
        env2.gain.setValueAtTime(0, time);
        env2.gain.linearRampToValueAtTime(0.05, time + 0.05);
        env2.gain.exponentialRampToValueAtTime(0.001, time + duration);
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.3;
        const delayGain = this.ctx.createGain();
        delayGain.gain.value = 0.3;
        osc.connect(env);
        osc2.connect(env2);
        env.connect(fadeGain);
        env2.connect(fadeGain);
        env.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(fadeGain);
        osc.start(time);
        osc.stop(time + duration + 2);
        osc2.start(time);
        osc2.stop(time + duration + 2);
        nextNoteTime += duration;
        noteIndex++;
    };
    fadeGain.connect(this.masterGain);
    const interval = window.setInterval(playNote, 100); 
    this.intervals.push(interval);
    this.activeNodes.push(fadeGain);
  }
}