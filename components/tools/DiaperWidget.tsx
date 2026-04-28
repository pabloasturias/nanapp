import React, { useState } from 'react';
import { Droplets, Disc, Check, History, Clock, Trash2, PieChart, AlertTriangle } from 'lucide-react';
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

const STOOL_TEXTURES = [
    { id: 'liquid', label: 'Líquida', icon: '💧' },
    { id: 'soft', label: 'Pastosa', icon: '☁️' },
    { id: 'hard', label: 'Dura', icon: '🪨' },
];

export const DiaperDashboard: React.FC = () => {
    const { getLatestLog, logs } = useToolData<DiaperLog>('diapers');
    const latest = getLatestLog();

    const lastWet = logs.find(l => l.type === 'wet' || l.type === 'mixed');
    const hoursSinceWet = lastWet ? (Date.now() - lastWet.timestamp) / 3600000 : 24;
    const isDehydrated = hoursSinceWet > 6;

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
            <div className="flex items-center gap-2">
                <span className={`font-bold ${isDehydrated ? 'text-red-400' : 'text-amber-200'} flex items-center gap-1`}>
                    {isDehydrated && <AlertTriangle size={10} className="animate-pulse" />}
                    {typeLabel}
                    {latest.color && (
                        <span className="w-2 h-2 rounded-full inline-block ml-1" style={{ backgroundColor: STOOL_COLORS.find(c => c.id === latest.color)?.hex || 'white' }}></span>
                    )}
                </span>
                {isDehydrated && <span className="text-[8px] font-black bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">¡Beber!</span>}
            </div>
            <span className="text-[10px] opacity-70">
                Hace {timeSince(latest.timestamp)}
            </span>
        </div>
    );
};

export const DiaperFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, getLogsByDate, removeLog, logs } = useToolData<DiaperLog>('diapers');
    const [selectedType, setSelectedType] = useState<DiaperLog['type'] | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedTexture, setSelectedTexture] = useState<string | null>(null);

    const lastWet = logs.find(l => l.type === 'wet' || l.type === 'mixed');
    const hoursSinceWet = lastWet ? (Date.now() - lastWet.timestamp) / 3600000 : 24;
    const isDehydrated = hoursSinceWet > 6;

    const handleSave = () => {
        if (!selectedType) return;
        addLog({
            type: selectedType,
            color: selectedColor || undefined,
            texture: selectedTexture || undefined
        });
        setSelectedType(null);
        setSelectedColor(null);
        setSelectedTexture(null);
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    const handleDelete = (timestamp: number) => {
        if (window.confirm("¿Seguro que quieres borrar este registro?")) {
            removeLog((l) => l.timestamp === timestamp);
        }
    };

    const history = getLogsByDate(new Date());

    // Stats
    const wetCount = history.filter(l => l.type === 'wet' || l.type === 'mixed').length;
    const dirtyCount = history.filter(l => l.type === 'dirty' || l.type === 'mixed').length;

    return (
        <div className="flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-amber-50 mb-6 text-center font-['Outfit']">Nuevo Pañal</h2>

            {/* Type Selection */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                    onClick={() => setSelectedType('wet')}
                    className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'wet'
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300 scale-105 shadow-lg shadow-blue-500/20'
                            : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'
                        }`}
                >
                    <Droplets size={32} />
                    <span className="text-sm font-bold">Pí</span>
                </button>

                <button
                    onClick={() => setSelectedType('dirty')}
                    className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'dirty'
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300 scale-105 shadow-lg shadow-amber-500/20'
                            : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'
                        }`}
                >
                    <Disc size={32} />
                    <span className="text-sm font-bold">Caca</span>
                </button>

                <button
                    onClick={() => setSelectedType('mixed')}
                    className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedType === 'mixed'
                            ? 'bg-orange-500/20 border-orange-400 text-orange-300 scale-105 shadow-lg shadow-orange-500/20'
                            : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'
                        }`}
                >
                    <div className="flex">
                        <Droplets size={20} className="-mr-1" />
                        <Disc size={20} />
                    </div>
                    <span className="text-sm font-bold">Ambos</span>
                </button>
            </div>

            {/* Color & Texture Palette (Show if Dirty or Mixed) */}
            {(selectedType === 'dirty' || selectedType === 'mixed') && (
                <div className="space-y-6 animate-[fade-in_0.3s_ease-out] mb-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">Color de las heces</p>
                        <div className="flex justify-between px-2 bg-slate-900/50 p-4 rounded-[2rem] border border-white/5">
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
                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Normal</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Alerta (Sangre)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Alerta (Biliar)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">Textura</p>
                        <div className="grid grid-cols-3 gap-2">
                            {STOOL_TEXTURES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTexture(t.id)}
                                    className={`py-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${selectedTexture === t.id 
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-200' 
                                        : 'bg-slate-900 border-white/5 text-slate-500'}`}
                                >
                                    <span className="text-xl">{t.icon}</span>
                                    <span className="text-[10px] font-bold uppercase">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Hydration Alert */}
            {isDehydrated && (
                <div className="mb-8 p-4 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-red-200">Alerta de Hidratación</p>
                        <p className="text-[10px] text-red-400/80 leading-tight">Han pasado {Math.round(hoursSinceWet)}h sin un pañal húmedo. Asegúrate de que {activeBaby?.name || 'el bebé'} esté tomando suficiente líquido.</p>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button
                disabled={!selectedType}
                onClick={handleSave}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all mb-8 ${selectedType
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]'
                        : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                    }`}
            >
                Guardar Registro
            </button>

            {/* Stats Summary */}
            {history.length > 0 && (
                <div className="mb-6 flex gap-4 animate-[fade-in_0.3s]">
                    <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-2">
                            <Droplets size={16} className="text-blue-400" />
                            <span className="text-sm font-bold text-slate-300">Pí Hoy</span>
                        </div>
                        <span className="text-xl font-bold text-blue-400">{wetCount}</span>
                    </div>
                    <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-2">
                            <Disc size={16} className="text-amber-400" />
                            <span className="text-sm font-bold text-slate-300">Caca Hoy</span>
                        </div>
                        <span className="text-xl font-bold text-amber-400">{dirtyCount}</span>
                    </div>
                </div>
            )}

            {/* History */}
            <div className="flex-1 mt-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Historial de Hoy
                </h3>
                <div className="space-y-3 pb-8">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Check size={32} className="text-slate-500" />
                            </div>
                            <p className="text-slate-400 font-bold">Sin cambios de pañal aún</p>
                            <p className="text-xs text-slate-500 mt-1">El bebé está limpio por ahora</p>
                        </div>
                    ) : (
                        history.map((log, i) => (
                            <div key={i} className="group flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl shadow-inner ${log.type === 'wet' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                        {log.type === 'wet' ? <Droplets size={20} /> : <Disc size={20} />}
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-200 capitalize flex items-center gap-2">
                                            {log.type === 'mixed' ? 'Ambos' : (log.type === 'wet' ? 'Pí' : 'Caca')}
                                            {log.color && (
                                                <span
                                                    className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                                    style={{ backgroundColor: STOOL_COLORS.find(c => c.id === log.color)?.hex }}
                                                />
                                            )}
                                        </span>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Clock size={10} />
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(log.timestamp)}
                                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
