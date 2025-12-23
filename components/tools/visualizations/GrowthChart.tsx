import React, { useMemo } from 'react';
import { WHO_DATA } from '../../../services/data/whoGrowthData';
import { GrowthLog } from '../types';

interface GrowthChartProps {
    logs: GrowthLog[];
    birthDate: number;
    gender: 'boy' | 'girl' | 'unknown';
    type: 'weight' | 'height';
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ logs, birthDate, gender, type }) => {
    // 1. Prepare Data Points for User
    const userPoints = useMemo(() => {
        return logs
            .map(log => {
                const ageMonths = (log.timestamp - birthDate) / (1000 * 60 * 60 * 24 * 30.44); // Approx month
                const val = type === 'weight' ? log.weightKg : log.heightCm;
                return { age: ageMonths, val };
            })
            .filter(p => p.val !== undefined && p.age >= 0)
            .sort((a, b) => a.age - b.age);
    }, [logs, birthDate, type]);

    // 2. Determine Chart Domain (X: Age Month, Y: Value)
    const maxUserAge = userPoints.length > 0 ? userPoints[userPoints.length - 1].age : 0;
    const maxAge = Math.max(12, Math.ceil(maxUserAge) + 2); // At least 12 months, or 2 months past last log.

    // WHO Data Key
    const whoKey = gender === 'unknown' ? 'boys' : gender;
    const whoProp = type === 'weight' ? 'weight' : 'length'; // WHO calls height 'length'
    const standard = WHO_DATA[whoKey][whoProp];

    // Filter Standard Data to current View Window
    const chartData = standard.filter(d => d[0] <= maxAge);

    // Calculate Y Domain
    // Find min and max from WHO P3/P97 in the range
    let minY = chartData[0][1]; // P3 of first
    let maxY = chartData[chartData.length - 1][5]; // P97 of last

    // Extend if user data is out of bounds
    userPoints.forEach(p => {
        if (p.val! < minY) minY = p.val!;
        if (p.val! > maxY) maxY = p.val!;
    });

    // Add Buffer Y
    const yBuffer = (maxY - minY) * 0.1;
    minY = Math.max(0, minY - yBuffer);
    maxY = maxY + yBuffer;

    // Dimensions
    const width = 300;
    const height = 180;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Scales
    const scaleX = (age: number) => (age / maxAge) * chartW;
    const scaleY = (val: number) => chartH - ((val - minY) / (maxY - minY)) * chartH;

    // Helper to generic line path
    const createPath = (points: { x: number, y: number }[]) => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    };

    // Generate Paths for Percentiles
    // Data format: [Month, P3, P15, P50, P85, P97]
    const lineP3 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[1]) })));
    const lineP15 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[2]) })));
    const lineP50 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[3]) })));
    const lineP85 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[4]) })));
    const lineP97 = createPath(chartData.map(d => ({ x: scaleX(d[0]), y: scaleY(d[5]) })));

    // Generate Path for User
    const lineUser = userPoints.length > 0
        ? createPath(userPoints.map(p => ({ x: scaleX(p.age), y: scaleY(p.val!) })))
        : '';

    return (
        <div className="w-full relative select-none">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
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

                    {/* Grid Lines Vert (Months) */}
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

                    {/* Areas */}
                    {/* Fill Area P3-P97 (Safe Zone) */}
                    <path
                        d={`${lineP97} L ${scaleX(chartData[chartData.length - 1][0])} ${scaleY(chartData[chartData.length - 1][1])} ${createPath(chartData.slice().reverse().map(d => ({ x: scaleX(d[0]), y: scaleY(d[1]) }))).replace('M', 'L')} Z`}
                        fill={type === 'weight' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(20, 184, 166, 0.05)'}
                        stroke="none"
                    />

                    {/* Percentile Lines */}
                    <path d={lineP3} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d={lineP97} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d={lineP50} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

                    <text x={scaleX(maxAge) - 5} y={scaleY(chartData[chartData.length - 1][3]) - 5} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="end">Average</text>

                    {/* User Line */}
                    {userPoints.length > 0 && (
                        <>
                            <path d={lineUser} fill="none" stroke={type === 'weight' ? '#34d399' : '#2dd4bf'} strokeWidth="3" strokeLinecap="round" />
                            {userPoints.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={scaleX(p.age)}
                                    cy={scaleY(p.val!)}
                                    r="3"
                                    fill="#0f172a"
                                    stroke={type === 'weight' ? '#34d399' : '#2dd4bf'}
                                    strokeWidth="2"
                                />
                            ))}
                        </>
                    )}
                </g>
            </svg>
        </div>
    );
};
