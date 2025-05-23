import { h } from 'preact';
import { StopIcon, SkipIcon } from './icons/AudioIcons';
import { ChevronLeft, ChevronRight } from 'lucide-preact'; // Importar iconos de paginación

interface BottomControlPanelProps {
  onStop: () => void;
  onSkip: () => void;
  isAudioActive: boolean; // Renombrado de isVisible para mayor claridad
  currentSurahName?: string;
  currentSurahNumber?: number;
  currentVerseNumber?: number;
  totalVerses?: number;
  
  // Props de paginación
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const BottomControlPanel = ({
  onStop,
  onSkip,
  isAudioActive,
  currentSurahName,
  currentSurahNumber,
  currentVerseNumber,
  totalVerses,
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
}: BottomControlPanelProps) => {
  // Determinar la altura del panel basada en si el audio está activo
  const panelHeightClass = isAudioActive ? 'h-32' : 'h-16'; // 128px vs 64px
  const audioControlsVisibility = isAudioActive ? 'flex' : 'hidden';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] glassmorphism p-4 min-w-[320px] w-[calc(100%-2rem)] max-w-md flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${panelHeightClass}`}>
      {/* Controles de audio (condicionalmente visibles) */}
      <div className={`${audioControlsVisibility} flex-col items-center justify-between w-full mb-3`}>
        {/* Línea de información contextual */}
        <div className="flex items-center justify-between text-sm text-textSecondary mb-2 w-full">
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
        <div className="flex items-center justify-between w-full">
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

      {/* Controles de paginación (siempre visibles) */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-4 text-textPrimary w-full justify-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-desertWarmOrange/80 hover:bg-desertWarmOrange disabled:opacity-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-englishMedium text-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-desertWarmOrange/80 hover:bg-desertWarmOrange disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomControlPanel;
