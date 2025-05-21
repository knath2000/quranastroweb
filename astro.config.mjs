// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind'; // Re-enable Astro Tailwind integration

// https://astro.build/config
export default defineConfig({
  integrations: [
    // Configurar React para los componentes específicos
    react({
      include: ['**/ReactSurahCard.tsx', '**/SurahListContainer.tsx'],
      // Asegurarse de que React no procese otros componentes
      exclude: ['**/*.tsx']
    }),
    
    // Configurar Preact para el resto de componentes
    preact({
      // Asegurarse de que Preact no procese los componentes React
      include: ['**/*.tsx'],
      exclude: ['**/ReactSurahCard.tsx', '**/SurahListContainer.tsx']
    }),
    
    tailwind()
  ],
  // Configuración adicional para evitar conflictos
  vite: {
    ssr: {
      // Evitar conflictos de hidratación
      noExternal: ['@tanstack/react-virtual']
    }
  }
});
