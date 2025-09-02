import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  Truck, 
  Plus
} from 'lucide-react';

/**
 * Страница поставщиков (заглушка)
 */
export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Поставщики"
            subtitle="Управление поставщиками запчастей"
          >
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить поставщика
            </Button>
          </PageHeader>

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Страница поставщиков находится в разработке. Здесь будет функциональность для управления поставщиками.</p>
              </div>
            </CardContent>
          </Card>

          {/* Заглушка для списка поставщиков */}
          <Card>
            <CardContent className="p-8 text-center">
              <Truck className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Функциональность в разработке
              </h3>
              <p className="text-neutral-600 mb-4">
                Страница поставщиков будет доступна в следующем обновлении.
              </p>
              <Button disabled>
                <Plus className="w-4 h-4 mr-2" />
                Добавить поставщика
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
