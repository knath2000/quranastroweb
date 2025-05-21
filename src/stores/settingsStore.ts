import { persistentAtom } from '@nanostores/persistent';

// Settings interface
export interface AppSettings {
  autoplayEnabled: boolean;
  showTranslation: boolean;
  audioActive: boolean;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  autoplayEnabled: false,
  showTranslation: true,
  audioActive: false,
};

// Create persistent atoms for each setting
export const autoplayEnabled = persistentAtom<boolean>(
  'settings.autoplayEnabled', 
  DEFAULT_SETTINGS.autoplayEnabled,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export const showTranslation = persistentAtom<boolean>(
  'settings.showTranslation', 
  DEFAULT_SETTINGS.showTranslation,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

// Helper functions
export function toggleAutoplay() {
  autoplayEnabled.set(!autoplayEnabled.get());
}

export const audioActive = persistentAtom<boolean>(
  'settings.audioActive', 
  DEFAULT_SETTINGS.audioActive,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export function toggleTranslation() {
  showTranslation.set(!showTranslation.get());
}

export function setAudioActive(active: boolean) {
  audioActive.set(active);
}
