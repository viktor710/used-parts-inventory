import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Кастомная цветовая палитра согласно требованиям
      colors: {
        // Основные цвета
        primary: {
          DEFAULT: '#0A2472', // Насыщенный синий
          light: '#1E3A8A',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#0B6623', // Зеленый
          light: '#16A34A',
          dark: '#15803D',
        },
        // Нейтральные цвета
        neutral: {
          50: '#F9F9F9', // Очень светлый серый для фона
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#DDDDDD', // Светло-серый для разделителей
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#333333', // Темно-серый для основного текста
        },
        // Семантические цвета
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      // Кастомные breakpoints для responsive дизайна
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Кастомные анимации
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
