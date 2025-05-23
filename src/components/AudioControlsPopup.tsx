import { h } from 'preact';
import { StopIcon, SkipIcon } from './icons/AudioIcons';

interface AudioControlsPopupProps {
  onStop: () => void;
  onSkip: () => void;
  isVisible: boolean;
  currentSurahName?: string;
  currentSurahNumber?: number;
  currentVerseNumber?: number;
  totalVerses?: number;
}

const AudioControlsPopup = ({
  onStop,
  onSkip,
  isVisible,
  currentSurahName,
  currentSurahNumber,
  currentVerseNumber,
  totalVerses
}: AudioControlsPopupProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glassmorphism p-4 min-w-[320px] animate-fade-in">
      {/* Línea de información contextual */}
      <div className="flex items-center justify-between text-sm text-textSecondary mb-2">
        <div className="flex items-center space-x-2">
          <span>📖</span>
          <span className="font-englishMedium">
            Surah {currentSurahName} ({currentSurahNumber})
          </span>
        </div>
        <div className="text-desertHighlightGold">
          Verse {currentVerseNumber}/{totalVerses}
        </div>
      </div>
      
      {/* Línea de estado y controles */}
      <div className="flex items-center justify-between">
        <span className="text-textPrimary text-sm font-englishRegular">
          Currently Playing
        </span>
        <div className="flex items-center space-x-3">
          <button
            onClick={onStop}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-desertWarmOrange text-white hover:bg-desertWarmOrange/80 transition-all duration-200 hover:scale-105"
            aria-label="Stop audio"
          >
            <StopIcon size={24} />
          </button>
          <button
            onClick={onSkip}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-desertHighlightGold text-skyDeepBlue hover:bg-desertHighlightGold/80 transition-all duration-200 hover:scale-105"
            aria-label="Skip to next verse"
          >
            <SkipIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioControlsPopup;
