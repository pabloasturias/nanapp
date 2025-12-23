import React, { useMemo } from 'react';
import { useLanguage } from '../../../services/LanguageContext';

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
    const { t } = useLanguage();
    // Current time
    const now = Date.now();

    // Window definition
    const msIn24h = 24 * 60 * 60 * 1000;
    // We want 'Now' to be at ~90% of the chart so the latest bar is visible
    const buffer = msIn24h * 0.1;
    const windowEnd = now + buffer;
    const windowStart = now - (msIn24h - buffer);

    // Filter events in window
    const activeEvents = useMemo(() => {
        return events.filter(e => {
            // Simplified overlap logic
            return e.timestamp >= windowStart;
        });
    }, [events, windowStart]);

    // Calculate position (0 to 100%)
    const getPos = (ts: number) => {
        const p = ((ts - windowStart) / msIn24h) * 100;
        return Math.max(0, Math.min(100, p)); // Clamp
    };

    const getWidth = (ts: number, durSec: number = 0) => {
        const durMs = durSec * 1000;
        // Min width representation (e.g. 2% for instant events of ~30mins scope, but here 24h = 1440mins. 1% is 14mins)
        // Let's set min width to 1.5% for visibility (~20 mins visual width)
        const w = (durMs / msIn24h) * 100;
        return Math.max(1.5, w);
    };

    // Ticks: Every 4 hours relevant to the window
    // We want ticks at nice hours (00:00, 04:00, etc) OR just relative "Now", "-4h".
    // Relative is easier.
    const ticks = [0, 4, 8, 12, 16, 20];

    return (
        <div className="w-full select-none">
            {/* Chart Area */}
            <div className="relative h-24 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">

                {/* Background Grid/Ticks */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Render grid lines manually based on % */}
                    {ticks.map(h => {
                        // h hours ago from NOW.
                        const ts = now - (h * 60 * 60 * 1000);
                        const pos = getPos(ts);
                        return (
                            <div key={h} className="absolute top-0 bottom-0 border-l border-slate-800 text-[9px] text-slate-600 pl-1 flex flex-col justify-end pb-1" style={{ left: `${pos}%` }}>
                                {h === 0 ? t('chart_now') : `-${h}h`}
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
                <span>{t('chart_24h_ago')}</span>
                <span>{t('chart_now')}</span>
            </div>
        </div>
    );
};
