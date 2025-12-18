import { useState, useCallback } from 'react';
import { ToolId } from '../../components/tools/types';

export const useToolData = <T extends { timestamp: number }>(toolId: ToolId) => {
    const STORAGE_KEY = `dw_tool_data_${toolId}`;

    const [logs, setLogs] = useState<T[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error(`Error loading data for ${toolId}`, e);
            return [];
        }
    });

    const addLog = useCallback((newLog: Omit<T, 'timestamp'> & { timestamp?: number }) => {
        setLogs(prev => {
            const logEntry = {
                ...newLog,
                timestamp: newLog.timestamp || Date.now()
            } as T;

            // Prepend new log (newest first)
            const updated = [logEntry, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, [STORAGE_KEY]);

    const getLatestLog = useCallback(() => {
        return logs.length > 0 ? logs[0] : null;
    }, [logs]);

    const getLogsByDate = useCallback((date: Date = new Date()) => {
        const start = new Date(date).setHours(0, 0, 0, 0);
        const end = new Date(date).setHours(23, 59, 59, 999);
        return logs.filter(l => l.timestamp >= start && l.timestamp <= end);
    }, [logs]);

    return {
        logs,
        addLog,
        getLatestLog,
        getLogsByDate
    };
};
