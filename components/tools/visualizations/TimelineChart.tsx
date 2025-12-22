import React, { useMemo } from 'react';

export interface TimeEvent {
    timestamp: number; // Start time
    durationSeconds?: number;
    color?: string; // Hex or Tailwind class
    label?: string;
    type?: string;
}

interface TimelineChartProps {
    events: TimeEvent[];
    referenceDate?: Date; // Defaults to now
    unit?: '24h' | 'day'; // Rolling 24h or Calendar Day. Default 24h.
    showGhost?: boolean; // Show previous day ghost?
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ events, unit = '24h' }) => {
    // Current time
    const now = Date.now();

    // Window definition
    const msIn24h = 24 * 60 * 60 * 1000;
    const windowEnd = now;
    const windowStart = now - msIn24h;

    // Filter events in window
    const activeEvents = useMemo(() => {
        return events.filter(e => {
            const end = e.timestamp + (e.durationSeconds || 0) * 1000;
            return e.timestamp >= windowStart && e.timestamp <= windowEnd; // Simplified overlap logic
        });
    }, [events, windowStart, windowEnd]);

    // Calculate position (0 to 100%)
    const getPos = (ts: number) => {
        const p = ((ts - windowStart) / msIn24h) * 100;
        return Math.max(0, Math.min(100, p));
    };

    const getWidth = (ts: number, durSec: number = 0) => {
        const durMs = durSec * 1000;
        // Min width representation (e.g. 1% for instant events)
        const w = (durMs / msIn24h) * 100;
        return Math.max(0.5, w); // Min width 0.5%
    };

    // Ticks: Every 4 hours
    const ticks = [];
    for (let i = 0; i <= 24; i += 4) {
        // i hours ago
        const tickTime = windowEnd - (i * 60 * 60 * 1000);
        ticks.push(tickTime);
    }

    return (
        <div className="w-full select-none">
            {/* Chart Area */}
            <div className="relative h-24 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">

                {/* Background Grid/Ticks */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                    {/* Render grid lines manually based on % */}
                    {[0, 4, 8, 12, 16, 20, 24].map(h => {
                        const pos = 100 - (h / 24 * 100);
                        return (
                            <div key={h} className="absolute top-0 bottom-0 border-l border-slate-800 text-[9px] text-slate-600 pl-1" style={{ left: `${pos}%` }}>
                                {h === 0 ? 'Ahora' : `-${h}h`}
                            </div>
                        );
                    })}
                </div>

                {/* Events */}
                {activeEvents.map((ev, i) => (
                    <div
                        key={i}
                        className={`absolute top-1/2 -translate-y-1/2 h-12 rounded-md shadow-sm border border-black/20 ${ev.color || 'bg-blue-500'}`}
                        style={{
                            left: `${getPos(ev.timestamp)}%`,
                            width: `${getWidth(ev.timestamp, ev.durationSeconds)}%`,
                        }}
                        title={ev.label || new Date(ev.timestamp).toLocaleTimeString()}
                    >
                        {ev.label && (getWidth(ev.timestamp, ev.durationSeconds || 0) > 5) && (
                            <span className="text-[9px] font-bold text-white/90 truncate absolute inset-0 flex items-center justify-center p-1">
                                {ev.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                <span>Hace 24h</span>
                <span>Ahora</span>
            </div>
        </div>
    );
};
