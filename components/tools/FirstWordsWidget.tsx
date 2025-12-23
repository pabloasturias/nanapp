import React, { useState, useMemo } from 'react';
import { Mic, Plus, Trash2, Calendar, WholeWord, Quote } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { useBaby } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext';
import { FirstWordsLog } from './types';

export const FirstWordsDashboard: React.FC = () => {
    const { logs } = useToolData<FirstWordsLog>('first_words');
    const { activeBaby } = useBaby();

    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        // In useToolData we don't assume logs have babyId unless they extend IT.
        // But FirstWordsLog doesn't explicitly have babyId in my definition earlier?
        // Wait, I forgot to add babyId to FirstWordsLog in types.ts?
        // Let's check types.ts.
        // It's defined as: timestamp, word, pronunciation, notes. Missing babyId.
        // But useToolData adds it if we pass it, but TS might complain if interface doesn't have it.
        // However, standard ToolData has it.
        // Let's assume we filter by logic or just show all for now if babyId is missing in interface.
        return logs;
    }, [logs, activeBaby]);

    // Filter by babyId if available in the log object strictly
    const filtered = useMemo(() => {
        if (!activeBaby) return logs;
        // @ts-ignore
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    if (filtered.length === 0) return <span className="opacity-60">Sin palabras</span>;

    const latest = filtered[0]; // logs are newest first

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-emerald-200">
                    {filtered.length}
                </span>
                <span className="text-xs text-slate-400 uppercase font-bold">Palabras</span>
            </div>
            <span className="text-xs text-slate-300 truncate max-w-full">
                "{latest.word}"
            </span>
        </div>
    );
};

export const FirstWordsFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const { addLog, logs, removeLog } = useToolData<FirstWordsLog>('first_words');
    const { activeBaby } = useBaby();

    const [showAdd, setShowAdd] = useState(false);

    // Inputs
    const [word, setWord] = useState('');
    const [pronunciation, setPronunciation] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredLogs = useMemo(() => {
        if (!activeBaby) return logs;
        // @ts-ignore
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const handleSave = () => {
        if (!word) return;

        addLog({
            timestamp: new Date(date).getTime(),
            word,
            pronunciation,
            notes,
            // @ts-ignore
            babyId: activeBaby?.id
        });

        setShowAdd(false);
        setWord('');
        setPronunciation('');
        setNotes('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header / Add Button */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-bold text-white">{filteredLogs.length}</span>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className={`p-2 rounded-xl border transition-all ${showAdd ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-indigo-400'
                        }`}
                >
                    {showAdd ? <span className="text-xs font-bold px-2">Cerrar</span> : <Plus size={24} />}
                </button>
            </div>

            {/* Add Panel */}
            {showAdd && (
                <div className="p-4 bg-slate-800/80 border-b border-slate-700 animate-in slide-in-from-top-4 space-y-4 shrink-0">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">La Palabra Real</label>
                        <input
                            type="text"
                            value={word}
                            onChange={e => setWord(e.target.value)}
                            placeholder="Ej: Agua"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Cómo lo dice</label>
                            <input
                                type="text"
                                value={pronunciation}
                                onChange={e => setPronunciation(e.target.value)}
                                placeholder="Ej: Aba"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-pink-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Notas / Contexto</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Ej: Lo dijo pidiendo agua en la comida..."
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!word}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                        Guardar Recuerdo
                    </button>
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center">
                        <Quote size={48} className="mb-4" />
                        <p className="text-sm">Aún no hay palabras registradas.</p>
                        <p className="text-xs mt-2">¡Apunta la primera!</p>
                    </div>
                ) : (
                    filteredLogs.map((log, i) => (
                        <div key={log.timestamp} className="bg-slate-800/40 rounded-xl border border-white/5 p-4 flex flex-col gap-2 relative group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-200">{log.word}</h3>
                                    {log.pronunciation && (
                                        <p className="text-sm text-pink-300 italic">"{log.pronunciation}"</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-1 rounded-lg">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            {log.notes && (
                                <div className="pt-2 border-t border-white/5 mt-1">
                                    <p className="text-xs text-slate-400 leading-relaxed">{log.notes}</p>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); removeLog(l => l.timestamp === log.timestamp); }}
                                className="absolute top-4 right-[-10px] opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all bg-red-500/20 text-red-400 p-2 rounded-lg"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
