import { h } from 'preact';
import { useEffect, useState, useMemo } from 'preact/hooks'; // Importar useMemo
import { fetchSurahById, fetchVersesForSurah } from '../services/apiClient';
import type { Surah, Verse } from '../types/quran';
import ReaderSurahHeader from './ReaderSurahHeader';
import { ReaderVerseCard } from './ReaderVerseCard';
import { useVersePlayer } from '../hooks/useVersePlayer';
import { getVerseKey } from '../utils/audioUtils';
import { useStore } from '@nanostores/preact';
import { showTranslation, audioActive } from '../stores/settingsStore';
import AudioControlsPopup from './AudioControlsPopup';

interface ReaderContainerProps {
  surahId: number;
}

const ReaderContainer = ({ surahId }: ReaderContainerProps) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use showTranslation from the store
  const $showTranslation = useStore(showTranslation);

  // Audio player state and functions
  const {
    status,
    error: audioError,
    currentVerseKey,
    togglePlayPause,
    stopAndUnload,
    duration,
    currentTime,
    seek,
    setVerseIndex,
    skipToNextVerse,
    onSeekChange,
    playVerse,
  } = useVersePlayer(verses);

  const isPlaying = status === 'playing';
  const isLoadingAudio = status === 'loading';
  const $audioActive = useStore(audioActive);

  // Obtener el verso actual de forma segura usando useMemo
  const currentVerse = useMemo(() => {
    if (!verses || !currentVerseKey) return null;
    return verses.find(v => getVerseKey(v.surahId, v.numberInSurah) === currentVerseKey);
  }, [verses, currentVerseKey]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setSurah(null);
      setVerses([]);
      
      // Stop any playing audio when changing Surahs
      stopAndUnload();

      try {
        // Fetch Surah details and verses in parallel
        const [surahData, versesData] = await Promise.all([
          fetchSurahById(surahId),
          fetchVersesForSurah(surahId)
        ]);

        if (!surahData) {
          throw new Error(`Surah with ID ${surahId} not found.`);
        }

        setSurah(surahData);
        setVerses(versesData);
        console.log('Loading data for Surah:', surahId);
        console.log('Verses after fetch:', versesData.length);
      } catch (err: any) {
        console.error('Error loading Surah data:', err);
        setError(err.message || 'Failed to load Surah data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (surahId > 0 && surahId <= 114) {
      loadData();
    } else {
      setError('Invalid Surah ID. Please enter a number between 1 and 114.');
      setLoading(false);
    }
  }, [surahId]);

  // Handler for verse audio toggle
  const handleVerseAudioToggle = (verse: Verse) => {
    console.log('Handling audio toggle for verse:', verse.surahId, verse.numberInSurah);
    
    // Find the index of the verse being played and set it in the hook
    const index = verses.findIndex(v =>
      v.surahId === verse.surahId && v.numberInSurah === verse.numberInSurah
    );

    if (index !== -1) {
      setVerseIndex(index);
      console.log('Found verse index:', index);
      
      // Verificar si este verso ya es el verso activo
      const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
      const isCurrentVerse = verseKey === currentVerseKey;
      
      console.log('Estado de audio antes de toggle:', {
        verseKey,
        currentVerseKey,
        isCurrentVerse,
        status,
        audioActive: $audioActive
      });
      
      // Si no es el verso actual, reproducir directamente en lugar de toggle
      if (!isCurrentVerse) {
        console.log('Reproduciendo nuevo verso directamente:', verseKey);
        playVerse(verse.surahId, verse.numberInSurah);
      } else {
        // Si es el verso actual, alternar reproducción/pausa
        console.log('Alternando reproducción para verso actual:', verseKey);
        togglePlayPause();
      }
    } else {
      console.error('No se pudo encontrar el índice del verso:', verse);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={null} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={surah} />
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p>{error}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!surah || verses.length === 0) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={surah} />
        <div className="bg-skyPurple/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <p className="text-textSecondary font-englishRegular">
            {surah ? 'No verses found for this Surah.' : 'Surah data not available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative h-full">
      {/* Scrollable container for verses */}
      <div className="absolute inset-x-0 top-0 overflow-y-auto space-y-4 z-10 bottom-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="opacity-0 animate-fade-in animation-delay-[100ms]">
          <ReaderSurahHeader surah={surah} />
        </div>
        {verses.map((verse, index) => {
          const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
          const isActiveAudio = currentVerseKey === verseKey;

          return (
            <div key={verse.id} className={`animate-list-item animate-item-${Math.min(index, 19)}`}>
              <ReaderVerseCard
                verse={verse}
                showTranslation={$showTranslation}
                isActiveAudio={isActiveAudio}
                isPlayingAudio={isActiveAudio && isPlaying}
                isLoadingAudio={isLoadingAudio}
                audioError={audioError}
                onAudioPress={() => handleVerseAudioToggle(verse)}
                currentTime={currentTime}
                duration={duration}
                onSeek={onSeekChange}
                className="last:mb-0"
              />
            </div>
          );
        })}
        {/* Extra padding at the bottom to ensure last item is fully visible */}
        <div className="h-4"></div>
      </div>
      {/* Añadir el popup de controles de audio */}
      <AudioControlsPopup
        isVisible={$audioActive && (isPlaying || (!!currentVerseKey && !isLoadingAudio && !audioError))}
        onStop={stopAndUnload}
        onSkip={skipToNextVerse}
        currentSurahName={surah?.englishName}
        currentSurahNumber={surah?.number}
        currentVerseNumber={currentVerse?.numberInSurah}
        totalVerses={surah?.numberOfAyahs}
      />
    </div>
  );
};

export default ReaderContainer;
