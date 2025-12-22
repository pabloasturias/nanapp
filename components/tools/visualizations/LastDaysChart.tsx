import React, { useMemo } from 'react';

export interface StreakData {
    timestamp: number;
    status: 'completed' | 'missed' | 'none';
}

interface LastDaysChartProps {
    data: StreakData[];
    days?: number; // Default 7
    label?: string;
}

export const LastDaysChart: React.FC<LastDaysChartProps> = ({ data, days = 7, label }) => {

    // Generate last N days
    const daySlots = useMemo(() => {
        const slots = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Check if there is data for this date
            const start = date.getTime();
            const end = start + 86400000;

            const match = data.find(d => d.timestamp >= start && d.timestamp < end);

            slots.push({
                date,
                status: match ? match.status : 'none',
                dayLabel: date.toLocaleDateString(undefined, { weekday: 'narrow' }) // L, M, X... or S, M, T...
            });
        }
        return slots;
    }, [data, days]);

    return (
        <div className="w-full bg-slate-900/40 p-3 rounded-xl border border-white/5">
            {label && <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">{label}</p>}
            <div className="flex justify-between items-center px-1">
                {daySlots.map((slot, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${slot.status === 'completed'
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : slot.status === 'missed'
                                    ? 'bg-red-500/20 text-red-500 border-red-500/30'
                                    : 'bg-slate-800 border-slate-700 text-slate-600'
                            }`}>
                            {slot.status === 'completed' && <div className="w-4 h-4 rounded-full bg-white" />}
                            {/* {slot.status === 'none' && <div className="w-1 h-1 rounded-full bg-slate-600"/>} */}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{slot.dayLabel}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
