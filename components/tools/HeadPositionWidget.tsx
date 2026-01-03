import React, { useState, useMemo, useEffect } from 'react';
import { useToolData } from '../../services/hooks/useToolData';
import { HeadPositionLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { Settings, Info, RotateCcw, ArrowRight, ArrowLeft, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const HeadPositionDashboard: React.FC = () => {
    const { logs } = useToolData<HeadPositionLog>('head_position');
    const { activeBaby } = useBaby();

    const lastLog = useMemo(() => {
        if (!activeBaby) return undefined;
        // Get last log for active baby
        return logs
            .filter(l => !l.babyId || l.babyId === activeBaby.id)
            .sort((a, b) => b.timestamp - a.timestamp)[0];
    }, [logs, activeBaby]);

    if (!lastLog) {
        return (
            <div className="flex flex-col items-center opacity-50">
                <span className="text-2xl font-bold text-slate-500">?</span>
                <span className="text-[10px]">Sin registro</span>
            </div>
        );
    }

    const labels = {
        left: 'Izquierda',
        right: 'Derecha',
        back: 'Boca Arriba'
    };

    return (
        <div className="flex flex-col items-center">
            <span className={`text-lg font-bold ${lastLog.side === 'left' ? 'text-blue-400' : lastLog.side === 'right' ? 'text-purple-400' : 'text-emerald-400'}`}>
                {labels[lastLog.side]}
            </span>
            <span className="text-[10px] opacity-70">
                Última posición
            </span>
        </div>
    );
};

export const HeadPositionFull: React.FC<{ onClose: () => void; onOpenSettings: () => void }> = ({ onClose, onOpenSettings }) => {
    const { logs, addLog } = useToolData<HeadPositionLog>('head_position');
    const { activeBaby, babies, setActiveBabyId } = useBaby();
    const { t } = useLanguage();

    const [viewBabyId, setViewBabyId] = useState<string | null>(activeBaby?.id || null);

    useEffect(() => {
        if (activeBaby && !viewBabyId) setViewBabyId(activeBaby.id);
    }, [activeBaby]);

    const currentBaby = babies.find(b => b.id === viewBabyId) || babies[0];

    // Get logs for current view baby
    const babyLogs = useMemo(() => {
        if (!currentBaby) return [];
        return logs
            .filter(l => !l.babyId || l.babyId === currentBaby.id)
            .sort((a, b) => b.timestamp - a.timestamp);
    }, [logs, currentBaby]);

    const lastLog = babyLogs[0];

    const handleLog = (side: 'left' | 'right' | 'back') => {
        addLog({
            timestamp: Date.now(),
            side,
            babyId: currentBaby.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    if (!currentBaby) return null;

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Sticky Header: Baby Selector */}
            <div className="bg-slate-900/95 backdrop-blur-md border-b border-white/5 pb-2 sticky top-0 z-30 shadow-md">
                <div className="px-4 py-3 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Bebé:</span>
                        {babies.map(baby => (
                            <button
                                key={baby.id}
                                onClick={() => {
                                    setViewBabyId(baby.id);
                                    setActiveBabyId(baby.id);
                                }}
                                className={`relative pl-1.5 pr-3.5 py-1.5 rounded-full border transition-all flex items-center gap-2 ${viewBabyId === baby.id
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${baby.gender === 'girl' ? 'bg-pink-100/20 text-pink-100' : 'bg-blue-100/20 text-blue-100'}`}>
                                    {baby.name[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold">{baby.name}</span>
                            </button>
                        ))}
                        <button onClick={onOpenSettings} className="p-1.5 ml-auto rounded-full bg-slate-800 text-slate-500 hover:text-white border border-transparent hover:border-slate-700">
                            <Settings size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Balance Visualization (Last 7 Days) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                        <span>Balance (Últimos 7 días)</span>
                        <Info size={14} />
                    </h3>

                    {(() => {
                        // Calculate stats
                        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                        const recentLogs = babyLogs.filter(l => l.timestamp > sevenDaysAgo);
                        const total = recentLogs.length || 1;
                        const left = recentLogs.filter(l => l.side === 'left').length;
                        const right = recentLogs.filter(l => l.side === 'right').length;
                        const back = recentLogs.filter(l => l.side === 'back').length;

                        const leftPct = Math.round((left / total) * 100);
                        const rightPct = Math.round((right / total) * 100);
                        const backPct = Math.round((back / total) * 100);

                        return (
                            <div className="space-y-3">
                                <div className="h-6 w-full flex rounded-full overflow-hidden bg-slate-800">
                                    {left > 0 && <div style={{ width: `${leftPct}%` }} className="h-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-100">{leftPct}%</div>}
                                    {back > 0 && <div style={{ width: `${backPct}%` }} className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-100">{backPct}%</div>}
                                    {right > 0 && <div style={{ width: `${rightPct}%` }} className="h-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-100">{rightPct}%</div>}
                                    {recentLogs.length === 0 && <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">Sin datos recientes</div>}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 px-1">
                                    <span className="text-blue-400 font-bold">Izquierda ({left})</span>
                                    <span className="text-emerald-400 font-bold">Boca Arriba ({back})</span>
                                    <span className="text-purple-400 font-bold">Derecha ({right})</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed text-center pt-1">
                                    Intenta mantener un equilibrio entre izquierda y derecha para prevenir el aplanamiento lateral.
                                </p>
                            </div>
                        );
                    })()}
                </div>

                {/* Main Action Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
                        Registrar Posición Actual
                    </h3>

                    <div className="grid grid-cols-3 gap-4 w-full">
                        <button
                            onClick={() => handleLog('left')}
                            className="aspect-square rounded-2xl bg-slate-800 hover:bg-blue-500/20 border-2 border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center gap-2 group transition-all active:scale-95"
                        >
                            <ArrowLeft size={32} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white">Izquierda</span>
                        </button>

                        <button
                            onClick={() => handleLog('back')}
                            className="aspect-square rounded-2xl bg-slate-800 hover:bg-emerald-500/20 border-2 border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 group transition-all active:scale-95"
                        >
                            <ArrowUp size={32} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white">Boca Arriba</span>
                        </button>

                        <button
                            onClick={() => handleLog('right')}
                            className="aspect-square rounded-2xl bg-slate-800 hover:bg-purple-500/20 border-2 border-slate-700 hover:border-purple-500 flex flex-col items-center justify-center gap-2 group transition-all active:scale-95"
                        >
                            <ArrowRight size={32} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white">Derecha</span>
                        </button>
                    </div>

                    {lastLog && (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-xs text-slate-500 mb-1">Último registro:</p>
                            <p className="text-lg font-bold text-white">
                                {lastLog.side === 'left' ? 'Izquierda' : lastLog.side === 'right' ? 'Derecha' : 'Boca Arriba'}
                            </p>
                            <p className="text-[10px] text-slate-600">
                                {new Date(lastLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Section: Plagiocephaly */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-400">
                        <Info size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Prevención: Plagiocefalia</h4>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-sm text-slate-300 leading-relaxed">
                        <p>
                            <strong className="text-white">Lo más importante:</strong> En el primer mes, el bebé no puede mover mucho el cuello. Es tu responsabilidad alternar su posición para evitar que la cabeza se aplane.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                                <strong className="block text-white mb-1">Dormir</strong>
                                Alterna el lado de la cabeza cada noche. Una noche a la izquierda, la siguiente a la derecha. boca arriba siempre.
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                                <strong className="block text-white mb-1">Despierto</strong>
                                ¡Tummy Time! El tiempo boca abajo fortalece el cuello y libera la presión de la parte posterior de la cabeza.
                            </div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                            <p className="font-bold text-slate-200 mb-2">Consejos de Prevención:</p>
                            <ul className="list-disc pl-4 space-y-1 marker:text-rose-500 text-xs">
                                <li>Si notas que tu bebé tiene una preferencia fuerte por un lado, consulta con tu pediatra.</li>
                                <li>Cambia la orientación del bebé en la cuna para que mire hacia estímulos diferentes y gire el cuello de forma natural.</li>
                                <li>Evita que pase muchas horas en sillas de coche o hamacas cuando no está viajando.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
