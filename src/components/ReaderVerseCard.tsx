import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { Verse } from '../types/quran';
import { ErrorIcon } from './icons/AudioIcons';

interface ReaderVerseCardProps {
  verse: Verse;
  showTranslation: boolean;
  isActiveAudio?: boolean;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
  audioError?: string | null;
  onAudioPress?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (event: Event) => void;
  className?: string;
}

export const ReaderVerseCard = ({
  verse,
  showTranslation = true,
  isActiveAudio = false,
  isPlayingAudio = false,
  isLoadingAudio = false,
  audioError = null,
  onAudioPress = () => {},
  currentTime = 0,
  duration = 0,
  onSeek = () => {},
}: ReaderVerseCardProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate class names for the verse card
  const getCardClassNames = () => {
    const baseClasses = "relative flex flex-row items-start overflow-hidden p-4 mb-3 rounded-xl cursor-pointer bg-skyPurple/60 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out";
    
    if (isActiveAudio) {
      // Aplica el borde de gradiente animado cuando el audio está activo
      let activeClasses = `${baseClasses} verse-border-gradient-flow`;
      if (isLoadingAudio) {
        return `${activeClasses} verse-audio-loading`;
      } else if (isPlayingAudio) {
        return `${activeClasses} verse-audio-playing`;
      } else {
        return `${activeClasses}`;
      }
    }
    
    return baseClasses;
  };

  return (
    <div
      className={getCardClassNames()}
      onClick={onAudioPress}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 glassmorphism z-0"></div>
      
      {/* Verse number in circle */}
      <div className="relative z-10 bg-desertHighlightGold rounded-full w-9 h-9 flex justify-center items-center mr-4 flex-shrink-0">
        <span className="text-skyDeepBlue font-englishBold text-sm">
          {verse.numberInSurah}
        </span>
      </div>
      
      {/* Text container */}
      <div className={`relative z-10 flex-1 ${isPlayingAudio ? 'verse-body-gradient-shift' : ''}`}>
        {/* Arabic text */}
        <p
          className="text-textArabic font-arabicRegular text-xl text-right mb-2 leading-relaxed"
          dir="rtl"
        >
          {verse.text}
        </p>
        
        {/* English translation (if enabled) */}
        {showTranslation && verse.translation && (
          <p className="text-textSecondary font-englishRegular text-base italic">
            {verse.translation}
          </p>
        )}

        {isActiveAudio && (
          <div className="w-full flex items-center space-x-2 mt-2">
            <span className="text-xs text-textSecondary bg-skyDeepBlue/40 px-1 rounded">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime} // Usar currentTime directamente
              onInput={onSeek} // Pasar el evento al handler del hook para la lógica de seek
              className="flex-1 h-1 bg-skyIndigo/50 rounded-lg appearance-none cursor-pointer range-sm"
              style={{
                background: `linear-gradient(to right, var(--tw-colors-desertWarmOrange) ${((currentTime / duration) * 100) || 0}%, var(--tw-colors-desertHighlightGold) ${((currentTime / duration) * 100) || 0}%)`,
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                outline: 'none',
                height: '8px', /* Make it a bit thicker */
                borderRadius: '9999px', /* Fully rounded */
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)', /* Subtle white border/glow */
                transition: 'background 0.1s linear', // Transición suave para el fondo del slider
              }}
            />
            <span className="text-xs text-textSecondary bg-skyDeepBlue/40 px-1 rounded">{formatTime(duration)}</span>
          </div>
        )}
        
        {/* Error indicator (only if there's an error and this verse is active) */}
        {isActiveAudio && audioError && (
          <div className="mt-2 text-red-500 flex items-center text-xs">
            <ErrorIcon size={12} className="text-red-500 mr-1" />
            <span>Error playing audio</span>
          </div>
        )}
      </div>
    </div>
  );
};
