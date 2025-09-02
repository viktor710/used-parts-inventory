import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  Users, 
  Plus
} from 'lucide-react';

/**
 * Страница клиентов (заглушка)
 */
export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Клиенты"
            subtitle="Управление клиентской базой"
          >
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить клиента
            </Button>
          </PageHeader>

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Страница клиентов находится в разработке. Здесь будет функциональность для управления клиентской базой.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для списка клиентов */}
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница клиентов будет доступна в следующем обновлении.
              </p>
              <Button disabled>
                <Plus className="w-4 h-4 mr-2" />
                Добавить клиента
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
