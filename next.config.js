/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем экспериментальные функции для лучшей производительности
  experimental: {
    // Оптимизация для статических страниц
    optimizePackageImports: ['lucide-react'],
  },

  // Настройки изображений
  images: {
    // Используем remotePatterns вместо устаревшего domains
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Форматы изображений
    formats: ['image/webp', 'image/avif'],
    // Размеры изображений
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Настройки компиляции
  compiler: {
    // Удаляем console.log в продакшене
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Убираем output: standalone для совместимости с next start
  // output: 'standalone',

  // Настройки для кэширования
  generateEtags: false,

  // Настройки для сжатия
  compress: true,

  // Настройки для безопасности
  poweredByHeader: false,

  // Настройки для перезаписи URL
  async rewrites() {
    return [
      // Можно добавить перезаписи URL если нужно
    ];
  },

  // Настройки для редиректов
  async redirects() {
    return [
      // Можно добавить редиректы если нужно
    ];
  },

  // Настройки для заголовков
  async headers() {
    return [
      {
        // Применяем заголовки ко всем страницам
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Кэширование статических ресурсов
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Настройки для webpack
  webpack: (config, { dev, isServer }) => {
    // Оптимизации для продакшена
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Настройки для TypeScript
  typescript: {
    // Игнорируем ошибки TypeScript во время сборки
    ignoreBuildErrors: false,
  },

  // Настройки для ESLint
  eslint: {
    // Игнорируем ошибки ESLint во время сборки
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
