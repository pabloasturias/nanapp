import React from 'react';

export enum SoundType {
  WHITE_NOISE = 'WHITE_NOISE',
  RAIN = 'RAIN',
  BROWN_NOISE = 'BROWN_NOISE',
  OCEAN = 'OCEAN',
  HAIR_DRYER = 'HAIR_DRYER',
  LULLABY = 'LULLABY',
  SHUSH = 'SHUSH',
  WAVES = 'WAVES'
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