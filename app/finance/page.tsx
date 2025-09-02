import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  DollarSign, 
  BarChart3
} from 'lucide-react';

/**
 * Страница финансов (заглушка)
 */
export default function FinancePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Финансы"
            subtitle="Финансовая аналитика и отчетность"
          />

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Страница финансов находится в разработке. Здесь будет функциональность для финансовой аналитики.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для финансовой аналитики */}
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница финансов будет доступна в следующем обновлении.
              </p>
              <Button disabled>
                <BarChart3 className="w-4 h-4 mr-2" />
                Просмотр аналитики
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
