import { SoundType, SoundOption, TimerOption } from './types';
import { WhiteNoiseIcon, RainIcon, BrownNoiseIcon, OceanIcon, HairDryerIcon, ShushIcon, WavesIcon, LullabyIcon } from './components/icons/SoundIcons';

export const SOUNDS: SoundOption[] = [
  {
    id: SoundType.WHITE_NOISE,
    label: 'Ruido Blanco',
    Icon: WhiteNoiseIcon,
    description: 'Aísla ruidos externos'
  },
  {
    id: SoundType.RAIN,
    label: 'Ruido Rosa',
    Icon: RainIcon,
    description: 'Ruido rosa relajante'
  },
  {
    id: SoundType.BROWN_NOISE,
    label: 'Ruido Marrón',
    Icon: BrownNoiseIcon,
    description: 'Profundo y grave'
  },
  {
    id: SoundType.OCEAN,
    label: 'Océano',
    Icon: OceanIcon,
    description: 'Ruido marrón rítmico'
  },
  {
    id: SoundType.HAIR_DRYER,
    label: 'Secador',
    Icon: HairDryerIcon,
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
    Icon: WavesIcon,
    description: 'Sonido de mar suave'
  },
  {
    id: SoundType.LULLABY,
    label: 'Nana',
    Icon: LullabyIcon,
    description: 'Melodía suave'
  }
];

export const TIMER_OPTIONS: TimerOption[] = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
];