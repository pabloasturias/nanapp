import React, { useState } from 'react';
import { FileText, Plus, Save, Trash2, Tag, Mic, AlertCircle, HelpCircle, CheckCircle, Pin } from 'lucide-react';
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
    const [category, setCategory] = useState<'doubt' | 'symptom' | 'instruction' | 'general'>('general');
    const [isAdding, setIsAdding] = useState(false);

    const CATEGORIES = [
        { id: 'general', label: 'General', color: 'bg-slate-500', icon: FileText },
        { id: 'doubt', label: 'Duda', color: 'bg-amber-500', icon: HelpCircle },
        { id: 'symptom', label: 'Síntoma', color: 'bg-rose-500', icon: AlertCircle },
        { id: 'instruction', label: 'Instrucción', color: 'bg-emerald-500', icon: CheckCircle }
    ];

    const handleSave = () => {
        if (!content.trim()) return;
        addLog({
            timestamp: Date.now(),
            title: title.trim(),
            content: content.trim(),
            category: category as any
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

                    {/* Category Selector */}
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${category === cat.id
                                    ? 'bg-slate-200 text-slate-900 border-slate-200'
                                    : 'bg-slate-900 border-white/5 text-slate-400'
                                    }`}
                            >
                                <cat.icon size={14} />
                                <span className="text-xs font-bold">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="flex-1 bg-transparent text-lg text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                        placeholder="Escribe aquí los apuntes del pediatra..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </div>

                {/* Footer Save Button */}
                <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur pb-8">
                    <button
                        onClick={handleSave}
                        disabled={!content.trim()}
                        className="w-full py-4 bg-slate-200 text-slate-900 rounded-xl font-bold text-lg shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        Guardar Nota
                    </button>
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
                    [...logs].sort((a,b) => {
                        const aPinned = (a as any).pinned ? 1 : 0;
                        const bPinned = (b as any).pinned ? 1 : 0;
                        if (aPinned !== bPinned) return bPinned - aPinned;
                        return b.timestamp - a.timestamp;
                    }).map((log) => (
                        <div key={log.timestamp} className={`bg-slate-900 border p-4 rounded-xl space-y-2 group relative transition-all ${(log as any).pinned ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : 'border-slate-800'}`}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                                    {(log as any).pinned && <Pin size={12} className="text-blue-400 fill-blue-400" />}
                                    {log.title || 'Sin título'}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => {
                                            const newLogs = logs.map(l => l.timestamp === log.timestamp ? { ...l, pinned: !(l as any).pinned } : l);
                                            localStorage.setItem('nanapp_pediatrician_notes', JSON.stringify(newLogs));
                                            window.location.reload(); // Simple state force for this logic
                                        }}
                                        className={`p-1 rounded hover:bg-white/5 transition-colors ${(log as any).pinned ? 'text-blue-400' : 'text-slate-600'}`}
                                    >
                                        <Pin size={14} className={(log as any).pinned ? 'fill-current' : ''} />
                                    </button>
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
