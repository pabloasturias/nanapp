import React, { useMemo } from 'react';
import { useToolData } from '../../services/hooks/useToolData';
import { TeethingLog } from './types';

// Tooth Definitions
type ToothType = 'incisor' | 'canine' | 'molar';
type Jaw = 'upper' | 'lower';
type Side = 'left' | 'right';

interface ToothDef {
    id: string; // Specific ID: "UL1", "LR2", etc.
    label: string;
    type: ToothType;
    jaw: Jaw;
    side: Side;
    position: number; // 1 (center) to 5 (back)
    months: string; // Average eruption time
    oldGroupId?: string; // For backward compatibility
}

// Generate the 20 primary teeth
const generateTeeth = (): ToothDef[] => {
    const teeth: ToothDef[] = [];
    const quadrants: { jaw: Jaw; side: Side; prefix: string }[] = [
        { jaw: 'upper', side: 'right', prefix: 'UR' },
        { jaw: 'upper', side: 'left', prefix: 'UL' },
        { jaw: 'lower', side: 'right', prefix: 'LR' },
        { jaw: 'lower', side: 'left', prefix: 'LL' },
    ];

    quadrants.forEach(({ jaw, side, prefix }) => {
        for (let i = 1; i <= 5; i++) {
            let type: ToothType = 'incisor';
            let label = '';
            let months = '';
            let oldGroupId = '';

            if (i === 1) {
                label = 'Incisivo Central';
                months = jaw === 'lower' ? '6-10m' : '8-12m';
                oldGroupId = jaw === 'upper' ? 'inc_up' : 'inc_low';
            } else if (i === 2) {
                label = 'Incisivo Lateral';
                months = jaw === 'lower' ? '10-16m' : '9-13m';
                oldGroupId = jaw === 'upper' ? 'lat_up' : 'lat_low';
            } else if (i === 3) {
                type = 'canine';
                label = 'Canino';
                months = '16-22m'; // Roughly same for both
                oldGroupId = 'can';
            } else if (i === 4) {
                type = 'molar';
                label = 'Primer Molar';
                months = '13-19m';
                oldGroupId = 'mol_1';
            } else if (i === 5) {
                type = 'molar';
                label = 'Segundo Molar';
                months = '25-33m';
                oldGroupId = 'mol_2';
            }

            teeth.push({
                id: `${prefix}${i}`,
                label,
                type,
                jaw,
                side,
                position: i,
                months,
                oldGroupId
            });
        }
    });
    return teeth;
};

const ALL_TEETH = generateTeeth();

// Visual Component for a single tooth
const VisualTooth: React.FC<{
    def: ToothDef;
    isErupted: boolean;
    isExpected?: boolean; // New prop
    onClick: () => void;
}> = ({ def, isErupted, isExpected, onClick }) => {
    // Widths
    const width = def.type === 'molar' ? 45 : def.type === 'canine' ? 35 : 30;
    const height = def.type === 'molar' ? 40 : 45;

    // Color
    const baseColor = isErupted ? '#F472B6' : isExpected ? '#451a03' : '#334155'; // Pink | Amber-900 | Slate-700
    const borderColor = isErupted ? '#FBCFE8' : isExpected ? '#f59e0b' : '#475569'; // Pink | Amber-500 | Slate-600
    const opacity = isErupted ? 1 : isExpected ? 0.8 : 0.4; // Highlight expected


    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center transition-all duration-300 relative group"
            style={{
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <div
                className={`w-full h-full rounded-lg border-2 shadow-lg transition-all duration-300 ${isErupted ? 'shadow-pink-500/20 scale-105' : 'shadow-none'}`}
                style={{
                    backgroundColor: baseColor,
                    borderColor: borderColor,
                    opacity: opacity,
                    borderRadius: def.type === 'incisor' ? '4px 4px 12px 12px' : def.type === 'canine' ? '4px 4px 20px 20px' : '8px',
                    // Flip radius for lower jaw
                    ...(def.jaw === 'lower' ? {
                        borderRadius: def.type === 'incisor' ? '12px 12px 4px 4px' : def.type === 'canine' ? '20px 20px 4px 4px' : '8px'
                    } : {})
                }}
            >
                {/* Gloss effect */}
                <div className="absolute top-1 left-1 right-1 h-1/3 bg-white/10 rounded-full blur-[1px]"></div>
            </div>

            {/* Tooltip-ish info on hover/active */}
            <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded pointer-events-none z-50 -bottom-12 w-24 text-center shadow-xl transition-opacity">
                <p className="font-bold text-pink-200">{def.label}</p>
                <p className="text-slate-400">{def.months}</p>
            </div>
        </button>
    );
};

export const TeethingDashboard: React.FC = () => {
    const { logs } = useToolData<TeethingLog>('teething');

    // Count unique erupted teeth (accounting for old groups)
    const count = useMemo(() => {
        let eruptedCount = 0;
        const processedIds = new Set();

        logs.forEach(log => {
            // If it's a specific ID
            if (ALL_TEETH.some(t => t.id === log.toothId)) {
                if (!processedIds.has(log.toothId)) {
                    eruptedCount++;
                    processedIds.add(log.toothId);
                }
            } else {
                // It's a group ID, count all teeth in that group that haven't been counted?
                // Actually simplified: specific IDs override groups.
                // But for the count, we assume if group is present, all in group are out.
                const groupTeeth = ALL_TEETH.filter(t => t.oldGroupId === log.toothId);
                groupTeeth.forEach(t => {
                    if (!processedIds.has(t.id)) {
                        eruptedCount++;
                        processedIds.add(t.id);
                    }
                });
            }
        });
        return eruptedCount;
    }, [logs]);

    return (
        <div className="flex flex-col">
            <span className="font-bold text-rose-200">
                {count} / 20
            </span>
            <span className="text-[10px] opacity-70">
                Dientes
            </span>
        </div>
    );
};

import { Info, X } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

// ... existing code ...

export const TeethingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog } = useToolData<TeethingLog>('teething');
    const { t } = useLanguage();
    const [showInfo, setShowInfo] = React.useState(false);

    const getIsErupted = (tooth: ToothDef) => {
        return logs.some(l => l.toothId === tooth.id || l.toothId === tooth.oldGroupId);
    };

    const toggleTooth = (tooth: ToothDef) => {
        const isErupted = getIsErupted(tooth);
        if (isErupted) return; // Only add for now
        addLog({ timestamp: Date.now(), toothId: tooth.id });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    // Organized by arch
    const upperRight = ALL_TEETH.filter(t => t.jaw === 'upper' && t.side === 'right').sort((a, b) => b.position - a.position);
    const upperLeft = ALL_TEETH.filter(t => t.jaw === 'upper' && t.side === 'left').sort((a, b) => a.position - b.position);
    const lowerRight = ALL_TEETH.filter(t => t.jaw === 'lower' && t.side === 'right').sort((a, b) => b.position - a.position);
    const lowerLeft = ALL_TEETH.filter(t => t.jaw === 'lower' && t.side === 'left').sort((a, b) => a.position - b.position);

    return (
        <div className="flex flex-col h-full bg-slate-950 relative">

            {/* Info Overlay */}
            {showInfo && (
                <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-[fade-in_0.2s]">
                    <div className="p-6 pb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-pink-200">{t('tool_teething_info_title')}</h3>
                        <button onClick={() => setShowInfo(false)} className="p-2 bg-slate-900 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-8">
                        {/* Chart */}
                        <section>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                {t('tool_teething_chart_title')}
                            </h4>
                            <div className="bg-slate-900 rounded-xl p-4 border border-white/5 space-y-3">
                                <div className="flex justify-between text-xs border-b border-white/5 pb-2 mb-2 font-bold text-slate-400">
                                    <span>Diente</span>
                                    <span>Meses (Aprox)</span>
                                </div>
                                {ALL_TEETH.filter(t => t.side === 'right').sort((a, b) => {
                                    // Custom sort order for chart: Center out
                                    return a.position - b.position || (a.jaw === 'upper' ? -1 : 1);
                                }).slice(0, 5).map((t) => (
                                    // Showing one set of examples (e.g. Upper Right) to simplify chart, generic names
                                    <div key={t.label} className="flex justify-between text-sm text-slate-300">
                                        <span>{t.label}</span>
                                        <span className="text-pink-300 tabular-nums">{t.months}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tips */}
                        <section>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                {t('tool_teething_tips_title')}
                            </h4>
                            <div className="grid gap-3">
                                <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-slate-300">{t('tool_teething_tip_1')}</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-slate-300">{t('tool_teething_tip_2')}</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-slate-300">{t('tool_teething_tip_3')}</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-slate-300">{t('tool_teething_tip_4')}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            <div className="shrink-0 p-6 pb-2 flex justify-between items-start">
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Registro Dentición</h3>
                    <p className="text-slate-400 text-sm mb-2">Toca los dientes que ya han salido.</p>
                </div>
                <button
                    onClick={() => setShowInfo(true)}
                    className="p-2 bg-slate-900 text-pink-300 rounded-full border border-pink-500/30 hover:bg-pink-500/10 transition-colors"
                >
                    <Info size={18} />
                </button>
            </div>

            <div className="shrink-0 px-6 pb-2">
                <div className="flex gap-4 text-[10px] text-slate-500 bg-white/5 p-2 rounded-lg">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600"></div>Sin salir</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-400 border border-pink-200"></div>Salido</span>
                    <span className="flex items-center gap-1 opacity-50"><div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500"></div>Esperado pronto</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto w-full">

                {/* Mouth Container */}
                <div className="relative flex flex-col gap-12 scale-[0.85] sm:scale-100 origin-center select-none">

                    {/* Upper Arch */}
                    <div className="relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 tracking-widest uppercase">Maxilar Superior</div>
                        <div className="flex justify-center gap-1.5 items-end rounded-b-[4rem] px-8 pb-4">
                            {/* Right Side (Display on Left) */}
                            <div className="flex gap-1.5 items-end translate-y-2">
                                {upperRight.map(t => (
                                    <div key={t.id} className={`transform ${t.position === 5 ? 'translate-y-8 rotate-[-15deg]' : t.position >= 3 ? 'translate-y-2 rotate-[-5deg]' : ''}`}>
                                        <VisualTooth def={t} isErupted={getIsErupted(t)} onClick={() => toggleTooth(t)} />
                                    </div>
                                ))}
                            </div>
                            {/* Left Side (Display on Right) */}
                            <div className="flex gap-1.5 items-end translate-y-2">
                                {upperLeft.map(t => (
                                    <div key={t.id} className={`transform ${t.position === 5 ? 'translate-y-8 rotate-[15deg]' : t.position >= 3 ? 'translate-y-2 rotate-[5deg]' : ''}`}>
                                        <VisualTooth def={t} isErupted={getIsErupted(t)} onClick={() => toggleTooth(t)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lower Arch */}
                    <div className="relative">
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 tracking-widest uppercase">Mandíbula</div>
                        <div className="flex justify-center gap-1.5 items-start rounded-t-[4rem] px-8 pt-4">
                            {/* Right Side (Display on Left) */}
                            <div className="flex gap-1.5 items-start -translate-y-2">
                                {lowerRight.map(t => (
                                    <div key={t.id} className={`transform ${t.position === 5 ? '-translate-y-8 rotate-[15deg]' : t.position >= 3 ? '-translate-y-2 rotate-[5deg]' : ''}`}>
                                        <VisualTooth def={t} isErupted={getIsErupted(t)} onClick={() => toggleTooth(t)} />
                                    </div>
                                ))}
                            </div>
                            {/* Left Side (Display on Right) */}
                            <div className="flex gap-1.5 items-start -translate-y-2">
                                {lowerLeft.map(t => (
                                    <div key={t.id} className={`transform ${t.position === 5 ? '-translate-y-8 rotate-[-15deg]' : t.position >= 3 ? '-translate-y-2 rotate-[-5deg]' : ''}`}>
                                        <VisualTooth def={t} isErupted={getIsErupted(t)} onClick={() => toggleTooth(t)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
