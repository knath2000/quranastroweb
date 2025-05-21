# Project Brief: Quran Expo Web App

## Overview
The Quran Expo Web App is a port of an existing native iOS application (QuranExpo2) to a web platform. This web version aims to provide the same functionality and user experience as the native app but optimized for web browsers across different devices. The application allows users to read the Quran in Arabic with translations, navigate through different Surahs, and listen to audio recitations of individual verses.

## Core Requirements

1. Create a responsive web application using Astro with Preact and TailwindCSS
2. Maintain the visual identity and UX patterns from the native iOS app
3. Implement core features from the native app:
   - Browsing Surahs (chapters) of the Quran
   - Reading verses with Arabic text and English translations
   - Audio playback of individual verses
   - Visual indicators for audio playback status
   - Navigation between different sections of the app

## Technical Constraints

- No React Native components - pure web technologies only
- Must use the same API endpoints as the native app
- Should optimize for web performance (load times, responsiveness)
- Must work well across different screen sizes and browsers

## Scope Boundaries

### In Scope
- Homepage with core navigation
- Surah listing page
- Reader page with verse display and audio playback
- Basic audio playback features (play/pause individual verses)

### Out of Scope (for initial version)
- User accounts and authentication
- Bookmarking functionality
- Advanced search features
- Offline functionality

## Success Criteria
- Web app successfully renders all Quranic content accurately
- Audio playback works smoothly with appropriate visual feedback
- Navigation matches the native app experience
- Performance is optimized for web