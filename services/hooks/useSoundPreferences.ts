import { useState, useEffect } from 'react';

// Default order of sounds
export const DEFAULT_ACTIVE_SOUNDS = [
    'WHITE_NOISE', 'RAIN', 'BROWN_NOISE', 'OCEAN',
    'HAIR_DRYER', 'SHUSH', 'WAVES', 'LULLABY'
];

export const AVAILABLE_SOUNDS = [
    // Original 8
    'WHITE_NOISE', 'RAIN', 'BROWN_NOISE', 'OCEAN',
    'HAIR_DRYER', 'SHUSH', 'WAVES', 'LULLABY',
    // New 8 (Placeholders for now)
    'TRAIN', 'CAT_PURR', 'FIREPLACE', 'FOREST',
    'NIGHT_CRICKETS', 'STREAM', 'FAN', 'HEARTBEAT'
];

export function useSoundPreferences() {
    const [activeSoundIds, setActiveSoundIds] = useState<string[]>(DEFAULT_ACTIVE_SOUNDS);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('nanapp_active_sounds');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActiveSoundIds(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load sound prefs", e);
        }
    }, []);

    // Save to LocalStorage whenever changes
    useEffect(() => {
        localStorage.setItem('nanapp_active_sounds', JSON.stringify(activeSoundIds));
    }, [activeSoundIds]);

    const toggleSoundVisibility = (soundId: string) => {
        if (activeSoundIds.includes(soundId)) {
            // Remove (if not the last one, to avoid empty screen)
            if (activeSoundIds.length > 1) {
                setActiveSoundIds(prev => prev.filter(id => id !== soundId));
            }
        } else {
            // Add
            setActiveSoundIds(prev => [...prev, soundId]);
        }
    };

    const reorderSounds = (newOrder: string[]) => {
        setActiveSoundIds(newOrder);
    };

    return {
        activeSoundIds,
        availableSoundIds: AVAILABLE_SOUNDS,
        toggleSoundVisibility,
        reorderSounds
    };
}
