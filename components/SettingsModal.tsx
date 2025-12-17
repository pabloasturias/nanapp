import React from 'react';
import { X, Thermometer, Volume2, VolumeX, Globe, Heart, Shield, Info, Clock, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isWarmthActive: boolean;
    onToggleWarmth: () => void;
    volume: number;
    onVolumeChange: (val: number) => void;
    isMuted: boolean;
    onToggleMute: () => void;
    fadeDuration: number;
    onFadeChange: (val: number) => void;
    heartbeatLayer: boolean;
    onToggleHeartbeatLayer: () => void;
    onOpenLegal: () => void;
    timerDuration: number;
    onTimerChange: (val: number) => void;
    onGoToStory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    isWarmthActive, onToggleWarmth,
    volume, onVolumeChange, isMuted, onToggleMute,
    fadeDuration, onFadeChange,
    heartbeatLayer, onToggleHeartbeatLayer,
    onOpenLegal, onGoToStory,
    timerDuration, onTimerChange
}) => {
    const { t, language, setLanguage } = useLanguage();

    if (!isOpen) return null;

    // Render logic for language buttons
    const renderLangBtn = (code: string, label: string) => (
        <button
            onClick={() => setLanguage(code as any)}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border
                ${language === code
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                    : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-300'}
            `}
        >
            {language === code && <Check size={12} />}
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-[2rem] shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] flex flex-col max-h-[90vh]">

                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
                    <h2 className="text-lg font-bold text-orange-50">{t('settings_title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-orange-50 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto">

                    {/* SECTION: AUDIO */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            <Volume2 size={12} />
                            <span>Audio</span>
                        </div>

                        <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-700/30 space-y-6">
                            {/* Volume */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-300">{t('volume_app')}</span>
                                    <button onClick={onToggleMute} className="text-slate-400 hover:text-white">
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.01" value={volume}
                                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-orange-400"
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5" />

                            {/* Fade */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm font-semibold text-slate-300 block">{t('fade_duration')}</span>
                                        <span className="text-[10px] text-slate-500">{t('fade_desc')}</span>
                                    </div>
                                    <span className="text-sm font-mono text-slate-400">{fadeDuration}s</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="5" step="0.5" value={fadeDuration}
                                    onChange={(e) => onFadeChange(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-pink-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: LAYERS */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            <Heart size={12} />
                            <span>Capas</span>
                        </div>

                        <div className="bg-slate-800/30 rounded-3xl border border-slate-700/30 overflow-hidden">
                            {/* Warmth */}
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
                                        <Thermometer size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-200 block">{t('warmth')}</span>
                                        <span className="text-[10px] text-slate-500">{t('warmth_desc')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onToggleWarmth}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${isWarmthActive ? 'bg-orange-500' : 'bg-slate-700'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isWarmthActive ? 'translate-x-4' : ''}`} />
                                </button>
                            </div>
                            {/* Heartbeat */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-xl text-red-400">
                                        <Heart size={18} fill="currentColor" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-200 block">{t('layer_heartbeat')}</span>
                                        <span className="text-[10px] text-slate-500">{t('layer_heartbeat_desc')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onToggleHeartbeatLayer}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${heartbeatLayer ? 'bg-red-500' : 'bg-slate-700'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${heartbeatLayer ? 'translate-x-4' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: GENERAL */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            <Globe size={12} />
                            <span>General</span>
                        </div>

                        <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-700/30 space-y-5">
                            {/* Timer */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-teal-400" />
                                    <span className="text-sm font-semibold text-slate-300">{t('settings_timer_default')}: <span className="text-teal-400">{timerDuration}m</span></span>
                                </div>
                                <input
                                    type="range" min="10" max="120" step="5" value={timerDuration}
                                    onChange={(e) => onTimerChange(parseInt(e.target.value, 10))}
                                    className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400"
                                />
                            </div>

                            {/* Language */}
                            <div>
                                <span className="text-xs font-semibold text-slate-500 block mb-3">{t('language')}</span>
                                <div className="flex flex-wrap gap-2">
                                    {renderLangBtn('es', 'Español')}
                                    {renderLangBtn('en', 'English')}
                                    {renderLangBtn('fr', 'Français')}
                                    {renderLangBtn('de', 'Deutsch')}
                                    {renderLangBtn('it', 'Italiano')}
                                    {renderLangBtn('pt', 'Português')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: INFO */}
                    <div className="pt-2 space-y-2">
                        <button
                            onClick={() => { onGoToStory(); onClose(); }}
                            className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between group hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Info size={18} className="text-indigo-400" />
                                <span className="text-sm font-semibold text-slate-300">Sobre nanapp</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-600" />
                        </button>

                        <button
                            onClick={onOpenLegal}
                            className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between group hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-slate-400" />
                                <span className="text-sm font-semibold text-slate-300">{t('legal_title')}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-600" />
                        </button>
                    </div>

                </div>

                <div className="text-center pb-6 pt-2">
                    <p className="text-[10px] text-slate-600">v4.1 · Final</p>
                </div>
            </div>
        </div>
    );
};