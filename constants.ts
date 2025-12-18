import { SoundType, SoundOption, TimerOption } from './types';
import { ShushIcon } from './components/icons/SoundIcons';
import { CloudRain, Wind, Waves, Disc, Volume2, Music, Zap, TrainFront, PawPrint, Flame, Trees, Moon, Droplets, Fan, Heart, Ghost } from 'lucide-react'; // Added new icons

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
  },
  {
    id: SoundType.TRAIN,
    label: 'Tren',
    Icon: TrainFront,
    description: 'Rítmico y constante'
  },
  {
    id: SoundType.CAT_PURR,
    label: 'Ronroneo',
    Icon: PawPrint,
    description: 'Vibración relajante'
  },
  {
    id: SoundType.FIREPLACE,
    label: 'Fuego',
    Icon: Flame,
    description: 'Crepitar cálido'
  },
  {
    id: SoundType.FOREST,
    label: 'Bosque',
    Icon: Trees,
    description: 'Naturaleza viva'
  },
  {
    id: SoundType.NIGHT_CRICKETS,
    label: 'Grillos',
    Icon: Moon,
    description: 'Noche tranquila'
  },
  {
    id: SoundType.STREAM,
    label: 'Arroyo',
    Icon: Droplets,
    description: 'Agua fluyendo'
  },
  {
    id: SoundType.FAN,
    label: 'Ventilador',
    Icon: Fan,
    description: 'Zumbido de aire'
  },
  {
    id: SoundType.HEARTBEAT,
    label: 'Latido',
    Icon: Heart,
    description: 'Ritmo vital'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
];