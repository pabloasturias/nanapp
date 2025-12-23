import React, { useState } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { AppointmentLog } from './types';

export const AgendaDashboard: React.FC = () => {
    const { logs } = useToolData<AppointmentLog>('medical_agenda');

    // Find next future appointment
    const upcoming = logs
        .filter(l => l.timestamp > Date.now())
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
    const { logs, addLog } = useToolData<AppointmentLog>('medical_agenda');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSave = () => {
        if (!date || !reason) return;
        addLog({
            timestamp: new Date(date).getTime(),
            reason,
            completed: false
        });
        setDate('');
        setReason('');
    };

    const upcoming = logs.filter(l => l.timestamp >= Date.now()).sort((a, b) => a.timestamp - b.timestamp);
    const past = logs.filter(l => l.timestamp < Date.now()).sort((a, b) => b.timestamp - a.timestamp);

    const downloadIcs = (log: AppointmentLog) => {
        const startDate = new Date(log.timestamp);
        const endDate = new Date(log.timestamp + 60 * 60 * 1000); // Assume 1 hour default
        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${log.reason}`,
            `DESCRIPTION:Cita médica registrada en Nanapp`,
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

    return (
        <div className="flex flex-col h-full p-6">

            {/* Add New */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nueva Cita</h4>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mb-3 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Motivo (ej: Vacunas 4m)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mb-3 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleSave}
                    disabled={!date || !reason}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${date && reason ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'}`}
                >
                    Agendar
                </button>
            </div>

            {/* Lists */}
            <div className="flex-1 overflow-y-auto">
                {upcoming.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Próximas</h3>
                        <div className="space-y-2">
                            {upcoming.map((l, i) => (
                                <div key={i} className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 text-center bg-blue-500/20 rounded-lg p-1">
                                            <p className="text-xs font-bold text-blue-300">{new Date(l.timestamp).getDate()}</p>
                                            <p className="text-[10px] text-blue-400 uppercase">{new Date(l.timestamp).toLocaleDateString([], { month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-blue-100">{l.reason}</p>
                                            <p className="text-xs text-blue-400/70">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                if ("Notification" in window) {
                                                    Notification.requestPermission().then(permission => {
                                                        if (permission === "granted") {
                                                            new Notification("Recordatorio Nanapp", {
                                                                body: `Cita médica: ${l.reason} - ${new Date(l.timestamp).toLocaleString()}`,
                                                                icon: '/pwa-192x192.png' // Fallback icon path
                                                            });
                                                        }
                                                    });
                                                }
                                            }}
                                            className="p-2 text-blue-400 hover:text-white bg-blue-500/20 hover:bg-blue-500 rounded-lg transition-colors"
                                            title="Recordarme (Notificación)"
                                        >
                                            <Clock size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const startDate = new Date(l.timestamp);
                                                const endDate = new Date(l.timestamp + 60 * 60 * 1000);
                                                const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
                                                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(l.reason)}&dates=${format(startDate)}/${format(endDate)}&details=${encodeURIComponent('Cita médica registrada en Nanapp')}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="p-2 text-blue-400 hover:text-white bg-blue-500/20 hover:bg-blue-500 rounded-lg transition-colors"
                                            title="Añadir a Google Calendar"
                                        >
                                            <Calendar size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {past.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Pasadas</h3>
                        <div className="space-y-2">
                            {past.map((l, i) => (
                                <div key={i} className="bg-slate-800 border border-white/5 p-3 rounded-xl flex gap-3 items-center opacity-60">
                                    <div className="w-10 text-center bg-slate-700 rounded-lg p-1">
                                        <p className="text-xs font-bold text-slate-300">{new Date(l.timestamp).getDate()}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{new Date(l.timestamp).toLocaleDateString([], { month: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-300">{l.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
