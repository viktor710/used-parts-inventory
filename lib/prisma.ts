import { PrismaClient } from '@prisma/client'

// Проверяем наличие переменной окружения DATABASE_URL
if (!process.env['DATABASE_URL']) {
  console.warn('⚠️ DATABASE_URL не установлена. Prisma может не работать корректно.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env['DATABASE_URL'] || '',
    },
  },
  // Добавляем настройки для Vercel
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Функция для закрытия соединения с базой данных
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Ошибка при закрытии соединения с Prisma:', error)
  }
}

// Функция для проверки соединения с базой данных
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ База данных подключена успешно')
    return true
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error)
    return false
  }
}

// Обработчик для graceful shutdown
process.on('beforeExit', async () => {
  await disconnectPrisma()
})
