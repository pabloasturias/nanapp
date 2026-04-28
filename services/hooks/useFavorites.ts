import { useState, useEffect } from 'react';
import { SoundType } from '../../types';
import { ToolId } from '../../components/tools/types';

const STORAGE_KEY_FAV_SOUNDS = 'dw_fav_sounds';
const STORAGE_KEY_FAV_TOOLS = 'dw_fav_tools';

const DEFAULT_FAV_SOUNDS: SoundType[] = [SoundType.WHITE_NOISE, SoundType.SHUSH];
const DEFAULT_FAV_TOOLS: ToolId[] = ['breastfeeding', 'meds', 'bottle', 'growth'];

export const useFavorites = () => {
    const [favoriteSounds, setFavoriteSounds] = useState<SoundType[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_FAV_SOUNDS);
            return saved ? JSON.parse(saved) : DEFAULT_FAV_SOUNDS;
        } catch (e) {
            return DEFAULT_FAV_SOUNDS;
        }
    });

    const [favoriteTools, setFavoriteTools] = useState<ToolId[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_FAV_TOOLS);
            return saved ? JSON.parse(saved) : DEFAULT_FAV_TOOLS;
        } catch (e) {
            return DEFAULT_FAV_TOOLS;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FAV_SOUNDS, JSON.stringify(favoriteSounds));
    }, [favoriteSounds]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FAV_TOOLS, JSON.stringify(favoriteTools));
    }, [favoriteTools]);

    const toggleFavoriteSound = (id: SoundType) => {
        setFavoriteSounds(prev => {
            if (prev.includes(id)) {
                return prev.filter(s => s !== id);
            }
            if (prev.length >= 2) {
                // If already 2, replace the first one
                return [prev[1], id];
            }
            return [...prev, id];
        });
    };

    const toggleFavoriteTool = (id: ToolId) => {
        setFavoriteTools(prev => {
            if (prev.includes(id)) {
                return prev.filter(t => t !== id);
            }
            if (prev.length >= 4) {
                // If already 4, replace the first one
                return [...prev.slice(1), id];
            }
            return [...prev, id];
        });
    };

    return {
        favoriteSounds,
        favoriteTools,
        toggleFavoriteSound,
        toggleFavoriteTool
    };
};
