import React, { useState } from 'react';
import { Thermometer, History, Calendar, Check } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { TemperatureLog } from './types';

export const TempDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<TemperatureLog>('fever');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const isHigh = latest.temp >= 38;

    return (
        <div className="flex flex-col">
            <span className={`font-bold ${isHigh ? 'text-red-400' : 'text-emerald-200'}`}>
                {latest.temp}°C
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export const TempFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<TemperatureLog>('fever');
    const [temp, setTemp] = useState<string>('36.5');

    const quickTemps = ['36.5', '37.0', '37.5', '38.0', '38.5', '39.0'];

    const handleSave = () => {
        if (!temp) return;
        addLog({
            temp: parseFloat(temp.replace(',', '.'))
        });
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        onClose();
    };

    return (
        <div className="flex flex-col h-full p-6">

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative mb-12">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        className="bg-transparent text-center text-7xl font-bold text-white focus:outline-none w-64 border-b-2 border-slate-700 focus:border-red-500 transition-all font-mono"
                    />
                    <span className="absolute top-0 -right-8 text-4xl text-slate-500 font-bold">°C</span>
                </div>

                {/* Suggestions */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-12">
                    {quickTemps.map(qt => (
                        <button
                            key={qt}
                            onClick={() => setTemp(qt)}
                            className={`py-3 rounded-xl border font-bold pointer-events-auto transition-all ${temp === qt
                                    ? 'bg-red-500/20 border-red-500 text-red-200'
                                    : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {qt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    className="w-full max-w-sm py-4 rounded-xl font-bold text-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all"
                >
                    Guardar Temperatura
                </button>
            </div>

            {/* History */}
            <div className="bg-slate-900/50 rounded-t-[2rem] border-t border-white/5 p-6 h-1/3 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Reciente
                </h3>
                <div className="space-y-3">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${log.temp >= 38 ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    <Thermometer size={14} />
                                </div>
                                <span className={`text-sm font-bold ${log.temp >= 38 ? 'text-red-300' : 'text-slate-200'}`}>
                                    {log.temp}°C
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
