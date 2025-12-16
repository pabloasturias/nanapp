import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialDuration: number = 40) => {
    const [duration, setDuration] = useState(initialDuration);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        localStorage.setItem('dw_duration', duration.toString());
    }, [duration]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback((forceReset: boolean = false) => {
        stop();
        if (!isActive) return;

        let initialSeconds;
        if (forceReset || remaining === null || remaining <= 0) {
            initialSeconds = duration * 60;
        } else {
            initialSeconds = remaining;
        }

        setRemaining(initialSeconds);

        intervalRef.current = window.setInterval(() => {
            setRemaining(prev => {
                if (prev === null || prev <= 1) {
                    stop();
                    return null; // Timer finished
                }
                return prev - 1;
            });
        }, 1000);
    }, [duration, remaining, isActive, stop]);

    const adjust = useCallback((deltaMinutes: number) => {
        const newDuration = Math.max(10, duration + deltaMinutes);
        setDuration(newDuration);

        // If running or paused with time left, adjust remaining too
        setRemaining(prev => {
            if (prev !== null) {
                return Math.max(10, prev + (deltaMinutes * 60));
            }
            return null;
        });
    }, [duration]);

    const setTimerDuration = useCallback((minutes: number) => {
        setDuration(minutes);
        // Reset remaining if we set a new duration explicitly? 
        // Current behavior in App.tsx: setRemaining(null) only if not playing/paused?
        // Simplified: Just set duration. Let 'start' handle reset if play is hit.
        // But if we want to reset current state:
        setRemaining(null);
    }, []);

    const toggleActive = useCallback(() => {
        setIsActive(prev => {
            const newState = !prev;
            if (!newState) {
                stop();
                setRemaining(null);
            }
            return newState;
        });
    }, [stop]);

    // Cleanup
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return {
        duration,
        remaining,
        isActive,
        start,
        stop,
        adjust,
        setDuration: setTimerDuration,
        toggleActive
    };
};
