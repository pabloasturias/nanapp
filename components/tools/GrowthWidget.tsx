import React, { useState } from 'react';
import { Ruler, Scale, History, Calendar } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { GrowthLog } from './types';

export const GrowthDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<GrowthLog>('growth');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-emerald-200">
                {latest.weightKg ? `${latest.weightKg}kg` : ''}
                {latest.weightKg && latest.heightCm ? ' · ' : ''}
                {latest.heightCm ? `${latest.heightCm}cm` : ''}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const GrowthFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<GrowthLog>('growth');
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [head, setHead] = useState<string>('');

    const handleSave = () => {
        if (!weight && !height && !head) return;
        addLog({
            weightKg: weight ? parseFloat(weight.replace(',', '.')) : undefined,
            heightCm: height ? parseFloat(height.replace(',', '.')) : undefined,
            headCm: head ? parseFloat(head.replace(',', '.')) : undefined
        });
        onClose();
    };

    return (
        <div className="flex flex-col h-full p-6">

            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 space-y-6 mb-8">
                {/* Weight Input */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Scale size={24} />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Peso (kg)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent text-2xl font-bold text-emerald-200 placeholder-slate-700 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* Height Input */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                        <Ruler size={24} />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Altura (cm)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="0"
                            className="w-full bg-transparent text-2xl font-bold text-teal-200 placeholder-slate-700 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* Head Input */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <span className="text-xl font-bold">O</span>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Perímetro (cm)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={head}
                            onChange={(e) => setHead(e.target.value)}
                            placeholder="0"
                            className="w-full bg-transparent text-2xl font-bold text-cyan-200 placeholder-slate-700 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={!weight && !height}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-8 ${(weight || height)
                        ? 'bg-emerald-500 text-white shadow-lg cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
            >
                Guardar Registro
            </button>

            {/* History */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Historial
                </h3>
                <div className="space-y-3">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                            <div className="flex gap-4">
                                {log.weightKg && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-emerald-200">{log.weightKg}kg</span>
                                        <span className="text-[10px] text-emerald-500/50 uppercase">Peso</span>
                                    </div>
                                )}
                                {log.heightCm && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-teal-200">{log.heightCm}cm</span>
                                        <span className="text-[10px] text-teal-500/50 uppercase">Altura</span>
                                    </div>
                                )}
                                {log.headCm && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-cyan-200">{log.headCm}cm</span>
                                        <span className="text-[10px] text-cyan-500/50 uppercase">Cabeza</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(log.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-sm text-slate-500 italic text-center">Sin registros</p>}
                </div>
            </div>
        </div>
    );
};
