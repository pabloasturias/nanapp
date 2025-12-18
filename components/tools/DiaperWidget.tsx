import React, { useState } from 'react';
import { Droplets, Disc, Check, History, Clock } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { DiaperLog } from './types';

const STOOL_COLORS = [
    { id: 'mustard', hex: '#EAB308', label: 'Mostaza' },
    { id: 'brown', hex: '#854D0E', label: 'Marrón' },
    { id: 'green', hex: '#22C55E', label: 'Verde' },
    { id: 'black', hex: '#171717', label: 'Negro' },
    { id: 'red', hex: '#EF4444', label: 'Rojo' },
    { id: 'white', hex: '#F5F5F5', label: 'Blanco' },
];

export const DiaperDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<DiaperLog>('diapers');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const timeSince = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    const typeLabel = {
        wet: 'Pí',
        dirty: 'Caca',
        mixed: 'Ambos'
    }[latest.type];

    return (
        <div className="flex flex-col">
            <span className="font-bold text-amber-200 flex items-center gap-1">
                {typeLabel}
                {latest.color && (
                    <span className="w-2 h-2 rounded-full inline-block ml-1" style={{ backgroundColor: STOOL_COLORS.find(c => c.id === latest.color)?.hex || 'white' }}></span>
                )}
            </span>
            <span className="text-[10px] opacity-70">
                Hace {timeSince(latest.timestamp)}
            </span>
        </div>
    );
};

export const DiaperFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, getLogsByDate } = useToolData<DiaperLog>('diapers');
    const [selectedType, setSelectedType] = useState<DiaperLog['type'] | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const handleSave = () => {
        if (!selectedType) return;
        addLog({
            type: selectedType,
            color: selectedColor || undefined
        });
        // Reset or Close? Let's reset for quick entry, or toast.
        // For now, just reset and maybe vibrate.
        setSelectedType(null);
        setSelectedColor(null);
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    const history = getLogsByDate(new Date());

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-bold text-amber-50 mb-6 text-center">Nuevo Pañal</h2>

            {/* Type Selection */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                    onClick={() => setSelectedType('wet')}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'wet'
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-700'
                        }`}
                >
                    <Droplets size={32} />
                    <span className="text-sm font-bold">Pí</span>
                </button>

                <button
                    onClick={() => setSelectedType('dirty')}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'dirty'
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-700'
                        }`}
                >
                    <Disc size={32} />
                    <span className="text-sm font-bold">Caca</span>
                </button>

                <button
                    onClick={() => setSelectedType('mixed')}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'mixed'
                            ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-700'
                        }`}
                >
                    <div className="flex">
                        <Droplets size={20} className="-mr-1" />
                        <Disc size={20} />
                    </div>
                    <span className="text-sm font-bold">Ambos</span>
                </button>
            </div>

            {/* Color Palette (Show if Dirty or Mixed) */}
            {(selectedType === 'dirty' || selectedType === 'mixed') && (
                <div className="mb-8 animate-[fade-in_0.3s_ease-out]">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Color</p>
                    <div className="flex justify-between px-2">
                        {STOOL_COLORS.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedColor(c.id)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform ${selectedColor === c.id ? 'scale-125 border-white shadow-xl' : 'border-transparent scale-100 opacity-70'
                                    }`}
                                style={{ backgroundColor: c.hex }}
                                title={c.label}
                            >
                                {selectedColor === c.id && <Check size={16} className={c.id === 'white' ? 'text-black' : 'text-white'} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button
                disabled={!selectedType}
                onClick={handleSave}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-8 ${selectedType
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
            >
                Guardar
            </button>

            {/* History */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Hoy
                </h3>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-500 italic text-center py-4">Sin registros hoy</p>
                    ) : (
                        history.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${log.type === 'wet' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                        {log.type === 'wet' ? <Droplets size={16} /> : <Disc size={16} />}
                                    </div>
                                    <span className="text-sm font-bold text-slate-200 capitalize">
                                        {log.type === 'mixed' ? 'Ambos' : (log.type === 'wet' ? 'Pí' : 'Caca')}
                                    </span>
                                    {log.color && (
                                        <span
                                            className="w-3 h-3 rounded-full border border-white/10"
                                            style={{ backgroundColor: STOOL_COLORS.find(c => c.id === log.color)?.hex }}
                                        />
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
