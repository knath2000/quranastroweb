import type { Verse, ApiError, Surah } from '../types/quran';

// The API base URL is hardcoded to match the quranexpo2 native app
const API_BASE_URL = 'https://onlyquranexpo.vercel.app';

/**
 * Fetches the list of all Surahs from the API
 * @returns A Promise resolving to an array of Surah objects
 * @throws Error If the API request fails
 */
export async function fetchSurahList(): Promise<Surah[]> {
  try {
    // Use the metadata API endpoint from quranexpo2 native app
    const response = await fetch(`${API_BASE_URL}/api/get-metadata?type=surah-list`);
    
    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`API error: Failed to fetch Surah list. Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // If the API returns data in a different format than expected, handle it here
    if (!Array.isArray(data)) {
      throw new Error('API returned invalid data structure for Surah list');
    }
    
    // Map API response to our Surah interface
    return data.map(item => ({
      number: item.number,
      name: item.name, // Arabic name
      englishName: item.ename,
      englishNameTranslation: `Chapter ${item.ename}`,
      numberOfAyahs: item.ayas,
      revelationType: item.type === 'Meccan' || item.type === 'Medinan' ? item.type : 'Meccan',
      id: String(item.number),
      arabicName: item.name,
      transliterationName: item.tname,
    }));
  } catch (error) {
    // Log the error for debugging
    console.error('Error in fetchSurahList:', error);
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Fetches a specific Surah by its ID
 * @param surahId The ID of the Surah to fetch
 * @returns A Promise resolving to the Surah object or null if not found
 * @throws Error If the API request fails
 */
export async function fetchSurahById(surahId: number): Promise<Surah | null> {
  try {
    // Get the full Surah list
    const surahList = await fetchSurahList();
    
    // Find the specific Surah by ID
    const surah = surahList.find(s => s.number === surahId);
    
    // Return the Surah or null if not found
    return surah || null;
  } catch (error) {
    console.error(`Error in fetchSurahById for surahId ${surahId}:`, error);
    throw error;
  }
}

/**
 * Fetches all verses for a specific Surah with translations
 * @param surahId The ID of the Surah
 * @param translator The translator code (default to English Yusuf Ali)
 * @returns A Promise resolving to an array of Verse objects with Arabic text and translations
 * @throws Error If the API request fails
 */
export async function fetchVersesForSurah(
  surahId: number,
  translator: string = "en.yusufali"
): Promise<Verse[]> {
  try {
    // Fetch Arabic verses
    const arabicVersesResponse = await fetch(`${API_BASE_URL}/api/get-verses?surah=${surahId}`);
    
    if (!arabicVersesResponse.ok) {
      throw new Error(`API error: Failed to fetch Arabic verses for Surah ${surahId}. Status: ${arabicVersesResponse.status}`);
    }
    
    const arabicVerses = await arabicVersesResponse.json();
    
    if (!Array.isArray(arabicVerses)) {
      throw new Error(`API returned invalid data structure for Arabic verses of Surah ${surahId}`);
    }
    
    // Fetch translations
    const translationsResponse = await fetch(`${API_BASE_URL}/api/get-translation-verses?surah=${surahId}&translator=${translator}`);
    
    if (!translationsResponse.ok) {
      throw new Error(`API error: Failed to fetch translations for Surah ${surahId}. Status: ${translationsResponse.status}`);
    }
    
    const translationObjects = await translationsResponse.json();
    
    if (!Array.isArray(translationObjects)) {
      throw new Error(`API returned invalid data structure for translations of Surah ${surahId}`);
    }
    
    // Create a map of translations by verse number for quick lookup
    const translationsMap = translationObjects.reduce((map, verse) => {
      map[verse.numberInSurah] = verse.translation;
      return map;
    }, {} as Record<number, string | undefined>);
    
    // Merge Arabic verses with translations
    const verses = arabicVerses.map(verse => ({
      id: verse.id,
      surahId: verse.surahId,
      numberInSurah: verse.numberInSurah,
      text: verse.text,
      translation: translationsMap[verse.numberInSurah] || ''
    }));
    
    return verses;
  } catch (error) {
    console.error(`Error in fetchVersesForSurah for surahId ${surahId}:`, error);
    throw error;
  }
}

/**
 * Fetches a single verse with its translation from the API
 * @param surahId The number of the Surah (1-based)
 * @param ayahId The number of the Ayah within the Surah
 * @param translator The translator code (default to English Yusuf Ali)
 * @returns A Promise resolving to a Verse object or null if an error occurs
 * @throws Error If the API request fails (network issue, non-200 status, etc.)
 */
export async function fetchSingleTranslatedVerse(
  surahId: number,
  ayahId: number,
  translator: string = "en.yusufali"
): Promise<Verse | null> {
  try {
    // Use the same API endpoint as quranexpo2 native app
    const response = await fetch(
      `${API_BASE_URL}/api/get-translated-verse?surah=${surahId}&ayah=${ayahId}&translator=${translator}`
    );
    
    // Handle non-OK responses
    if (!response.ok) {
      // Specific error for 404 (not found)
      if (response.status === 404) {
        throw new Error(`Verse ${surahId}:${ayahId} not found.`);
      }
      
      // General error for other status codes
      throw new Error(`API error: Failed to fetch verse ${surahId}:${ayahId}. Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // If the API returns data in a different format than expected, handle it here
    if (!data || !data.text) {
      throw new Error(`API returned invalid data structure for verse ${surahId}:${ayahId}`);
    }
    
    // Convert API format to our Verse format
    return {
      id: data.id || parseInt(`${surahId}${ayahId}`), // Use API's ID or generate one
      surahId: surahId,
      numberInSurah: ayahId,
      text: data.text || '',
      translation: data.translation || ''
    };
  } catch (error) {
    // Log the error for debugging
    console.error(`Error in fetchSingleTranslatedVerse for ${surahId}:${ayahId}:`, error);
    
    // Re-throw the error to be handled by the caller (no silent failures)
    throw error;
  }
}