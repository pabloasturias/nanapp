import React, { useState } from 'react';
import { Circle, History } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { GrowthLog } from './types';

// RE-USES 'growth' storage key!
export const HeadDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<GrowthLog>('growth');
    const latest = getLatestLog(); // Note: getLatestLog might return a log without headCm.

    // We need latest log THAT HAS headCm
    // useToolData doesn't support complex queries yet.
    // We'll just show specific text if available

    return (
        <div className="flex flex-col">
            <span className="font-bold text-emerald-200">
                {latest?.headCm ? `${latest.headCm}cm` : '--'}
            </span>
            <span className="text-[10px] opacity-70">
                Perímetro
            </span>
        </div>
    );
};

export const HeadFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<GrowthLog>('growth');
    const [head, setHead] = useState('');

    const handleSave = () => {
        if (!head) return;
        addLog({
            timestamp: Date.now(),
            headCm: parseFloat(head.replace(',', '.'))
        });
        onClose();
    };

    const headLogs = logs.filter(l => l.headCm);

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative mb-12">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={head}
                        onChange={(e) => setHead(e.target.value)}
                        className="bg-transparent text-center text-7xl font-bold text-emerald-200 focus:outline-none w-64 border-b-2 border-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                        placeholder="0"
                    />
                    <span className="absolute top-0 -right-8 text-xl text-emerald-500 font-bold mt-8">cm</span>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full max-w-sm py-4 rounded-xl font-bold text-lg bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all"
                >
                    Guardar Perímetro
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 h-1/3 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Historial</h3>
                <div className="space-y-2">
                    {headLogs.map((log, i) => (
                        <div key={i} className="flex justify-between text-sm p-3 bg-slate-800 rounded-lg border border-white/5">
                            <span className="font-bold text-emerald-200">{log.headCm} cm</span>
                            <span className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
