import { SoundType, SoundOption, TimerOption } from './types';
import { ShushIcon } from './components/icons/SoundIcons';
import { CloudRain, Wind, Waves, Disc, Volume2, Music, Zap, TrainFront, PawPrint, Flame, Trees, Moon, Droplets, Fan, Heart, Speaker, Car, Activity } from 'lucide-react';

export const SOUNDS: SoundOption[] = [
  {
    id: SoundType.WHITE_NOISE,
    label: 'Ruido Blanco',
    Icon: Volume2,
    description: 'Bloquea frecuencias agudas'
  },
  {
    id: SoundType.WAVES,
    label: 'Ruido Rosa',
    Icon: Zap, // Or a better icon for Pink Noise
    description: 'Sonido suave y equilibrado'
  },
  {
    id: SoundType.BROWN_NOISE,
    label: 'Ruido Marrón',
    Icon: Speaker,
    description: 'Profundo y grave, anti-cólicos'
  },
  {
    id: SoundType.HEARTBEAT,
    label: 'Útero Materno',
    Icon: Heart,
    description: 'Simula el vientre materno'
  },
  {
    id: SoundType.SHUSH,
    label: 'Shhh Rítmico',
    Icon: ShushIcon,
    description: 'Tranquiliza el llanto activo'
  },
  {
    id: SoundType.RAIN,
    label: 'Lluvia',
    Icon: CloudRain,
    description: 'Tormenta constante'
  },
  {
    id: SoundType.OCEAN,
    label: 'Fondo Marino',
    Icon: Waves,
    description: 'El vaivén de las mareas'
  },
  {
    id: SoundType.HAIR_DRYER,
    label: 'Secador',
    Icon: Wind,
    description: 'Zumbido doméstico cálido'
  },
  {
    id: SoundType.FOREST,
    label: 'Bosque',
    Icon: Trees,
    description: 'Naturaleza y pájaros suaves'
  },
  {
    id: SoundType.FAN,
    label: 'Ventilador',
    Icon: Fan,
    description: 'Zumbido de aire blanco'
  },
  {
    id: SoundType.TRAIN,
    label: 'Tren',
    Icon: TrainFront,
    description: 'Traqueteo rítmico'
  },
  {
    id: SoundType.CAT_PURR,
    label: 'Ronroneo',
    Icon: PawPrint,
    description: 'Vibración felina relajante'
  },
  {
    id: SoundType.STREAM,
    label: 'Arroyo',
    Icon: Droplets,
    description: 'Agua fluyendo suave'
  },
  {
    id: SoundType.LULLABY,
    label: 'Caja de Música',
    Icon: Music,
    description: 'Melodía suave para relajar'
  },
  {
    id: SoundType.FIREPLACE,
    label: 'Fuego',
    Icon: Flame,
    description: 'Crepitar de madera cálida'
  },
  {
    id: SoundType.NIGHT_CRICKETS,
    label: 'Grillos',
    Icon: Moon,
    description: 'Noche de verano'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '1 hora' },
  { minutes: 120, label: '2 horas' },
  { minutes: 0, label: '∞' }
];