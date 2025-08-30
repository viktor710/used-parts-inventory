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
  },
  // Настройки для TypeScript
  typescript: {
    // Игнорируем ошибки TypeScript при сборке (для разработки)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
