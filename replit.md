# Overview

nanapp is a Progressive Web App (PWA) designed to help babies sleep using scientifically-backed white noise and soothing sounds. The app features multiple sound types (white noise, pink noise, brown noise, ocean, hair dryer, lullabies, and rhythmic shushing), a customizable timer, audio processing features (warmth filter, fade transitions, heartbeat layer), and comprehensive sleep education content for parents.

The app is built as a mobile-first PWA with offline capabilities, multilingual support (Spanish, English, French), and is optimized for deployment to Google Play Store via PWA Builder. It focuses on providing a calm, distraction-free experience with no intrusive ads, emphasizing parental education about infant sleep patterns and techniques.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 19.2 with TypeScript  
**Build Tool**: Vite 6.2  
**Styling**: Tailwind CSS (via CDN)  
**Icons**: Lucide React

The app uses a component-based architecture with a single-page application (SPA) design. The main `App.tsx` manages global state and orchestrates different views (Sounds, Sleep Guide, Tips, Story) through a bottom navigation system. State management is handled through React hooks (useState, useEffect, useRef) without external state libraries, keeping the bundle size minimal.

**Rationale**: React provides excellent PWA support and component reusability. Vite offers fast development experience and optimized production builds. The decision to avoid complex state management libraries (like Redux) reduces complexity and bundle size, which is crucial for a PWA targeting mobile devices with potentially slow connections.

## Audio Processing System

**Core Technology**: Web Audio API  
**Class**: `AudioEngine` (services/audioEngine.ts)

The audio engine uses procedurally generated sounds rather than audio files, creating white noise, pink noise, and brown noise through oscillators and filters. This approach:
- Eliminates file downloads (faster load, works offline immediately)
- Enables infinite loops without repetition artifacts
- Allows real-time audio manipulation (warmth filter, fade transitions)

**Key Features**:
- Dynamic gain control with fade-in/fade-out transitions
- Biquad lowpass filter for "warmth" effect (simulates womb acoustics)
- Layered heartbeat generator (separate audio graph for optional heartbeat overlay)
- Master gain node for volume control separate from mute functionality

**Alternative Considered**: Using MP3/OGG files would be simpler but would require larger initial downloads, create storage overhead, and limit real-time audio manipulation capabilities.

## Progressive Web App (PWA) Implementation

**Service Worker**: Custom offline-first caching strategy (public/sw.js)  
**Manifest**: Optimized for Google Play Store submission (public/manifest.json)  
**Caching Strategy**: 
- Static assets precached on install
- Runtime cache for dynamic requests
- Stale-while-revalidate for optimal performance

The PWA is configured for:
- Standalone display mode (app-like experience)
- Portrait orientation lock
- Safe area insets for notched devices
- iOS-specific meta tags for home screen installation
- Shortcuts for direct sound access from launcher

**Digital Asset Links**: Prepared for Trusted Web Activity (TWA) deployment to Google Play Store via PWA Builder (public/.well-known/assetlinks.json)

**Rationale**: PWA approach allows single codebase for web and Android, eliminates app store review delays for updates, and provides instant loading after first visit. The offline-first strategy ensures the app works without internet, critical for nighttime use when connectivity may be poor.

## Internationalization (i18n)

**Implementation**: Custom React Context (services/LanguageContext.tsx)  
**Translations**: Static object-based (services/translations.ts)  
**Supported Languages**: Spanish (default), English, French

Language detection follows this priority:
1. User's saved preference (localStorage)
2. Browser language detection
3. Fallback to English

**Rationale**: Custom implementation avoids heavy i18n libraries (react-i18next ~100KB). For a focused app with ~200 translation strings, a simple key-value object provides sufficient functionality while keeping bundle size minimal.

## State Persistence

**Storage**: Browser LocalStorage  
**Persisted Settings**:
- Volume level
- Last played sound
- Timer duration
- Warmth filter state
- Fade duration
- Heartbeat layer preference
- Language preference

**Rationale**: LocalStorage provides synchronous access to settings needed during audio initialization. IndexedDB would be overkill for the small amount of configuration data. Settings are restored on app load to provide continuity between sessions.

## URL-Based Deep Linking

The app supports URL parameters for direct access:
- `?sound=WHITE_NOISE` - Auto-select specific sound
- `?tab=sleep` - Open specific tab

This enables:
- PWA shortcuts to specific sounds
- Social sharing of specific content
- Direct linking from external sources

## UI/UX Design Patterns

**Design System**: Custom design with Quicksand font family  
**Color Scheme**: Dark mode optimized (slate/orange palette)  
**Layout**: Mobile-first with max-width constraint (lg breakpoint)

Key UX decisions:
- Bottom navigation (thumb-friendly on mobile)
- Large touch targets (min 44x44px)
- Haptic feedback on interactions (when supported)
- Rounded corners and soft shadows for calming aesthetic
- Minimal animations to avoid distraction during nighttime use

**Rationale**: The calming color palette (dark blues, soft oranges) is scientifically chosen to avoid blue light stimulation while maintaining readability. The rounded, soft design language reduces visual stress for sleep-deprived parents.

# External Dependencies

## Third-Party Libraries

**React & ReactDOM** (19.2.0)  
- Core framework for UI rendering
- Latest version provides automatic batching and concurrent features

**Lucide React** (0.555.0)  
- Icon library for UI elements
- Tree-shakeable, only imports used icons
- Lightweight alternative to Font Awesome or Material Icons

**Tailwind CSS** (CDN)  
- Utility-first CSS framework loaded via CDN
- Reduces build complexity and bundle size
- CDN caching improves load times on repeat visits

## Build Tools (Development Only)

**Vite** (6.2.0)  
- Development server with HMR
- Production bundler with optimized output

**TypeScript** (5.8.2)  
- Type safety during development
- No runtime overhead (compiles to JavaScript)

**@vitejs/plugin-react** (5.0.0)  
- React Fast Refresh support
- JSX transformation

## Browser APIs

**Web Audio API**  
- Core audio processing (oscillators, filters, gain nodes)
- No polyfills needed (supported in all modern browsers)

**Service Worker API**  
- Offline caching and PWA functionality
- Progressive enhancement (app works without it)

**LocalStorage API**  
- Settings persistence
- Synchronous, no external library needed

**Navigator.vibrate API**  
- Haptic feedback (optional feature, gracefully degrades)

## Deployment Platform

**Replit Deployments**  
- Hosting platform for the PWA
- HTTPS required for Service Workers and PWA features
- Custom domain support available

**Future: Google Play Store**  
- Planned deployment via PWA Builder
- Converts PWA to Trusted Web Activity (TWA)
- Requires Digital Asset Links verification (already configured)

## No Database

This application does not use any external database. All state is:
- Ephemeral (in-memory during session)
- Persisted locally (LocalStorage for settings)
- Generated procedurally (audio synthesis)

**Rationale**: A sleep sounds app has no need for server-side data storage. User settings are personal and should remain on-device for privacy and offline functionality.

## No External APIs

The app operates entirely client-side with no external API calls. Content (sleep tips, educational material) is embedded in the translation files and components.

**Rationale**: Eliminates network dependencies, ensures offline functionality, protects user privacy (no tracking or analytics), and reduces operational costs.