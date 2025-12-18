import { useState, useEffect } from 'react';
import { ToolId } from '../../components/tools/types';

const STORAGE_KEY_ACTIVE_TOOLS = 'dw_tools_active';

const DEFAULT_TOOLS: ToolId[] = ['breastfeeding', 'diapers', 'meds'];

export const useTools = () => {
    const [activeTools, setActiveTools] = useState<ToolId[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TOOLS);
            return saved ? JSON.parse(saved) : DEFAULT_TOOLS;
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
