import React from 'react';

export enum SoundType {
  WHITE_NOISE = 'WHITE_NOISE',
  RAIN = 'RAIN',
  BROWN_NOISE = 'BROWN_NOISE',
  OCEAN = 'OCEAN',
  HAIR_DRYER = 'HAIR_DRYER',
  LULLABY = 'LULLABY',
  SHUSH = 'SHUSH',
  WAVES = 'WAVES',
  TRAIN = 'TRAIN',
  CAT_PURR = 'CAT_PURR',
  FIREPLACE = 'FIREPLACE',
  FOREST = 'FOREST',
  NIGHT_CRICKETS = 'NIGHT_CRICKETS',
  STREAM = 'STREAM',
  FAN = 'FAN',
  HEARTBEAT = 'HEARTBEAT'
}

export interface SoundOption {
  id: SoundType;
  label: string;
  Icon: React.ComponentType<{ size?: number | string; strokeWidth?: number; className?: string }>;
  description: string;
}

export interface TimerOption {
  minutes: number;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  url: string;
}