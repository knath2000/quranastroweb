/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        skyDeepBlue: '#0B0724',
        skyPurple: '#2C1D5D',
        skyIndigo: '#4A3F8E',
        desertSandGold: '#D4A373',
        desertWarmOrange: '#E09F3E',
        desertHighlightGold: '#FFD700',
        accentEmerald: '#50C878',
        accentRuby: '#E0115F',
        accentSapphire: '#0F52BA',
        accentAmethyst: '#9966CC',
        playingGreen: '#4CAF50',
        textPrimary: '#F5F5F5',
        textSecondary: '#A9A9A9',
        textArabic: '#FFFFFF',
        textEnglish: '#E0E0E0',
        // background: '#0B0724', // Removed as skyDeepBlue serves the same purpose
        cardBackground: 'rgba(44, 29, 93, 0.5)', // Semi-transparent
        tabBarBackground: '#1C1240',
        activeTabIcon: '#FFD700',
        inactiveTabIcon: '#A9A9A9',
        buttonPrimaryBackground: '#E09F3E',
        buttonPrimaryText: '#0B0724',
        buttonSecondaryBackground: '#4A3F8E',
        buttonSecondaryText: '#F5F5F5',
        error: '#D32F2F',
        success: '#388E3C',
      },
      fontFamily: {
        arabicRegular: ['NotoNaskhArabic-Regular', 'sans-serif'],
        arabicBold: ['NotoNaskhArabic-Bold', 'sans-serif'],
        englishRegular: ['Montserrat-Regular', 'sans-serif'],
        englishMedium: ['Montserrat-Medium', 'sans-serif'],
        englishSemiBold: ['Montserrat-SemiBold', 'sans-serif'],
        englishBold: ['Montserrat-Bold', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'md': '1rem', // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        arabicHeading: '1.75rem', // 28px
        arabicBody: '1.375rem', // 22px
        arabicSubtext: '1.125rem', // 18px
      },
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        xxl: '3rem', // 48px
      },
      borderRadius: {
        sm: '0.25rem', // 4px
        md: '0.5rem', // 8px
        lg: '1rem', // 16px
        full: '9999px',
      },
      boxShadow: {
        subtle: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        strong: '0px 8px 16px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        }
      }
      // For glassmorphism, we'll use backdrop-filter utilities
      // which are enabled by default in Tailwind CSS v3.0+
      // We can apply them directly in components, e.g. backdrop-blur-md bg-opacity-50
    },
  },
  plugins: [],
};
