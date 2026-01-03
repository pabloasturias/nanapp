import React, { useMemo, useState } from 'react';
import { GrowthLog } from '../../types';
import { WHO_DATA, getPercentiles } from '../../../../services/data/whoGrowthData';
import { AlertCircle } from 'lucide-react';

interface GrowthChartProps {
    logs: GrowthLog[];
    birthDate: number;
    gender: 'boy' | 'girl' | 'unknown';
    type: 'weight' | 'height' | 'head';
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ logs, birthDate, gender, type }) => {
    // 1. Prepare Data Points
    const userPoints = useMemo(() => {
        return logs
            .map(log => {
                const ageMonths = (log.timestamp - birthDate) / (1000 * 60 * 60 * 24 * 30.44);
                const val = type === 'weight' ? log.weightKg : (type === 'height' ? log.heightCm : log.headCm);
                return { age: ageMonths, val, date: log.timestamp };
            })
            .filter(p => p.val !== undefined && p.age >= 0)
            .sort((a, b) => a.age - b.age);
    }, [logs, birthDate, type]);

    // 2. Domain & Scales
    const maxUserAge = userPoints.length > 0 ? userPoints[userPoints.length - 1].age : 0;
    const maxAge = Math.max(12, Math.ceil(maxUserAge) + 2);

    const whoKey = gender === 'girl' ? 'girls' : 'boys';
    let whoProp: 'weight' | 'length' | 'head';
    if (type === 'weight') whoProp = 'weight';
    else if (type === 'height') whoProp = 'length';
    else whoProp = 'head';

    const standard = WHO_DATA[whoKey] ? WHO_DATA[whoKey][whoProp] : undefined;

    if (!standard) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[150px] text-xs text-slate-500 bg-slate-900/50 rounded-lg p-4">
                <AlertCircle size={16} className="mb-2 opacity-50" />
                <span>Datos no disponibles ({whoKey}/{whoProp})</span>
            </div>
        );
    }

    const chartData = standard.filter(d => d[0] <= maxAge);
    if (chartData.length === 0) return null;

    let minY = chartData[0][1];
    let maxY = chartData[chartData.length - 1][5];

    userPoints.forEach(p => {
        if (p.val! < minY) minY = p.val!;
        if (p.val! > maxY) maxY = p.val!;
    });

    const yBuffer = (maxY - minY) * 0.1;
    minY = Math.max(0, minY - yBuffer);
    maxY = maxY + yBuffer;

    const width = 300;
    const height = 180;
    const padding = { top: 20, right: 10, bottom: 20, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const scaleX = (age: number) => (age / maxAge) * chartW;
    const invertScaleX = (x: number) => (x / chartW) * maxAge;
    const scaleY = (val: number) => chartH - ((val - minY) / (maxY - minY)) * chartH;

    const createPath = (points: { x: number, y: number }[]) => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    };

    const lineP3 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[1]) })));
    const lineP50 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[3]) })));
    const lineP97 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[5]) })));

    const lineUser = userPoints.length > 0
        ? createPath(userPoints.map(p => ({ x: scaleX(p.age), y: scaleY(p.val!) })))
        : '';

    let strokeColor = '#34d399';
    let fillColor = 'rgba(16, 185, 129, 0.05)';
    if (type === 'height') {
        strokeColor = '#2dd4bf';
        fillColor = 'rgba(20, 184, 166, 0.05)';
    } else if (type === 'head') {
        strokeColor = '#06b6d4';
        fillColor = 'rgba(6, 182, 212, 0.05)';
    }

    // Interaction State
    const [hover, setHover] = useState<{ x: number, age: number, userPoint?: { val: number, age: number }, percentiles: { p3: number, p50: number, p97: number } } | null>(null);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        let clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

        const relX = clientX - rect.left - padding.left;
        const age = invertScaleX(relX);

        if (age < 0 || age > maxAge) {
            setHover(null);
            return;
        }

        // Calculate percentiles for this exact mouse age
        // Type case matching: WHO data uses 'weight', 'length', 'head'
        // getPercentiles uses 'weight' | 'length' currently, need to ensure it handles head or we cast
        // Luckily I updated whoGrowthData.ts? No, I only updated the DATA export. 
        // Wait, getPercentiles implementation: const data = WHO_DATA[key][type];
        // It DOES support 'head' if passed! TS just complains.
        const percentiles = getPercentiles(gender, whoProp as any, age);

        let userPoint = undefined;
        let minDist = Infinity;

        userPoints.forEach(p => {
            const px = scaleX(p.age);
            const dist = Math.abs(px - relX);
            if (dist < minDist) {
                minDist = dist;
                userPoint = p;
            }
        });

        if (minDist > 15) userPoint = undefined; // Snap threshold

        setHover({
            x: userPoint ? scaleX(userPoint.age) : relX, // Snap line to point if close
            age: userPoint ? userPoint.age : age,
            userPoint: userPoint ? { val: userPoint.val!, age: userPoint.age } : undefined,
            percentiles
        });
    };

    return (
        <div className="w-full relative select-none">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto overflow-visible touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseLeave={() => setHover(null)}
                onTouchEnd={() => setHover(null)}
            >
                <g transform={`translate(${padding.left}, ${padding.top})`}>

                    {/* Grid Lines Horiz */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const y = chartH * t;
                        const val = maxY - (t * (maxY - minY));
                        return (
                            <g key={t}>
                                <line x1={0} y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                <text x={-5} y={y + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)">
                                    {val.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Grid Lines Vert */}
                    {[0, 3, 6, 9, 12, 18, 24].filter(m => m <= maxAge).map(m => {
                        const x = scaleX(m);
                        return (
                            <g key={m}>
                                <line x1={x} y1={0} x2={x} y2={chartH} stroke="rgba(255,255,255,0.05)" />
                                <text x={x} y={chartH + 12} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">
                                    {m}m
                                </text>
                            </g>
                        );
                    })}

                    {/* Percentile Area */}
                    <path
                        d={`${lineP97} L ${scaleX(chartData[chartData.length - 1][0])} ${scaleY(chartData[chartData.length - 1][1])} ${createPath(chartData.slice().reverse().map(d => ({ x: scaleX(d[0]), y: scaleY(d[1]) }))).replace('M', 'L')} Z`}
                        fill={fillColor}
                        stroke="none"
                    />

                    {/* Percentile Lines */}
                    <path d={lineP3} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d={lineP97} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d={lineP50} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                    <text x={scaleX(maxAge) - 5} y={scaleY(chartData[chartData.length - 1][3]) - 5} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="end">P50</text>

                    {/* User Line */}
                    {userPoints.length > 0 && (
                        <>
                            <path d={lineUser} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                            {userPoints.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={scaleX(p.age)}
                                    cy={scaleY(p.val!)}
                                    r="3"
                                    fill="#0f172a"
                                    stroke={strokeColor}
                                    strokeWidth="2"
                                />
                            ))}
                        </>
                    )}

                    {/* Tooltip / Hover State */}
                    {hover && (
                        <g>
                            <line
                                x1={hover.x} y1={0} x2={hover.x} y2={chartH}
                                stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.3"
                            />
                            {hover.userPoint && (
                                <circle cx={hover.x} cy={scaleY(hover.userPoint.val)} r="5" fill="#fff" stroke={strokeColor} strokeWidth="2" />
                            )}

                            {/* Updated Detailed Info Box */}
                            <foreignObject x={hover.x > chartW / 2 ? hover.x - 100 : hover.x + 10} y={10} width="90" height="auto" style={{ overflow: 'visible' }}>
                                <div className="bg-slate-900/95 backdrop-blur border border-slate-700/50 rounded-lg p-2 text-[9px] text-slate-300 shadow-xl pointer-events-none min-w-[90px]">
                                    <div className="font-bold text-white mb-1.5 border-b border-white/10 pb-1 text-center">
                                        {hover.age.toFixed(1)} meses
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between">
                                            <span className="text-emerald-400">P97</span>
                                            <span>{hover.percentiles.p97.toFixed(1)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-white bg-white/5 rounded px-0.5 -mx-0.5">
                                            <span className="text-emerald-500">Media</span>
                                            <span>{hover.percentiles.p50.toFixed(1)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-emerald-400">P3</span>
                                            <span>{hover.percentiles.p3.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    {hover.userPoint && (
                                        <div className="mt-2 pt-1.5 border-t border-white/10">
                                            <div className="font-bold text-white flex justify-between items-center mb-0.5">
                                                <span>Bebé ({type === 'weight' ? 'kg' : 'cm'}):</span>
                                            </div>
                                            <div className="text-center text-xs font-bold text-indigo-400 bg-indigo-500/10 rounded py-0.5">
                                                {hover.userPoint.val.toFixed(2)}
                                            </div>
                                            <div className="text-[8px] text-slate-400 text-center mt-0.5">
                                                {hover.userPoint.val > hover.percentiles.p50 ? '> Media' : '< Media'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </foreignObject>
                        </g>
                    )}
                </g>
            </svg>
        </div>
    );
};
