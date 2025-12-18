import React from 'react';
import { X, ChevronUp, ChevronDown, Check, Circle, Volume2 } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';
import { SOUNDS } from '../constants';
import { SoundOption } from '../types';

interface ManageSoundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeSoundIds: string[];
    onToggleSound: (id: string) => void;
    onReorderSounds: (newOrder: string[]) => void;
}

export const ManageSoundsModal: React.FC<ManageSoundsModalProps> = ({
    isOpen,
    onClose,
    activeSoundIds,
    onToggleSound,
    onReorderSounds
}) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const handleMove = (id: string, direction: 'up' | 'down') => {
        const currentIndex = activeSoundIds.indexOf(id);
        if (currentIndex === -1) return;

        const newOrder = [...activeSoundIds];
        if (direction === 'up' && currentIndex > 0) {
            [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
        } else if (direction === 'down' && currentIndex < activeSoundIds.length - 1) {
            [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
        }
        onReorderSounds(newOrder);
    };

    // Split sounds into active and inactive for display?
    // User wants to reorder ACTIVE sounds.
    // And ENABLE/DISABLE available sounds.

    // Let's list ALL sounds. 
    // If active -> show in "Active" list (reorderable).
    // If inactive -> show in "Available" list.

    // Actually simpler: One list of Active sounds (reorderable).
    // Below that: List of Inactive sounds (click to add).

    const activeSoundsObj = activeSoundIds
        .map(id => SOUNDS.find(s => s.id === id))
        .filter(Boolean) as SoundOption[];

    const inactiveSoundsObj = SOUNDS
        .filter(s => !activeSoundIds.includes(s.id));

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={onClose}>
            <div
                className="bg-slate-900 w-full max-w-md max-h-[80vh] rounded-[2rem] border border-white/10 shadow-2xl relative flex flex-col overflow-hidden animate-[scale-in_0.3s_ease-out]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
                            <Volume2 size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-white font-['Quicksand']">{t('tab_sounds')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Active Sounds Section */}
                    <div>
                        <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 px-1">{t('tool_active')}</h3>
                        <div className="space-y-2">
                            {activeSoundsObj.map((sound, index) => (
                                <div key={sound.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-white/5 group">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                        <sound.Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-200">{sound.label}</div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col gap-0.5 mr-2">
                                            <button
                                                onClick={() => handleMove(sound.id, 'up')}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-white/10 rounded text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleMove(sound.id, 'down')}
                                                disabled={index === activeSoundsObj.length - 1}
                                                className="p-1 hover:bg-white/10 rounded text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => onToggleSound(sound.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Sounds Section */}
                    {inactiveSoundsObj.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1 mt-4">{t('tool_available')}</h3>
                            <div className="space-y-2">
                                {inactiveSoundsObj.map(sound => (
                                    <div key={sound.id} className="flex items-center gap-3 bg-slate-800/20 p-3 rounded-xl border border-white/5 opacity-70 hover:opacity-100 transition-all">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                                            <sound.Icon size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-slate-300">{sound.label}</div>
                                        </div>
                                        <button
                                            onClick={() => onToggleSound(sound.id)}
                                            className="p-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg transition-colors"
                                            title="Add"
                                        >
                                            <Check size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
