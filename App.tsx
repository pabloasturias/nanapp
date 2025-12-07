import React, { useState, useEffect, useRef } from 'react';
import { AudioEngine } from './services/audioEngine';
import { SoundButton } from './components/SoundButton';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { TipsView } from './components/TipsView';
import { SleepView } from './components/SleepView';
import { StoryView } from './components/StoryView';
import { SettingsModal } from './components/SettingsModal';
import { WhyItWorksModal } from './components/WhyItWorksModal';
import { QuickInfoModal } from './components/QuickInfoModal';
import { SupportModal } from './components/SupportModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SOUNDS } from './constants';
import { SoundType } from './types';
import { HelpCircle, Info } from 'lucide-react';
import { LanguageProvider, useLanguage } from './services/LanguageContext';

const AppContent: React.FC = () => {
  const { t } = useLanguage();

  const loadSavedVolume = () => parseFloat(localStorage.getItem('dw_volume') || '0.4');
  const loadSavedSound = () => localStorage.getItem('dw_sound') as SoundType | null;
  const loadSavedDuration = () => parseInt(localStorage.getItem('dw_duration') || '40', 10);
  const loadSavedWarmth = () => localStorage.getItem('dw_warmth') === 'true';
  const loadSavedFade = () => parseFloat(localStorage.getItem('dw_fade') || '1.5');
  const loadSavedHeartbeatLayer = () => localStorage.getItem('dw_hb_layer') === 'true';

  const [currentSound, setCurrentSound] = useState<SoundType | null>(loadSavedSound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(loadSavedVolume); 
  const [isMuted, setIsMuted] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'sounds' | 'sleep' | 'tips' | 'story'>('sounds');
  const [showSettings, setShowSettings] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [quickInfoType, setQuickInfoType] = useState<'colic' | 'arsenic' | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [isWarmthActive, setIsWarmthActive] = useState(loadSavedWarmth);
  const [fadeDuration, setFadeDuration] = useState(loadSavedFade);
  const [heartbeatLayer, setHeartbeatLayer] = useState(loadSavedHeartbeatLayer);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [timerDuration, setTimerDuration] = useState(loadSavedDuration); 
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const engineRef = useRef<AudioEngine | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const showNotification = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
  };

  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.setVolume(volume);
    engineRef.current.setWarmth(isWarmthActive);
    engineRef.current.setFadeTime(fadeDuration);
    engineRef.current.toggleHeartbeatLayer(heartbeatLayer);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isPlaying) handlePause();
            else handlePlay();
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));

    return () => {
      engineRef.current?.stopAll(false);
      stopTimer();
      releaseWakeLock();
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => localStorage.setItem('dw_volume', volume.toString()), [volume]);
  useEffect(() => { if(currentSound) localStorage.setItem('dw_sound', currentSound); }, [currentSound]);
  useEffect(() => localStorage.setItem('dw_duration', timerDuration.toString()), [timerDuration]);
  useEffect(() => localStorage.setItem('dw_warmth', isWarmthActive.toString()), [isWarmthActive]);
  useEffect(() => localStorage.setItem('dw_fade', fadeDuration.toString()), [fadeDuration]);
  useEffect(() => localStorage.setItem('dw_hb_layer', heartbeatLayer.toString()), [heartbeatLayer]);

  const handleToggleWarmth = () => { 
      const newState = !isWarmthActive;
      setIsWarmthActive(newState); 
      engineRef.current?.setWarmth(newState);
  };
  const handleFadeChange = (val: number) => {
      setFadeDuration(val);
      engineRef.current?.setFadeTime(val);
  };
  const handleToggleHeartbeatLayer = () => {
      const newState = !heartbeatLayer;
      setHeartbeatLayer(newState);
      engineRef.current?.toggleHeartbeatLayer(newState);
  };

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
        try { wakeLockRef.current = await navigator.wakeLock.request('screen'); } catch (err) {}
    }
  };
  const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
          try { await wakeLockRef.current.release(); wakeLockRef.current = null; } catch(err) {}
      }
  };
  useEffect(() => { if (isPlaying) requestWakeLock(); else releaseWakeLock(); }, [isPlaying]);

  useEffect(() => {
      if ('mediaSession' in navigator && currentSound) {
          const soundLabel = t(currentSound as any); 
          if (isPlaying) {
              navigator.mediaSession.playbackState = 'playing';
              navigator.mediaSession.metadata = new MediaMetadata({
                  title: soundLabel || 'nanapp',
                  artist: 'nanapp',
                  album: t('app_slogan'),
                  artwork: [
                      { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
                      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
                  ]
              });
              navigator.mediaSession.setActionHandler('play', handlePlay);
              navigator.mediaSession.setActionHandler('pause', handlePause);
              navigator.mediaSession.setActionHandler('stop', () => handleStop(false));
              navigator.mediaSession.setActionHandler('previoustrack', handlePrevSound);
              navigator.mediaSession.setActionHandler('nexttrack', handleNextSound);
              navigator.mediaSession.setActionHandler('seekto', () => {}); 
          } else if (isPaused) {
              navigator.mediaSession.playbackState = 'paused';
          } else {
              navigator.mediaSession.playbackState = 'none';
          }
      }
  }, [isPlaying, isPaused, currentSound, t]); 

  const handleSoundSelect = (soundId: SoundType) => {
    if (currentSound === soundId && isPlaying) {
      handlePause();
    } else {
      setCurrentSound(soundId);
      setIsPaused(false);
      engineRef.current?.play(soundId);
      setIsPlaying(true);
      setTimerRemaining(null); 
      startTimer(true);
    }
  };

  const handleNextSound = () => {
      if (!currentSound) return;
      const currentIndex = SOUNDS.findIndex(s => s.id === currentSound);
      const nextIndex = (currentIndex + 1) % SOUNDS.length;
      handleSoundSelect(SOUNDS[nextIndex].id);
  };

  const handlePrevSound = () => {
      if (!currentSound) return;
      const currentIndex = SOUNDS.findIndex(s => s.id === currentSound);
      const prevIndex = (currentIndex - 1 + SOUNDS.length) % SOUNDS.length;
      handleSoundSelect(SOUNDS[prevIndex].id);
  };

  const handlePlay = () => {
    if (currentSound) {
        engineRef.current?.play(currentSound);
        setIsPlaying(true);
        setIsPaused(false);
        // CRITICAL FIX: Resume timer (false = no force reset)
        startTimer(false); 
    } else {
        handleSoundSelect(SOUNDS[0].id);
    }
  };

  const handlePause = () => {
     engineRef.current?.stopAll(true); 
     setIsPlaying(false);
     setIsPaused(true);
     stopTimer();
     // State 'timerRemaining' is preserved
  };

  const handleStop = (longFade = false) => {
      const shouldFade = longFade;
      engineRef.current?.stopAll(shouldFade, longFade);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSound(null);
      stopTimer();
      setTimerRemaining(null);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (isMuted) setIsMuted(false); 
    engineRef.current?.setVolume(val);
  };

  const handleToggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    engineRef.current?.toggleMute(newMuteState);
  };

  // Timer Logic Fixed
  const startTimer = (forceReset: boolean = false) => {
      stopTimer(); 
      if (!isTimerActive) return;

      let initialSeconds;
      
      // If forceReset is true, OR we don't have a valid remaining time (>0), start fresh.
      if (forceReset || timerRemaining === null || timerRemaining <= 0) {
          initialSeconds = timerDuration * 60;
      } else {
          // Resume from where we left off
          initialSeconds = timerRemaining;
      }

      setTimerRemaining(initialSeconds);

      timerIntervalRef.current = window.setInterval(() => {
          setTimerRemaining(prev => {
              if (prev === null || prev <= 1) {
                  stopTimer();
                  handleStop(true);
                  return null;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const stopTimer = () => {
      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
  };

  const handleAdjustTimer = (delta: number) => {
      const newDuration = Math.max(10, timerDuration + delta); 
      setTimerDuration(newDuration);
      
      if (isPlaying && timerRemaining !== null) {
          setTimerRemaining(Math.max(10, timerRemaining + (delta * 60)));
      } else if (timerRemaining !== null) {
           setTimerRemaining(Math.max(10, timerRemaining + (delta * 60)));
      }
      showNotification(`${t('timer')}: ${newDuration}m`);
  };

  const handleSetTimer = (minutes: number) => {
      setTimerDuration(minutes);
      if (!isPlaying && !isPaused) setTimerRemaining(null);
  };

  const handleToggleTimerActive = () => {
      const newState = !isTimerActive;
      setIsTimerActive(newState);
      if (!newState) {
          stopTimer();
          setTimerRemaining(null);
      } else if (isPlaying) {
          startTimer(true);
      }
  };

  const handleBackgroundClick = () => {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
          if (isPlaying) { handlePause(); showNotification(t('paused')); }
          else { handlePlay(); showNotification(t('playing')); }
      }
      lastTapRef.current = now;
  };
  
  const lastTapRef = useRef(0);

  const renderContent = () => {
      if (activeTab === 'story') return <StoryView onBack={() => setActiveTab('sounds')} />;
      if (activeTab === 'sleep') return <SleepView />;
      if (activeTab === 'tips') return <TipsView />;
      
      return (
        <>
            <div className="shrink-0 flex items-center justify-between px-6 mb-2">
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('tab_sounds')}</h2>
                 <button 
                    onClick={() => setShowWhyModal(true)}
                    className="p-1.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-orange-200 hover:border-orange-200/50 transition-colors flex items-center gap-1.5 pr-3"
                 >
                    <HelpCircle size={14} />
                    <span className="text-[10px] font-bold">{t('why_works')}</span>
                 </button>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 mb-1 auto-rows-fr animate-[fade-in_0.3s_ease-out] px-6">
                {SOUNDS.map(sound => (
                    <SoundButton
                    key={sound.id}
                    sound={sound}
                    isActive={currentSound === sound.id}
                    onClick={() => handleSoundSelect(sound.id)}
                    />
                ))}
            </div>

            <div className="shrink-0 h-6 flex items-center justify-center mb-1">
                {isPlaying && (
                    <div className="flex items-center gap-2">
                        {isWarmthActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" title="Warmth On"></span>}
                        <p className="text-orange-100/80 text-xs font-bold uppercase animate-pulse tracking-widest">
                            {t('playing')} · {currentSound ? t(currentSound as any) : ''}
                        </p>
                    </div>
                )}
                {!isPlaying && isPaused && (
                    <p className="text-orange-200/50 text-xs font-bold uppercase tracking-widest">{t('paused')}</p>
                )}
            </div>

            <div className="shrink-0 px-6 pb-2" onClick={(e) => e.stopPropagation()}>
                <Controls 
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStop={() => handleStop(false)}
                    timerDuration={timerDuration}
                    timerRemaining={timerRemaining}
                    onAdjustTimer={handleAdjustTimer}
                    isTimerActive={isTimerActive}
                    onToggleTimerActive={handleToggleTimerActive}
                    hapticsEnabled={false}
                />
            </div>
        </>
      );
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden transition-colors duration-500 bg-slate-950" onClick={handleBackgroundClick}>
      
      {isPageVisible && <Visualizer isActive={isPlaying} type="calm" />}
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isWarmthActive={isWarmthActive} onToggleWarmth={handleToggleWarmth}
        volume={volume} onVolumeChange={handleVolumeChange}
        isMuted={isMuted} onToggleMute={handleToggleMute}
        fadeDuration={fadeDuration} onFadeChange={handleFadeChange}
        heartbeatLayer={heartbeatLayer} onToggleHeartbeatLayer={handleToggleHeartbeatLayer}
        timerDuration={timerDuration} onTimerChange={handleSetTimer}
        onOpenLegal={() => { setShowSettings(false); setShowLegalModal(true); }}
        onOpenAbout={() => { setShowSettings(false); setActiveTab('story'); }}
      />
      <WhyItWorksModal isOpen={showWhyModal} onClose={() => setShowWhyModal(false)} />
      <QuickInfoModal isOpen={quickInfoType !== null} type={quickInfoType} onClose={() => setQuickInfoType(null)} />
      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} onGoToProducts={() => setActiveTab('tips')} />
      <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
      <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

      <div className="flex-1 flex flex-col w-full max-w-lg mx-auto relative z-10 min-h-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <Header 
                onOpenSettings={() => setShowSettings(true)}
                onOpenSupport={() => setShowSupportModal(true)}
                onGoToStory={() => setActiveTab('story')}
                isOffline={isOffline}
            />
            {renderContent()}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;