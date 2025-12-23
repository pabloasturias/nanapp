import React, { useState, useEffect, useRef } from 'react';
import { SoundButton } from './components/SoundButton';
import { ManageSoundsModal } from './components/ManageSoundsModal'; // New Import
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { ProductsView } from './components/ProductsView';
import { SleepView } from './components/SleepView';
import { StoryView } from './components/StoryView';
import { SettingsModal } from './components/SettingsModal';
import { ReloadPrompt } from './components/ReloadPrompt';
import { StatsView } from './components/StatsView';
import { ToolsView } from './components/ToolsView';
import { WhyItWorksModal } from './components/WhyItWorksModal';
import { QuickInfoModal } from './components/QuickInfoModal';
import { SupportModal } from './components/SupportModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SOUNDS } from './constants';
import { SoundType } from './types';
import { HelpCircle, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal
import { LanguageProvider, useLanguage } from './services/LanguageContext';
import { useAudioEngine } from './services/hooks/useAudioEngine';
import { useTimer } from './services/hooks/useTimer';
import { useStatistics } from './services/hooks/useStatistics';
import { useSoundPreferences } from './services/hooks/useSoundPreferences'; // New Import

import { SplashScreen } from './components/SplashScreen';

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const [showSplash, setShowSplash] = useState(true);

    // Custom Hooks
    const audio = useAudioEngine(parseFloat(localStorage.getItem('dw_volume') || '0.4'));
    const timer = useTimer(parseInt(localStorage.getItem('dw_duration') || '40', 10));
    const { logSession } = useStatistics();
    const { activeSoundIds, toggleSoundVisibility, reorderSounds } = useSoundPreferences(); // New Hook

    const [activeTab, setActiveTab] = useState<'sounds' | 'sleep' | 'tips' | 'story' | 'stats' | 'tools'>('sounds');
    const [showSettings, setShowSettings] = useState(false);
    const [showManageSounds, setShowManageSounds] = useState(false); // New State
    const [showWhyModal, setShowWhyModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [quickInfoType, setQuickInfoType] = useState<'colic' | 'arsenic' | null>(null);
    const [isPageVisible, setIsPageVisible] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const showNotification = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
    };

    // Keyboard support using hooks
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (audio.isPlaying) handlePause();
                else handlePlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [audio.isPlaying, audio.pause, audio.play]); // Add deps

    // Visibility & Offline
    useEffect(() => {
        const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('online', () => setIsOffline(false));
        window.addEventListener('offline', () => setIsOffline(true));
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Wake Lock
    const requestWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try { wakeLockRef.current = await navigator.wakeLock.request('screen'); } catch (err) { }
        }
    };
    const releaseWakeLock = async () => {
        if (wakeLockRef.current) {
            try { await wakeLockRef.current.release(); wakeLockRef.current = null; } catch (err) { }
        }
    };
    useEffect(() => { if (audio.isPlaying) requestWakeLock(); else releaseWakeLock(); }, [audio.isPlaying]);

    // Media Session
    useEffect(() => {
        if ('mediaSession' in navigator && audio.currentSound) {
            const soundLabel = t(audio.currentSound as any);
            if (audio.isPlaying) {
                navigator.mediaSession.playbackState = 'playing';
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: soundLabel || 'nanapp',
                    artist: 'nanapp',
                    album: t('app_slogan'),
                    artwork: [
                        { src: './icon.svg', sizes: '96x96', type: 'image/svg+xml' },
                        { src: './icon.svg', sizes: '512x512', type: 'image/svg+xml' },
                    ]
                });
                navigator.mediaSession.setActionHandler('play', handlePlay);
                navigator.mediaSession.setActionHandler('pause', handlePause);
                navigator.mediaSession.setActionHandler('stop', () => handleStop(false));
                navigator.mediaSession.setActionHandler('previoustrack', handlePrevSound);
                navigator.mediaSession.setActionHandler('nexttrack', handleNextSound);
                navigator.mediaSession.setActionHandler('seekto', () => { });
            } else if (audio.isPaused) {
                navigator.mediaSession.playbackState = 'paused';
            } else {
                navigator.mediaSession.playbackState = 'none';
            }
        }
    }, [audio.isPlaying, audio.isPaused, audio.currentSound, t]);

    // Statistics Logging
    useEffect(() => {
        let startTime: number | null = null;

        if (audio.isPlaying) {
            startTime = Date.now();
        }

        return () => {
            // This cleanup runs when audio.isPlaying changes (e.g. becomes false)
            // or when component unmounts. 
            // Ideally we want to capture ONLY when it STOPS playing.
            // But hooks are tricky. Let's use a separate effect for strict state changes?
            // Or better: Tracking ref.
        };
    }, [audio.isPlaying]);

    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (audio.isPlaying) {
            startTimeRef.current = Date.now();
        } else {
            // Stopped or Paused
            if (startTimeRef.current && audio.currentSound) {
                const durationSeconds = (Date.now() - startTimeRef.current) / 1000;
                logSession(durationSeconds, audio.currentSound);
                startTimeRef.current = null;
            }
        }
    }, [audio.isPlaying, audio.currentSound]); // logSession is stable


    // Handlers bridging Hooks and UI
    const handleSoundSelect = (soundId: SoundType) => {
        if (audio.currentSound === soundId && audio.isPlaying) {
            handlePause();
        } else {
            audio.play(soundId);
            timer.start(true); // Always restart timer on new sound
        }
    };

    const handleNextSound = () => {
        if (!audio.currentSound) return;
        const currentIndex = SOUNDS.findIndex(s => s.id === audio.currentSound);
        const nextIndex = (currentIndex + 1) % SOUNDS.length;
        handleSoundSelect(SOUNDS[nextIndex].id);
    };

    const handlePrevSound = () => {
        if (!audio.currentSound) return;
        const currentIndex = SOUNDS.findIndex(s => s.id === audio.currentSound);
        const prevIndex = (currentIndex - 1 + SOUNDS.length) % SOUNDS.length;
        handleSoundSelect(SOUNDS[prevIndex].id);
    };

    const handlePlay = () => {
        if (audio.currentSound) {
            audio.play(audio.currentSound);
            timer.start(false); // Resume timer
        } else {
            handleSoundSelect(SOUNDS[0].id);
        }
    };

    const handlePause = () => {
        audio.pause();
        timer.stop();
    };

    const handleStop = (longFade = false) => {
        audio.stop(longFade);
        timer.stop();
        // timer.setRemaining(null); // Wait, timer hook manages reset on active toggle or start
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
    };

    // Timer Integration
    // Check if timer finished
    useEffect(() => {
        if (timer.remaining === null && timer.isActive && !audio.isPlaying && !audio.isPaused) {
            // Timer naturally finished/stopped. Ensure audio stops if it was running?
            // Actually useTimer stops itself when remaining <= 0.
            // We need to trigger audio stop when timer hits 0.
            // Let's watch timer.remaining.
        }
    }, [timer.remaining]);

    // Better approach: useTimer executes a callback? Or we watch state.
    // In `useTimer`, we put logic inside the interval check. But cleaner to have a callback.
    // Since I implemented `useTimer` without callback, let's add an effect here.
    useEffect(() => {
        if (timer.remaining === null && audio.isPlaying && timer.isActive) {
            // Timer finished!
            handleStop(true);
        }
    }, [timer.remaining, audio.isPlaying, timer.isActive]);


    const handleBackgroundClick = () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            if (audio.isPlaying) { handlePause(); showNotification(t('paused')); }
            else { handlePlay(); showNotification(t('playing')); }
        }
        lastTapRef.current = now;
    };

    const lastTapRef = useRef(0);

    const renderContent = () => {
        if (activeTab === 'story') return <StoryView onBack={() => setActiveTab('sounds')} />;
        if (activeTab === 'sleep') return <SleepView />;
        if (activeTab === 'tips') return <ProductsView />;
        if (activeTab === 'stats') return <StatsView onBack={() => setActiveTab('sounds')} />;
        if (activeTab === 'tools') return <ToolsView />;

        return (
            <>
                <div className="shrink-0 flex items-center justify-between px-6 mb-2">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('tab_sounds')}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowManageSounds(true)}
                            className="p-1.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-teal-200 hover:border-teal-200/50 transition-colors"
                        >
                            <SlidersHorizontal size={14} />
                        </button>
                        <button
                            onClick={() => setShowWhyModal(true)}
                            className="p-1.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-orange-200 hover:border-orange-200/50 transition-colors flex items-center gap-1.5 pr-3"
                        >
                            <HelpCircle size={14} />
                            <span className="text-[10px] font-bold">{t('why_works')}</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 mb-1 auto-rows-fr animate-[fade-in_0.3s_ease-out] px-6 pb-2 overflow-y-auto">
                    {activeSoundIds.map(id => {
                        const sound = SOUNDS.find(s => s.id === id);
                        if (!sound) return null;
                        return (
                            <SoundButton
                                key={sound.id}
                                sound={sound}
                                isActive={audio.currentSound === sound.id}
                                onClick={() => handleSoundSelect(sound.id)}
                            />
                        );
                    })}
                    {/* Add placeholder to fill grid if odd number? No, CSS grid handles it. */}
                </div>

                <div className="shrink-0 h-6 flex items-center justify-center mb-1">
                    {audio.isPlaying && (
                        <div className="flex items-center gap-2">
                            {audio.isWarmthActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" title="Warmth On"></span>}
                            <p className="text-orange-100/80 text-xs font-bold uppercase animate-pulse tracking-widest">
                                {t('playing')} · {audio.currentSound ? t(audio.currentSound as any) : ''}
                            </p>
                        </div>
                    )}
                    {!audio.isPlaying && audio.isPaused && (
                        <p className="text-orange-200/50 text-xs font-bold uppercase tracking-widest">{t('paused')}</p>
                    )}
                </div>

                <div className="shrink-0 px-6 pb-2" onClick={(e) => e.stopPropagation()}>
                    <Controls
                        isPlaying={audio.isPlaying}
                        isPaused={audio.isPaused}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onStop={() => handleStop(false)}
                        timerDuration={timer.duration}
                        timerRemaining={timer.remaining}
                        onAdjustTimer={(delta) => { timer.adjust(delta); showNotification(`${t('timer')}: ${Math.max(10, timer.duration + delta)}m`); }}
                        isTimerActive={timer.isActive}
                        onToggleTimerActive={timer.toggleActive}
                        hapticsEnabled={false}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden transition-colors duration-500 bg-slate-950" onClick={handleBackgroundClick}>

            {/* Splash Screen */}
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

            {isPageVisible && <Visualizer isActive={audio.isPlaying} type="calm" />}

            {/* UI Layovers */}
            <ReloadPrompt />
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                isWarmthActive={audio.isWarmthActive} onToggleWarmth={audio.toggleWarmth}
                volume={audio.volume} onVolumeChange={audio.setVolume}
                isMuted={audio.isMuted} onToggleMute={audio.toggleMute}
                fadeDuration={audio.fadeDuration} onFadeChange={audio.changeFade}
                heartbeatLayer={audio.heartbeatLayer} onToggleHeartbeatLayer={audio.toggleHeartbeat}
                timerDuration={timer.duration} onTimerChange={timer.setDuration}
                onOpenLegal={() => { setShowSettings(false); setShowLegalModal(true); }}
                onGoToStory={() => setActiveTab('story')}
            />
            <WhyItWorksModal isOpen={showWhyModal} onClose={() => setShowWhyModal(false)} />
            <QuickInfoModal isOpen={quickInfoType !== null} type={quickInfoType} onClose={() => setQuickInfoType(null)} />
            <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} onGoToProducts={() => setActiveTab('tips')} />
            <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
            <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

            <ManageSoundsModal
                isOpen={showManageSounds}
                onClose={() => setShowManageSounds(false)}
                activeSoundIds={activeSoundIds}
                onToggleSound={toggleSoundVisibility}
                onReorderSounds={reorderSounds}
            />

            <div className="flex-1 flex flex-col w-full max-w-lg mx-auto relative z-10 min-h-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
                <Header
                    onOpenSettings={() => setShowSettings(true)}
                    onOpenSupport={() => setShowSupportModal(true)}
                    onOpenStats={() => setActiveTab('stats')}
                    onGoToStory={() => setActiveTab('story')}
                    isOffline={isOffline}
                />
                {renderContent()}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

import { BabyProvider } from './services/BabyContext';

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <BabyProvider>
                <AppContent />
            </BabyProvider>
        </LanguageProvider>
    );
}

export default App;