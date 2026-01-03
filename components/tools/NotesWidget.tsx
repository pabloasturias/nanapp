import React, { useState } from 'react';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';
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
    const { logs, addLog, removeLog } = useToolData<NoteLog>('pediatrician_notes');
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
            <div className="flex flex-col h-full bg-slate-950 absolute inset-0 z-20">
                {/* Header with Actions */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/95 backdrop-blur">
                    <button
                        onClick={() => setIsAdding(false)}
                        className="text-slate-400 font-medium"
                    >
                        Cancelar
                    </button>
                    <h3 className="font-bold text-white">Nueva Nota</h3>
                    <button
                        onClick={handleSave}
                        disabled={!content.trim()}
                        className={`font-bold transition-colors ${content.trim() ? 'text-blue-400' : 'text-slate-600'}`}
                    >
                        Guardar
                    </button>
                </div>

                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                    <input
                        className="bg-transparent text-xl font-bold text-white placeholder-slate-500 mb-4 focus:outline-none border-b border-transparent focus:border-slate-800 pb-2 transition-colors"
                        placeholder="Título (Opcional)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="flex-1 bg-transparent text-lg text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                        placeholder="Escribe aquí los apuntes del pediatra..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative bg-slate-950">
            {/* Header */}
            <div className="p-4 border-b border-white/5 sticky top-0 bg-slate-950/95 backdrop-blur z-10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Notas</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>No hay notas guardadas</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.timestamp} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 group relative">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-200 text-lg">{log.title || 'Sin título'}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Eliminar esta nota?')) removeLog(l => l.timestamp === log.timestamp);
                                        }}
                                        className="text-slate-600 hover:text-rose-500 p-1 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed border-t border-slate-800/50 pt-2">{log.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Button for New Note */}
            <button
                onClick={() => setIsAdding(true)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-slate-200 hover:bg-white text-slate-900 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
            >
                <Plus size={32} />
            </button>
        </div>
    );
};
