import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  Package, 
  Clock,
  Filter
} from 'lucide-react';

/**
 * Страница зарезервированных запчастей (заглушка)
 */
export default function ReservedPartsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Зарезервированные запчасти"
            subtitle="Запчасти зарезервированные клиентами"
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </Button>
          </PageHeader>

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Страница зарезервированных запчастей находится в разработке. Здесь будет отображаться список запчастей со статусом &quot;Зарезервирована&quot;.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для списка зарезервированных запчастей */}
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница зарезервированных запчастей будет доступна в следующем обновлении.
              </p>
              <Button disabled>
                <Package className="w-4 h-4 mr-2" />
                Просмотр запчастей
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
