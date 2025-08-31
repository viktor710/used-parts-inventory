/** @type {import('next').NextConfig} */
const nextConfig = {
  // Экспериментальные функции для улучшения производительности
  experimental: {
    // Включаем оптимизацию изображений
    optimizePackageImports: ['lucide-react'],
  },
  // Настройки для работы с изображениями
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
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
