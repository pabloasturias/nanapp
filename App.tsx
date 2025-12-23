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
import { HelpCircle, SlidersHorizontal, ShieldAlert } from 'lucide-react'; // Added ShieldAlert
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
    const { activeSoundIds, toggleSoundVisibility, reorderSounds } = useSoundPreferences();

    // Navigation State
    const [activeTab, setActiveTab] = useState<'sounds' | 'sleep' | 'tips' | 'story' | 'stats' | 'tools'>(() => {
        return window.history.state?.tab || 'sounds';
    });

    // Modal States
    const [showSettings, setShowSettings] = useState(false);
    const [showManageSounds, setShowManageSounds] = useState(false);
    const [showWhyModal, setShowWhyModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [quickInfoType, setQuickInfoType] = useState<'colic' | 'arsenic' | null>(null);

    const [isPageVisible, setIsPageVisible] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // --- history / Navigation Logic ---

    // Sync State from History ( PopState )
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const state = event.state || {}; // default to empty if null

            // Sync Tab
            if (state.tab) setActiveTab(state.tab);
            else setActiveTab('sounds'); // Default fall back

            // Sync Modals
            setShowSettings(state.modal === 'settings');
            setShowManageSounds(state.modal === 'manage');
            setShowWhyModal(state.modal === 'why');
            setShowSupportModal(state.modal === 'support');
            setShowLegalModal(state.modal === 'legal');

            // Quick Info Special Case
            if (state.modal === 'info_colic') setQuickInfoType('colic');
            else if (state.modal === 'info_arsenic') setQuickInfoType('arsenic');
            else setQuickInfoType(null);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Navigation Helpers
    const navigateToTab = (tab: typeof activeTab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        // Clear modals when switching tabs? Ideally yes.
        // But passing 'modal: undefined' in pushState implicitly clears them in history.
        // We must also clear local state to match "immediate" UI update.
        closeAllModalsLocal(); // Helper to clear local booleans
        window.history.pushState({ tab, modal: undefined }, '');
    };

    const openModal = (modalName: string) => {
        // Update local state
        if (modalName === 'settings') setShowSettings(true);
        if (modalName === 'manage') setShowManageSounds(true);
        if (modalName === 'why') setShowWhyModal(true);
        if (modalName === 'support') setShowSupportModal(true);
        if (modalName === 'legal') setShowLegalModal(true);
        if (modalName === 'info_colic') setQuickInfoType('colic');
        if (modalName === 'info_arsenic') setQuickInfoType('arsenic');

        // Push State
        window.history.pushState({ tab: activeTab, modal: modalName }, '');
    };

    const closeModal = () => {
        // Expectation: The modal was opened via pushState, so 'back' closes it.
        window.history.back();
    };

    const closeAllModalsLocal = () => {
        setShowSettings(false);
        setShowManageSounds(false);
        setShowWhyModal(false);
        setShowSupportModal(false);
        setShowLegalModal(false);
        setQuickInfoType(null);
    };

    // ----------------------------------

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
    }, [audio.isPlaying, audio.pause, audio.play]);

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
                        { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                        { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png' },
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
        return () => { };
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
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
    };

    // Timer Integration
    useEffect(() => {
        if (timer.remaining === null && audio.isPlaying && timer.isActive) {
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
        if (activeTab === 'story') return <StoryView onBack={closeModal} />; // Using closeModal as back action if pushed?
        // Wait, StoryView is a TAB, not a Modal.
        // If I went to Story tab via 'Settings' -> 'GoToStory', I pushed { tab: 'story' }.
        // So 'back' should pop that state and return to previous tab (e.g. Sounds).
        // Correct.
        if (activeTab === 'sleep') return <SleepView />;
        if (activeTab === 'tips') return <ProductsView />;
        if (activeTab === 'stats') return <StatsView onBack={() => navigateToTab('sounds')} />;
        // StatsView back button might want to go explicitly to sounds? or just back?
        // navigateToTab('sounds') pushes a new entry 'Sounds'.
        // If I want 'Back', I should use history.back().
        // Let's use history.back() for consistency if we want "Back" behavior.
        // But the UI says "Back" (implied to Home).
        // Let's stick navigateToTab('sounds') for explicit navigation, or closeModal (back) for history.
        // navigateToTab('sounds') is safer for "Home" buttons.

        if (activeTab === 'tools') return <ToolsView />;

        return (
            <>
                <div className="shrink-0 flex items-center justify-between px-6 mb-2">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('tab_sounds')}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openModal('legal')}
                            className="p-1.5 rounded-full bg-slate-800/60 text-amber-500/70 border border-slate-700 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                        >
                            <ShieldAlert size={14} />
                        </button>
                        <button
                            onClick={() => openModal('manage')}
                            className="p-1.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-teal-200 hover:border-teal-200/50 transition-colors"
                        >
                            <SlidersHorizontal size={14} />
                        </button>
                        <button
                            onClick={() => openModal('why')}
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
                onClose={closeModal}
                isWarmthActive={audio.isWarmthActive} onToggleWarmth={audio.toggleWarmth}
                volume={audio.volume} onVolumeChange={audio.setVolume}
                isMuted={audio.isMuted} onToggleMute={audio.toggleMute}
                fadeDuration={audio.fadeDuration} onFadeChange={audio.changeFade}
                heartbeatLayer={audio.heartbeatLayer} onToggleHeartbeatLayer={audio.toggleHeartbeat}
                timerDuration={timer.duration} onTimerChange={timer.setDuration}
                onOpenLegal={() => {
                    // Close settings? Or stack?
                    // To maintain stack: push 'legal'.
                    // Since Settings is full screen-ish but technically a modal...
                    // Standard flow: Open Settings -> Click Legal. 
                    // Should we Close Settings then Open Legal? Or open Legal on top?
                    // Implementation: openModal('legal'). This PUSHES state. 
                    // state becomes { tab: ..., modal: 'legal' }.
                    // The useEffect will see modal='legal' and set showSettings(false).
                    // So it replaces Settings with Legal visually.
                    // When back is pressed -> Pops to { tab: ..., modal: 'settings' }. Settings re-appears. 
                    // This is PERFECT behavioral flow.
                    openModal('legal');
                }}
                onGoToStory={() => navigateToTab('story')}
            />
            <WhyItWorksModal isOpen={showWhyModal} onClose={closeModal} />
            <QuickInfoModal isOpen={quickInfoType !== null} type={quickInfoType} onClose={closeModal} />
            <SupportModal isOpen={showSupportModal} onClose={closeModal} onGoToProducts={() => navigateToTab('tips')} />
            <LegalModal isOpen={showLegalModal} onClose={closeModal} />
            <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

            <ManageSoundsModal
                isOpen={showManageSounds}
                onClose={closeModal}
                activeSoundIds={activeSoundIds}
                onToggleSound={toggleSoundVisibility}
                onReorderSounds={reorderSounds}
            />

            <div className="flex-1 flex flex-col w-full max-w-lg mx-auto relative z-10 min-h-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
                <Header
                    onOpenSettings={() => openModal('settings')}
                    onOpenSupport={() => openModal('support')}
                    onOpenStats={() => navigateToTab('stats')}
                    onGoToStory={() => navigateToTab('story')}
                    isOffline={isOffline}
                />
                {renderContent()}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={navigateToTab} />
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