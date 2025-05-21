import { h } from 'preact';
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
  onSeek?: (time: number) => void;
  className?: string;
}

const ReaderVerseCard = ({
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
  // Calculate class names for the verse card
  const getCardClassNames = () => {
    const baseClasses = "relative flex flex-row items-start overflow-hidden p-4 mb-3 rounded-xl cursor-pointer bg-skyPurple/60 backdrop-blur-xl border border-white/10";
    
    if (isActiveAudio) {
      if (isLoadingAudio) {
        return `${baseClasses} verse-audio-active verse-audio-loading`;
      } else if (isPlayingAudio) {
        return `${baseClasses} verse-audio-active verse-audio-playing`;
      } else {
        return `${baseClasses} verse-audio-active`;
      }
    }
    
    return baseClasses;
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className={getCardClassNames()}
      onClick={onAudioPress}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-skyPurple/60 backdrop-blur-xl rounded-xl z-0"></div>
      
      {/* Verse number in circle */}
      <div className="relative z-10 bg-desertHighlightGold rounded-full w-9 h-9 flex justify-center items-center mr-4 flex-shrink-0">
        <span className="text-skyDeepBlue font-englishBold text-sm">
          {verse.numberInSurah}
        </span>
      </div>
      
      {/* Text container */}
      <div className="relative z-10 flex-1">
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
        
        {/* Error indicator (only if there's an error and this verse is active) */}
        {isActiveAudio && audioError && (
          <div className="mt-2 text-red-500 flex items-center text-xs">
            <ErrorIcon size={12} className="text-red-500 mr-1" />
            <span>Error playing audio</span>
          </div>
        )}

        {/* Playback slider */}
        {isActiveAudio && duration > 0 && (
          <div className="mt-3 z-10">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onInput={e => onSeek(Number((e.target as HTMLInputElement).value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-textSecondary mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderVerseCard;