import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '../audioEngine';
import { SoundType } from '../../types';
import { SOUNDS } from '../../constants';

export const useAudioEngine = (initialVolume: number = 0.5) => {
  const engineRef = useRef<AudioEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isWarmthActive, setIsWarmthActive] = useState(false);
  const [fadeDuration, setFadeDuration] = useState(1.5);
  const [heartbeatLayer, setHeartbeatLayer] = useState(false);

  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.setVolume(volume);
    return () => {
      engineRef.current?.stopAll(false);
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
        engineRef.current.setVolume(volume);
    }
  }, [volume]);

  // Persist settings
  useEffect(() => { localStorage.setItem('dw_volume', volume.toString()); }, [volume]);
  useEffect(() => { if (currentSound) localStorage.setItem('dw_sound', currentSound); }, [currentSound]);
  useEffect(() => { localStorage.setItem('dw_warmth', isWarmthActive.toString()); }, [isWarmthActive]);
  useEffect(() => { localStorage.setItem('dw_fade', fadeDuration.toString()); }, [fadeDuration]);
  useEffect(() => { localStorage.setItem('dw_hb_layer', heartbeatLayer.toString()); }, [heartbeatLayer]);

  const play = useCallback((sound: SoundType) => {
    if (!engineRef.current) return;
    
    // If same sound and was paused, resume logic (handled by engine state usually, but here strict)
    if (currentSound === sound && isPaused) {
        setIsPaused(false);
    } 
    
    setCurrentSound(sound);
    setIsPlaying(true);
    setIsPaused(false);
    engineRef.current.play(sound);
  }, [currentSound, isPaused]);

  const pause = useCallback(() => {
    engineRef.current?.stopAll(true);
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const stop = useCallback((longFade = false) => {
    engineRef.current?.stopAll(true, longFade);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSound(null);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
        const newVal = !prev;
        engineRef.current?.toggleMute(newVal);
        return newVal;
    });
  }, []);

  const toggleWarmth = useCallback(() => {
    setIsWarmthActive(prev => {
        const newVal = !prev;
        engineRef.current?.setWarmth(newVal);
        return newVal;
    });
  }, []);

  const changeFade = useCallback((val: number) => {
    setFadeDuration(val);
    engineRef.current?.setFadeTime(val);
  }, []);
  
  const toggleHeartbeat = useCallback(() => {
      setHeartbeatLayer(prev => {
          const newVal = !prev;
          engineRef.current?.toggleHeartbeatLayer(newVal);
          return newVal;
      });
  }, []);

  // Initialize from storage
  useEffect(() => {
     const savedWarmth = localStorage.getItem('dw_warmth') === 'true';
     const savedFade = parseFloat(localStorage.getItem('dw_fade') || '1.5');
     const savedHb = localStorage.getItem('dw_hb_layer') === 'true';
     
     setIsWarmthActive(savedWarmth);
     setFadeDuration(savedFade);
     setHeartbeatLayer(savedHb);
     
     // Apply valid startup settings
     engineRef.current?.setWarmth(savedWarmth);
     engineRef.current?.setFadeTime(savedFade);
     engineRef.current?.toggleHeartbeatLayer(savedHb);
  }, []);

  return {
    engine: engineRef.current,
    currentSound,
    isPlaying,
    isPaused,
    volume,
    isMuted,
    isWarmthActive,
    fadeDuration,
    heartbeatLayer,
    play,
    pause,
    stop,
    setVolume,
    toggleMute,
    toggleWarmth,
    changeFade,
    toggleHeartbeat
  };
};
