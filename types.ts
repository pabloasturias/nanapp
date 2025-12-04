
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
  iconName: string; // Key for Lucide icon lookup
  description: string;
}

export interface TimerOption {
  minutes: number;
  label: string;
}
