import { LucideIcon } from 'lucide-react';

export type ToolId =
    | 'breastfeeding'
    | 'bottle'
    | 'diapers'
    | 'sleep'
    | 'meds'
    | 'growth'
    | 'teething'
    | 'solids'
    | 'tummy_time'
    | 'bath'
    | 'vaccines'
    | 'fever'
    | 'pumping'
    | 'pediatrician_notes'
    | 'milestones'
    | 'sound_memories'
    | 'medical_agenda'
    | 'head_circumference';

export interface ToolDefinition {
    id: ToolId;
    icon: any; // LucideIcon
    translationKey: string;
    color: string; // Tailwind color class (e.g., 'text-pink-400')
    bgColor: string; // Tailwind bg class (e.g., 'bg-pink-500/10')
}

export interface ToolData {
    id: string; // Unique instance ID (for future multiple babies support?) OR just toolId
    timestamp: number;
    [key: string]: any;
}
