# nanapp - Baby White Noise App

## Overview

nanapp is a Progressive Web App (PWA) designed to help babies sleep using white noise and soothing sounds. The app provides various sound types (white noise, pink noise, brown noise, ocean, hair dryer, shushing, waves, and lullabies), along with educational content about baby sleep, colic relief tips, and parenting guidance. The app is built primarily for Spanish-speaking users but supports multiple languages (Spanish, English, French).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **Font**: Quicksand (Google Fonts)

### Application Structure
The app follows a component-based architecture with a single-page application (SPA) design:

1. **Main Entry**: `App.tsx` serves as the root component, managing global state for audio playback, settings, and navigation
2. **Views**: Tab-based navigation between Sounds, Sleep Guide, Tips, and Story sections
3. **Modals**: Settings, Support, Legal, and informational modals overlay the main content
4. **State Management**: React useState/useEffect with localStorage persistence for user preferences

### Audio Engine
- **Location**: `services/audioEngine.ts`
- **Approach**: Web Audio API for procedural sound generation
- **Features**: 
  - Multiple noise types generated programmatically (no external audio files required)
  - Volume control with fade in/out transitions
  - "Warmth" filter (low-pass) to simulate womb-like sounds
  - Optional heartbeat layer overlay
  - Timer functionality with gradual fade-out

### Internationalization
- **Location**: `services/LanguageContext.tsx` and `services/translations.ts`
- **Approach**: React Context-based language provider
- **Languages**: Spanish (default), English, French
- **Detection**: Auto-detects browser language, falls back to saved preference or English

### PWA Configuration
- **Manifest**: `manifest.json` defines app metadata, icons, and standalone display mode
- **Service Worker**: `sw.js` caches app assets for offline functionality
- **Target**: Mobile-first design with safe area insets for notched devices

### User Preferences Persistence
Settings are stored in localStorage with `dw_` prefix:
- Volume level
- Last selected sound
- Timer duration
- Warmth filter state
- Fade duration
- Heartbeat layer toggle
- Language preference

## External Dependencies

### CDN Resources
- **Tailwind CSS**: Loaded via `cdn.tailwindcss.com` for styling
- **Google Fonts**: Quicksand font family
- **Lucide Icons**: SVG icons via CDN for PWA manifest

### Runtime Dependencies (npm)
- `react` and `react-dom`: UI framework
- `lucide-react`: Icon components

### Development Dependencies
- `vite`: Build and dev server
- `@vitejs/plugin-react`: React plugin for Vite
- `typescript`: Type checking

### Environment Variables
- `GEMINI_API_KEY`: Referenced in Vite config but not actively used in current codebase (likely for future AI features)

### No Backend Required
This is a fully client-side application with no server dependencies. All audio is generated procedurally, and data persists in localStorage.