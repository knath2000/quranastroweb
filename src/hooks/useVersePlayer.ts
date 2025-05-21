import { useRef, useState, useEffect, useCallback } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { getVerseAudioUrl } from '../utils/audioUtils';
import { autoplayEnabled, setAudioActive } from '../stores/settingsStore';
import type { Verse } from '../types/quran';

interface VersePlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
  currentVerseKey: string | null;
}

export const useVersePlayer = (verses?: Verse[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<VersePlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    duration: 0,
    currentTime: 0,
    currentVerseKey: null,
  });
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const $autoplayEnabled = useStore(autoplayEnabled);

  // Use useRef to hold stable references to functions that depend on each other
  const playVerseRef = useRef<(surahId: number, verseNumber: number) => void>();
  const stopAndUnloadCompletelyRef = useRef<() => void>();
  const skipToNextVerseRef = useRef<() => void>();

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
  }, []);

  // Define stopAndUnloadCompletely
  stopAndUnloadCompletelyRef.current = useCallback(() => {
    cleanupAudio();
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isLoading: false,
      error: null,
      duration: 0,
      currentTime: 0,
      currentVerseKey: null,
    }));
    setCurrentVerseIndex(null);
    setAudioActive(false);
  }, [cleanupAudio]);

  // Define playVerse
  playVerseRef.current = useCallback((surahId: number, verseNumber: number) => {
    const verseKey = `${surahId}-${verseNumber}`;
    setAudioActive(true);
    const verseIndex = verses?.findIndex(v => v.surahId === surahId && v.numberInSurah === verseNumber) ?? null;
    setCurrentVerseIndex(verseIndex); // This sets the state

    if (state.currentVerseKey === verseKey && state.isPlaying && !state.error) {
      return;
    }

    cleanupAudio();
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentVerseKey: verseKey,
      duration: 0,
      currentTime: 0,
      isPlaying: false,
    }));

    const audio = new Audio();
    audioRef.current = audio;

    audio.src = getVerseAudioUrl(surahId, verseNumber);
    audio.load();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing audio:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to play audio',
          isLoading: false,
          isPlaying: false,
        }));
      });
    }
  }, [state.currentVerseKey, state.isPlaying, state.error, cleanupAudio, verses]);

  // Effect to handle audio event listeners and autoplay logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    };
    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    const handlePlaying = () => {
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    };
    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setState(prev => ({
        ...prev,
        error: 'Failed to load audio',
        isLoading: false,
        isPlaying: false,
      }));
    };
    const handleWaiting = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };
    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleEnded = () => {
      console.log('Audio ended, checking autoplay status');
      setState(prev => ({
        ...prev,
        isPlaying: false,
        // Do NOT reset currentTime here. It should stay at the end.
      }));

      // Obtener el valor actual directamente del store
      const isAutoplayEnabled = autoplayEnabled.get(); // Get latest value from store
      console.log('Autoplay enabled:', isAutoplayEnabled);
      console.log('Verses available:', !!verses, verses?.length);
      console.log('Current verse index (from state):', currentVerseIndex); // Use the state value

      if (isAutoplayEnabled && verses && currentVerseIndex !== null) {
        const nextIndex = currentVerseIndex + 1;
        console.log('Current verse index:', currentVerseIndex, 'Next index:', nextIndex);

        if (nextIndex < verses.length) {
          const nextVerse = verses[nextIndex];
          console.log('Playing next verse:', nextVerse.surahId, nextVerse.numberInSurah);

          setTimeout(() => {
            if (playVerseRef.current) {
              playVerseRef.current(nextVerse.surahId, nextVerse.numberInSurah);
            } else {
              console.error('playVerseRef.current is undefined');
            }
          }, 500);
        } else {
          console.log('Reached end of verses, stopping playback');
          if (stopAndUnloadCompletelyRef.current) {
            stopAndUnloadCompletelyRef.current();
          }
        }
      } else {
        console.log('Autoplay disabled or no verses available, stopping playback');
        if (stopAndUnloadCompletelyRef.current) {
          stopAndUnloadCompletelyRef.current();
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded); // This listener now depends on currentVerseIndex and verses
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioRef.current, currentVerseIndex, verses, $autoplayEnabled, playVerseRef.current, stopAndUnloadCompletelyRef.current]);

  // Define skipToNextVerse
  skipToNextVerseRef.current = useCallback(() => {
    if (verses && currentVerseIndex !== null) {
      const nextIndex = currentVerseIndex + 1;
      if (nextIndex < verses.length) {
        const nextVerse = verses[nextIndex];
        playVerseRef.current?.(nextVerse.surahId, nextVerse.numberInSurah);
      } else {
        stopAndUnloadCompletelyRef.current?.();
      }
    }
  }, [verses, currentVerseIndex]);

  // Pause currently playing audio
  const pauseVerse = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    }
  }, []);

  // Resume playback of the current verse
  const resumeVerse = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error resuming audio:', error);
          setState(prev => ({
            ...prev,
            error: 'Failed to resume audio',
            isPlaying: false,
          }));
        });
      }
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isLoading: false,
      }));
    }
  }, []);

  // Seek to a specific time in the audio
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({
        ...prev,
        currentTime: time,
      }));
    }
  }, []);

  // Toggle playback for a verse
  const toggleVerseAudio = useCallback((surahId: number, verseNumber: number) => {
    const verseKey = `${surahId}-${verseNumber}`;
    if (state.currentVerseKey === verseKey) {
      if (state.isPlaying) {
        pauseVerse();
      } else {
        resumeVerse();
      }
    } else {
      playVerseRef.current?.(surahId, verseNumber);
    }
  }, [state.currentVerseKey, state.isPlaying, pauseVerse, resumeVerse]);

  // Add function to set current verse index
  const setVerseIndex = useCallback((index: number) => {
    setCurrentVerseIndex(index);
  }, []);

  // Export the functions using their ref.current values
  return {
    ...state,
    playVerse: playVerseRef.current!,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload: stopAndUnloadCompletelyRef.current!,
    toggleVerseAudio,
    setVerseIndex,
    skipToNextVerse: skipToNextVerseRef.current!,
  };
};
