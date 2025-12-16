import { useState, useEffect } from 'react';
import { SoundType } from '../../types';

export interface Statistics {
    totalSessions: number;
    totalPlayTimeMinutes: number;
    mostUsedSound: SoundType | null;
    soundUsage: Record<string, number>; // SoundID -> Minutes played
}

const INITIAL_STATS: Statistics = {
    totalSessions: 0,
    totalPlayTimeMinutes: 0,
    mostUsedSound: null,
    soundUsage: {},
};

export const useStatistics = () => {
    const [stats, setStats] = useState<Statistics>(INITIAL_STATS);

    useEffect(() => {
        const savedStats = localStorage.getItem('nanapp_stats');
        if (savedStats) {
            try {
                setStats(JSON.parse(savedStats));
            } catch (e) {
                console.error("Failed to parse stats", e);
            }
        }
    }, []);

    const saveStats = (newStats: Statistics) => {
        setStats(newStats);
        localStorage.setItem('nanapp_stats', JSON.stringify(newStats));
    };

    const logSession = (durationSeconds: number, soundId: SoundType) => {
        if (durationSeconds < 10) return; // Ignore very short sessions

        const minutes = Math.ceil(durationSeconds / 60);

        const newStats = { ...stats };
        newStats.totalSessions += 1;
        newStats.totalPlayTimeMinutes += minutes;

        // Update sound usage
        newStats.soundUsage[soundId] = (newStats.soundUsage[soundId] || 0) + minutes;

        // Recalculate interesting sound
        let maxMinutes = 0;
        let favSound: SoundType | null = newStats.mostUsedSound;

        Object.entries(newStats.soundUsage).forEach(([id, mins]) => {
            const minutes = mins as number;
            if (minutes > maxMinutes) {
                maxMinutes = minutes;
                favSound = id as SoundType;
            }
        });
        newStats.mostUsedSound = favSound;

        saveStats(newStats);
    };

    return {
        stats,
        logSession
    };
};
