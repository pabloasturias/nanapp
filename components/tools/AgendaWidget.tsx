import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Plus, Clock, Trash2, Settings } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { AppointmentLog } from './types';
import { useBaby } from '../../services/BabyContext';

export const AgendaDashboard: React.FC = () => {
    const { logs } = useToolData<AppointmentLog>('medical_agenda');
    const { activeBaby } = useBaby();

    // Find next future appointment for active baby
    const upcoming = logs
        .filter(l => l.timestamp > Date.now() && (!l.babyId || (activeBaby && l.babyId === activeBaby.id)))
        .sort((a, b) => a.timestamp - b.timestamp)[0];

    if (!upcoming) return <span className="opacity-60">Sin citas</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-blue-200 truncate">
                {new Date(upcoming.timestamp).toLocaleDateString()}
            </span>
            <span className="text-[10px] opacity-70 truncate">
                {upcoming.reason}
            </span>
        </div>
    );
};

export const AgendaFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog, removeLog } = useToolData<AppointmentLog>('medical_agenda');
    const { activeBaby, babies, setActiveBabyId } = useBaby();

    const [viewBabyId, setViewBabyId] = useState<string | null>(activeBaby?.id || null);

    // Form State
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [reminder, setReminder] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Selected baby for new event (default to viewBabyId)
    const [eventBabyId, setEventBabyId] = useState<string | null>(null);

    useEffect(() => {
        if (activeBaby && !viewBabyId) setViewBabyId(activeBaby.id);
    }, [activeBaby]);

    // When opening add modal, set eventBabyId to current view
    useEffect(() => {
        if (isAdding && !eventBabyId && viewBabyId) {
            setEventBabyId(viewBabyId);
        }
    }, [isAdding, viewBabyId]);

    const currentBaby = babies.find(b => b.id === viewBabyId) || babies[0];

    const babyLogs = useMemo(() => {
        if (!currentBaby) return [];
        return logs.filter(l => !l.babyId || l.babyId === currentBaby.id);
    }, [logs, currentBaby]);

    const handleSave = () => {
        if (!date || !reason || !eventBabyId) return;

        const timestamp = new Date(date).getTime();

        addLog({
            timestamp,
            reason,
            completed: false,
            babyId: eventBabyId
        });

        if (reminder && "Notification" in window) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Recordatorio Configurado", {
                        body: `Te avisaremos para: ${reason}`,
                        icon: '/pwa-192x192.png'
                    });

                    const timeUntil = timestamp - Date.now();
                    // Schedule notification if within reasonable time
                    if (timeUntil > 0 && timeUntil < 24 * 60 * 60 * 1000) { // Limit to 24h for simple timeout
                        setTimeout(() => {
                            new Notification("Agenda Nanapp", {
                                body: `Es hora de: ${reason}`,
                                icon: '/pwa-192x192.png'
                            });
                        }, timeUntil);
                    }
                }
            });
        }

        setDate('');
        setReason('');
        setReminder(false);
        setIsAdding(false);
    };

    const upcoming = babyLogs.filter(l => l.timestamp >= Date.now()).sort((a, b) => a.timestamp - b.timestamp);
    const past = babyLogs.filter(l => l.timestamp < Date.now()).sort((a, b) => b.timestamp - a.timestamp);

    const downloadIcs = (log: AppointmentLog) => {
        const startDate = new Date(log.timestamp);
        const endDate = new Date(log.timestamp + 60 * 60 * 1000); // 1 hour default
        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${log.reason}`,
            `DESCRIPTION:Agendado desde Nanapp`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${log.reason.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isAdding) {
        return (
            <div className="flex flex-col h-full bg-slate-950 absolute inset-0 z-50">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900">
                    <button onClick={() => setIsAdding(false)} className="text-slate-400 font-medium">Cancelar</button>
                    <h3 className="font-bold text-white">Nuevo Evento</h3>
                    <button
                        onClick={handleSave}
                        disabled={!date || !reason || !eventBabyId}
                        className={`font-bold px-4 py-1.5 rounded-full transition-colors ${date && reason ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-600'}`}
                    >
                        Guardar
                    </button>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    {/* Baby Selector for Event */}
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Calendario de:</span>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {babies.map(baby => (
                                <button
                                    key={baby.id}
                                    onClick={() => setEventBabyId(baby.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${eventBabyId === baby.id
                                        ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                                        : 'bg-slate-800 border-transparent text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${activeBaby?.id === baby.id ? 'bg-white text-blue-900' : 'bg-slate-700 text-slate-300'}`}>
                                        {baby.name[0]}
                                    </div>
                                    <span className="font-bold text-sm">{baby.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Añade un título"
                            className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 focus:outline-none border-b border-slate-800 focus:border-blue-500 pb-2 transition-colors"
                            autoFocus
                        />

                        <div className="bg-slate-900 rounded-xl p-4 border border-white/5 space-y-4">
                            <div className="flex items-center gap-4 text-slate-300">
                                <Clock size={20} className="text-blue-400" />
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="bg-transparent text-white focus:outline-none flex-1 font-medium text-lg"
                                />
                            </div>

                            <div
                                className="flex items-center gap-4 text-slate-300 cursor-pointer pt-2 border-t border-white/5"
                                onClick={() => setReminder(!reminder)}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${reminder ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-600'}`}>
                                    {reminder && <Plus size={14} className="rotate-45" />}
                                </div>
                                <span className={reminder ? 'text-blue-400 font-bold' : 'text-slate-400'}>Notificarme al momento</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 relative">
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
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${baby.gender === 'girl' ? 'bg-pink-100/20 text-pink-100' : 'bg-blue-100/20 text-blue-100'}`}>
                                    {baby.name[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold">{baby.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* UPCOMING EVENTS */}
                {upcoming.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest px-1 sticky top-0 bg-slate-950/80 backdrop-blur py-2 z-10">Agenda</h3>
                        {upcoming.map((l, i) => {
                            const eventDate = new Date(l.timestamp);
                            const isToday = eventDate.toDateString() === new Date().toDateString();

                            return (
                                <div key={l.timestamp} className="flex gap-4 group">
                                    {/* Time Column */}
                                    <div className="flex flex-col items-center pt-1 min-w-[3rem]">
                                        <span className="text-xs font-bold text-slate-400">
                                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="w-0.5 h-full bg-slate-800/50 my-2 rounded-full"></div>
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg relative">
                                        {/* Color Strip */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

                                        <div className="p-4 pl-5">
                                            {isToday && <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full mb-2 inline-block">HOY</span>}
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-lg leading-tight">{l.reason}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Borrar este evento?')) {
                                                            removeLog(item => item.timestamp === l.timestamp);
                                                        }
                                                    }}
                                                    className="pl-2 text-slate-600 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-4">{eventDate.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</p>

                                            <button
                                                onClick={() => downloadIcs(l)}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                                            >
                                                <Calendar size={18} />
                                                Añadir al Calendario
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* PAST EVENTS */}
                {past.length > 0 && (
                    <div className="space-y-3 pt-8">
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Pasados</h3>
                        {past.map((l, i) => (
                            <div key={l.timestamp} className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                                <div className="flex flex-col items-center pt-1 min-w-[3rem]">
                                    <span className="text-xs font-bold text-slate-500 grayscale">
                                        {new Date(l.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex-1 bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
                                    <span className="font-bold text-slate-400 line-through decoration-slate-600">{l.reason}</span>
                                    <button
                                        onClick={() => removeLog(item => item.timestamp === l.timestamp)}
                                        className="text-slate-600 hover:text-rose-500 p-2"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {upcoming.length === 0 && past.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                        <Calendar size={48} className="mb-4 opacity-20" />
                        <p>No hay eventos programados</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsAdding(true)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl shadow-xl shadow-blue-900/50 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 z-40 hover:rotate-90 duration-300"
            >
                <Plus size={32} />
            </button>
        </div>
    );
};
