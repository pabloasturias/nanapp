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
    label: 'Aspiradora',
    Icon: Fan, // Vacuum icon
    description: 'Motor constante y grave'
  },
  {
    id: SoundType.FAN,
    label: 'Ventilador',
    Icon: Fan,
    description: 'Zumbido de aire blanco'
  },
  {
    id: SoundType.TRAIN,
    label: 'Viaje en Tren',
    Icon: TrainFront,
    description: 'Traqueteo rítmico'
  },
  {
    id: SoundType.CAT_PURR,
    label: 'Motor de Coche',
    Icon: Car,
    description: 'Vibración de viaje por carretera'
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
    label: 'Latido Constante',
    Icon: Activity,
    description: 'Pulsación rítmica del corazón'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
];