/** @type {import('next').NextConfig} */
const nextConfig = {
  // Экспериментальные функции для улучшения производительности
  experimental: {
    // Включаем оптимизацию изображений
    optimizePackageImports: ['lucide-react'],
  },
  // Настройки для работы с изображениями
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
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
  },
  // Сжатие
  compress: true,
  // Оптимизация бандлов
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          // Отдельный чанк для данных запчастей
          zapchasti: {
            test: /[\\/]lib[\\/]zapchasti-data/,
            name: 'zapchasti',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
  // Настройки для TypeScript
  typescript: {
    // Игнорируем ошибки TypeScript при сборке (для разработки)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
