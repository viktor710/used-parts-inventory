import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  Package, 
  CheckCircle,
  Filter
} from 'lucide-react';

/**
 * Страница доступных запчастей (заглушка)
 */
export default function AvailablePartsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Доступные запчасти"
            subtitle="Запчасти готовые к продаже"
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
                <p>Страница доступных запчастей находится в разработке. Здесь будет отображаться список запчастей со статусом &quot;Доступна&quot;.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для списка доступных запчастей */}
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница доступных запчастей будет доступна в следующем обновлении.
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
