import React, { useState } from 'react';
import { Mic, Music, Quote } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
// We'll reuse NoteLog structure but store key 'sound_memories'
interface SoundLog {
    timestamp: number;
    description: string;
}

export const SoundDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<SoundLog>('sound_memories');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin recuerdos</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-rose-200 truncate">
                {latest.description}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const SoundFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog } = useToolData<SoundLog>('sound_memories');
    const [text, setText] = useState('');

    const handleSave = () => {
        if (!text) return;
        addLog({ timestamp: Date.now(), description: text });
        onClose();
    }

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex-1 flex flex-col justify-center">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 mb-6">
                    <label className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-4">
                        ¿Qué sonido nuevo hizo hoy?
                    </label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Ej: Dijo 'Ma-ma' por primera vez..."
                        className="w-full bg-transparent text-xl text-slate-200 placeholder-slate-600 focus:outline-none resize-none h-32"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={!text}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${text ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'
                        }`}
                >
                    Guardar Recuerdo
                </button>
            </div>

            <div className="h-1/3 overflow-y-auto space-y-3">
                {logs.map((log, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                            <Quote size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-200">{log.description}</p>
                            <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
