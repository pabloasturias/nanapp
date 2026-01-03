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
    | 'vaccines'

    | 'pumping'
    | 'pediatrician_notes'
    | 'milestones'
    | 'medical_agenda'
    | 'first_words'
    | 'routines'
    | 'head_position'
    | 'endocrine_info';

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
    babyId?: string; // Optional for backward compatibility
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



// --- Batch 3: Activity & Feeding ---

export interface PumpingLog {
    timestamp: number;
    amountMl: number;
    durationSeconds: number;
    side: 'L' | 'R' | 'double';
}

export interface SolidsLog {
    timestamp: number;
    food: string;
    reaction: 'love' | 'ok' | 'hate' | 'allergy';
    amount?: 'taste' | 'meal';
    notes?: string;
}


// --- Batch 4: Lists & Memories ---

export interface VaccineLog {
    timestamp: number; // Date administered
    vaccineName: string;
    doseNumber?: number;
    completed?: boolean;
    babyId?: string;
}

export interface MilestoneLog {
    timestamp: number;
    milestoneId: string; // 'smile', 'roll', etc
    note?: string;
    babyId?: string;
}

export interface TeethingLog {
    timestamp: number;
    toothId: string; // 'incisor_upper_left', etc
}

export interface NoteLog {
    timestamp: number;
    title?: string;
    content: string;
}

export interface AppointmentLog {
    timestamp: number; // Date of appointment
    doctorName?: string;
    reason: string;
    completed: boolean;
    babyId?: string;
}

export interface FirstWordsLog {
    timestamp: number;
    word: string; // "Agua"
    pronunciation?: string; // "Aba"
    notes?: string; // "Dicho en la bañera"
}

export interface RoutineLog {
    timestamp: number; // Created timestamp
    startTime: string; // "08:00"
    activity: string; // "Desayuno"
    icon?: string; // lucide icon name? or category
    babyId?: string;
}

export interface HeadPositionLog {
    timestamp: number;
    side: 'left' | 'right' | 'back';
    babyId?: string;
}



export interface SoundLog {
    timestamp: number;
    title: string;
    durationSeconds: number;
    audioUrl?: string; // Blob URL? Note: LocalStorage has limit. 
    // Storing audio in localStorage is BAD. 
    // Realistically, for this demo, we might skip actual audio blob storage 
    // or store very short clips as base64 (risk of quota exceeded).
    // Better: Just "Log a memory" description for now, or use IndexedDB (too complex for this agent context?).
    // I will try to implement a simple "Microphone" record that saves to a temporary blob URL 
    // (active session only) but warns about persistence, 
    // OR just use it as a "Quote/Sound Log" (Text describing the sound).
    // Let's stick to "Transcript/Description" to be safe on storage, or very short base64.
}

