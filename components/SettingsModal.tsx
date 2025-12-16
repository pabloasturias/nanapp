import React from 'react';
import { X, Thermometer, Volume2, VolumeX, Globe, Wind, Heart, Shield, ArrowRight, Clock, Info } from 'lucide-react';
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
    onOpenAbout: () => void;
    timerDuration: number;
    onTimerChange: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    isWarmthActive, onToggleWarmth,
    volume, onVolumeChange, isMuted, onToggleMute,
    fadeDuration, onFadeChange,
    heartbeatLayer, onToggleHeartbeatLayer,
    onOpenLegal, onOpenAbout,
    timerDuration, onTimerChange
}) => {
    const { t, language, setLanguage } = useLanguage();

    if (!isOpen) return null;

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

                <div className="p-6 space-y-6 overflow-y-auto">

                    {/* Language Selector */}
                    <div className="bg-slate-800/30 p-4 rounded-3xl border border-slate-700/30">
                        <div className="flex items-center gap-3 mb-3">
                            <Globe size={18} className="text-blue-300" />
                            <span className="text-sm font-semibold text-orange-50">{t('language')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setLanguage('es')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'es' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Español
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'en' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('fr')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'fr' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Français
                            </button>
                            <button
                                onClick={() => setLanguage('de')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'de' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Deutsch
                            </button>
                            <button
                                onClick={() => setLanguage('it')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'it' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Italiano
                            </button>
                            <button
                                onClick={() => setLanguage('pt')}
                                className={`p-2 rounded-xl text-xs font-bold transition-all ${language === 'pt' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Português
                            </button>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="space-y-4 bg-slate-800/50 p-5 rounded-3xl border border-slate-700/30">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-orange-50">{t('volume_app')}</span>
                            <button
                                onClick={onToggleMute}
                                className={`p-2 rounded-full transition-colors ${isMuted ? 'text-orange-300 bg-orange-900/20' : 'text-slate-400 hover:bg-slate-700'}`}
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-orange-400 hover:accent-orange-300 focus:outline-none"
                        />
                    </div>

                    {/* Timer Default Setting */}
                    <div className="bg-slate-800/30 p-4 rounded-3xl border border-slate-700/30">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={18} className="text-teal-300" />
                            <div>
                                <span className="text-sm font-semibold text-orange-50 block">{t('settings_timer_default')}</span>
                                <span className="text-[10px] text-slate-400">{t('settings_timer_desc')}</span>
                            </div>
                            <span className="ml-auto text-xs font-mono text-teal-200">{timerDuration}m</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="120"
                            step="5"
                            value={timerDuration}
                            onChange={(e) => onTimerChange(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400 hover:accent-teal-300 focus:outline-none"
                        />
                    </div>

                    {/* PRO AUDIO SECTION */}
                    <div className="space-y-4">
                        <h3 className="px-1 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('settings_pro_audio')}</h3>

                        {/* Heartbeat Layer Toggle */}
                        <div className="flex items-center justify-between bg-red-500/10 p-4 rounded-3xl border border-red-500/20">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-red-500/20 text-red-300 rounded-2xl">
                                    <Heart size={22} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-orange-50">{t('layer_heartbeat')}</p>
                                    <p className="text-[10px] text-slate-400">{t('layer_heartbeat_desc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={onToggleHeartbeatLayer}
                                className={`w-12 h-7 rounded-full transition-colors relative ${heartbeatLayer ? 'bg-red-500' : 'bg-slate-700'}`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${heartbeatLayer ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>

                        {/* Fade Duration */}
                        <div className="bg-slate-800/30 p-4 rounded-3xl border border-slate-700/30">
                            <div className="flex items-center gap-3 mb-4">
                                <Wind size={18} className="text-pink-300" />
                                <div>
                                    <span className="text-sm font-semibold text-orange-50 block">{t('fade_duration')}</span>
                                    <span className="text-[10px] text-slate-400">{t('fade_desc')}</span>
                                </div>
                                <span className="ml-auto text-xs font-mono text-orange-200">{fadeDuration}s</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.5"
                                value={fadeDuration}
                                onChange={(e) => onFadeChange(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-pink-400 hover:accent-pink-300 focus:outline-none"
                            />
                        </div>

                        {/* Toggle Warmth */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-orange-500/10 text-orange-300 rounded-2xl">
                                    <Thermometer size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-orange-50">{t('warmth')}</p>
                                    <p className="text-[10px] text-slate-400">{t('warmth_desc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={onToggleWarmth}
                                className={`w-12 h-7 rounded-full transition-colors relative ${isWarmthActive ? 'bg-orange-500' : 'bg-slate-700'}`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isWarmthActive ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="pt-2 space-y-2">
                        <button
                            onClick={onOpenAbout}
                            className="w-full p-4 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between group hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Info size={20} className="text-slate-400 group-hover:text-indigo-300" />
                                <span className="text-sm font-semibold text-slate-300 group-hover:text-orange-50">{t('about_nanapp')}</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-500 group-hover:text-indigo-300" />
                        </button>

                        <button
                            onClick={onOpenLegal}
                            className="w-full p-4 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between group hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-slate-400 group-hover:text-orange-200" />
                                <span className="text-sm font-semibold text-slate-300 group-hover:text-orange-50">{t('legal_title')}</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-500 group-hover:text-orange-300" />
                        </button>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-800 text-center">
                        <p className="text-[10px] text-slate-500">nanapp v4.0 · Final</p>
                    </div>
                </div>
            </div>
        </div>
    );
};