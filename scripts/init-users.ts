import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Начинаем инициализацию пользователей...');

  try {
    // Проверяем, есть ли уже пользователи
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('ℹ️ Пользователи уже существуют, пропускаем создание');
      return;
    }

    // Создаем демо-пользователей
    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'ADMIN' as const,
      },
      {
        email: 'manager@example.com',
        password: 'manager123',
        name: 'Менеджер',
        role: 'MANAGER' as const,
      },
      {
        email: 'user@example.com',
        password: 'user123',
        name: 'Пользователь',
        role: 'USER' as const,
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
        },
      });

      console.log(`✅ Создан пользователь: ${user.name} (${user.email}) с ролью ${user.role}`);
    }

    console.log('🎉 Инициализация пользователей завершена успешно!');
    console.log('\n📋 Демо-аккаунты для входа:');
    console.log('Администратор: admin@example.com / admin123');
    console.log('Менеджер: manager@example.com / manager123');
    console.log('Пользователь: user@example.com / user123');

  } catch (error) {
    console.error('❌ Ошибка при инициализации пользователей:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
