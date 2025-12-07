import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AudioEngine } from './services/audioEngine';
import { SoundButton } from './components/SoundButton';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { SettingsModal } from './components/SettingsModal';
import { WhyItWorksModal } from './components/WhyItWorksModal';
import { QuickInfoModal } from './components/QuickInfoModal';
import { SupportModal } from './components/SupportModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { InstallBanner } from './components/InstallBanner';
import { SOUNDS } from './constants';
import { SoundType } from './types';
import { HelpCircle, Info } from 'lucide-react';
import { LanguageProvider, useLanguage } from './services/LanguageContext';

const TipsView = lazy(() => import('./components/TipsView').then(m => ({ default: m.TipsView })));
const SleepView = lazy(() => import('./components/SleepView').then(m => ({ default: m.SleepView })));
const StoryView = lazy(() => import('./components/StoryView').then(m => ({ default: m.StoryView })));

const AppContent: React.FC = () => {
  const { t } = useLanguage();

  const loadSavedVolume = () => parseFloat(localStorage.getItem('dw_volume') || '0.4');
  const loadSavedSound = () => localStorage.getItem('dw_sound') as SoundType | null;
  const loadSavedDuration = () => parseInt(localStorage.getItem('dw_duration') || '40', 10);
  const loadSavedWarmth = () => localStorage.getItem('dw_warmth') === 'true';
  const loadSavedFade = () => parseFloat(localStorage.getItem('dw_fade') || '1.5');
  const loadSavedHeartbeatLayer = () => localStorage.getItem('dw_hb_layer') === 'true';

  const urlParams = new URLSearchParams(window.location.search);
  const rawUrlSound = urlParams.get('sound');
  const rawUrlTab = urlParams.get('tab');

  const validSoundIds = SOUNDS.map(s => s.id);
  const validTabs = ['sounds', 'sleep', 'tips', 'story'];

  const urlSound = rawUrlSound && validSoundIds.includes(rawUrlSound as SoundType) 
    ? (rawUrlSound as SoundType) 
    : null;
  
  const urlTab = rawUrlTab && validTabs.includes(rawUrlTab) 
    ? (rawUrlTab as 'sounds' | 'sleep' | 'tips' | 'story') 
    : null;

  const [currentSound, setCurrentSound] = useState<SoundType | null>(urlSound || loadSavedSound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(loadSavedVolume); 
  const [isMuted, setIsMuted] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'sounds' | 'sleep' | 'tips' | 'story'>(urlTab || 'sounds');
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

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const engineRef = useRef<AudioEngine | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const showNotification = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
  };

  useEffect(() => {
    const checkSharedContent = async () => {
      const shareParams = new URLSearchParams(window.location.search);
      const sharedTitle = shareParams.get('title');
      const sharedText = shareParams.get('text');
      const sharedUrl = shareParams.get('url');
      
      if (sharedTitle || sharedText || sharedUrl) {
        const message = sharedTitle || sharedText || 'Contenido compartido recibido';
        showNotification(`📤 ${message}`);
        window.history.replaceState({}, '', '/');
      }
    };
    
    checkSharedContent();
  }, []);

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

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDeclined = localStorage.getItem('install_declined');
      const hasInstalled = localStorage.getItem('app_installed');
      if (!hasDeclined && !hasInstalled) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      localStorage.setItem('app_installed', 'true');
      showNotification(t('app.installed'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (urlSound && !isPlaying) {
      setTimeout(() => {
        handleSoundSelect(urlSound);
      }, 500);
    }

    return () => {
      engineRef.current?.stopAll(false);
      stopTimer();
      releaseWakeLock();
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => localStorage.setItem('dw_volume', volume.toString()), [volume]);
  useEffect(() => { if(currentSound) localStorage.setItem('dw_sound', currentSound); }, [currentSound]);
  useEffect(() => localStorage.setItem('dw_duration', timerDuration.toString()), [timerDuration]);
  useEffect(() => localStorage.setItem('dw_warmth', isWarmthActive.toString()), [isWarmthActive]);
  useEffect(() => localStorage.setItem('dw_fade', fadeDuration.toString()), [fadeDuration]);
  useEffect(() => localStorage.setItem('dw_hb_layer', heartbeatLayer.toString()), [heartbeatLayer]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('app_installed', 'true');
    } else {
      localStorage.setItem('install_declined', 'true');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('install_declined', 'true');
  };

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
          const soundEmoji = {
              WHITE_NOISE: '〰️',
              RAIN: '🌸',
              BROWN_NOISE: '🟤',
              OCEAN: '🌊',
              HAIR_DRYER: '💨',
              SHUSH: '🤫',
              WAVES: '🌊',
              LULLABY: '🎵'
          }[currentSound] || '🎵';
          
          if (isPlaying) {
              navigator.mediaSession.playbackState = 'playing';
              navigator.mediaSession.metadata = new MediaMetadata({
                  title: `${soundEmoji} ${soundLabel}`,
                  artist: 'nanapp',
                  album: t('app_slogan'),
                  artwork: [
                      { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
                      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
                      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
                  ]
              });
              navigator.mediaSession.setActionHandler('play', handlePlay);
              navigator.mediaSession.setActionHandler('pause', handlePause);
              navigator.mediaSession.setActionHandler('stop', () => handleStop(false));
              navigator.mediaSession.setActionHandler('previoustrack', handlePrevSound);
              navigator.mediaSession.setActionHandler('nexttrack', handleNextSound);
              navigator.mediaSession.setActionHandler('seekbackward', null);
              navigator.mediaSession.setActionHandler('seekforward', null);
              navigator.mediaSession.setActionHandler('seekto', null);
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

  const LoadingFallback = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    </div>
  );

  const renderContent = () => {
      if (activeTab !== 'sounds') {
        const LazyComponent = activeTab === 'story' ? StoryView : activeTab === 'sleep' ? SleepView : TipsView;
        const props = activeTab === 'story' ? { onBack: () => setActiveTab('sounds') } : {};
        
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LazyComponent {...props} />
          </Suspense>
        );
      }
      
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
      
      {showInstallBanner && (
        <InstallBanner
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstall}
          message={t('install.banner_message')}
          installText={t('install.button')}
        />
      )}
      
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
      <SupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)} 
        onGoToProducts={() => setActiveTab('tips')}
        onCoffeeClick={() => showNotification(t('coffee_thanks'))}
      />
      <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
      <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

      <div className="flex-1 flex flex-col w-full max-w-lg mx-auto relative z-10 min-h-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <Header 
                onOpenSettings={() => setShowSettings(true)}
                onOpenSupport={() => setShowSupportModal(true)}
                onGoToStory={() => setActiveTab('story')}
                isOffline={isOffline}
                coffeeTooltip={t('coffee_tooltip')}
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