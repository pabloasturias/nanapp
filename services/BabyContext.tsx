import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BabyProfile {
    id: string;
    name: string;
    birthDate: number; // timestamp
    gender: 'boy' | 'girl' | 'unknown'; // important for percentiles
    themeColor?: string;
}

interface BabyContextType {
    babies: BabyProfile[];
    activeBabyId: string | null;
    activeBaby: BabyProfile | null;
    addBaby: (baby: Omit<BabyProfile, 'id'>) => void;
    updateBaby: (id: string, updates: Partial<BabyProfile>) => void;
    removeBaby: (id: string) => void;
    setActiveBabyId: (id: string) => void;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [babies, setBabies] = useState<BabyProfile[]>([]);
    const [activeBabyId, setActiveBabyId] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const savedBabies = localStorage.getItem('nanapp_babies');
            const savedActiveId = localStorage.getItem('nanapp_active_baby');

            if (savedBabies) {
                const parsed = JSON.parse(savedBabies);
                setBabies(parsed);

                // If we have an active ID saved and it exists, use it.
                // Else if babies exist, pick first.
                // Else null.
                if (savedActiveId && parsed.some((b: BabyProfile) => b.id === savedActiveId)) {
                    setActiveBabyId(savedActiveId);
                } else if (parsed.length > 0) {
                    setActiveBabyId(parsed[0].id);
                }
            } else {
                // Initialize with default empty baby if none exists? 
                // Maybe better to wait for user input, or create a default "Bebé"
                // Let's CREATE a default one to ensure tools work with a birthdate.
                // Actually, let's leave it empty and prompt user.
            }
        } catch (e) {
            console.error("Failed to load babies", e);
        }
    }, []);

    // Persist changes
    useEffect(() => {
        if (babies.length > 0) {
            localStorage.setItem('nanapp_babies', JSON.stringify(babies));
        }
        if (activeBabyId) {
            localStorage.setItem('nanapp_active_baby', activeBabyId);
        }
    }, [babies, activeBabyId]);

    const addBaby = (data: Omit<BabyProfile, 'id'>) => {
        const newBaby: BabyProfile = {
            ...data,
            id: crypto.randomUUID()
        };
        setBabies(prev => {
            const next = [...prev, newBaby];
            if (!activeBabyId) setActiveBabyId(newBaby.id); // Auto select first
            return next;
        });
    };

    const updateBaby = (id: string, updates: Partial<BabyProfile>) => {
        setBabies(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const removeBaby = (id: string) => {
        setBabies(prev => {
            const next = prev.filter(b => b.id !== id);
            if (activeBabyId === id) {
                setActiveBabyId(next.length > 0 ? next[0].id : null);
            }
            return next;
        });
    };

    const activeBaby = babies.find(b => b.id === activeBabyId) || null;

    return (
        <BabyContext.Provider value={{ babies, activeBabyId, activeBaby, addBaby, updateBaby, removeBaby, setActiveBabyId }}>
            {children}
        </BabyContext.Provider>
    );
};

export const useBaby = () => {
    const context = useContext(BabyContext);
    if (!context) throw new Error("useBaby must be used within BabyProvider");
    return context;
};
