import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  Settings
} from 'lucide-react';

/**
 * Страница настроек (заглушка)
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Настройки"
            subtitle="Настройки системы и профиля"
          />

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Страница настроек находится в разработке. Здесь будет функциональность для настройки системы.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для настроек */}
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница настроек будет доступна в следующем обновлении.
              </p>
              <Button disabled>
                <Settings className="w-4 h-4 mr-2" />
                Настройки профиля
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
