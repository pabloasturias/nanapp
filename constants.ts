import { SoundType, SoundOption, TimerOption } from './types';

export const SOUNDS: SoundOption[] = [
  {
    id: SoundType.WHITE_NOISE,
    label: 'Ruido Blanco',
    iconName: 'ZapOff',
    description: 'Aísla ruidos externos'
  },
  {
    id: SoundType.RAIN,
    label: 'Ruido Rosa',
    iconName: 'Flower2',
    description: 'Ruido rosa relajante'
  },
  {
    id: SoundType.BROWN_NOISE,
    label: 'Ruido Marrón',
    iconName: 'Cloud',
    description: 'Profundo y grave'
  },
  {
    id: SoundType.OCEAN,
    label: 'Océano',
    iconName: 'Waves',
    description: 'Ruido marrón rítmico'
  },
  {
    id: SoundType.HAIR_DRYER,
    label: 'Secador',
    iconName: 'Wind',
    description: 'Zumbido cálido'
  },
  {
    id: SoundType.SHUSH,
    label: 'Shh Rítmico',
    iconName: 'Mic2',
    description: 'Sonido calmante humano'
  },
  {
    id: SoundType.WAVES,
    label: 'Olas',
    iconName: 'Waves',
    description: 'Sonido de mar suave'
  },
  {
    id: SoundType.LULLABY,
    label: 'Nana',
    iconName: 'Music',
    description: 'Melodía suave'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
];