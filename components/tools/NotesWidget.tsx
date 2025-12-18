import React, { useState } from 'react';
import { FileText, Plus, Save } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { NoteLog } from './types';

export const NotesDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<NoteLog>('pediatrician_notes');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin notas</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-slate-200 truncate max-w-[120px]">
                {latest.title || 'Nota'}
            </span>
            <span className="text-[10px] opacity-70 truncate">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const NotesFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog } = useToolData<NoteLog>('pediatrician_notes');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = () => {
        if (!content.trim()) return;
        addLog({
            timestamp: Date.now(),
            title: title.trim(),
            content: content.trim()
        });
        setTitle('');
        setContent('');
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <div className="flex flex-col h-full p-6">
                <input
                    className="bg-transparent text-xl font-bold text-white placeholder-slate-500 mb-4 focus:outline-none"
                    placeholder="Título (Ej: Revisión 6m)"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                />
                <textarea
                    className="flex-1 bg-slate-800/50 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none resize-none mb-4"
                    placeholder="Escribe aquí los apuntes..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAdding(false)}
                        className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-slate-200 text-slate-900 rounded-xl font-bold"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6">
            <button
                onClick={() => setIsAdding(true)}
                className="w-full py-4 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-bold mb-6 flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-500 transition-all"
            >
                <Plus size={20} />
                Nueva Nota
            </button>

            <div className="flex-1 overflow-y-auto space-y-4">
                {logs.map((log, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-200">{log.title || 'Sin título'}</h4>
                            <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-400 whitespace-pre-wrap">{log.content}</p>
                    </div>
                ))}
                {logs.length === 0 && <p className="text-center text-slate-500 mt-10">No hay notas guardadas</p>}
            </div>
        </div>
    );
};
