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

// --- Specific Log Types ---

export interface BreastfeedingLog {
    timestamp: number; // Start time
    side: 'L' | 'R';
    durationSeconds: number;
    manual?: boolean; // true if added manually (not timer)
}

export interface BottleLog {
    timestamp: number;
    amount: number; // ml
    unit: 'ml' | 'oz'; // default ml
    type: 'formula' | 'breastmilk' | 'cow' | 'water';
}

export interface DiaperLog {
    timestamp: number;
    type: 'wet' | 'dirty' | 'mixed'; // mixed = wet + dirty
    color?: string; // Hex code or label for stool
    notes?: string;
}

export interface MedsLog {
    timestamp: number;
    medName: string; // 'Vitamin D' | 'Apiretal' etc
    dose?: string;
}

// --- Batch 2: Tracking ---

export interface SleepLog {
    timestamp: number; // Start of sleep
    endTime?: number; // If finished
    durationMinutes?: number;
    type: 'nap' | 'night';
    quality?: 'good' | 'bad' | 'ok';
}

export interface GrowthLog {
    timestamp: number;
    weightKg?: number;
    heightCm?: number;
    headCm?: number; // Can be tracked here or separately
}

export interface TemperatureLog {
    timestamp: number;
    temp: number; // Celsius
    note?: string; // "After Meds" etc
}

// --- Batch 3: Activity & Feeding ---

export interface PumpingLog {
    timestamp: number;
    amountMl: number;
    durationSeconds: number;
    side: 'L' | 'R' | 'double';
}

export interface TummyLog {
    timestamp: number;
    durationSeconds: number;
}

export interface BathLog {
    timestamp: number;
    type?: 'sponge' | 'tub';
}

export interface SolidsLog {
    timestamp: number;
    food: string;
    reaction: 'love' | 'ok' | 'hate' | 'allergy';
    amount?: 'taste' | 'meal';
}

