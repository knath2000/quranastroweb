export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  id: string;
  arabicName: string;
  transliterationName: string;
}

/**
 * Represents a verse from the Quran as returned from the API
 */
export interface Verse {
  id: number;
  surahId: number;
  numberInSurah: number;
  text: string;     // Arabic text
  translation?: string;  // English or other translation
}

/**
 * Represents a verse formatted for display in the UI
 */
export interface DisplayVerse {
  surahName: string;         // English name of the surah
  surahNumber: number;       // Surah number (1-114)
  verseNumberInSurah: number; // Verse number within the surah
  arabic: string;           // Arabic text of the verse
  english: string;          // English translation
  fullReference: string;    // Formatted reference (e.g., "Surah Al-Baqarah (2:255)")
}

/**
 * Represents an API error response
 */
export interface ApiError {
  message: string;
  code?: number;
  details?: string;
}