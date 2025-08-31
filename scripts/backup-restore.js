const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Скрипт для резервного копирования и восстановления базы данных Supabase
 * Использует pg_dump и psql для работы с PostgreSQL
 */

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.ensureBackupDir();
  }

  /**
   * Создаем директорию для резервных копий если её нет
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`📁 Создана директория для резервных копий: ${this.backupDir}`);
    }
  }

  /**
   * Получаем переменные окружения для подключения к базе данных
   */
  getDatabaseConfig() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL не установлена в переменных окружения');
    }

    // Парсим URL базы данных
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.slice(1), // Убираем начальный слеш
      username: url.username,
      password: url.password
    };
  }

  /**
   * Создаем резервную копию базы данных
   */
  async createBackup(backupName = null) {
    try {
      const config = this.getDatabaseConfig();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = backupName || `backup-${timestamp}.sql`;
      const filePath = path.join(this.backupDir, fileName);

      console.log('🔄 Создание резервной копии базы данных...');

      const command = `pg_dump -h ${config.host} -p ${config.port} -U ${config.username} -d ${config.database} -f "${filePath}"`;

      await this.executeCommand(command, config.password);

      console.log(`✅ Резервная копия создана: ${filePath}`);
      
      // Получаем размер файла
      const stats = fs.statSync(filePath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`📊 Размер файла: ${fileSizeInMB} MB`);

      return filePath;
    } catch (error) {
      console.error('❌ Ошибка при создании резервной копии:', error.message);
      throw error;
    }
  }

  /**
   * Восстанавливаем базу данных из резервной копии
   */
  async restoreBackup(backupPath) {
    try {
      const config = this.getDatabaseConfig();
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Файл резервной копии не найден: ${backupPath}`);
      }

      console.log('🔄 Восстановление базы данных из резервной копии...');
      console.log(`📁 Файл: ${backupPath}`);

      const command = `psql -h ${config.host} -p ${config.port} -U ${config.username} -d ${config.database} -f "${backupPath}"`;

      await this.executeCommand(command, config.password);

      console.log('✅ База данных успешно восстановлена');
    } catch (error) {
      console.error('❌ Ошибка при восстановлении базы данных:', error.message);
      throw error;
    }
  }

  /**
   * Выполняем команду с обработкой пароля
   */
  executeCommand(command, password) {
    return new Promise((resolve, reject) => {
      const env = { ...process.env, PGPASSWORD: password };
      
      const child = exec(command, { env }, (error, stdout, stderr) => {
        if (error) {
          console.error('Ошибка выполнения команды:', error);
          reject(error);
          return;
        }
        
        if (stderr) {
          console.warn('Предупреждения:', stderr);
        }
        
        if (stdout) {
          console.log('Вывод команды:', stdout);
        }
        
        resolve(stdout);
      });

      // Обработка ошибок процесса
      child.on('error', (error) => {
        console.error('Ошибка процесса:', error);
        reject(error);
      });
    });
  }

  /**
   * Получаем список всех резервных копий
   */
  listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = files
        .filter(file => file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          };
        })
        .sort((a, b) => b.modifiedAt - a.modifiedAt);

      return backups;
    } catch (error) {
      console.error('Ошибка при получении списка резервных копий:', error);
      return [];
    }
  }

  /**
   * Удаляем старые резервные копии (оставляем только последние N)
   */
  cleanupOldBackups(keepCount = 10) {
    try {
      const backups = this.listBackups();
      
      if (backups.length <= keepCount) {
        console.log(`📁 Количество резервных копий в пределах нормы (${backups.length}/${keepCount})`);
        return;
      }

      const toDelete = backups.slice(keepCount);
      console.log(`🗑️ Удаляем ${toDelete.length} старых резервных копий...`);

      toDelete.forEach(backup => {
        try {
          fs.unlinkSync(backup.path);
          console.log(`✅ Удалена: ${backup.name}`);
        } catch (error) {
          console.error(`❌ Ошибка при удалении ${backup.name}:`, error.message);
        }
      });

      console.log(`✅ Очистка завершена. Оставлено ${keepCount} резервных копий.`);
    } catch (error) {
      console.error('Ошибка при очистке старых резервных копий:', error);
    }
  }

  /**
   * Проверяем целостность резервной копии
   */
  async validateBackup(backupPath) {
    try {
      console.log('🔍 Проверка целостности резервной копии...');
      
      const content = fs.readFileSync(backupPath, 'utf8');
      
      // Проверяем наличие основных таблиц
      const requiredTables = ['cars', 'parts', 'suppliers', 'customers', 'sales'];
      const missingTables = requiredTables.filter(table => !content.includes(`CREATE TABLE ${table}`));
      
      if (missingTables.length > 0) {
        console.warn(`⚠️ В резервной копии отсутствуют таблицы: ${missingTables.join(', ')}`);
        return false;
      }

      // Проверяем размер файла
      const stats = fs.statSync(backupPath);
      if (stats.size < 1024) { // Меньше 1KB
        console.warn('⚠️ Резервная копия слишком маленькая, возможно повреждена');
        return false;
      }

      console.log('✅ Резервная копия прошла проверку целостности');
      return true;
    } catch (error) {
      console.error('❌ Ошибка при проверке целостности:', error.message);
      return false;
    }
  }
}

// Экспортируем класс для использования в других модулях
module.exports = DatabaseBackup;

// Если скрипт запущен напрямую
if (require.main === module) {
  const backup = new DatabaseBackup();
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'backup':
      backup.createBackup(arg)
        .then(() => {
          console.log('🎉 Резервное копирование завершено');
          process.exit(0);
        })
        .catch((error) => {
          console.error('💥 Ошибка резервного копирования:', error);
          process.exit(1);
        });
      break;

    case 'restore':
      if (!arg) {
        console.error('❌ Укажите путь к файлу резервной копии');
        process.exit(1);
      }
      backup.restoreBackup(arg)
        .then(() => {
          console.log('🎉 Восстановление завершено');
          process.exit(0);
        })
        .catch((error) => {
          console.error('💥 Ошибка восстановления:', error);
          process.exit(1);
        });
      break;

    case 'list':
      const backups = backup.listBackups();
      console.log('📋 Список резервных копий:');
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name} (${backup.sizeMB} MB) - ${backup.modifiedAt.toLocaleString()}`);
      });
      break;

    case 'cleanup':
      backup.cleanupOldBackups(parseInt(arg) || 10);
      break;

    case 'validate':
      if (!arg) {
        console.error('❌ Укажите путь к файлу резервной копии');
        process.exit(1);
      }
      backup.validateBackup(arg)
        .then((isValid) => {
          process.exit(isValid ? 0 : 1);
        });
      break;

    default:
      console.log(`
🔧 Скрипт для работы с резервными копиями базы данных

Использование:
  node backup-restore.js <команда> [аргумент]

Команды:
  backup [имя_файла]     - Создать резервную копию
  restore <путь_к_файлу> - Восстановить из резервной копии
  list                   - Показать список резервных копий
  cleanup [количество]   - Удалить старые копии (по умолчанию 10)
  validate <путь_к_файлу> - Проверить целостность резервной копии

Примеры:
  node backup-restore.js backup
  node backup-restore.js backup my-backup.sql
  node backup-restore.js restore ./backups/backup-2024-01-15.sql
  node backup-restore.js list
  node backup-restore.js cleanup 5
      `);
      break;
  }
}
