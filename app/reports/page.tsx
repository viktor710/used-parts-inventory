import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Car
} from 'lucide-react';

/**
 * Интерфейс для отчета
 */
interface Report {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'inventory' | 'financial' | 'customers' | 'cars';
  format: 'pdf' | 'excel' | 'csv';
  lastGenerated?: string;
  status: 'available' | 'generating' | 'error';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Страница отчетов (статическая)
 */
export default function ReportsPage() {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] ReportsPage: Компонент рендерится (статический)');
  }

  // Статические данные отчетов
  const reports: Report[] = [
    {
      id: 'sales-summary',
      title: 'Сводка продаж',
      description: 'Общая статистика продаж за выбранный период',
      type: 'sales',
      format: 'pdf',
      status: 'available',
      icon: ShoppingCart
    },
    {
      id: 'inventory-status',
      title: 'Статус инвентаря',
      description: 'Текущее состояние склада и доступность запчастей',
      type: 'inventory',
      format: 'excel',
      status: 'available',
      icon: Package
    },
    {
      id: 'financial-report',
      title: 'Финансовый отчет',
      description: 'Доходы, расходы и прибыльность',
      type: 'financial',
      format: 'pdf',
      status: 'available',
      icon: DollarSign
    },
    {
      id: 'customer-analytics',
      title: 'Аналитика клиентов',
      description: 'Статистика по клиентам и их активности',
      type: 'customers',
      format: 'excel',
      status: 'available',
      icon: Users
    },
    {
      id: 'cars-inventory',
      title: 'Инвентарь автомобилей',
      description: 'Список всех автомобилей в системе',
      type: 'cars',
      format: 'csv',
      status: 'available',
      icon: Car
    },
    {
      id: 'trends-analysis',
      title: 'Анализ трендов',
      description: 'Анализ продаж и популярности запчастей',
      type: 'sales',
      format: 'pdf',
      status: 'available',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок страницы */}
          <PageHeader
            title="Отчеты"
            subtitle="Генерация и управление отчетами по системе"
          />

          {/* Информация о функциональности */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Эта страница показывает доступные отчеты. Для интерактивной генерации отчетов добавьте клиентские компоненты.</p>
              </div>
            </CardContent>
          </Card>

          {/* Список отчетов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <p className="text-sm text-neutral-600">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Тип отчета */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Тип:</span>
                        <span className="text-sm font-medium capitalize">{report.type}</span>
                      </div>

                      {/* Формат */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Формат:</span>
                        <span className="text-sm font-medium uppercase">{report.format}</span>
                      </div>

                      {/* Статус */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Статус:</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          report.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : report.status === 'generating'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status === 'available' ? 'Доступен' : 
                           report.status === 'generating' ? 'Генерируется' : 'Ошибка'}
                        </span>
                      </div>

                      {/* Кнопки действий */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          disabled={report.status !== 'available'}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={report.status === 'generating'}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Предпросмотр
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Дополнительная информация */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Информация об отчетах</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-neutral-600">
                <p>
                  <strong>PDF отчеты</strong> - подходят для печати и официальной документации
                </p>
                <p>
                  <strong>Excel отчеты</strong> - удобны для дальнейшего анализа и редактирования
                </p>
                <p>
                  <strong>CSV отчеты</strong> - подходят для импорта в другие системы
                </p>
                <p className="text-xs text-neutral-500">
                  Для добавления интерактивности и реальной генерации отчетов используйте клиентские компоненты.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
