import { SoundType, SoundOption, TimerOption } from './types';
import { ShushIcon } from './components/icons/SoundIcons';
import { CloudRain, Wind, Waves, Disc, Volume2, Music, Zap } from 'lucide-react'; // Using Lucide for others

export const SOUNDS: SoundOption[] = [
  {
    id: SoundType.WHITE_NOISE,
    label: 'Ruido Blanco',
    Icon: Volume2, // Using Volume2 for White Noise or similar
    description: 'Aísla ruidos externos'
  },
  {
    id: SoundType.RAIN,
    label: 'Ruido Rosa',
    Icon: CloudRain,
    description: 'Ruido rosa relajante'
  },
  {
    id: SoundType.BROWN_NOISE,
    label: 'Ruido Marrón',
    Icon: Disc, // Represents Brown Noise
    description: 'Profundo y grave'
  },
  {
    id: SoundType.OCEAN,
    label: 'Océano',
    Icon: Waves,
    description: 'Ruido marrón rítmico'
  },
  {
    id: SoundType.HAIR_DRYER,
    label: 'Secador',
    Icon: Wind,
    description: 'Zumbido cálido'
  },
  {
    id: SoundType.SHUSH,
    label: 'Shh Rítmico',
    Icon: ShushIcon,
    description: 'Sonido calmante humano'
  },
  {
    id: SoundType.WAVES,
    label: 'Olas',
    Icon: Zap, // Waves usually represented by something moving
    description: 'Sonido de mar suave'
  },
  {
    id: SoundType.LULLABY,
    label: 'Nana',
    Icon: Music,
    description: 'Melodía suave'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
];