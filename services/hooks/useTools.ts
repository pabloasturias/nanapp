import { useState, useEffect } from 'react';
import { ToolId } from '../../components/tools/types';

const STORAGE_KEY_ACTIVE_TOOLS = 'dw_tools_active';

const DEFAULT_TOOLS: ToolId[] = ['breastfeeding', 'meds', 'medical_agenda', 'growth', 'milestones'];

export const useTools = () => {
    const [activeTools, setActiveTools] = useState<ToolId[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TOOLS);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
            return DEFAULT_TOOLS;
        } catch (e) {
            console.error('Error loading tools', e);
            return DEFAULT_TOOLS;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_ACTIVE_TOOLS, JSON.stringify(activeTools));
    }, [activeTools]);

    const toggleTool = (id: ToolId) => {
        setActiveTools(prev => {
            if (prev.includes(id)) {
                return prev.filter(t => t !== id);
            }
            return [...prev, id];
        });
    };

    const isToolActive = (id: ToolId) => activeTools.includes(id);

    return {
        activeTools,
        toggleTool,
        isToolActive
    };
};
